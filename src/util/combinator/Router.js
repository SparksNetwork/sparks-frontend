"use strict";
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.group || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
console.groupEnd = console.groupEnd || console.log;
// TODO : include history driver of cycle but modified so that only the
// Observable<Location> is passed. Optimally use rackt history driver
// last version, or else keep current version but remove the objects passed
// on the observable and include them as dependencies through import
/**
 * Usage : m(Router, {route: RouteSpec, sinkNames: [...]}, [children
 * components])
 */
var checks_1 = require('../checks');
var ramda_1 = require('ramda');
var $ = require('most');
var m_1 = require('./m');
// TODO : pass routeMatcher to typescript module format
// import {routeMatcher} from '../routeMatcher'
var hold_1 = require('@most/hold');
var sample_1 = require('@most/sample');
// Configuration
var routeSourceName = 'route$';
// const nullVNode = {
//   "children": undefined,
//   "data": undefined,
//   "elm": undefined,
//   "key": undefined,
//   "sel": undefined,
//   "text": undefined
// }
///////////
// Route matcher
// TODO BRC: pass to typescript
/* JavaScript Route Matcher - v0.1.0 - 10/19/2011
 * http://github.com/cowboy/javascript-route-matcher
 * Copyright (c) 2011 "Cowboy" Ben Alman; Licensed MIT, GPL */
