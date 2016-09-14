/// <reference path="../../typings/index.d.ts" />
import { VNode, DOMSource, div } from '@motorcycle/dom';
import { Component, Sources, Sinks, DOMComponent } from '../component/types';

import { merge } from 'ramda';

export type ComponentUtility = (component: Component<Sources, Sinks>) => Component<Sources, Sinks>;

export function clickable(component: DOMComponent): DOMComponent  {
  return function clickableComponent(sources: Sources & { DOM: DOMSource }) {
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
