/// <reference path="../../../typings/index.d.ts" />

import { Stream } from 'most';
import hold from '@most/hold';
import isolate from '@cycle/isolate';
import { div, VNode, DOMSource } from '@motorcycle/dom';
import { RouteDefinitions } from 'switch-path';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
import { Pathname } from '@cycle/history/lib/interfaces';
import { eqProps, prop, merge } from 'ramda';
import { propOrNever } from '../../util';

const equalPaths = eqProps('path');

const loading = div('.loading', {}, 'Loading....');

export type  ComponentRouterSources = {
  DOM: DOMSource;
  router: RouterSource;
  routes$: Stream<RouteDefinitions>;
}

export type ComponentRouterSinks = {
  DOM: Stream<VNode>;
  route$: Stream<Pathname>;
  pluck: (sink: string) => any;
}

function callComponent(sources: ComponentRouterSources) {
  return function ({path, value}) {
    const component = value(merge(sources, {
      router: sources.router.path(path)
    }));

    const DOM = component.DOM.startWith(loading);

    return merge(component, { DOM });
  };
}

function ComponentRouter(sources: ComponentRouterSources): ComponentRouterSinks {
  const component$ = sources.routes$
    .map(routes => sources.router.define(routes))
    .switch()
    .skipRepeatsWith(equalPaths)
    .map(callComponent(sources))
    .thru(hold);

  return {
    DOM: component$.map(prop('DOM')).switch().multicast(),
    route$: component$.map(prop('route$')).switch().multicast(),
    pluck: (key: string) => component$.map(propOrNever(key)).switch().multicast()
  };
}

export default (sources: ComponentRouterSources) => isolate(ComponentRouter)(sources);
