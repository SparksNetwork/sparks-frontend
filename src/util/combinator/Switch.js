"use strict";
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.log;
console.groupCollapsed = console.log;
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
var checks_1 = require('../checks');
var m_1 = require('./m');
var ramda_1 = require('ramda');
var $ = require('most');
var sample_1 = require('@most/sample');
// CONFIG
var DEFAULT_SWITCH_COMPONENT_SOURCE_NAME = 'switch$'; // NOT USED
var defaultEqFn = function swichCptDefaultEqFn(a, b) {
    return a === b;
};
var cfg = {
    defaultSwitchComponentSourceName: DEFAULT_SWITCH_COMPONENT_SOURCE_NAME,
    defaultEqFn: defaultEqFn
};
//////
// Helper functions
function isSwitchSettings(settings) {
    var eqFn = settings.eqFn, caseWhen = settings.caseWhen, sinkNames = settings.sinkNames, on = settings.on;
    var signature = {
        eqFn: ramda_1.either(ramda_1.isNil, checks_1.isFunction),
        caseWhen: ramda_1.complement(ramda_1.isNil),
        sinkNames: checks_1.isArrayOf(checks_1.isString),
        on: ramda_1.either(checks_1.isString, checks_1.isFunction)
    };
    var signatureErrorMessages = {
        eqFn: 'eqFn property, when not undefined, must be a function.',
        caseWhen: 'caseWhen property is mandatory.',
        sinkNames: 'sinkNames property must be an array of strings',
        on: '`on` property is mandatory and must be a string or a function.'
    };
    return checks_1.checkSignature(settings, signature, signatureErrorMessages, false);
}
function hasAtLeastOneChildComponent(childrenComponents) {
    return childrenComponents &&
        checks_1.isArray(childrenComponents) &&
        childrenComponents.length >= 1 ? true : '';
}
function computeSinks(makeOwnSinks, childrenComponents, sources, settings) {
    // TODO (later): Be careful that the inheritance of settings down the
    // chain can pollute children... So I need to check the presence of the
    // passed settings before merge to check that mandatory properties are
    // passed and not inherited unexpectedly from an ancestor.
    // This will have to be done via settingsContracts at SwitchCase level
    // debug info
    console.groupCollapsed('Switch component > computeSinks');
    console.debug('sources, settings, childrenComponents', sources, settings, childrenComponents);
    checks_1.assertContract(isSwitchSettings, [settings], 'Invalid switch' +
        ' component settings!');
    checks_1.assertContract(hasAtLeastOneChildComponent, [childrenComponents], 'switch combinator must at least have one child component to switch to!');
    var eqFn = settings.eqFn, caseWhen = settings.caseWhen, sinkNames = settings.sinkNames, on = settings.on;
    var overload = checks_1.unfoldObjOverload(on, [
        { 'guard$': checks_1.isFunction },
        { 'sourceName': checks_1.isString }
    ]);
    var _a = overload, guard$ = _a.guard$, sourceName = _a.sourceName, _index = _a._index;
    var switchSource;
    if (overload._index === 1) {
        // Case : overload `settings.on :: SourceName`
        switchSource = sources[sourceName];
        checks_1.assertContract(checks_1.isSource, [switchSource], "An observable with name " + sourceName + " could not be found in sources");
    }
    if (overload._index === 0) {
        // Case : overload `settings.on :: SourceName`
        switchSource = guard$(sources, settings);
        checks_1.assertContract(checks_1.isSource, [switchSource], "The function used for conditional switching did not return an observable!");
    }
    // set default values for optional properties
    eqFn = checks_1.defaultsTo(eqFn, cfg.defaultEqFn);
    var shouldSwitch$ = switchSource
        .map(function (x) { return eqFn(caseWhen, x); });
    var cachedSinks$ = shouldSwitch$
        .filter(function (x) { return x; })
        .map(function (_) {
        var mergedChildrenComponentsSinks = m_1.m({}, { matched: caseWhen }, childrenComponents);
        return mergedChildrenComponentsSinks(sources, settings);
    })
        .multicast(); // multicasted to all sinks
    function makeSwitchedSinkFromCache(sinkName) {
        return function makeSwitchedSinkFromCache(isMatchingCase, cachedSinks) {
            var cached$, preCached$, prefix$;
            if (isMatchingCase) {
                // Case : the switch source emits a value corresponding to the
                // configured case in the component
                // Case : matches configured value
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
                        // !! Don't start with null in case of switching IN, only
                        // when switching OUT
                        $.empty() :
                        // Case : Non-DOM sink
                        // Non-DOM sinks are merged with a simple `merge`, there
                        // is no conflict here, so we just return nothing
                        $.empty();
                    preCached$ = cachedSinks[sinkName]
                        .tap(console.log.bind(console, 'sink ' + sinkName + ':'));
                    // TODO BRC : add the finally operator
                    //            .finally(_ => {
                    //              console.log(`sink ${sinkName} terminating due to route change`)
                    //            })
                    cached$ = $.concat(prefix$, preCached$);
                }
                else {
                    // Case : the component does not have any sinks with the
                    // corresponding sinkName
                    cached$ = $.empty();
                }
            }
            else {
                // Case : the switch source emits a value NOT corresponding to the
                // configured case in the component
                console.log('isMatchingCase is null!!! no match for this component on' +
                    ' this route!');
                cached$ = sinkName === 'DOM' ? $.of(null) : $.empty();
            }
            return cached$;
        };
    }
    function makeSwitchedSink(sinkName) {
        return (_a = {},
            _a[sinkName] = sample_1.sample(makeSwitchedSinkFromCache(sinkName), shouldSwitch$, cachedSinks$)
                .switch(),
            _a
        );
        var _a;
    }
    console.groupEnd();
    return ramda_1.mergeAll(ramda_1.map(makeSwitchedSink, sinkNames));
}
/**
 * Usage : m(SwitchCase, ::SwitchCaseSettings, ::Array<CaseComponent>)
 * Example : cf. specs
 *   > const mComponent = m(SwitchCase, {
   *   >    on: (sources,settings) => sources.sweatch$,
   *   >    sinkNames: ['DOM', 'a', 'b']
   *   >  }, [
 *   > m(Case, {caseWhen: true}, [childComponent1, childComponent2]),
 *   > m(Case, {caseWhen: false}, [childComponent3])
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
 * - SwitchCase combinator must have at least one child component
 * - Case combinator must have at least one child component
 * - Conditions should be defined such that there is for any given value
 * of the 'switched' stream only one matching component
 *   - If that is not the case, the last matching component will be the one
 *   prevailing. It is however how to predict which of the components will
 *   be the last in a given configuration
 * - on, sinkNames, caseWhen are mandatory
 *
 * Case component
 * - settings.caseWhen :: *
 * An object which will activate the switched-to component whenever the source
 * observable returned by the `on` parameter emits that object
 *
 * Contracts :
 * - caseWhen is mandatory
 *
 */
var SwitchCase = {
    mergeSinks: {
        DOM: function mergeDomSwitchedSinks(ownSink, childrenDOMSink, settings) {
            var allSinks = ramda_1.flatten([ownSink, childrenDOMSink]);
            var allDOMSinks = checks_1.removeNullsFromArray(allSinks);
            // NOTE : zip rxjs does not accept only one argument...
            return $.mergeArray(allDOMSinks)
                .tap(console.warn.bind(console, 'Switch.specs' +
                ' > mergeDomSwitchedSinks > merge'))
                .filter(Boolean);
            // Most values will be null
            // All non-null values correspond to a match
            // In the degenerated case, all values will be null (no match
            // at all)
        }
    }
};
exports.SwitchCase = SwitchCase;
var Case = { computeSinks: computeSinks };
exports.Case = Case;
