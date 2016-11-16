import 'es6-shim';

import Cycle from '@cycle/most-run';
import { makeDOMDriver, AttrsModule, ClassModule, StyleModule, PropsModule } from '@motorcycle/dom';
import { makeRouterDriver } from 'cyclic-router';
import { createHistory } from 'history';
import firebase = require('firebase');
import { makeFirebaseDriver, makeQueueDriver } from './drivers/cyclic-fire';
import { makeFirebaseAuthenticationDriver } from './drivers/firebase-authentication';
import { preventDefault } from './drivers/prevent-default';
import switchPath from 'switch-path';
import { just } from 'most';

import { makePolyglotModule } from './ui/modules/polyglot';
import { main } from './main';

const modules = [
  makePolyglotModule(require('./translations')),
  PropsModule,
  StyleModule,
  ClassModule,
  AttrsModule
];

declare const Sparks;
firebase.initializeApp(Sparks.firebase);

const firebaseRef = firebase.database().ref();

const drivers = {
  dom: makeDOMDriver('#sparks-app', { transposition: false, modules }),
  router: makeRouterDriver(createHistory() as any, switchPath),
  authentication$: makeFirebaseAuthenticationDriver(firebase),
  firebase: makeFirebaseDriver(firebaseRef),
  queue$: makeQueueDriver(firebaseRef.child('!queue')),
  preventDefault,
  random: () => just(Math.random())
};

Cycle.run(main, drivers);
