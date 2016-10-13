import { Component as IComponent, Sources, Sinks } from '../../component/types';
import { Stream } from 'most';
import { merge } from 'ramda';
import { model } from './model';

export const GOOGLE: 'GOOGLE' = 'GOOGLE';
export const FACEBOOK: 'FACEBOOK' = 'FACEBOOK';
export { EMAIL_AND_PASSWORD } from '../../driver/firebase-authentication';

export type GoogleAuthenticationMethod = {
  method: 'GOOGLE';
};

export type FacebookAuthenticationMethod = {
  method: 'FACEBOOK';
}

export type EmailAndPasswordAuthentincationMethod = {
  method: 'EMAIL_AND_PASSWORD';
  email: string;
  password: string;
}

export type AuthenticationMethod =
  GoogleAuthenticationMethod |
  FacebookAuthenticationMethod |
  EmailAndPasswordAuthentincationMethod;

export type AuthenticationSinks = {
  authenticationMethod$: Stream<AuthenticationMethod>
};

export function authenticate(
    Component: IComponent<Sources, Sinks & AuthenticationSinks>) {
  return function AuthenticationComponent(sources: Sources) {
    const sinks = Component(sources);
    const authentication$ = sinks.authenticationMethod$.map(model);

    return merge(sinks, { authentication$ });
  };
}
