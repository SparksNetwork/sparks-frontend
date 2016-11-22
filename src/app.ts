import { DriverFn, run } from '@motorcycle/core';
import { DOMSource, VNode, makeDOMDriver } from '@motorcycle/dom';
import { makeRouterDriver } from '@motorcycle/router';
import { Stream } from 'most';
import { makeFirebaseAuthenticationDriver, Authentication, AuthenticationType }
  from './drivers/firebase-authentication';
import firebase = require('firebase');

require('./style.scss');

import { App, AppSources, AppSinks } from './App';

export interface MainSources {
  dom: DOMSource;
  authentication$: Stream<Authentication>;
}

export interface MainSinks {
  dom: Stream<VNode>;
  authentication$: Stream<AuthenticationType>;
}

// injected via Webpack
declare const Sparks: any;

// initialize connection to Firebase
firebase.initializeApp(Sparks.firebase);

run<AppSources, AppSinks>(App, {
  dom: makeDOMDriver('#sparks-app') as DriverFn,
  router: makeRouterDriver(),
  authentication$: makeFirebaseAuthenticationDriver(firebase) as DriverFn,
});
