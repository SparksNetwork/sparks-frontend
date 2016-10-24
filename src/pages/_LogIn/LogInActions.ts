import {
  AuthenticationInput,
  AuthenticationOutput,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';
import {merge as mergeM, Stream} from 'most';
import hold from '@most/hold';
import {User} from './User';
import {
  Component as IComponent,
  Sources,
  Sinks
} from '../../components/types';
import {VNode, DOMSource} from '@motorcycle/dom';
import {merge as mergeR} from 'ramda';

export * from './types';

function redirectToHome() {
  // TODO : for now I pass a string, but when the router is done and
  // mosterized, adjust here
  return '/'
}

function redirectToForgotPassword() {
  // TODO : for now I pass a string, but when the router is done and
  // mosterized, adjust here
  return '/forgotPassword'
}

function computeAuthenticationSinks(sources, childSinks) {
  const {google$, facebook$, emailAndPasswordAuthenticationInput$, cancel$, forgotPassword$}= childSinks

  return {
    DOM : childSinks.DOM,
    authentication$: mergeM<AuthenticationInput>(
      google$, facebook$, emailAndPasswordAuthenticationInput$
    )
      .startWith({method: GET_REDIRECT_RESULT})
      .multicast(),
    router: mergeM(
      cancel$.map(redirectToHome),
      forgotPassword$.map(redirectToForgotPassword)
    ),
  }
}

function computeAuthenticationSources(sources) {
  const isAuthenticated$ = sources.authentication$
    .map((authenticationOutput) => !!authenticationOutput.userCredential.user)
    .thru(hold);

  const authenticationError$ = sources.authentication$
    .filter(authenticationOutput => !!authenticationOutput.error)
    .map(authenticationOutput => authenticationOutput.error as AuthenticationError)
    .thru(hold);

  const user$ = sources.authentication$
    .map(authenticationOutput => authenticationOutput.userCredential.user as firebase.User)
    .filter(Boolean)
    .map(firebaseUser => new User(firebaseUser.uid,
      firebaseUser.displayName || '', firebaseUser.photoURL || '', firebaseUser.email || ''))
    .thru(hold);

  return {
    isAuthenticated$,
    authenticationError$,
    user$
  }
}

export type AuthenticationSinks = Sinks & {
  DOM: Stream<VNode>,
  authentication$: Stream<AuthenticationInput>,
  router: Stream<string>
};

export type AuthenticationSources = Sources & {
  DOM: DOMSource;
  isAuthenticated$: Stream<boolean>;
  random: Stream<number>;
}

function LogInActions(specs, [childComponent]) {
  return function Authenticate(sources: AuthenticationSources): AuthenticationSinks {
    // compute the extra sources which are inputs to the children components
    const fetchedSources = specs.fetch(sources)
    const extendedSources = mergeR(sources, fetchedSources)

    // compute the children sinks
    const childrenSinks = childComponent(extendedSources)

    // compute the final component sinks
    return specs.merge(sources, childrenSinks)
  }
}

export {
  computeAuthenticationSinks,
  computeAuthenticationSources,
  LogInActions,
}
