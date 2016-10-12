// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.group || console.log
console.groupCollapsed = console.groupCollapsed || console.log
console.groupEnd = console.groupEnd || console.log

// TODO : include history driver of cycle but modified so that only the
// Observable<Location> is passed. Optimally use rackt history driver
// last version, or else keep current version but remove the objects passed
// on the observable and include them as dependencies through import

/**
 * Usage : m(Router, {route: RouteSpec, sinkNames: [...]}, [children
 * components])
 */

import {
  assertSignature,
  isString,
  isArray,
} from '../checks'
import {
  map as mapR,
  mergeAll as mergeAllR,
  isNil,
  omit,
  path as pathR,
  pluck,
} from 'ramda'
import * as $ from 'most'
import {m} from './m'
// TODO : pass routeMatcher to typescript module format
import {routeMatcher} from '../routeMatcher'
import hold from '@most/hold'
import {sample} from '@most/sample'

// Configuration
const routeSourceName = 'route$'
const nullVNode = {
  "children": undefined,
  "data": undefined,
  "elm": undefined,
  "key": undefined,
  "sel": undefined,
  "text": undefined
}

///////////
// Helpers
function match(routeToMatch) {
  let rm1 = routeMatcher(routeToMatch)
  let rm2 = routeMatcher(routeToMatch + '/*routeRemainder')

  return function match(incomingRoute) {
    if (isNil(incomingRoute)) {
      return {
        match: null
      }
    }

    const matched = rm1.parse(incomingRoute)
    const remainder = rm2.parse(incomingRoute)

    return {
      match: matched || remainder
    }
  }
}

function isRouteSettings(obj) {
  return obj.route && isString(obj.route) &&
    obj.sinkNames && isArray(obj.sinkNames) && obj.sinkNames.length > 0
}

/**
 * Definition for a router component which :
 * - will pass the sinks of its children components iff the new route
 * matches the route configured for the components
 * - when the route no longer matches, components sinks are terminated
 * - when the route matches, changes but keeps the same value, children
 * sinks remain in place
 * Route information is read on the `route$` property
 * Children components pass to their own children a `route$` which is the
 * `route$` they received from their parent, from which they remove the
 * part of the route that they have matched (passing what is called here the
 * remainder).
 * Params parsed from the matched route are passed to the children
 * component through their `settings` parameters, with the `routeParams`
 * property.
 * The `route$` property can be but should not be manipulated directly out
 * of a `Router` component.
 *
 * Two settings are necessary :
 * - route : the route which triggers the component sinks activation.
 *   1. Note that a route value of `undefined` will produce no matching,
 *   while a value of `""` will match `":user"` ! See the tests
 *   2. Every new nested route will trigger the emission of a nested route
 *   value, even if that new nested route value is the same as the
 *   previous one.
 *   3. In the routed component, the `route$` will emit the matched
 *   portion of the route. However, the same information is already broken
 *   down in `routeParams` and should be read from there.
 *
 * - sinkNames : the list of sinks (names) which must be activated in
 * response to the matching route
 *
 * Note that the DOM sink will emit null on some specific circumstances,
 * hence the component receiving the routed DOM sink must plan for that
 * case accordingly. That means DOM :: Observable<VNode>|Null
 *
 * @param {Sources} sources
 * @param {{route: string, sinkNames: Array<string>, trace: string}} settings
 * @param {Array<Component>} childrenComponents
 */
