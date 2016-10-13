import { Component as IComponent, Sources, Sinks } from '../../component/types';
import { Stream } from 'most';
import { merge } from 'ramda';
import { model } from './model';
import { AuthenticationMethod } from './types';

export * from './types';

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
