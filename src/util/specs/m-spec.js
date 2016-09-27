"use strict";
var assert = require('assert');
var ramda_1 = require('ramda');
var dom_1 = require('@motorcycle/dom');
var $ = require('most');
var runTestScenario_1 = require('../test/runTestScenario');
var m_1 = require('../combinator/m');
var checks_1 = require('../checks');
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.groupCollapsed = console.log;
// Fixtures
var PROVIDERS = {
    google: 'google',
    facebook: 'facebook',
};
function plan(n) {
    return function _done(done) {
        if (--n === 0) {
            done();
        }
    };
}
describe('Testing m(component_def, settings, children)', function () {
    it('edge cases - no arguments', function () {
        // NOTE
        // skipping more edge cases where arguments are of the wrong type
        // there are too many of them and they do not add so much value
        // As much as possible, the helper is written so it fails early with a
        // reasonably descriptive error message when it detects invalid arguments
        assert.throws(function () {
            m_1.m();
        }, /fails/, 'it throws an exception if it is called with an invalid ' +
            'combination of arguments');
    });
    it('main cases - only children components', function (done) {
        // NOTE
        // skipping also a number of main cases corresponding to combination of inputs
        // which are deem to be tested
        // Inputs : component_def x settings x children
        // - component_def: 7 classes of values for properties
        // - settings: two classes of values (null, {...})
        // - children: three classes of values ([], [component], [component, component])
        // That makes for 7x2x3 = 42 tests
        // We assume that those inputs are 'independent', so the number of cases
        // gets down to 7 + 2 + 3 = 12
        // We assume that case children : [component, component] takes care of [component]
        // and we test several conditions in the same test case
        // which brings down the number of tests to 4
        var assertAsync = plan(4);
        // Test case 2
        // 2 children: [component (sink DOM, a, c), component(sink DOM, a, d)], settings : {...}, no component_def, no local sources
        //   + sources : DOM, a, b, c, d, e
        //   + output.sinks = children component sinks merged with default values of the component_def
        //   + i.e. sinkNames = [DOM, auth, route, queue], DOM is merged with default,
        //     auth is merged with both, queue, route merged with 1
        //   + settings are taken into account (have all of the sinks depend on settings differently)
        var testSettings = { main: 'parent settings' };
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (user) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, settings.main),
                ]); }, sources.a),
                a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                c: sources.c.map(function (x) { return 'child1-c-' + x; }),
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (user) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, settings.local),
                ]); }, sources.a),
                a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                d: sources.e.map(function (x) { return 'child2-e-' + x; }),
            };
        };
        var mComponent = m_1.m({
            makeLocalSettings: function (settings) { return ({ local: 'local setting' }); },
        }, testSettings, [childComponent1, childComponent2]);
        var inputs = [
            { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
            { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
            { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
            { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
            { e: { diagram: 'a|', values: { a: 'e-0' } } }
        ];
        var vNodes = [
            // 1
            dom_1.div([
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                ]),
            ]),
            // 2
            dom_1.div([
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                ]),
            ]),
            dom_1.div([
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                ]),
            ]),
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "child1-a-b-0",
                    "child2-a-d-0",
                    "child1-a-b-1",
                    "child1-a-b-2",
                    "child2-a-d-2"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            c: {
                outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                successMessage: 'sink c produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            d: {
                outputs: ["child2-e-e-0"],
                successMessage: 'sink d produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
        it('main cases - only children components', function (done) {
            // NOTE
            // skipping also a number of main cases corresponding to combination of inputs
            // which are deem to be tested
            // Inputs : component_def x settings x children
            // - component_def: 7 classes of values for properties
            // - settings: two classes of values (null, {...})
            // - children: three classes of values ([], [component], [component, component])
            // That makes for 7x2x3 = 42 tests
            // We assume that those inputs are 'independent', so the number of cases
            // gets down to 7 + 2 + 3 = 12
            // We assume that case children : [component, component] takes care of [component]
            // and we test several conditions in the same test case
            // which brings down the number of tests to 4
            var assertAsync = plan(4);
            // Test case 2
            // 2 children: [component (sink DOM, a, c), component(sink DOM, a, d)], settings : {...}, no component_def, no local sources
            //   + sources : DOM, a, b, c, d, e
            //   + output.sinks = children component sinks merged with default values of the component_def
            //   + i.e. sinkNames = [DOM, auth, route, queue], DOM is merged with default,
            //     auth is merged with both, queue, route merged with 1
            //   + settings are taken into account (have all of the sinks depend on settings differently)
            var testSettings = { main: 'parent settings' };
            var childComponent1 = function childComponent1(sources, settings) {
                return {
                    DOM: $.empty(),
                    a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                    c: sources.c.map(function (x) { return 'child1-c-' + x; }),
                };
            };
            var childComponent2 = function childComponent1(sources, settings) {
                return {
                    DOM: $.map(function (user) { return dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, settings.local),
                    ]); }, sources.a),
                    a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                    d: sources.e.map(function (x) { return 'child2-e-' + x; }),
                };
            };
            var mComponent = m_1.m({
                makeLocalSettings: function (settings) { return ({ local: 'local setting' }); },
            }, testSettings, [childComponent1, childComponent2]);
            var inputs = [
                { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
                { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
                { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
                { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
                { e: { diagram: 'a|', values: { a: 'e-0' } } }
            ];
            var vNodes = [
                // 1
                dom_1.div([
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                    ]),
                ]),
                // 2
                dom_1.div([
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                    ]),
                ]),
                dom_1.div([
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                    ]),
                ]),
            ];
            function analyzeTestResults(actual, expected, message) {
                assert.deepEqual(actual, expected, message);
                assertAsync(done);
            }
            /** @type TestResults */
            var testResults = {
                DOM: {
                    outputs: vNodes,
                    successMessage: 'sink DOM produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                    transformFn: undefined,
                },
                a: {
                    outputs: [
                        "child1-a-b-0",
                        "child2-a-d-0",
                        "child1-a-b-1",
                        "child1-a-b-2",
                        "child2-a-d-2"
                    ],
                    successMessage: 'sink a produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                },
                c: {
                    outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                    successMessage: 'sink c produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                    transformFn: undefined,
                },
                d: {
                    outputs: ["child2-e-e-0"],
                    successMessage: 'sink d produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                    transformFn: undefined,
                },
            };
            var testFn = mComponent;
            runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
                timeUnit: 50,
                waitForFinishDelay: 100
            });
        });
    });
    it("main cases - no children", function (done) {
        var assertAsync = plan(5);
        // Test input 4
        // No children, settings : ?, full component def(sink DOM, auth,
        //   queue, extra source user$) using the extra sources created
        var vNode = {
            "children": [
                {
                    "children": undefined,
                    "data": {
                        "style": {
                            "fontWeight": "bold"
                        }
                    },
                    "elm": undefined,
                    "key": undefined,
                    "sel": "span",
                    "text": "parent settings"
                },
                {
                    "children": undefined,
                    "data": undefined,
                    "elm": undefined,
                    "key": undefined,
                    "sel": undefined,
                    "text": " and this is local settings"
                },
                {
                    "children": undefined,
                    "data": {
                        "style": {
                            "fontWeight": "italic"
                        }
                    },
                    "elm": undefined,
                    "key": undefined,
                    "sel": "span",
                    "text": "local setting"
                }
            ],
            "data": {},
            "elm": undefined,
            "key": undefined,
            "sel": "div#container.two.classes",
            "text": undefined
        };
        var testSettings = { key: 'parent settings' };
        var mComponent = m_1.m({
            makeLocalSources: function (sources, settings) {
                return {
                    user$: $.of(settings),
                };
            },
            makeLocalSettings: function (settings) { return ({ localSetting: 'local setting' }); },
            makeOwnSinks: function (sources, settings) { return ({
                DOM: $.map(function (user) { return dom_1.h('div#container.two.classes', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, user.key),
                    ' and this is local settings',
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, settings.localSetting),
                ]); }, sources.user$),
                auth$: sources.auth$.startWith(PROVIDERS.google),
            }); },
            mergeSinks: function (parentSinks, childrenSinks, settings) { return ({
                DOM: parentSinks.DOM,
                auth$: parentSinks.auth$,
                user$: parentSinks.user$,
                childrenSinks$: $.of(childrenSinks),
                settings$: $.of(settings),
            }); },
            sinksContract: function checkMSinksContracts() {
                return true;
            }
        }, null, []);
        var inputs = [
            { auth$: { diagram: '-a|', values: { a: PROVIDERS.facebook } } },
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: [vNode],
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            auth$: {
                outputs: ['google', 'facebook'],
                successMessage: 'sink auth produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            user$: {
                outputs: [],
                successMessage: 'sink user produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            childrenSinks$: {
                outputs: [[]],
                successMessage: 'sink childrenSinks produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            settings$: {
                outputs: [{
                        "key": "parent settings",
                        "localSetting": "local setting"
                    }],
                successMessage: 'sink settings produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = function mComponentTestFn(settings) {
            return function _mComponentTestFn(sources) {
                return mComponent(sources, settings);
            };
        };
        runTestScenario_1.runTestScenario(inputs, testResults, testFn(testSettings), {
            timeUnit: 10,
            waitForFinishDelay: 30
        });
    });
    it('main cases - children components and parent component - default merge', function (done) {
        var assertAsync = plan(5);
        // Test case 4
        // 4 children: [component, component], settings : {...}, full component def (DOM, queue, auth, action)
        var testSettings = null;
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-' + a),
                ]); }, sources.a),
                a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                c: sources.c.map(function (x) { return 'child1-c-' + x; }),
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-' + a),
                ]); }, sources.a),
                a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                d: sources.e.map(function (x) { return 'child2-e-' + x; }),
            };
        };
        var mComponent = m_1.m({
            makeLocalSources: function (sources, settings) {
                return {
                    user$: $.of(settings),
                };
            },
            makeOwnSinks: function (sources, settings) { return ({
                DOM: $.of(dom_1.div('.parent')),
                auth$: sources.auth$.startWith(PROVIDERS.google),
            }); },
            sinksContract: function checkMSinksContracts() {
                return true;
            }
        }, testSettings, [childComponent1, childComponent2]);
        var vNodes = [
            dom_1.div('.parent', [
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-0'),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-0'),
                ]),
            ]),
            dom_1.div('.parent', [
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-1'),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-0'),
                ]),
            ]),
            dom_1.div('.parent', [
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-1'),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-1'),
                ]),
            ]),
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var inputs = [
            { auth$: { diagram: 'a|', values: { a: 'auth-0' } } },
            { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
            { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
            { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
            { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
            { e: { diagram: 'a|', values: { a: 'e-0' } } },
        ];
        /** @type TestResults */
        var TestResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            auth$: {
                outputs: ["google", "auth-0"],
                successMessage: 'sink auth$ produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "child1-a-b-0",
                    "child2-a-d-0",
                    "child1-a-b-1",
                    "child1-a-b-2",
                    "child2-a-d-2"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            c: {
                outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                successMessage: 'sink c produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            d: {
                outputs: ["child2-e-e-0"],
                successMessage: 'sink d produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, TestResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
    });
    it('main cases - children components and parent component - customized merge', function (done) {
        var assertAsync = plan(5);
        var testSettings = null;
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-' + a),
                ]); }, sources.a),
                a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                c: sources.c.map(function (x) { return 'child1-c-' + x; }),
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-' + a),
                ]); }, sources.a),
                a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                d: sources.e.map(function (x) { return 'child2-e-' + x; }),
            };
        };
        var mComponent = m_1.m({
            makeLocalSources: function (sources, settings) {
                return {
                    user$: $.of(settings),
                };
            },
            makeOwnSinks: function (sources, settings) { return ({
                DOM: $.of(dom_1.div('.parent')),
                auth$: sources.auth$.startWith(PROVIDERS.google),
            }); },
            mergeSinks: function (parentSinks, childrenSinks, settings) { return ({
                DOM: parentSinks.DOM,
                auth$: parentSinks.auth$,
                user$: parentSinks.user$,
                childrenSinks$: $.mergeArray(checks_1.projectSinksOn('DOM', childrenSinks)),
                settings$: $.of(settings),
            }); },
            sinksContract: function checkMSinksContracts() {
                return true;
            }
        }, testSettings, [childComponent1, childComponent2]);
        var inputs = [
            { auth$: { diagram: 'a|', values: { a: 'auth-0' } } },
            { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
            { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
            { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
            { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
            { e: { diagram: 'a|', values: { a: 'e-0' } } }
        ];
        var vNodes = [
            {
                "children": undefined,
                "data": {},
                "elm": undefined,
                "key": undefined,
                "sel": "div.parent",
                "text": undefined
            }
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            user$: {
                outputs: [],
                successMessage: 'sink user produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            childrenSinks$: {
                outputs: [
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-0'),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-0'),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-1'),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-1'),
                    ]),
                ],
                successMessage: 'sink childrenSinks produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            settings$: {
                outputs: [{}],
                successMessage: 'sink settings produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            auth$: {
                outputs: ["google", "auth-0"],
                successMessage: 'sink auth$ produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "child1-a-b-0",
                    "child2-a-d-0",
                    "child1-a-b-1",
                    "child1-a-b-2",
                    "child2-a-d-2"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            c: {
                outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                successMessage: 'sink c produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            d: {
                outputs: ["child2-e-e-0"],
                successMessage: 'sink d produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
    });
    it('main cases - great children components - default merge - settings', function (done) {
        var assertAsync = plan(4);
        var child = {
            makeOwnSinks: function childMakeOwnSinks(sources, settings) {
                return {
                    DOM: sources.DOM1.map(checks_1.makeDivVNode),
                    childSettings$: sources.DOM1.map(ramda_1.always(settings))
                };
            },
            makeLocalSettings: function makeLocalSettings(settings) {
                return {
                    childKey1: '.settingInMOverloaded'
                };
            }
        };
        var greatChild = {
            makeOwnSinks: function greatCMakeOwnSinks(sources, settings) {
                return {
                    DOM: sources.DOM2.map(checks_1.makeDivVNode),
                    gCSettings$: sources.DOM2.map(ramda_1.always(settings))
                };
            }
        };
        var parent = {
            makeOwnSinks: function parentMakeOwnSinks(sources, settings) {
                return {
                    DOM: sources.DOMp.map(checks_1.makeDivVNode),
                    parentSettings$: sources.DOMp.map(ramda_1.always(settings))
                };
            }
        };
        var component = m_1.m(parent, {
            parentKey1: 'MOverloaded',
            parentKey2: 'settingInM',
            parentKey3: { parent: 1 }
        }, [
            m_1.m(child, {
                childKey1: '.settingInM',
                parentKey2: 'parentSettingOverloadByChild',
                parentKey3: { child: 2 }
            }, [
                m_1.m(greatChild, {
                    greatChildKey: '..settingInM',
                    parentKey3: { greatChild: 3 }
                }, [])
            ])
        ]);
        var inputs = [
            { DOMp: { diagram: '-a---b--' } },
            { DOM1: { diagram: '-a--b--c--' } },
            { DOM2: { diagram: '-a-b-c-d-e-' } },
        ];
        function makeTestVNode(p, c, gc) {
            // p: parent, c: child, gc: greatchild
            return {
                "children": [
                    {
                        "children": [],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": undefined,
                        "text": p
                    },
                    {
                        "children": [
                            {
                                "children": [],
                                "data": {},
                                "elm": undefined,
                                "key": undefined,
                                "sel": undefined,
                                "text": c
                            },
                            {
                                "children": [
                                    {
                                        "children": [],
                                        "data": {},
                                        "elm": undefined,
                                        "key": undefined,
                                        "sel": undefined,
                                        "text": gc
                                    },
                                ],
                                "data": {},
                                "elm": undefined,
                                "key": undefined,
                                "sel": "div",
                                "text": undefined
                            }
                        ],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": "div",
                        "text": undefined
                    }
                ],
                "data": {},
                "elm": undefined,
                "key": undefined,
                "sel": "div",
                "text": undefined
            };
        }
        var vNodes = [
            makeTestVNode('a', 'a', 'a'),
            makeTestVNode('a', 'a', 'b'),
            makeTestVNode('a', 'b', 'b'),
            makeTestVNode('b', 'b', 'b'),
            makeTestVNode('b', 'b', 'c'),
            makeTestVNode('b', 'c', 'c'),
            makeTestVNode('b', 'c', 'd'),
            makeTestVNode('b', 'c', 'e'),
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            parentSettings$: {
                outputs: [
                    {
                        "parentKey1": "MOverloaded",
                        "parentKey2": "settingInM",
                        "parentKey3": {
                            "parent": 1
                        }
                    },
                    {
                        "parentKey1": "MOverloaded",
                        "parentKey2": "settingInM",
                        "parentKey3": {
                            "parent": 1
                        }
                    }
                ],
                successMessage: 'Component settings are the resulting merge of :\n' +
                    '1. settings passed through `m` helper, \n' +
                    '2. settings passed when calling the component which is a result of the `m` helper,\n' +
                    '3. settings resulting from `makeLocalSettings`\n' +
                    'in decreasing precedency order.',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            childSettings$: {
                outputs: [
                    {
                        "childKey1": ".settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "parent": 1
                        }
                    }
                ],
                successMessage: 'Children settings are computed like any component ' +
                    'settings, but also merge with the settings from the parent.\n' +
                    ' In case of conflict with the parent, the children settings ' +
                    'have higher precedency.',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            gCSettings$: {
                outputs: [
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    }
                ],
                successMessage: 'Each child has its own setting object, ' +
                    'i.e settings are passed down the component tree by value, ' +
                    'not by reference',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = function (sources, settings) {
            return component(sources, { parentKey1: 'settingOut' });
        };
        runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
    });
});