function computeSinks(makeOwnSinks, childrenComponents, sources, settings) {
  console.groupCollapsed('Router component > makeAllSinks')
  console.log('sources, settings, childrenComponents', sources, settings, childrenComponents);

  const signature = [{settings: isRouteSettings},]

  assertSignature('Router > computeSinks', [settings], signature as any)

  // The sink names are necessary as we cannot know otherwise in
  // advance what are the sinks output by the children components without
  // executing all the children components.
  // However to execute the children components, we need to pass the route
  // params to the children. To get those params, in turn, we need to
  // enter the observable monad, from which we can't get out.
  // This behaviour results in having to handle null cases for sinks (some
  // sinks might be present only on some children components).
  const sinkNames = settings.sinkNames
  const trace = 'router:' + (settings.trace || "")

  let route$ = sources[routeSourceName]
    .tap(console.error.bind(console, 'route$'))

  let matchedRoute$ = hold(
    route$.map(match(settings.route))
      .tap(console.warn.bind(console, trace + '|matchedRoute$'))
    // NOTE : replaying here is mandatory
    // That's because the children are passed `matchedRoute` and
    // connect to it AFTER the `route$` has emitted its value...
    // In short, while time is abstracted out in the case of a static
    // graph, dynamic stream graphs come with synchronization pains
    // TODO BRC: use hold for now, but check that edge cases not covered
    // by hold do not play too badly (hold does not replay a completed source)
  )//.shareReplay(1)

  let changedRouteEvents$ = matchedRoute$
    .map(pluck('match'))
    .skipRepeatsWith(function eq(x, y) {
      console.log('distinctUntilChanged on : ', x ? omit(['routeRemainder'], x) : null)
      const _x = x ? omit(['routeRemainder'], y) : null
      const _y = y ? omit(['routeRemainder'], y) : null
      return _x === _y
    }) // check eq. to distinctUntilChanged with selector
    .tap(console.warn.bind(console, 'changedRouteEvents$'))
    .multicast() // TODO BRC : check the level of equivalency to share
  // Note : must be shared, used twice here

  const cachedSinks$ = changedRouteEvents$
    .map(function (params) {
      let cachedSinks

      if (params != null) {
        console.info('computing children components sinks', params)
        const componentFromChildren = m({
            makeLocalSources: function makeLocalSources(sources, __settings) {
              console.group('makeLocalSources')
              console.log('sources, __settings', sources, __settings);
              console.groupEnd()

              return {
                route$: matchedRoute$
                  .map(pathR(['match', 'routeRemainder']))
                  .tap(console.warn.bind(console, settings.trace + ' :' +
                    ' changedRouteEvents$' +
                    ' : routeRemainder: '))
                  .multicast(),
              }
            },
          }, {
            routeParams: omit(['routeRemainder'], params),
            trace: 'inner - ' + trace
          },
          childrenComponents)
        cachedSinks = componentFromChildren(sources, settings)
      }
      else {
        cachedSinks = null
      }

      return cachedSinks
    })
    .multicast()

  function makeRoutedSinkFromCache(sinkName) {
    return function makeRoutedSinkFromCache(params, cachedSinks) {
      var cached$, preCached$, prefix$

      if (params != null) {
        // Case : new route matches component configured route
        if (cachedSinks[sinkName] != null) {
          // Case : the component produces a sink with that name
          // This is an important case, as parent can have children
          // nested at arbitrary levels, with either :
          // 1. sinks which will not be retained (not in `sinkNames`
          // settings)
          // 2. or no sinks matching a particular `sinkNames`
          // Casuistic 1. is taken care of automatically as we only
          // construct the sinks in `sinkNames`
          // Casuistic 2. is taken care of thereafter

          prefix$ = sinkName === 'DOM' ?
            // Case : DOM sink
            // actually any sink which is merged with a `combineLatest`
            // but here by default only DOM sinks are merged that way
            // Because the `combineLatest` blocks till all its sources
            // have started, and that behaviour interacts badly with
            // route changes desired behavior, we forcibly emits a `null`
            // value at the beginning of every sink.
            $.of(null) :
            // Case : Non-DOM sink
            // Non-DOM sinks are merged with a simple `merge`, there
            // is no conflict here, so we just return nothing
            $.empty()

          preCached$ = cachedSinks[sinkName]
            .tap(console.log.bind(console, 'sink ' + sinkName + ':'))
          // TODO TYS/BRC : pass to most
//            .finally(_ => {
//              console.log(trace + ' : sink ' + sinkName + ': terminating' +
//              ' due to' +
//                ' route change')
//            }) // inexistant in most

          cached$ = $.concat(prefix$, preCached$)
        }
        else {
          // Case : the component does not have any sinks with the
          // corresponding sinkName
          cached$ = $.empty()
        }
      }
      else {
        // Case : new route does NOT match component configured route
        console.log('params is null!!! no match for this component on' +
          ' this route :' + trace)
        cached$ = sinkName === 'DOM' ? $.of(null) : $.empty()
      }

      return cached$
    }
  }

  function makeRoutedSink(sinkName) {
    return {
      [sinkName]: sample(
        makeRoutedSinkFromCache(sinkName),
        changedRouteEvents$,
        cachedSinks$
      )
        .switch()

      //     [sinkName]: changedRouteEvents$.withLatestFrom(
      //       cachedSinks$,
      //       makeRoutedSinkFromCache(sinkName)
      //     ).switch()
    }
  }

  console.groupEnd()
  return mergeAllR(mapR(makeRoutedSink, sinkNames))
}

const Router = {computeSinks}

export {
  Router
}
