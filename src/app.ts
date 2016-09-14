import 'es6-shim';

import Cycle from '@cycle/most-run';
import { makeDOMDriver, AttrsModule, ClassModule, StyleModule, PropsModule } from '@motorcycle/dom';
import { makeRouterDriver } from 'cyclic-router';
import { createHistory } from 'history';
import firebase = require('firebase');
import { makeAuthDriver, makeFirebaseDriver, makeQueueDriver } from './driver/cyclic-fire';
import switchPath from 'switch-path';

import { makePolyglotModule } from './module/polyglot';
import { translations }from './translations';
import { main } from './page/main';

const modules = [
  makePolyglotModule(translations),
  PropsModule,
  StyleModule,
  ClassModule,
  AttrsModule
];

declare const Sparks;
firebase.initializeApp(Sparks.firebase);

const firebaseRef = firebase.database().ref();

const drivers = {
  DOM: makeDOMDriver('#app', { transposition: false, modules }),
  router: makeRouterDriver(createHistory() as any, switchPath),
  auth$: makeAuthDriver(firebase),
  firebase: makeFirebaseDriver(firebaseRef),
  queue$: makeQueueDriver(firebaseRef.child('!queue'))
};

Cycle.run(main, drivers);
