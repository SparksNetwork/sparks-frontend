import { Component, Sinks } from '../../../../components/types';
import { Stream } from 'most';
import { VNode } from '@motorcycle/dom';
import { merge } from 'ramda';
import { view } from './view';

export type ScreenSinks = Sinks & {
  DOM: Stream<VNode>
}

export function screen(ScreenableComponent: Component<any, ScreenSinks>) {
  return function ScreenComponent(sources): ScreenSinks {
    return screenComponentSinks(ScreenableComponent(sources));
  }
}

function screenComponentSinks(sinks: ScreenSinks): ScreenSinks {
  const { DOM } = sinks;

  const screenWrappedDOM: Stream<VNode> = DOM.map(view);

  return merge(sinks, { DOM: screenWrappedDOM });
}
