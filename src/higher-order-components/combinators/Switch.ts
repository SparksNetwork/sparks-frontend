// TODO BRC : update the rxjs version with the modifications here (eqFn,
// matched etc.)
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.group || console.log
console.groupCollapsed = console.groupCollapsed || console.log
console.debug = console.debug || console.log

// Type checking typings
/**
 * @typedef {function(Sources,Settings):Source} SwitchOnCondition
 */
/**
 * @typedef {SourceName} SwitchOnSource
 */
/**
 * @typedef {Object} SwitchCaseSettings
 * @property {SwitchOnCondition | SwitchOnSource} on
 * @property {Array<SinkName>} sinkNames
 * @property {?function(*,*): Boolean} eqFn
 */

import {
  assertContract, checkSignature,
  isString, isArray, isArrayOf, isFunction, defaultsTo, isSource,
  unfoldObjOverload, removeNullsFromArray,
} from '../../utils/testing/checks'
import {m} from './m'
import {
  map, mergeAll, flatten, either, isNil, complement,
}  from 'ramda'
import * as $ from 'most'
import {sample} from '@most/sample'
//import hold from '@most/hold'

// CONFIG
const DEFAULT_SWITCH_COMPONENT_SOURCE_NAME = 'switch$' // NOT USED
const defaultEqFn = function swichCptDefaultEqFn(a, b) {
  return a === b
}
const cfg = {
  defaultSwitchComponentSourceName: DEFAULT_SWITCH_COMPONENT_SOURCE_NAME,
  defaultEqFn: defaultEqFn
}

//////
// Helper functions
function isSwitchSettings(settings) {
  const signature = {
    eqFn: either(isNil, isFunction),
    caseWhen: complement(isNil),
    sinkNames: isArrayOf(isString),
    on: either(isString, isFunction)
  }
  const signatureErrorMessages = {
    eqFn: 'eqFn property, when not undefined, must be a function.',
    caseWhen: 'caseWhen property is mandatory.',
    sinkNames: 'sinkNames property must be an array of strings',
    on: '`on` property is mandatory and must be a string or a function.'
  }

  return checkSignature(settings, signature as any, signatureErrorMessages, false)
}

function hasAtLeastOneChildComponent(childrenComponents) {
  return childrenComponents &&
  isArray(childrenComponents) &&
  childrenComponents.length >= 1 ? true : ''
}

