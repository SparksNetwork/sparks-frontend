import {
  merge,
} from 'ramda'
import {Sources, Sinks} from '../../components/types';

export function InjectSources(injectedSources : Sources, childComponent) {
  return function (sources, settings) {
    const mergedSources = merge(sources, injectedSources)

    return childComponent(mergedSources, settings)
  }
}

