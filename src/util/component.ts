/// <reference path="../../typings/index.d.ts" />
import { VNode, div } from '@motorcycle/dom';
import { Component, DOMComponent, DOMSources } from '../component/types';

import { merge } from 'ramda';

export type ComponentUtility = (component: Component) => Component;

export function clickable(component: DOMComponent)  {
  return function clickableComponent(sources: DOMSources) {
    const click$ = sources.DOM.select('.clickable').events('click');
    const sinks = component(sources);

    const DOM = sinks.DOM.map(function (view: VNode) {
      return div('.clickable', {}, [
        view
      ]);
    });

    return merge(sinks, { click$, DOM });
  };
}
