import { Stream } from 'most';
import { run, DriverFn } from '@motorcycle/core';
import { makeDOMDriver, DOMSource, VNode } from '@motorcycle/dom';
import { makeRouterDriver, RouterSource } from '@motorcycle/router'
import { HistoryInput, Pathname } from '@motorcycle/history'

export interface MainSources {
  dom: DOMSource;
  router: RouterSource;
}

export interface MainSinks {
  dom: Stream<VNode>;
  router: Stream<HistoryInput | Pathname>;
}

import { main } from './main'

run<MainSources, MainSinks>(main, {
  dom: makeDOMDriver('#sparks-app') as DriverFn,
  router: makeRouterDriver(),
});
