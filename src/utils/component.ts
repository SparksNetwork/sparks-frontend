/// <reference path="../../typings/index.d.ts" />
import { Stream } from 'most';
import { VNode, DOMSource, div } from '@motorcycle/dom';
import { proxy } from 'most-proxy';
import { Component, Sources, Sinks, DOMComponent } from '../components/types';

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

export function circular<T>(circularComponent:
    Component<Sources & { circular: Stream<T> }, Sinks & { circular: Stream<T> }>): Component<Sources, Sinks> {
  return function CircularComponent(sources: Sources): Sinks {
    const { attach, stream } = proxy<T>();
    const sinks = circularComponent(Object.assign({}, sources, { circular: stream }));
    attach(sinks.circular);
    return sinks;
  };
}
