import {
  Component as IComponent,
  Sources,
  Sinks
} from '../../components/types';
import {
  AuthenticationOutput,
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

export type AuthenticationSinks = Sinks & {
  authenticationMethod$: Stream<AuthenticationMethod>
};

export function authenticate(
    Component: IComponent<any, AuthenticationSinks>) {
  return function AuthenticationComponent(
      sources: Sources & { authentication$: Stream<AuthenticationOutput> }) {
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
      .map(makeUserFromFirebaseUser)
      .thru(hold);

    const authenticationSources = merge(sources, {
      isAuthenticated$,
      authenticationError$,
      user$
    });

    const sinks = Component(authenticationSources);

    const authentication$ = sinks.authenticationMethod$.map(model)
      .startWith({ method: GET_REDIRECT_RESULT });

    return merge(sinks, { authentication$ });
  };
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
