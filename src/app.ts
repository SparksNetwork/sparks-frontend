import { DriverFn, run } from '@motorcycle/core';
import { DOMSource, VNode, makeDOMDriver } from '@motorcycle/dom';
import { makeRouterDriver } from '@motorcycle/router';
import {
  makeFirebaseAuthenticationDriver,
  Authentication,
  AuthenticationType,
} from '@motorcycle/firebase';
import { Stream } from 'most';
import firebase = require('firebase');

require('./style.scss');
require('./index.html');

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
  authentication$: makeFirebaseAuthenticationDriver(firebase),
});

if ('serviceWorker' in navigator) {
  (navigator as any).serviceWorker.register('/sw.js').then(function (registration: any) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function (err: Error) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}