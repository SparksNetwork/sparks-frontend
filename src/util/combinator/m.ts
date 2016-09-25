console.group = console.log
// Component typings
/**
 * @typedef {Object.<string, Observable>} Sources
 */
/**
 * @typedef {Object.<string, Observable>} Sinks
 * NOTE : this type def is not perfect as we allow sometimes null values
 */
/**
 * @typedef {?Object.<string, ?Object>} Settings
 */
/**
 * @typedef {Object} DetailedComponentDef
 * @property {?function(Sources, Settings)} makeLocalSources
 * @property {?function(Settings)} makeLocalSettings
 * @property {?function(Sources, Settings)} makeOwnSinks
 * @property {function(Sinks, Array<Sinks>, Settings)} mergeSinks
 * @property {function(Sinks):Boolean} sinksContract
 * @property {function(Sources):Boolean} sourcesContract
 */
/**
 * @typedef {Object} ShortComponentDef
 * @property {?function(Sources, Settings)} makeLocalSources
 * @property {?function(Settings)} makeLocalSettings
 * @property {function(Sources, Settings, Array<Component>)} makeAllSinks
 * @property {function(Sinks):Boolean} sinksContract
 * @property {function(Sources):Boolean} sourcesContract
 */
/**
 * @typedef {function(Sources, Settings):Sinks} Component
 */

import {
  makeDivVNode,  assertSignature,  assertContract,  hasPassedSignatureCheck, trace,
  checkSignature,  unfoldObjOverload,  projectSinksOn,  getSinkNamesFromSinksArray,
  removeNullsFromArray,  defaultsTo, isNullableObject, isUndefined,  isFunction,
  isVNode, isObject, isBoolean, isString, isArray, isArrayOf, isObservable, isSource, isOptSinks, routeSourceName,
  isNullableComponentDef, mergeSinksDefault, assertSourcesContracts, shareAllSources, isArrayOptSinks, assertSinksContracts
} from '../checks'

import { isComponent, deepMerge} from '../m'
import {
  mapObjIndexed, flatten, keys, always, reject, isNil, complement, uniq,
  merge, reduce, all, either, clone, values, addIndex, map, is, mergeWith
} from 'ramda'
import * as $ from 'most'
import {h, div, span} from '@motorcycle/dom'

const mapIndexed = addIndex(map)

/**
 * Returns a component specified by :
 * - a component definition object (nullable)
 * - settings (nullable)
 * - children components
 * Component definition default properties :
 * - mergeAllSinks :
 *   - DOM : mergeDOMSinksDefault
 *   - non-DOM : mergeNonDOMSinksDefault
 * - sinksContract : check all sinks are observables or `null`
 * - makeLocalSources : -> null
 * - makeLocalSettings : -> null
 * - makeOwnSinks : -> null
 * That component computes its sinks from its sources by:
 * - merging current sources with extra sources if any
 * - creating some sinks by itself
 * - computing children sinks by executing the children components on the
 * merged sources
 * - merging its own computed sinks with the children computed sinks
 * There are two version of definition, according to the level of
 * granularity desired : the short spec and the detailed spec :
 * - short spec :
 *   one function `makeAllSinks` which outputs the sinks from the sources,
 *   settings and children components
 * - detailed spec :
 *   several properties as detailed above
 * @param {?(DetailedComponentDef|ShortComponentDef)} componentDef
 * @param {?Object} _settings
 * @param {Array<Component>} children
 * @returns {Component}
 * @throws when type- and user-specified contracts are not satisfied
 */