function computeSinks(makeOwnSinks, childrenComponents, sources, settings) {
  // TODO (later): Be careful that the inheritance of settings down the
  // chain can pollute children... So I need to check the presence of the
  // passed settings before merge to check that mandatory properties are
  // passed and not inherited unexpectedly from an ancestor.
  // This will have to be done via settingsContracts at switchCase level

  // debug info
  console.groupCollapsed('Switch component > computeSinks')
  console.debug('sources, settings, childrenComponents', sources, settings, childrenComponents)

  assertContract(isSwitchSettings, [settings], 'Invalid switch' +
    ' component settings!')
  assertContract(hasAtLeastOneChildComponent, [childrenComponents], 'switch combinator must at least have one child component to switch to!')

  let {eqFn, caseWhen, sinkNames, on} = settings

  const overload = unfoldObjOverload(on, [
    {'guard$': isFunction},
    {'sourceName': isString}
  ])
  let {guard$, sourceName, _index} = overload as any
  let switchSource: any

  if (_index === 1) {
    // caseWhen : overload `settings.on :: SourceName`
    switchSource = sources[sourceName]
    assertContract(isSource, [switchSource],
      `An observable with name ${sourceName} could not be found in sources`)
  }
  if (_index === 0) {
    // caseWhen : overload `settings.on :: SourceName`
    switchSource = guard$(sources, settings)
    assertContract(isSource, [switchSource],
      `The function used for conditional switching did not return an observable!`)
  }

  // set default values for optional properties
  eqFn = defaultsTo(eqFn, cfg.defaultEqFn)

  const shouldSwitch$ = switchSource
    .map(x => ({isEqual: eqFn(caseWhen, x), value: x}))

  const cachedSinks$ = shouldSwitch$
    .filter(x => x.isEqual)
    .map(function (_) {
      const mergedChildrenComponentsSinks = m(
        {},
        {matched: _.value},
        childrenComponents)
      return mergedChildrenComponentsSinks(sources, settings)
    })
    .multicast() // multicasted to all sinks

  function makeSwitchedSinkFromCache(sinkName) {
    return function makeSwitchedSinkFromCache(isMatchingCase, cachedSinks) {
      var cached$, preCached$, prefix$
      if (isMatchingCase.isEqual) {
        // caseWhen : matches configured value
        //
        // Parent can have children nested at arbitrary levels, with either :
        // 1. sinks which will not be retained (not in `sinkNames`
        // settings)
        // 2. or no sinks matching a particular `sinkNames`
        // 3. or sinks which match with the configured `sinkNames`
        // Casuistic 1. is taken care of automatically as we only
        // construct the sinks in `sinkNames` settings
        // Casuistic 2. is taken care in the `else` branch
        // Casuistic 3. is taken care in the following `if` branch
        if (cachedSinks[sinkName] != null) {
          // caseWhen : the component produces a sink with that name

          preCached$ = cachedSinks[sinkName]
            .tap(console.log.bind(console, `sink ${sinkName} :`))
          // TODO BRC : MOAT -> add the finally operator
//            .finally(_ => {
//              console.log(`sink ${sinkName} terminating due to route change`)
//            })

          // Rxjs version
          // cached$ = $.concat(prefix$, preCached$)
          // Holy cow, this does not work well with most, even if prefix is
          // empty, because it will delay `preCached` data emission to a
          // tick later.
          // In some cases, that delay makes it difficult to reason about
          // the program behaviour
          cached$ = preCached$
        }
        else {
          // caseWhen : the component did not produce a sink with that name
          cached$ = $.empty()
        }
      }
      else {
        // caseWhen : the switch source emits a value NOT corresponding to the
        // configured case in the component
        console.log('isMatchingCase is null!!! no match for this component on' +
          ' this route!')
        cached$ = sinkName === 'DOM' ? $.of(null) : $.empty()
      }
      return cached$
    }
  }

  function makeSwitchedSink(sinkName) {
    return {
      [sinkName]: sample(
        makeSwitchedSinkFromCache(sinkName),
        shouldSwitch$,
        cachedSinks$
      )
        .tap(function () {
          console.warn(`switching: ${sinkName}`)
        })
        .switch()
    }
  }

  console.groupEnd()

  return mergeAll(map(makeSwitchedSink, sinkNames))
}
/**
 * Usage : m(switchCase, ::SwitchCaseSettings, ::Array<CaseComponent>)
 * Example : cf. specs
 *   > const mComponent = m(switchCase, {
   *   >    on: (sources,settings) => sources.sweatch$,
   *   >    sinkNames: ['DOM', 'a', 'b']
   *   >  }, [
 *   > m(caseWhen, {caseWhen: true}, [childComponent1, childComponent2]),
 *   > m(caseWhen, {caseWhen: false}, [childComponent3])
 *   > ])
 *
 * The switch combinator activates a component conditionally depending on
 * whether a condition on a 'switched' source stream is satisfied. Note
 * that the condition is evaluated every time there is an incoming value
 * on the relevant sources.
 * If it is necessary to implement a logic by which, the component activation
 * should only trigger on **changes** of the incoming value, that logic
 * could be implemented with a `distinctUntilChanged`.
 * When the condition is no longer satisfied, the previously activated
 * component is deactivated automatically :
 * - DOM sink emits null and terminates
 * - Non-DOM sinks are empty
 * DOM sinks are treated differently because the DOM is a behaviour
 * (continuous value), not an event, so we need to update to null its value
 * when there is no longer a match. i.e. match => DOM, no match => Null
 *
 * Signature 1: SwitchOnCondition -> [Component] -> Component
 * - settings.on :: Sources -> Settings -> Source
 * The function passed as parameter is returning a source observable whose
 * values will be used for the conditional switching.
 * - settings.sinkNames :: [SinkName]
 * This is an array with the names of the sinks to be constructed. This is
 * mandatory as we can't know in advance which sinks to produce
 * - settings.eqFn :: * -> * -> Boolean
 * A predicate which returns true if both parameters are considered equal.
 * This parameter defaults to `===`
 *
 * Signature 2: SwitchOnSource -> [Component] -> Component
 * - settings.on :: SourceName
 * A string which is the source name whose values will be used for the
 * conditional activation of the component. The sources used will be
 * sources[sourceName]
 * - Cf. Signature 1 for the meaning of the rest of parameters
 *
 * Contracts :
 * - switchCase combinator must have at least one child component
 * - caseWhen combinator must have at least one child component
 * - Conditions should be defined such that there is for any given value
 * of the 'switched' stream only one matching component
 *   - If that is not the case, the last matching component will be the one
 *   prevailing. It is however how to predict which of the components will
 *   be the last in a given configuration
 * - on, sinkNames, caseWhen are mandatory
 *
 * caseWhen component
 * - settings.caseWhen :: *
 * An object which will activate the switched-to component whenever the source
 * observable returned by the `on` parameter emits that object
 *
 * Contracts :
 * - caseWhen is mandatory
 *
 */
