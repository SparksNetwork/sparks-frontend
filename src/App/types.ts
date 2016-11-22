import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';
import { RouterSource, RouterInput } from '@motorcycle/router';
import { Authentication, AuthenticationType } from '../drivers/firebase-authentication';

export interface AppSources {
  dom: DOMSource;
  router: RouterSource;
  authentication$: Stream<Authentication>;
}

export interface AppSinks {
  dom: Stream<VNode>;
  router: RouterInput;
  authentication$: Stream<AuthenticationType>;
};