// m :: Opt Component_Def -> Opt Settings -> [Component] -> Component
function m(componentDef, _settings, children) {
  _settings = _settings || {}
  console.groupCollapsed('Utils > m')
  console.log('componentDef, _settings, children', componentDef, _settings, children)
  // check signature
  const mSignature = [
    {componentDef: isNullableComponentDef},
    {settings: isNullableObject},
    {children: isArrayOf(isComponent)},
  ]

  assertSignature('m', arguments, mSignature)

  const makeLocalSources = componentDef.makeLocalSources || always(null)
  const makeLocalSettings = componentDef.makeLocalSettings || always({})
  const makeOwnSinks = componentDef.makeOwnSinks || always(null)
  const mergeSinks = componentDef.mergeSinks || mergeSinksDefault
  const sinksContract = componentDef.sinksContract || always(true)
  const sourcesContract = componentDef.sourcesContract || always(true)
  // TODO : add a settingsContract - can be used for components with
  // mandatory settings

  if (componentDef.makeAllSinks) {
    console.groupEnd()

    return function mComponent(sources, innerSettings) {
      console.groupCollapsed('m\'ed component > makeAllSinks > Entry')
      console.log('sources, _settings, innerSettings', sources, _settings, innerSettings)

      assertSourcesContracts(sources, sourcesContract)

      innerSettings = innerSettings || {}
      const mergedSettings = deepMerge(innerSettings, _settings)

      const extendedSources = shareAllSources(
        merge(sources, makeLocalSources(sources, mergedSettings))
      )

      let sinks = componentDef.makeAllSinks(
        extendedSources, mergedSettings, children
      )
      assertSinksContracts(sinks, sinksContract)

      // TODO : factor out the trace too so I don't duplicate it
      const tracedSinks = trace(sinks, mergedSettings)

      console.groupEnd()

      return tracedSinks
    }
  }
  else {
    console.groupEnd()
    return function m(sources, innerSettings) {
      console.groupCollapsed('m\'ed component > Entry')
      console.log('sources, innerSettings', sources, innerSettings)

      innerSettings = innerSettings || {}
      const mergedSettings = deepMerge(innerSettings, _settings)

      assertSourcesContracts(sources, sourcesContract)

      // Computes and MERGES the extra sources which will be passed
      // to the children and this component
      // Extra sources are derived from the `sources`
      // received as input, which remain untouched
      const extendedSources = shareAllSources(
        merge(sources, makeLocalSources(sources, mergedSettings))
      )
      // Note that per `merge` ramda spec. the second object's values
      // replace those from the first in case of key conflict
      const localSettings = deepMerge(
        makeLocalSettings(mergedSettings),
        mergedSettings
      )

      console.groupCollapsed('m\'ed component > makeOwnSinks')
      console.log('extendedSources, localSettings', extendedSources, localSettings)
      const ownSinks = makeOwnSinks(extendedSources, localSettings)
      if (!ownSinks) console.warn('makeOwnSinks : null!!!')
      console.groupEnd()

      console.group('m\'ed component > computing children sinks')
      const childrenSinks = map(
        childComponent => childComponent(extendedSources, localSettings),
        children
      )
      console.groupEnd('m\'ed component > computing children sinks')

      assertContract(isOptSinks, [ownSinks], 'ownSinks must be a hash of observable sink')
      assertContract(isArrayOptSinks, [childrenSinks], 'childrenSinks must' +
        ' be an array of sinks')

      // merge the sinks from children and one-s own...
      console.groupCollapsed('m\'ed component > mergeSinks')
      console.log('ownSinks, childrenSinks, localSettings', ownSinks, childrenSinks, localSettings)
      const reducedSinks = mergeSinks(ownSinks, childrenSinks, localSettings)
      console.groupEnd()

      assertSinksContracts(reducedSinks, sinksContract)

      const tracedSinks = trace(reducedSinks, mergedSettings)
      // ... and add tracing information(sinkPath, timestamp, sinkValue/sinkError) after each sink
      // TODO : specify trace/debug/error generation information
      // This would ensure that errors are automatically and systematically
      //       caught in the component where they occur, and not
      //       interrupting the application implementation-wise, it might be
      //       necessary to add a `currentPath` parameter somewhere which
      //       carries the current path down the tree

      console.groupEnd()
      return tracedSinks
    }
  }
}

export {m}
