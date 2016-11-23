import { Stream, combineArray, mergeArray } from 'most';
import { VNode, div } from '@motorcycle/dom';
import { filter, map, prop } from 'ramda';

export interface DOMSinks {
  dom: Stream<VNode>;
}

/**
 * Combines an Array of Sinks into a single Sinks object
 * const a = [ { dom: Stream<VNode>, router: Stream<Pathname> }, { dom: Stream<VNode> } ]
 * mergeSinks(a, 'sparks-component') => { dom: Stream<VNode>, router: stream<Pathname> }
 */
export function mergeSinks<Sinks extends DOMSinks>(
  sinksArray: Array<Sinks>,
  divId: string): Sinks
{
  const childSinks = pluckSinks(sinksArray);

  const dom: Stream<VNode> =
    map(childView(divId), combineArray(Array, childSinks.dom)) as Stream<VNode>;

  let sinks: any = { dom };

  for (const sinkName in childSinks)
    if (sinkName !== 'dom')
      sinks[sinkName] = mergeArray(childSinks[sinkName]);

  return sinks as Sinks;
}

function childView(divId: string) {
  return function (childViews: Array<VNode>): VNode {
    return div('#' + divId, {}, childViews);
  };
}

/**
 * Converts an array of objects into a an object of arrays
 * const a = [ {a: 1}, {b: 2}, {a: 3} ]
 * pluckSinks(a) // { a: [1, 3], b: [2] }
 */
function pluckSinks<Sinks extends DOMSinks>(sinksArray: Array<Sinks>): any {
  const childDoms: Array<Stream<VNode>> =
    filter(Boolean, map(prop('dom'), sinksArray));

  let sinks: any = { dom: childDoms };

  const sinkCount = sinksArray.length;

  for (let i = 0; i < sinkCount; ++i) {
    const sink: Sinks = sinksArray[i];

    for (const key in sink) {
      if (key === 'dom')
        continue;

      const stream = sink[key as keyof Sinks];

      if (!sinks[key]) sinks[key] = [];

      sinks[key].push(stream);
    }
  }

  return sinks;
}
