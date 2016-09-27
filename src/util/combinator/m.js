"use strict";
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.log;
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
var checks_1 = require('../checks');
var ramda_1 = require('ramda');
var $ = require('most');
var dom_1 = require('@motorcycle/dom');
var deepMerge = function deepMerge(a, b) {
    return (ramda_1.is(Object, a) && ramda_1.is(Object, b)) ? ramda_1.mergeWith(deepMerge, a, b) : b;
};
// Configuration
var defaultMergeSinkConfig = {
    DOM: computeDOMSinkDefault,
    _default: computeSinkDefault
};
//////
// Helpers
/**
 * Merges the DOM nodes produced by a parent component with the DOM nodes
 * produced by children components, such that the parent DOM nodes
 * wrap around the children DOM nodes
 * For instance:
 * - parent -> div(..., [h2(...)])
 * - children -> [div(...), button(...)]
 * - result : div(..., [h2(...), div(...), button(...)])
 * @param {Sink} parentDOMSinkOrNull
 * @param {Array<Sink>} childrenSink
 * @param {Settings} settings
 * @returns {Observable<VNode>|Null}
 */
function computeDOMSinkDefault(parentDOMSinkOrNull, childrenSink, settings) {
    // We want `combineLatest` to still emit the parent DOM sink, even when
    // one of its children sinks is empty, so we modify the children sinks
    // to emits ONE `Null` value if it is empty
    // Note : in default function, settings parameter is not used
    var childrenDOMSinkOrNull = ramda_1.map(checks_1.emitNullIfEmpty, childrenSink);
    var allSinks = ramda_1.flatten([parentDOMSinkOrNull, childrenDOMSinkOrNull]);
    var allDOMSinks = checks_1.removeNullsFromArray(allSinks);
    // Edge case : none of the sinks have a DOM sink
    // That should not be possible as we come here only
    // when we detect a DOM sink
    if (allDOMSinks.length === 0) {
        throw "mergeDOMSinkDefault: internal error!";
    }
    return $.combineArray(allDOMSinks)
        .tap(console.log.bind(console, 'mergeDOMSinkDefault: allDOMSinks'))
        .map(mergeChildrenIntoParentDOM(parentDOMSinkOrNull));
}
function computeSinkDefault(parentDOMSinkOrNull, childrenSink, settings) {
    var allSinks = ramda_1.concat([parentDOMSinkOrNull], childrenSink);
    // Nulls have to be removed as a given sink name will not be in all children
    // sinks. It is however guaranteed by the caller that the given sink
    // name will be in at least one of the children. Hence the merged array
    // is never empty
    return $.mergeArray(checks_1.removeNullsFromArray(allSinks));
}
function mergeChildrenIntoParentDOM(parentDOMSink) {
    return function mergeChildrenIntoParentDOM(arrayVNode) {
        // We remove null elements from the array of vNode
        // We can have a null vNode emitted by a sink if that sink is empty
        var _arrayVNode = checks_1.removeEmptyVNodes(checks_1.removeNullsFromArray(arrayVNode));
        checks_1.assertContract(checks_1.isArrayOf(checks_1.isVNode), [_arrayVNode], 'DOM sources must' +
            ' stream VNode objects! Got ' + _arrayVNode);
        if (parentDOMSink) {
            // Case : the parent sinks have a DOM sink
            // We want to put the children's DOM **inside** the parent's DOM
            // Two cases here :
            // - The parent's vNode has a `text` property :
            //   we move that text to a text vNode at first position in the children
            //   then we add the children's DOM in last position of the
            // existing parent's children
            // - The parent's vNode does not have a `text` property :
            //   we just add the children's DOM in last position of the exisitng
            //   parent's children
            // Note that this is specific to the snabbdom vNode data structure
            // Note that we defensively clone vNodes so the original vNode remains
            // inmuted
            var parentVNode = ramda_1.clone(_arrayVNode.shift());
            var childrenVNode = _arrayVNode;
            parentVNode.children = ramda_1.clone(parentVNode.children) || [];
            // childrenVNode could be null if all children sinks are empty
            // observables, in which case we just return the parentVNode
            if (childrenVNode) {
                if (parentVNode.text) {
                    parentVNode.children.splice(0, 0, {
                        children: [],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": undefined,
                        "text": parentVNode.text
                    });
                    parentVNode.text = undefined;
                }
                Array.prototype.push.apply(parentVNode.children, childrenVNode);
            }
            return parentVNode;
        }
        else {
            // Case : the parent sinks does not have a DOM sink
            // To avoid putting an extra `div` when there is only one vNode
            // we put the extra `div` only when there are several vNodes
            switch (_arrayVNode.length) {
                case 0:
                    return null;
                case 1:
                    return _arrayVNode[0];
                default:
                    return dom_1.div(_arrayVNode);
            }
        }
    };
}
///////
// Helpers
function computeReducedSink(ownSinks, childrenSinks, localSettings, mergeSinks) {
    return function computeReducedSink(accReducedSinks, sinkName) {
        var mergeSinkFn = mergeSinks[sinkName]
            || defaultMergeSinkConfig[sinkName]
            || defaultMergeSinkConfig['_default'];
        checks_1.assertContract(checks_1.isMergeSinkFn, [mergeSinkFn], 'm : mergeSinkFn' +
            ' for sink ${sinkName} must be a function : check' +
            ' parameter or default merge function!');
        if (mergeSinkFn) {
            accReducedSinks[sinkName] = mergeSinkFn(ownSinks ? ownSinks[sinkName] : null, checks_1.projectSinksOn(sinkName, childrenSinks), localSettings);
        }
        return accReducedSinks;
    };
}
/**
 * Returns a component specified by :
 * - a component definition object (nullable)
 * - settings (nullable)
 * - children components
 * Component definition properties :
 * - mergeSinks : computes resulting sinks or a specific sinks according to
 * configuration. See type information
 * - computeSinks : computes resulting sinks by executing the
 * children component and parent and merging the result
 * - sourcesContract : default to checking all sinks are observables or `null`
 * - sinksContract : default to checking all sinks are observables or `null`
 * - settingsContract : default to do noting
 * - makeLocalSources : default -> null
 * - makeLocalSettings : default -> null
 * - makeOwnSinks : -> default null
 *
 * The factored algorithm which derives sinks from sources is as follows :
 * - merging current sources with extra sources if any
 * - creating some sinks by itself
 * - computing children sinks by executing the children components on the
 * merged sources
 * - merging its own computed sinks with the children computed sinks
 * There are two versions of definition, according to the level of
 * granularity desired : the short spec and the detailed spec :
 * - short spec :
 *   one function `computeSinks` which outputs the sinks from the sources,
 *   settings and children components
 * - detailed spec :
 *   several properties as detailed above
 * @param {?(DetailedComponentDef|ShortComponentDef)} componentDef
 * @param {?Object} _settings
 * @param {Array<Component>} children
 * @returns {Component}
 * @throws when type- and user-specified contracts are not satisfied
 *
 * Contracts function allows to perform contract checking before computing
 * the component, for instance :
 * - check that sources have the expected type
 * - check that sources include the mandatory source property for
 * computing the component
 * - check that the sinks have the expected type/exists
 *
 * Source contracts are checked before extending the sources
 * Settings contracts are checked before merging
 *
 */
