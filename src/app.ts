import * as i18nXhr from 'i18next-xhr-backend';

import {
  Authentication,
  AuthenticationType,
  makeFirebaseAuthenticationDriver,
} from './drivers/firebase-authentication';
import { Component, Sinks, Sources, run } from '@motorcycle/core';
import { DomSource, VNode, makeDomDriver } from '@motorcycle/dom';
import {
  FirebaseUserChange,
  makeFirebaseUserDriver,
} from './drivers/firebase-user';
import { I18nSource, makeI18nDriver } from '@motorcycle/i18n';
import {
  RouterInput,
  RouterSource,
  routerDriver,
} from '@motorcycle/router';
import { Stream, map, skipRepeats, startWith } from 'most';

import hold from '@most/hold';
import { main } from './main';

import firebase = require('firebase');
declare const Sparks: any;
firebase.initializeApp(Sparks.firebase);

require('./style.scss');

export interface MainSources extends Sources {
  dom: DomSource;
  router: RouterSource;
  i18n: I18nSource;
  authentication$: Stream<Authentication>;
  isAuthenticated$: Stream<boolean>;
  user$: Stream<FirebaseUserChange>;
}

export interface MainSinks extends Sinks {
  dom: Stream<VNode>;
  router: RouterInput;
  i18n: Stream<string>;
  authentication$: Stream<AuthenticationType>;
}


const auth = firebase.auth();

const rootElement: HTMLElement = document.querySelector('#app') as HTMLElement;

const i18nOptions: any =
  {
    load: `currentOnly`,
    fallbackLng: false,
  };

run<MainSources, MainSinks>(augmentWithIsAuthenticated$(main), {
  dom: makeDomDriver(rootElement),
  router: routerDriver,
  i18n: function (language$: Stream<string>) {
    return makeI18nDriver([i18nXhr], i18nOptions)(startWith(`en-US`, language$))
  },
  authentication$: makeFirebaseAuthenticationDriver(firebase),
  user$: makeFirebaseUserDriver(listener => auth.onAuthStateChanged(listener)),
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