const switchCase = {
  // https://jsfiddle.net/tk6ec5th/ mergeArray obviously works
  mergeSinks: {
    DOM: function mergeDomSwitchedSinks(ownSink, childrenDOMSink, settings) {
      const allSinks = flatten([ownSink, childrenDOMSink])
      const allDOMSinks = removeNullsFromArray(allSinks)

      const mergedSinks = $.mergeArray(allDOMSinks)
      // TODO : the array could be empty, check behaviour of most in that case
        .tap(console.warn.bind(console, 'Switch.specs' +
          ' > mergeDomSwitchedSinks > merge'))
        // Most values will be null
        // All non-null values correspond to a match
        // In the degenerated case, all values will be null (no match
        // at all)
        .filter((x: any) => x)

      // Note : For some obscure reasons, when moving from rxjs to most,
      // when not subscribing here directly, no subscription ever happens...
      // NO IDEA WHAT IS GOING ON but wasted 2 days already figuring it out
      // so going with this hack//
      // const observer = {
      //        next:function(x){
      //          console.warn('switchCase  > mergeDomSwitchedSinks > fake' +
      //            ' observer', x)
      //        },
      //      error: function(x){
      //        console.warn('switchCase  > mergeDomSwitchedSinks > fake' +
      //          ' observer : error!', x)
      //        },
      //      complete: function(){console.warn('SWITCH CASE complete')}
      //    }
      //
      //    mergedSinks.subscribe(observer)
      //
      // After some extra analysis, here are the work-arounds :
      // 1. One workaround is to permute 136-137 of `sample.js` file
      //   var samplerDisposable = this.sampler.run(sampleSink, scheduler);
      //   var sourceDisposable = this.source.run(sampleSink.hold, scheduler);
      // to start the source first
      //   var sourceDisposable = this.source.run(sampleSink.hold, scheduler);
      //   var samplerDisposable = this.sampler.run(sampleSink, scheduler);
      // 2. Second work-around is to subscribe now to the source which achieves
      // essentially the same without modifying the source code
      // Dont know if there is any side-effects though of having two
      // subscriptions for the source...
      mergedSinks.drain();

      return mergedSinks
    }
  }
}

const caseWhen = {computeSinks: computeSinks}

function Switch(settings, childComponents) {
  return m(switchCase, settings, childComponents)
}

function Case(settings, childComponents) {
  return m(caseWhen, settings, childComponents)
}

export {
  caseWhen,
  switchCase,
  Switch,
  Case,
}