// m :: Opt Component_Def -> Opt Settings -> [Component] -> Component
function m(componentDef, _settings, children) {
    console.groupCollapsed('Utils > m');
    console.log('componentDef, _settings, children', componentDef, _settings, children);
    // check signature
    var mSignature = [
        { componentDef: checks_1.isNullableComponentDef },
        { settings: checks_1.isNullableObject },
        { children: checks_1.isArrayOf(checks_1.isComponent) },
    ];
    checks_1.assertSignature('m', arguments, mSignature);
    var makeLocalSources = componentDef.makeLocalSources, makeLocalSettings = componentDef.makeLocalSettings, makeOwnSinks = componentDef.makeOwnSinks, mergeSinks = componentDef.mergeSinks, computeSinks = componentDef.computeSinks, sinksContract = componentDef.sinksContract, sourcesContract = componentDef.sourcesContract, settingsContract = componentDef.settingsContract;
    // Set default values
    _settings = _settings || {};
    makeLocalSources = checks_1.defaultsTo(makeLocalSources, ramda_1.always(null));
    makeLocalSettings = checks_1.defaultsTo(makeLocalSettings, ramda_1.always({}));
    makeOwnSinks = checks_1.defaultsTo(makeOwnSinks, ramda_1.always(null));
    mergeSinks = checks_1.defaultsTo(mergeSinks, {});
    sinksContract = checks_1.defaultsTo(sinksContract, ramda_1.always(true));
    sourcesContract = checks_1.defaultsTo(sourcesContract, ramda_1.always(true));
    settingsContract = checks_1.defaultsTo(settingsContract, ramda_1.always(true));
    console.groupEnd();
    return function m(sources, innerSettings) {
        console.groupCollapsed('m\'ed component > Entry');
        console.log('sources, innerSettings', sources, innerSettings);
        checks_1.assertSettingsContracts(innerSettings, settingsContract);
        innerSettings = innerSettings || {};
        var mergedSettings = deepMerge(innerSettings, _settings);
        checks_1.assertSourcesContracts(sources, sourcesContract);
        // Computes and MERGES the extra sources which will be passed
        // to the children and this component
        // Extra sources are derived from the `sources`
        // received as input, which remain untouched
        var extendedSources = ramda_1.merge(sources, makeLocalSources(sources, mergedSettings));
        // Note that per `merge` ramda spec. the second object's values
        // replace those from the first in case of key conflict
        var localSettings = deepMerge(makeLocalSettings(mergedSettings), mergedSettings);
        var reducedSinks;
        // Case : computeSinks is defined
        if (computeSinks) {
            reducedSinks = computeSinks(makeOwnSinks, children, extendedSources, localSettings);
        }
        else {
            console.groupCollapsed('m\'ed component > makeOwnSinks');
            console.log('extendedSources, localSettings', extendedSources, localSettings);
            var ownSinks = makeOwnSinks(extendedSources, localSettings);
            console.groupEnd();
            console.group('m\'ed component > computing children sinks');
            var childrenSinks = ramda_1.map(function (childComponent) { return childComponent(extendedSources, localSettings); }, children);
            console.groupEnd('m\'ed component > computing children sinks');
            checks_1.assertContract(checks_1.isOptSinks, [ownSinks], 'ownSinks must be a hash of observable sink');
            checks_1.assertContract(checks_1.isArrayOptSinks, [childrenSinks], 'childrenSinks must' +
                ' be an array of sinks');
            // Merge the sinks from children and one-s own...
            // Case : mergeSinks is defined through a function
            if (checks_1.isFunction(mergeSinks)) {
                console.groupCollapsed('m\'ed component > (fn) mergeSinks');
                console.log('ownSinks, childrenSinks, localSettings', ownSinks, childrenSinks, localSettings);
                reducedSinks = mergeSinks(ownSinks, childrenSinks, localSettings);
                console.groupEnd();
            }
            else {
                var allSinks = ramda_1.flatten(checks_1.removeNullsFromArray([ownSinks, childrenSinks]));
                var sinkNames = checks_1.getSinkNamesFromSinksArray(allSinks);
                console.groupCollapsed('m\'ed component > (obj) mergeSinks');
                console.log('ownSinks, childrenSinks, localSettings,' +
                    ' (fn) mergeSinks', ownSinks, childrenSinks, localSettings, mergeSinks);
                reducedSinks = ramda_1.reduce(computeReducedSink(ownSinks, childrenSinks, localSettings, mergeSinks), {}, sinkNames);
                console.groupEnd();
            }
        }
        checks_1.assertSinksContracts(reducedSinks, sinksContract);
        var tracedSinks = checks_1.trace(reducedSinks, mergedSettings);
        // ... and add tracing information(sinkPath, timestamp, sinkValue/sinkError) after each sink
        // TODO : specify trace/debug/error generation information
        // This would ensure that errors are automatically and systematically
        //       caught in the component where they occur, and not
        //       interrupting the application implementation-wise, it might be
        //       necessary to add a `currentPath` parameter somewhere which
        //       carries the current path down the tree
        console.groupEnd();
        return tracedSinks;
    };
}
exports.m = m;
