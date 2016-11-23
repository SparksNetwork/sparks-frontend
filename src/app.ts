import { App, AppSinks, AppSources } from './App';
import { Authentication, AuthenticationType, makeFirebaseAuthenticationDriver }
  from './drivers/firebase-authentication';
import { DOMSource, VNode, makeDOMDriver } from '@motorcycle/dom';
import { DriverFn, run } from '@motorcycle/core';

import { Stream } from 'most';
import { makeRouterDriver } from '@motorcycle/router';
import firebase = require('firebase');

require('./style.scss');


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
