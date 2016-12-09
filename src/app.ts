import { Stream, map, skipRepeats } from 'most';
import hold from '@most/hold';
import { path } from 'ramda';
import { run, DriverFn, Component } from '@motorcycle/core';
import { makeDOMDriver, DOMSource, VNode } from '@motorcycle/dom';
import {
  makeRouterDriver,
  RouterSource,
  RouterDefinitions,
  RouterSources,
} from '@motorcycle/router';
import { HistoryInput, Pathname } from '@motorcycle/history';
import {
  Authentication,
  AuthenticationType,
  makeFirebaseAuthenticationDriver,
} from './drivers/firebase-authentication';

import firebase = require('firebase');
declare const Sparks: any;
firebase.initializeApp(Sparks.firebase);

require('./style.scss');

export interface MainSources {
  dom: DOMSource;
  router: RouterSource;
  authentication$: Stream<Authentication>;
  isAuthenticated$: Stream<boolean>;
}

export interface MainSinks {
  dom: Stream<VNode>;
  router: Stream<HistoryInput | Pathname>;
  authentication$: Stream<AuthenticationType>;
}

import { main } from './main';

export function Routing(
  definitions: RouterDefinitions<MainSources, MainSinks>,
  sources: RouterSources<any>,
): Stream<MainSinks> {
  return sources.router.define(definitions)
    .map(({path, value}: { path: string, value: any }) =>
      value({ ...sources, router: sources.router.path(path) }),
    );
}

run<MainSources, MainSinks>(augmentWithIsAuthenticated$(main), {
  dom: makeDOMDriver('#app') as DriverFn,
  router: makeRouterDriver(),
  authentication$: makeFirebaseAuthenticationDriver(firebase) as DriverFn,
});

function augmentWithIsAuthenticated$(main: Component<MainSources, MainSinks>) {
  return function augmentedComponent(sources: MainSources): MainSinks {
    const isAuthenticated$: Stream<boolean> =
      hold(skipRepeats(map(isAuthenticated, sources.authentication$)));

    return main({ ...sources, isAuthenticated$ });
  };
};

function isAuthenticated(auth: Authentication): boolean {
  return !!path(['userCredential', 'user'], auth);
}