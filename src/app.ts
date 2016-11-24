import { DOMSource, VNode, makeDOMDriver } from '@motorcycle/dom';
import { DriverFn, run } from '@motorcycle/core';
import { Stream } from 'most';
import { makeFirebaseAuthenticationDriver, Authentication, AuthenticationType }
  from './drivers/firebase-authentication';
import firebase = require('firebase');

import { Button } from './components/FacebookAuthenticationButton';

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

run<MainSources, MainSinks>(Button, {
  dom: makeDOMDriver('#sparks-app') as DriverFn,
  authentication$: makeFirebaseAuthenticationDriver(firebase) as DriverFn,
});
