/// <reference path="../../../typings/index.d.ts" />
"use strict";
var assert = require('assert');
var dom_1 = require('@motorcycle/dom');
var $ = require('most');
var runTestScenario_1 = require('../test/runTestScenario');
var m_1 = require('../combinator/m');
var Router_1 = require('../combinator/Router');
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.groupCollapsed = console.groupCollapsed || console.log;
function plan(n) {
    return function _done(done) {
        if (--n === 0) {
            done();
        }
    };
}
describe('Testing Router component', function () {
    it('main cases - non-nested routing', function (done) {
        var assertAsync = plan(4);
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM1.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 1: '))
                    .map(function (x) { return dom_1.h('span', {}, 'Component 1 : id=' + settings.routeParams.id + ' - ' + x); })
                    .concat($.never()),
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : component 1 - route$'))
                    .map(function (x) { return 'Component 1 - routeLog - ' +
                    settings.routeParams.user + settings.routeParams.id; }),
                a: sources.userAction$.map(function (x) { return 'Component1 - user action - ' + x; })
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM2.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 2: '))
                    .map(function (x) { return dom_1.h('span', {}, 'Component 2 : id=' + settings.routeParams.id + ' - ' + x); })
                    .concat($.never()),
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : component 2 - route$'))
                    .map(function (x) { return 'Component2 - routeLog - routeRemainder: ' + x; }),
                b: sources.userAction$.map(function (x) { return 'Component2 - user action - ' + x; })
            };
        };
        var mComponent = m_1.m(Router_1.Router, { route: ':user/:id', sinkNames: ['DOM', 'routeLog', 'a', 'b'] }, [childComponent1, childComponent2]);
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a--b--c--d-' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-abb-c-d-e-f-' } },
            {
                userAction$: {
                    diagram: 'a---b-ac--ab---c',
                    values: { a: 'click', b: 'select', c: 'hover', }
                }
            },
            {
                route$: {
                    //diagr: '-a--b--c--d--e--f--a--b--c--d--e--f-',
                    //diagr: '-a-b-c-d-e-f-abb-c-d-e-f-',
                    diagram: '-a---b--cdef--g', values: {
                        a: 'bruno/1',
                        b: 'ted',
                        c: 'bruno/2',
                        d: 'bruno/2/remainder',
                        e: 'bruno/2/remainder',
                        f: 'bruno/3/bigger/remainder',
                        g: 'paul',
                    }
                }
            }
        ];
        function makeVNode(componentNum, id, x) {
            return dom_1.h('span', {}, 'Component ' + componentNum + ' : id=' + id + ' - ' + x);
        }
        var vNodes = [
            null,
            dom_1.div([
                makeVNode(1, 1, 'b'),
                makeVNode(2, 1, 'b'),
            ]),
            dom_1.div([
                makeVNode(1, 1, 'b'),
                makeVNode(2, 1, 'c'),
            ]),
            null,
            null,
            dom_1.div([
                makeVNode(1, 2, 'd'),
                makeVNode(2, 2, 'e'),
            ]),
            dom_1.div([
                makeVNode(1, 2, 'd'),
                makeVNode(2, 2, 'f'),
            ]),
            null,
            dom_1.div([
                makeVNode(1, 3, 'e'),
                makeVNode(2, 3, 'a'),
            ]),
            dom_1.div([
                makeVNode(1, 3, 'e'),
                makeVNode(2, 3, 'b'),
            ]),
            null,
        ];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            routeLog: {
                outputs: [
                    "Component 1 - routeLog - bruno1",
                    "Component2 - routeLog - routeRemainder: undefined",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: undefined",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: remainder",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: remainder",
                    "Component 1 - routeLog - bruno3",
                    "Component2 - routeLog - routeRemainder: bigger/remainder"
                ],
                successMessage: 'sink routeLog produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "Component1 - user action - select",
                    "Component1 - user action - click",
                    "Component1 - user action - select"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            b: {
                outputs: [
                    "Component2 - user action - select",
                    "Component2 - user action - click",
                    "Component2 - user action - select"
                ],
                successMessage: 'sink b produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 5,
            waitForFinishDelay: 30
        });
    });
    /**
     // Note that `:user` matches the empty string! It is somewhat of a
     // pathological case but important to have in mind.
     //
     // We have 6 transitions to test against :
     //   A    | child  |  n          B    | child  |  n
     //-------------------------    ------------------------
     // parent |   o    |  1        parent |   1    |  o
     // n      |   x    |  2        n      |   x    |  2
     //
     //   C    | child  |  n
     //-------------------------
     // parent |   1    |  2
     // n      |   x    |  o
     //
     // Legend:
     // - (n,n) : the streamed route does not match any of the configured route
     // - (parent, child) : the streamed route match the parent, and the
     // nested child configured route
     // - (parent, n) | (child, n) : the streamed route matches only one of
     // parent or child configured route
     // - x : state which is not possible
     //
     // Transition A -> A1:
     // The parent sink emits immediately a value which is the last seen
     // value of the parent sink (i.e. as if children sinks became null) if any
     // Transition A -> A2:
     // All children and parent sinks are terminated. Nothing is emitted,
     //
     // Transition B -> B1:
     // Nothing is visibly emitted on any sinks (actually null is emitted at
     // children's level but filtered out), but children sinks are activated.
     // Whenever a child sink will emit a value, that value will be merged
     // into the parent sinks
     //
     // Transition B -> B2:
     // Nothing is emitted on the parent sinks, which are terminated.
     //
     // Transition C -> C1:
     // Parent and children sinks are activated and combined. The current
     // logic is hierarchical :
     // - if the parent sinks emit first, then that value is passed
     // - if the children sinks emit first, then till the parent value emit
     // its first value, nothing is passed (à la `combineLatest`)
     // Starting the top level parent sink will emit a null.
     //
     // Transition C -> C2:
     // Parent sinks are activated.
     // Starting the top level parent sink will emit a null.
     */
    it('main cases - nested routing', function (done) {
        var assertAsync = plan(4);
        var counter = 0;
        var childComponent = {
            makeOwnSinks: function (sources, settings) {
                console.group("executing childComponent own");
                console.log('sources, settings', sources, settings);
                console.groupEnd();
                var user = settings.routeParams.user;
                console.error('settings.routeParams user', user, ++counter);
                return {
                    DOM: sources.DOM1.take(4)
                        .tap(console.warn.bind(console, 'DOM : child component : '))
                        .map(function (x) { return dom_1.h('span', {}, 'Child component : user=' + user + ' - ' + x); })
                        .concat($.never()),
                    routeLog: sources.route$
                        .tap(console.warn.bind(console, 'routeLog : child component -' +
                        ' route$'))
                        .map(function (x) {
                        return 'Child component 1 - routeLog - ' + user;
                    }),
                    userAction1$: sources.userAction$.map(function (x) { return 'child component - user' +
                        ' action - ' + x; }).startWith('child component - starting')
                };
            }
        };
        var greatChildComponent = function greatChildComponent(sources, settings) {
            console.group("executing greatChildComponent own");
            console.log('sources, settings', sources, settings);
            console.groupEnd();
            return {
                DOM: sources.DOM2.take(4)
                    .tap(console.warn.bind(console, 'DOM : great child component : '))
                    .map(function (x) { return dom_1.h('span', {}, 'Great child component : id=' + settings.routeParams.id + ' - ' + x); })
                    .concat($.never()),
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : great child component -' +
                    ' route$'))
                    .map(function (x) { return [
                    'great child component - routeLog -',
                    '(user: ' + settings.routeParams.user + ',',
                    'id: ' + settings.routeParams.id + ')'
                ].join(' '); }),
                userAction2$: sources.userAction$.map(function (x) { return 'great child component -' +
                    ' user action - ' + x; }).startWith('great child component - starting'),
                notMerged: sources.DOM1.map(function (x) { return 'ERROR'; })
                    .tap(console.log.bind(console, 'notMerged:'))
            };
        };
        // Note that if nested routers redefine `sinkNames` it will have no impact
        // on previous definition, as settings are local to each child : children
        // inherit settings from the parent through copy (passing by value)
        console.groupCollapsed('creating mComponent');
        var mComponent = m_1.m(Router_1.Router, {
            route: ':user',
            sinkNames: ['DOM', 'routeLog', 'userAction1$', 'userAction2$'],
            trace: 'top'
        }, [
            m_1.m(childComponent, { trace: 'middle' }, [
                m_1.m(Router_1.Router, { route: ':id', trace: 'bottom' }, [greatChildComponent])
            ])
        ]);
        console.groupEnd();
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a--b--c--d-' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-a-b-c-d-e-f-' } },
            {
                userAction$: {
                    diagram: 'a---b-ac--aba--c',
                    values: { a: 'click', b: 'select', c: 'hover', }
                }
            },
            {
                route$: {
                    //userA: 'a---b-ac--aba--c',
                    //diagr: '-a--b--c--d--e--f--a--b--c--d-'}},
                    //diagr: '-a-b-c-d-e-f-a-b-c-d-e-f-'}},
                    //          diagram: '-a--b--c--def--g-h-i-j-k', values: {
                    diagram: '-a----------------------', values: {
                        a: 'bruno/1',
                        b: 'ted/1',
                        c: 'ted',
                        d: 'bruno/2',
                        e: 'bruno/2/remainder',
                        f: 'bruno/2/remainder',
                        g: 'bruno/3/bigger/remainder',
                        h: '',
                        i: undefined,
                        j: 'ted/1/sth',
                        k: undefined,
                    }
                }
            }
        ];
        function makeVNode(user, id, x, y) {
            return y != null ? {
                "children": [
                    {
                        "children": [],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": undefined,
                        "text": "Child component : user=" + user + " - " + x
                    },
                    {
                        "children": undefined,
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": "span",
                        "text": "Great child component : id=" + id + " - " + y
                    }
                ],
                "data": {},
                "elm": undefined,
                "key": undefined,
                "sel": "span",
                "text": undefined
            } : {
                "children": [
                    {
                        "children": [],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": undefined,
                        "text": "Child component : user=" + user + " - " + x
                    },
                ],
                "data": {},
                "elm": undefined,
                "key": undefined,
                "sel": "span",
                "text": undefined
            };
        }
        var expectedVNodes = [
            null,
            makeVNode('bruno', 1, 'b', 'b'),
            null,
            makeVNode('ted', 1, 'c', 'c'),
            makeVNode('ted', 1, 'c', 'd'),
            makeVNode('ted', 0, 'c', null),
            makeVNode('ted', 0, 'd', null),
            null,
            makeVNode('bruno', 2, 'e', 'f'),
            makeVNode('bruno', 2, 'e', 'a'),
            makeVNode('bruno', 2, 'e', 'b'),
            makeVNode('bruno', 0, 'e', null),
            makeVNode('bruno', 0, 'f', null),
            makeVNode('bruno', 3, 'f', 'c'),
            null,
            makeVNode('', 0, 'a', null),
            null,
            null,
            makeVNode('ted', 1, 'b', null),
            makeVNode('ted', 1, 'b', 'f'),
            null
        ];
        var expectedRouteLog = [
            "Child component 1 - routeLog - bruno",
            "great child component - routeLog - (user: bruno, id: 1)",
            "Child component 1 - routeLog - ted",
            "great child component - routeLog - (user: ted, id: 1)",
            "Child component 1 - routeLog - ted",
            "Child component 1 - routeLog - bruno",
            "great child component - routeLog - (user: bruno, id: 2)",
            "Child component 1 - routeLog - bruno",
            "great child component - routeLog - (user: bruno, id: 2)",
            "Child component 1 - routeLog - bruno",
            "great child component - routeLog - (user: bruno, id: 2)",
            "Child component 1 - routeLog - bruno",
            "great child component - routeLog - (user: bruno, id: 3)",
            "Child component 1 - routeLog - ",
            "Child component 1 - routeLog - ted",
            "great child component - routeLog - (user: ted, id: 1)"
        ];
        var expectedUserAction1 = [
            "child component - starting",
            "child component - user action - select",
            "child component - starting",
            "child component - user action - click",
            "child component - user action - hover",
            "child component - user action - click",
            "child component - starting",
            "child component - user action - select",
            "child component - user action - click",
            "child component - user action - hover",
            "child component - starting",
            "child component - starting",
        ];
        var expectedUserAction2 = [
            "great child component - starting",
            "great child component - user action - select",
            "great child component - starting",
            "great child component - user action - click",
            "great child component - user action - hover",
            "great child component - starting",
            "great child component - user action - select",
            "great child component - user action - click",
            "great child component - user action - hover",
            "great child component - starting",
            "great child component - starting",
        ];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: expectedVNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            routeLog: {
                outputs: expectedRouteLog,
                successMessage: 'routeParams are merged recursively, i.e. the nested children have access to the routeParams from parent level',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            userAction1$: {
                outputs: expectedUserAction1,
                successMessage: 'sink userAction1$ produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            userAction2$: {
                outputs: expectedUserAction2,
                successMessage: 'sink userAction2$ produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 5,
            waitForFinishDelay: 30
        });
        assert.equal(true, true, 'sinks whose name is not present in sinkNames' +
            ' are not merged');
    });
    it('edge cases - non-nested routing - empty DOM sink', function (done) {
        var assertAsync = plan(4);
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM1.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 1: '))
                    .map(function (x) { return dom_1.h('span', {}, 'Component 1 : id=' + settings.routeParams.id + ' - ' + x); })
                    .concat($.never()),
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : component 1 - route$'))
                    .map(function (x) { return 'Component 1 - routeLog - ' +
                    settings.routeParams.user + settings.routeParams.id; }),
                a: sources.userAction$.map(function (x) { return 'Component1 - user action - ' + x; })
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.empty(),
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : component 2 - route$'))
                    .map(function (x) { return 'Component2 - routeLog - routeRemainder: ' + x; }),
                b: sources.userAction$.map(function (x) { return 'Component2 - user action - ' + x; })
            };
        };
        var mComponent = m_1.m(Router_1.Router, { route: ':user/:id', sinkNames: ['DOM', 'routeLog', 'a', 'b'] }, [childComponent1, childComponent2]);
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a--b--c--d-' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-abb-c-d-e-f-' } },
            {
                userAction$: {
                    diagram: 'a---b-ac--ab---c',
                    values: { a: 'click', b: 'select', c: 'hover', }
                }
            },
            {
                route$: {
                    //diagr: '-a--b--c--d--e--f--a--b--c--d--e--f-',
                    //diagr: '-a-b-c-d-e-f-abb-c-d-e-f-',
                    diagram: '-a---b--cdef--g', values: {
                        a: 'bruno/1',
                        b: 'ted',
                        c: 'bruno/2',
                        d: 'bruno/2/remainder',
                        e: 'bruno/2/remainder',
                        f: 'bruno/3/bigger/remainder',
                        g: 'paul',
                    }
                }
            }
        ];
        function makeVNode(componentNum, id, x) {
            return dom_1.h('span', {}, 'Component ' + componentNum + ' : id=' + id + ' - ' + x);
        }
        var vNodes = [
            null,
            makeVNode(1, 1, 'b'),
            null,
            null,
            makeVNode(1, 2, 'd'),
            null,
            makeVNode(1, 3, 'e'),
            null,
        ];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values :' +
                    ' <div>non-empty children content<\div>',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            routeLog: {
                outputs: [
                    "Component 1 - routeLog - bruno1",
                    "Component2 - routeLog - routeRemainder: undefined",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: undefined",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: remainder",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: remainder",
                    "Component 1 - routeLog - bruno3",
                    "Component2 - routeLog - routeRemainder: bigger/remainder"
                ],
                successMessage: 'sink routeLog produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "Component1 - user action - select",
                    "Component1 - user action - click",
                    "Component1 - user action - select"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            b: {
                outputs: [
                    "Component2 - user action - select",
                    "Component2 - user action - click",
                    "Component2 - user action - select"
                ],
                successMessage: 'sink b produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 10,
            waitForFinishDelay: 100
        });
    });
    it("edge cases - non-nested routing - 1 child with null DOM sink," +
        " 1 with non-null DOM sink", function (done) {
        var assertAsync = plan(4);
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM1.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 1: '))
                    .map(function (x) { return dom_1.h('span', {}, 'Component 1 : id=' + settings.routeParams.id + ' - ' + x); })
                    .concat($.never()),
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : component 1 - route$'))
                    .map(function (x) { return 'Component 1 - routeLog - ' +
                    settings.routeParams.user + settings.routeParams.id; }),
                a: sources.userAction$.map(function (x) { return 'Component1 - user action - ' + x; })
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: null,
                routeLog: sources.route$
                    .tap(console.warn.bind(console, 'routeLog : component 2 - route$'))
                    .map(function (x) { return 'Component2 - routeLog - routeRemainder: ' + x; }),
                b: sources.userAction$.map(function (x) { return 'Component2 - user action - ' + x; })
            };
        };
        var mComponent = m_1.m(Router_1.Router, { route: ':user/:id', sinkNames: ['DOM', 'routeLog', 'a', 'b'] }, [childComponent1, childComponent2]);
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a--b--c--d-' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-abb-c-d-e-f-' } },
            {
                userAction$: {
                    diagram: 'a---b-ac--ab---c',
                    values: { a: 'click', b: 'select', c: 'hover', }
                }
            },
            {
                route$: {
                    //diagr: '-a--b--c--d--e--f--a--b--c--d--e--f-',
                    //diagr: '-a-b-c-d-e-f-abb-c-d-e-f-',
                    diagram: '-a---b--cdef--g', values: {
                        a: 'bruno/1',
                        b: 'ted',
                        c: 'bruno/2',
                        d: 'bruno/2/remainder',
                        e: 'bruno/2/remainder',
                        f: 'bruno/3/bigger/remainder',
                        g: 'paul',
                    }
                }
            }
        ];
        function makeVNode(componentNum, id, x) {
            return dom_1.h('span', {}, 'Component ' + componentNum + ' : id=' + id + ' - ' + x);
        }
        var vNodes = [
            null,
            makeVNode(1, 1, 'b'),
            null,
            null,
            makeVNode(1, 2, 'd'),
            null,
            makeVNode(1, 3, 'e'),
            null,
        ];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values : non-null' +
                    ' child content are not wrapped into a div if there are no more than' +
                    ' 1 child',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            routeLog: {
                outputs: [
                    "Component 1 - routeLog - bruno1",
                    "Component2 - routeLog - routeRemainder: undefined",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: undefined",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: remainder",
                    "Component 1 - routeLog - bruno2",
                    "Component2 - routeLog - routeRemainder: remainder",
                    "Component 1 - routeLog - bruno3",
                    "Component2 - routeLog - routeRemainder: bigger/remainder"
                ],
                successMessage: 'sink routeLog produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "Component1 - user action - select",
                    "Component1 - user action - click",
                    "Component1 - user action - select"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            b: {
                outputs: [
                    "Component2 - user action - select",
                    "Component2 - user action - click",
                    "Component2 - user action - select"
                ],
                successMessage: 'sink b produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 5,
            waitForFinishDelay: 30
        });
    });
});
