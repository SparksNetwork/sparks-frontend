import { Stream, map, skipRepeats } from 'most';
import hold from '@most/hold';
import { run, DriverFn, Component } from '@motorcycle/core';
import { makeDomDriver, DomSource, VNode } from '@motorcycle/dom';
import {
  makeRouterDriver,
  RouterSource,
} from '@motorcycle/router';
import { HistoryInput, Pathname } from '@motorcycle/history';
import {
  Authentication,
  AuthenticationType,
  makeFirebaseAuthenticationDriver,
} from './drivers/firebase-authentication';

import {
  makeFirebaseUserDriver,
  FirebaseUserChange,
} from './drivers/firebase-user';

import firebase = require('firebase');
declare const Sparks: any;
firebase.initializeApp(Sparks.firebase);

require('./style.scss');

export interface MainSources {
  dom: DomSource;
  router: RouterSource;
  authentication$: Stream<Authentication>;
  isAuthenticated$: Stream<boolean>;
  user$: Stream<FirebaseUserChange>;
}

export interface MainSinks {
  dom: Stream<VNode>;
  router: Stream<HistoryInput | Pathname>;
  authentication$: Stream<AuthenticationType>;
}

import { main } from './main';

const auth = firebase.auth();
const onAuthStateChanged = auth.onAuthStateChanged.bind(auth);

run<MainSources, MainSinks>(augmentWithIsAuthenticated$(main), {
  dom: makeDomDriver(document.querySelector('#app') as HTMLElement) as DriverFn,
  router: makeRouterDriver(),
  authentication$: makeFirebaseAuthenticationDriver(firebase) as DriverFn,
  user$: makeFirebaseUserDriver(onAuthStateChanged) as DriverFn,
});

function augmentWithIsAuthenticated$(main: Component<MainSources, MainSinks>) {
  return function augmentedComponent(sources: MainSources): MainSinks {
    const isAuthenticated$: Stream<boolean> =
      hold(skipRepeats(map(isAuthenticated, sources.user$)));

    return main({ ...sources, isAuthenticated$ });
  };
};

function isAuthenticated(user: firebase.User | null): boolean {
  return !!user;
}