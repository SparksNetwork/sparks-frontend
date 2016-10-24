import { Stream } from 'most';
import create = require('@most/create');
import firebase = require('firebase');
import { eqProps } from 'ramda';
import hold from '@most/hold';

export const POPUP = 'popup';
export const REDIRECT = 'redirect';
export const LOGOUT = 'logout';
export const PASSWORD = 'password';

export type Action = 'popup' | 'redirect' | 'logout' | 'password' ;
export type Provider = 'google' | 'facebook' | 'password';
export type AuthInput = {
  type: Action;
  provider: Provider;
}

export type FirebaseSource = (...args) => Stream<{ key: string, value: any }>
export type QueueSink = Stream<any>;
export type QueueSource = Stream<any>;

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
