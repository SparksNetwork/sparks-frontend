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
import { User } from './User';
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
      .map(firebaseUser => new User(firebaseUser.uid,
        firebaseUser.displayName || '', firebaseUser.photoURL || '', firebaseUser.email || ''))
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
