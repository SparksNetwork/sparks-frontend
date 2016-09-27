"use strict";
var assert = require('assert');
var runTestScenario_1 = require('../test/runTestScenario');
var $ = require('most');
function plan(n) {
    return function _done(done) {
        if (--n === 0) {
            done();
        }
    };
}
describe("Testings runTestScenario helper", function () {
    it('runTestScenario(testSources, testCase, testFn, settings) :', function (done) {
        var assertAsync = plan(3);
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var inputs = [
            { a: { diagram: 'xy|', values: { x: 'a-0', y: 'a-1' } } },
            { b: { diagram: 'xyz|', values: { x: 'b-0', y: 'b-1', z: 'b-2' } } }
        ];
        /** @type TestResults */
        var testCase = {
            m: {
                outputs: ['m-a-0', 'm-b-0', 'm-a-1', 'm-b-1', 'm-b-2'],
                successMessage: 'sink m produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            n: {
                outputs: ['t-n-a-0', 't-n-a-1'],
                successMessage: 'sink n produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: function (x) { return 't-' + x; },
            },
            o: {
                outputs: ['o-b-0', 'o-b-1', 'o-b-2'],
                successMessage: 'sink o produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            }
        };
        var testFn = function (sources) { return ({
            m: $.merge(sources.a, sources.b).map((function (x) { return 'm-' + x; })),
            n: sources.a.map(function (x) { return 'n-' + x; }),
            o: sources.b.delay(3).map(function (x) { return 'o-' + x; })
        }); };
        runTestScenario_1.runTestScenario(inputs, testCase, testFn, {
            timeUnit: 10,
            waitForFinishDelay: 30
        });
    });
    it('runTestScenario(inputs, testCase, testFn, settings) : Main case', function (done) {
        var assertAsync = plan(3);
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var inputs = [
            { a: { diagram: 'xy|', values: { x: 'a-0', y: 'a-1' } } },
            { b: { diagram: 'xyz|', values: { x: 'b-0', y: 'b-1', z: 'b-2' } } },
        ];
        /** @type TestResults */
        var expected = {
            m: {
                outputs: ['m-a-0', 'm-b-0', 'm-a-1', 'm-b-1', 'm-b-2'],
                successMessage: 'sink m produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            n: {
                outputs: ['t-n-a-0', 't-n-a-1'],
                successMessage: 'sink n produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: function (x) { return 't-' + x; },
            },
            o: {
                outputs: ['o-b-0', 'o-b-1', 'o-b-2'],
                successMessage: 'sink o produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            }
        };
        var testFn = function (sources) { return ({
            m: $.merge(sources.a, sources.b).map((function (x) { return 'm-' + x; })),
            n: sources.a.map(function (x) { return 'n-' + x; }),
            o: sources.b.delay(3).map(function (x) { return 'o-' + x; })
        }); };
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 10,
            waitForFinishDelay: 30
        });
    });
});