var routeMatcher = (function () {
    var exports = {};
    // Characters to be escaped with \. RegExp borrowed from the Backbone router
    // but escaped (note: unnecessarily) to keep JSHint from complaining.
    var reEscape = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
    // Match named :param or *splat placeholders.
    var reParam = /([:*])(\w+)/g;
    // Test to see if a value matches the corresponding rule.
    function validateRule(rule, value) {
        // For a given rule, get the first letter of the string name of its
        // constructor function. "R" -> RegExp, "F" -> Function (these shouldn't
        // conflict with any other types one might specify). Note: instead of
        // getting .toString from a new object {} or Object.prototype, I'm assuming
        // that exports will always be an object, and using its .toString method.
        // Bad idea? Let me know by filing an issue
        var type = exports.toString.call(rule).charAt(8);
        // If regexp, match. If function, invoke. Otherwise, compare. Note that ==
        // is used because type coercion is needed, as `value` will always be a
        // string, but `rule` might not.
        return type === "R" ? rule.test(value) : type === "F" ? rule(value) : rule == value;
    }
    // Pass in a route string (or RegExp) plus an optional map of rules, and get
    // back an object with .parse and .stringify methods.
    exports.routeMatcher = function (route, rules) {
        // Object to be returned. The public API.
        var self = {};
        // Matched param or splat names, in order
        var names = [];
        // Route matching RegExp.
        var re = route;
        // Build route RegExp from passed string.
        if (typeof route === "string") {
            // Escape special chars.
            re = re.replace(reEscape, "\\$&");
            // Replace any :param or *splat with the appropriate capture group.
            re = re.replace(reParam, function (_, mode, name) {
                names.push(name);
                // :param should capture until the next / or EOL, while *splat should
                // capture until the next :param, *splat, or EOL.
                return mode === ":" ? "([^/]*)" : "(.*)";
            });
            // Add ^/$ anchors and create the actual RegExp.
            re = new RegExp("^" + re + "$");
            // Match the passed url against the route, returning an object of params
            // and values.
            self.parse = function (url) {
                var i = 0;
                var param, value;
                var params = {};
                var matches = url.match(re);
                // If no matches, return null.
                if (!matches) {
                    return null;
                }
                // Add all matched :param / *splat values into the params object.
                while (i < names.length) {
                    param = names[i++];
                    value = matches[i];
                    // If a rule exists for thie param and it doesn't validate, return null.
                    if (rules && param in rules && !validateRule(rules[param], value)) {
                        return null;
                    }
                    params[param] = value;
                }
                return params;
            };
            // Build path by inserting the given params into the route.
            self.stringify = function (params) {
                var param, re;
                var result = route;
                // Insert each passed param into the route string. Note that this loop
                // doesn't check .hasOwnProperty because this script doesn't support
                // modifications to Object.prototype.
                for (param in params) {
                    re = new RegExp("[:*]" + param + "\\b");
                    result = result.replace(re, params[param]);
                }
                // Missing params should be replaced with empty string.
                return result.replace(reParam, "");
            };
        }
        else {
            // RegExp route was passed. This is super-simple.
            self.parse = function (url) {
                var matches = url.match(re);
                return matches && { captures: matches.slice(1) };
            };
            // There's no meaningful way to stringify based on a RegExp route, so
            // return empty string.
            self.stringify = function () {
                return "";
            };
        }
        return self;
    };
    return exports.routeMatcher;
})();
///////////
// Helpers
function match(routeToMatch) {
    var rm1 = routeMatcher(routeToMatch);
    var rm2 = routeMatcher(routeToMatch + '/*routeRemainder');
    return function match(incomingRoute) {
        if (ramda_1.isNil(incomingRoute)) {
            return {
                match: null
            };
        }
        var matched = rm1.parse(incomingRoute);
        var remainder = rm2.parse(incomingRoute);
        return {
            match: matched || remainder
        };
    };
}
function isRouteSettings(obj) {
    return obj.route && checks_1.isString(obj.route) &&
        obj.sinkNames && checks_1.isArray(obj.sinkNames) && obj.sinkNames.length > 0;
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
    console.groupCollapsed('Router component > makeAllSinks');
    console.log('sources, settings, childrenComponents', sources, settings, childrenComponents);
    var signature = [{ settings: isRouteSettings },];
    checks_1.assertSignature('Router > computeSinks', [settings], signature);
    // The sink names are necessary as we cannot know otherwise in
    // advance what are the sinks output by the children components without
    // executing all the children components.
    // However to execute the children components, we need to pass the route
    // params to the children. To get those params, in turn, we need to
    // enter the observable monad, from which we can't get out.
    // This behaviour results in having to handle null cases for sinks (some
    // sinks might be present only on some children components).
    var sinkNames = settings.sinkNames;
    var trace = 'router:' + (settings.trace || "");
    var route$ = sources[routeSourceName]
        .tap(console.error.bind(console, 'route$'));
    var matchedRoute$ = hold_1.default(route$.map(match(settings.route))
        .tap(console.warn.bind(console, trace + '|matchedRoute$'))); //.shareReplay(1)
    var changedRouteEvents$ = matchedRoute$
        .map(ramda_1.prop('match'))
        .tap(console.warn.bind(console, 'matchedRoute$'))
        .skipRepeatsWith(function eq(x, y) {
        var _x = x ? ramda_1.omit(['routeRemainder'], x) : null;
        var _y = y ? ramda_1.omit(['routeRemainder'], y) : null;
        return ramda_1.equals(_x, _y);
    })
        .tap(console.warn.bind(console, 'changedRouteEvents$'))
        .multicast(); // TODO BRC : check the level of equivalency to share
    // Note : must be shared, used twice here
    var cachedSinks$ = hold_1.default(changedRouteEvents$
        .map(function (params) {
        var cachedSinks;
        console.error('changedRouteEvents$ > params', params);
        if (params != null) {
            console.info('computing children components sinks', params);
            var componentFromChildren = m_1.m({
                makeLocalSources: function makeLocalSources(sources, __settings) {
                    console.group('makeLocalSources');
                    console.log('sources, __settings', sources, __settings);
                    console.groupEnd();
                    return {
                        route$: hold_1.default(matchedRoute$
                            .map(ramda_1.path(['match', 'routeRemainder']))
                            .tap(function (x) {
                            console.warn(settings.trace + ' :' +
                                ' changedRouteEvents$ : routeRemainder: ', x);
                        })),
                    };
                },
            }, {
                routeParams: ramda_1.omit(['routeRemainder'], params),
                trace: 'inner - ' + trace
            }, childrenComponents);
            cachedSinks = componentFromChildren(sources, settings);
        }
        else {
            cachedSinks = null;
        }
        return cachedSinks;
    })); //.multicast()
    function makeRoutedSinkFromCache(sinkName) {
        return function makeRoutedSinkFromCache(params, cachedSinks) {
            var cached$, preCached$, prefix$;
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
                        $.empty();
                    preCached$ = cachedSinks[sinkName]
                        .tap(console.log.bind(console, 'sink ' + sinkName + ':'));
                    // TODO TYS/BRC : pass to most
                    //            .finally(_ => {
                    //              console.log(trace + ' : sink ' + sinkName + ': terminating' +
                    //              ' due to' +
                    //                ' route change')
                    //            }) // inexistant in most
                    cached$ = $.concat(prefix$, preCached$);
                }
                else {
                    // Case : the component does not have any sinks with the
                    // corresponding sinkName
                    cached$ = $.empty();
                }
            }
            else {
                // Case : new route does NOT match component configured route
                console.log('params is null!!! no match for this component on' +
                    ' this route :' + trace);
                cached$ = sinkName === 'DOM' ? $.of(null) : $.empty();
            }
            return cached$;
        };
    }
    function makeRoutedSink(sinkName) {
        return (_a = {},
            // !!!!!!!!!!!!! changed the sample implementation to start the source
            // first, then then sampler, this allow cachedSinks$ values to be read
            // before the sampler is subscribed to
            _a[sinkName] = sample_1.sample(makeRoutedSinkFromCache(sinkName), changedRouteEvents$, cachedSinks$)
                .switch(),
            _a
        );
        var _a;
    }
    console.groupEnd();
    return ramda_1.mergeAll(ramda_1.map(makeRoutedSink, sinkNames));
}
var Router = { computeSinks: computeSinks };
exports.Router = Router;
