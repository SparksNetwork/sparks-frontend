import { Stream } from 'most';
import { run, DriverFn } from '@motorcycle/core';
import { makeDOMDriver, DOMSource, VNode } from '@motorcycle/dom';
import { makeRouterDriver, RouterSource, RouterDefinitions, RouterSources } from '@motorcycle/router'
import { HistoryInput, Pathname } from '@motorcycle/history'
import { Authentication, AuthenticationType, makeFirebaseAuthenticationDriver } from './drivers/firebase-authentication'

import firebase = require('firebase')
declare const Sparks: any;
firebase.initializeApp(Sparks.firebase)

require('./style.scss');

export interface MainSources {
  dom: DOMSource;
  router: RouterSource;
  authentication$: Stream<Authentication>;
}

export interface MainSinks {
  dom: Stream<VNode>;
  router: Stream<HistoryInput | Pathname>;
  authentication$: Stream<AuthenticationType>;
}

import { main } from './main'

export function Routing(
    definitions: RouterDefinitions<MainSources,MainSinks>,
    sources: RouterSources<any>,
  ) : Stream<MainSinks> {
  return sources.router.define(definitions)
    .map(({path, value} : {path:string, value:any}) =>
      value({...sources, router: sources.router.path(path)})
    )
}

run<MainSources, MainSinks>(main, {
  dom: makeDOMDriver('#app') as DriverFn,
  router: makeRouterDriver(),
  authentication$: makeFirebaseAuthenticationDriver(firebase) as DriverFn,
});
