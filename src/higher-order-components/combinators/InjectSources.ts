import {
  merge, mapObjIndexed
} from 'ramda'
import {Sources, Sinks} from '../../components/types';

interface SourceFactory {
  (Sources): Sources;
}

interface HashSourceFactory {
  [sourceName: string]: SourceFactory
}

export function InjectSources(hashSourcesFn: HashSourceFactory, childComponent) {
  return function (sources, settings) {
    // TODO : refactor the InjectSources in the main when finished
    let injectedSources = mapObjIndexed((sourceFactory: SourceFactory) => {
      return sourceFactory(sources)
    }, hashSourcesFn);
    const mergedSources = merge(sources, injectedSources)

    return childComponent(mergedSources, settings)
  }
}

