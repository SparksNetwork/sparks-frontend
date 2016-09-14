import { Stream } from 'most';
import create = require('@most/create');
import firebase = require('firebase');
import { eqProps } from 'ramda';
import hold from '@most/hold';

export const POPUP = 'popup';
export const REDIRECT = 'redirect';
export const LOGOUT = 'logout';

export type Action = 'popup' | 'redirect' | 'logout';
export type Provider = 'google' | 'facebook';
export type AuthInput = {
  type: Action;
  provider: Provider;
}

export type FirebaseSource = (...args) => Stream<{ key: string, value: any }>
export type QueueSink = Stream<any>;
export type AuthSource = Stream<firebase.auth.UserCredential | null>;
export type AuthSink = Stream<AuthInput>;

function FirebaseStream (reference: any, eventName: string) {
  return create<any>((add: Function) => {
    reference.on(eventName, (snap: any) => {
      add(snap);
    });
  })
    .map((snap: any) => ({ key: snap.key, value: snap.val() }))
    .skipRepeatsWith(eqProps('value'));
}

const ValueStream = ref => FirebaseStream(ref, 'value')
  .map((x: any) => x.val)
  .thru(hold);

const ChildAddedStream = ref => FirebaseStream(ref, 'child_added')
  .multicast();

export function makeAuthDriver(firebase: any) {
  if (firebase.authMigrator) {
    firebase.authMigrator().migrate().then(user => {
      if (!user) {
        return;
      }
    }).catch(error => {
      console.log('auth migration error:', error);
    });
  }
  const actionMap = {
    [POPUP]: prov => firebase.auth().signInWithPopup(prov),
    [REDIRECT]: prov => firebase.auth().signInWithRedirect(prov),
    [LOGOUT]: () => firebase.auth().signOut(),
  };

  const auth$ = create<firebase.auth.UserCredential>((add) => {
    let hasRedirectResult = false;

    // This function calls the observer only when hasRedirectResult is true
    const nextUser = user => {
      if (hasRedirectResult) { add(user); }
    };

    // Add onAuthStateChanged listener
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user && firebase.authMigrator) {
        firebase.authMigrator().clearLegacyAuth();
      }

      nextUser(user);
    });

    // getRedirectResult listener
    firebase.auth().getRedirectResult().then(result => {
      hasRedirectResult = true;

      if (result.user) {
        nextUser(result.user);
      }
    })
      // Always set the flag
      .catch(() => {
        hasRedirectResult = true;
      });

    return unsubscribe;
  });

  /**
   * When given a name this will return an object created from the firebase
   * auth classes. Example, giving 'google' will return an instance of
   * firebase.auth.GoogleAuthProvider.
   *
   * @param {string} name
   * @returns {Object}
   */
  function providerObject (name: string) {
    if (typeof name === 'string') {
      const className = name[0].toUpperCase() + name.slice(1) + 'AuthProvider';
      return new firebase.auth[className]();
    }
    return name;
  }

   /**
  * Perform an authentication action. The input should have provider and type,
  * plus the optional scopes array.
  *
  * @param {Object} input
  * @param {Object|string} input.provider
  * @param {string} input.type 'popup', 'redirect' or 'logout'
  * @param {Array<string>} input.scopes a list of OAuth scopes to add to the
  *   provider
  * @return {void}
  */
  function authAction (input) {
    console.log(input);
    const provider = providerObject(input.provider);
    const scopes = input.scopes || [];

    for (let scope of scopes) {
      provider.addScope(scope);
    }

    const action = actionMap[input.type];
    return action(provider);
  }

  return function authDriver(input$: Stream<AuthInput>) {
    input$.observe(authAction);

    let stream = auth$.skipRepeatsWith(eqProps('user')).thru(hold);

    stream.drain();

    return stream.multicast();
  };

}

export const makeFirebaseDriver = (ref: firebase.database.Reference) => {
  const cache = {};
  // there are other chainable firebase query buiders, this is wot we need now
  const query = (parentRef, {orderByChild, equalTo}) => {
    let childRef = parentRef;
    if (orderByChild) { childRef = childRef.orderByChild(orderByChild); }
    if (equalTo) { childRef = childRef.equalTo(equalTo); }
    return childRef;
  };

  // used to build fb ref, each value passed is either child or k:v query def
  const chain = (a, v) => typeof v === 'object' && query(a, v) || a.child(v);

  // building query from fb api is simply mapping the args to chained fn calls
  const build = (args) => {
    const stream = ValueStream(args.reduce(chain, ref)).thru(hold);
    stream.drain();
    return stream.multicast();
  };

  // SIDE EFFECT: build and add to cache if not in cache
  const cacheOrBuild = (key, args) => cache[key] || (cache[key] = build(args));

  return function firebaseDriver() {
    let fn = (...args) => cacheOrBuild(JSON.stringify(args), args);
    return fn;
  };
};

const deleteResponse = (ref, listenerKey, responseKey) => {
  console.log('removing', ref.key, listenerKey, responseKey);
  ref.child(listenerKey).child(responseKey).remove();
};

// talks to FirebaseQueue on the backend
// factory takes FB ref, plus path names for src and dest locs, returns driver
// source: a function, called with key, returns stream of new items on that key
// sink: consumes objects that it pushes to the destination reference
export function makeQueueDriver(ref: firebase.database.Reference, src: string = 'responses', dest = 'task') {
  return function queueDriver(sink$: Stream<any>) {
    const srcRef = ref.child(src);
    const destRef = ref.child(dest);

    sink$.tap(console.log.bind(console, 'queue input:'))
      .observe((item) => destRef.push(item));

    return function (listenerKey: string) {
      return ChildAddedStream(srcRef.child(listenerKey))
        .tap(({ key }) => {
          deleteResponse(srcRef, listenerKey, key);
        }).multicast();
    };
  };
}
