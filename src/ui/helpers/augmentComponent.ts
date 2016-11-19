import { Component } from '../../components/types';
import { merge } from 'ramda';

export function augmentComponent<Sources, Sinks, AugmentationSinks>(
  Component: Component<Sources, Sinks>,
  augmentationSinks: AugmentationSinks): (sources: Sources) => Sinks & AugmentationSinks
{
  return function AugmentationComponent(sources: Sources) {
    const sinks: Sinks = Component(sources);

    return merge(sinks, augmentationSinks);
  }
}
