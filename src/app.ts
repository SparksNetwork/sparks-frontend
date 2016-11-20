import { Stream } from 'most';
import { run, DriverFn } from '@motorcycle/core';
import { makeDOMDriver, DOMSource, VNode } from '@motorcycle/dom';
import { makeRouterDriver, RouterSource, RouterDefinitions, RouterSources } from '@motorcycle/router'
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
  dom: makeDOMDriver('#sparks-app') as DriverFn,
  router: makeRouterDriver(),
});
