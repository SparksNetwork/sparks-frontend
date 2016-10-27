import {
  Component,
  Sources,
  Sinks
} from '../../components/types';
import {
  AuthenticationType,
  Authentication,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';
import { Stream } from 'most';
import { merge } from 'ramda';
import { model } from './model';
import { AuthenticationMethod } from './types';
import { User } from '../../domain/models/User';
import { WebUrl } from '../../domain/models/WebUrl';
import { instance as missingWebUrl } from '../../domain/models/MissingWebUrl';
import { EmailAddress } from '../../domain/models/EmailAddress';
import { instance as missingEmailAddress }
  from '../../domain/models/MissingEmailAddress';
import hold from '@most/hold';

export * from './types';

export type AuthenticationSources = AuthenticationComponentSources & {
  isAuthenticated$: Stream<boolean>;
  authenticationError$: AuthenticationError$;
  user$: User$;
}

export type AuthenticationError$ = Stream<AuthenticationError>;

export type User$ = Stream<User>;

export type AuthenticationSinks = Sinks & {
  authenticationMethod$: Stream<AuthenticationMethod>
};

export type AuthenticationType$ = Stream<AuthenticationType>

export type Authentication$ = Stream<Authentication>;

export type AuthenticationComponentSources = Sources & {
  authentication$: Authentication$
};

export type AuthenticationComponentSinks = AuthenticationSinks & {
  authentication$: AuthenticationType$
}

export function authenticate(
    AuthenticatableComponent: Component<any, AuthenticationSinks>) {

  return function AuthenticationComponent(
      sources: AuthenticationComponentSources): AuthenticationComponentSinks {

    return authenticationComponentSinks(
      AuthenticatableComponent(
        authenticationSources(sources)));
  };
}

function authenticationComponentSinks(
    sinks: AuthenticationSinks): AuthenticationComponentSinks {

  return merge(sinks, { authentication$: authenticationType$(sinks) });
}

function authenticationType$(sinks: AuthenticationSinks): AuthenticationType$ {
  return sinks.authenticationMethod$.map(model)
    .startWith({ method: GET_REDIRECT_RESULT });
}

function authenticationSources(
    sources: AuthenticationComponentSources): AuthenticationSources {

  const { authentication$ } = sources;

  return merge(sources, {
    isAuthenticated$: isAuthenticatedStream(authentication$),
    authenticationError$: authenticationErrorStream(authentication$),
    user$: userStream(authentication$)
  });
}

function isAuthenticatedStream(
    authentication$: Authentication$): Stream<boolean> {

  return authentication$.map(hasFirebaseUser).thru(hold);
}

function authenticationErrorStream(
    authentication$: Authentication$): AuthenticationError$ {

  return authentication$.filter(hasError).map(error).thru(hold);
}

function userStream(authentication$: Authentication$): User$ {
  return authentication$
    .map(firebaseUser).filter(Boolean).map(makeUserFromFirebaseUser).thru(hold);
}

function hasFirebaseUser(authentication: Authentication): boolean {
  return !!firebaseUser(authentication);
}

function firebaseUser(authentication: Authentication): firebase.User {
  return authentication.userCredential.user as firebase.User;
}

function hasError(authentication: Authentication): boolean {
  return !!error(authentication);
}

function error(authentication: Authentication): AuthenticationError {
  return authentication.error as AuthenticationError;
}

function makeUserFromFirebaseUser(firebaseUser: firebase.User): User {
  const { uid, displayName, photoURL: portraitUrl, email: emailAddress } =
    firebaseUser;

  return new User(
    uid,
    displayName || '',
    portraitUrl ? new WebUrl(portraitUrl) : missingWebUrl(),
    emailAddress
      ? new EmailAddress(emailAddress)
      : missingEmailAddress()
  );
}
