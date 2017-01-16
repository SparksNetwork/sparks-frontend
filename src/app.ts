import { Stream, map, skipRepeats } from 'most';
import hold from '@most/hold';
import { run, Component, Sources, Sinks } from '@motorcycle/core';
import { makeDomDriver, DomSource, VNode } from '@motorcycle/dom';
import {
  routerDriver,
  RouterSource,
  RouterInput,
} from '@motorcycle/router';
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

export interface MainSources extends Sources {
  dom: DomSource;
  router: RouterSource;
  authentication$: Stream<Authentication>;
  isAuthenticated$: Stream<boolean>;
  user$: Stream<FirebaseUserChange>;
}

export interface MainSinks extends Sinks {
  dom: Stream<VNode>;
  router: RouterInput;
  authentication$: Stream<AuthenticationType>;
}

import { main } from './main';

const auth = firebase.auth();

const rootElement: HTMLElement = document.querySelector('#app') as HTMLElement;

run<MainSources, MainSinks>(augmentWithIsAuthenticated$(main), {
  dom: makeDomDriver(rootElement),
  router: routerDriver,
  authentication$: makeFirebaseAuthenticationDriver(firebase),
  user$: makeFirebaseUserDriver(listener => auth.onAuthStateChanged(listener)),
});

function augmentWithIsAuthenticated$(main: Component<MainSources, MainSinks>) {
  return function augmentedComponent(sources: MainSources): MainSinks {
    const isAuthenticated$: Stream<boolean> =
      hold(skipRepeats(map(isAuthenticated, sources.user$)));

    return main({ ...sources, isAuthenticated$ });
  };
}

function isAuthenticated(user: firebase.User | null): boolean {
  return !!user;
}
