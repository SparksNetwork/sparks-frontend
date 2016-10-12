"use strict";
var ramda_1 = require('ramda');
var U = require('../checks');
var $ = require('most');
var most_last_1 = require('most-last');
var most_subject_1 = require('most-subject');
var mapIndexed = ramda_1.addIndex(ramda_1.map);
// TODO : find a solution to use it in the browser
//console.log = function(){}
//console.warn=function(){} // used by mocha, cannot stub
console.groupEnd = console.groupEnd || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
/**
 * @typedef {function(*):boolean} Predicate
 */
/**
 * @typedef {Object} Input
 */
/**
 * @typedef {Object} Output
 */
/**
 * @typedef {{diagram: string, values: Object.<string, Input>}} Sequence
 */
/**
 * @typedef {Object} ExpectedRecord
 * @property {?function (outputs:Array<Output>)} transformFn
 * @property {Array<Output>} outputs
 * @property {?String} successMessage
 * @property {!function (Array<Output>, Array<Output>), String} analyzeTestResults
 */
/**
 * @typedef {!Object.<string, ExpectedRecord>} TestResults
 */
var rxlog = function rxlog(label) {
    return console.warn.bind(console, label);
};
var isOptSinks = U.isOptSinks;
var removeNullsFromArray = U.removeNullsFromArray;
var assertSignature = U.assertSignature;
var assertContract = U.assertContract;
var tickDurationDefault = 5;
//////
// Contract and signature checking helpers
function isSourceInput(obj) {
    return obj && ramda_1.keys(obj).length === 1
        && U.isString(ramda_1.values(obj)[0].diagram);
}
function isExpectedStruct(record) {
    return (!record.transformFn || U.isFunction(record.transformFn)) &&
        record.outputs && U.isArray(record.outputs) &&
        record.analyzeTestResults && U.isFunction(record.analyzeTestResults) &&
        (!record.successMessage || U.isString(record.successMessage));
}
function isExpectedRecord(obj) {
    return ramda_1.all(isExpectedStruct, ramda_1.values(obj));
}
function hasTestCaseForEachSink(testCase, sinkNames) {
    var _sinkNames = ramda_1.drop(1, sinkNames);
    return ramda_1.all(function (sinkName) { return testCase[sinkName]; }, _sinkNames);
}
//////
// test execution helpers
function analyzeTestResultsCurried(analyzeTestResultsFn, expectedResults, successMessage) {
    return function (actual) {
        return analyzeTestResultsFn(actual, expectedResults, successMessage);
    };
}
function analyzeTestResults(testExpectedOutputs) {
    return function analyzeTestResults(sinkResults$, sinkName) {
        var expected = testExpectedOutputs[sinkName];
        // Case the component returns a sink with no expected value
        // That is a legit possibility, we might not want to test for all
        // the sinks returned by a component
        if (ramda_1.isNil(expected))
            return null;
        var expectedResults = expected.outputs;
        var successMessage = expected.successMessage;
        var analyzeTestResultsFn = expected.analyzeTestResults;
        return sinkResults$
            .tap(analyzeTestResultsCurried(analyzeTestResultsFn, expectedResults, successMessage));
    };
}
function getTestResults(testInputs$, expected, settings) {
    var defaultWaitForFinishDelay = 50;
    var waitForFinishDelay = settings.waitForFinishDelay
        || defaultWaitForFinishDelay;
    return function getTestResults(sink$, sinkName) {
        if (U.isUndefined(sink$)) {
            console.warn('getTestResults: received an undefined sink ' + sinkName);
            return $.of([]);
        }
        return sink$
            .scan(function buildResults(accumulatedResults, sinkValue) {
            var transformFn = expected[sinkName].transformFn || ramda_1.identity;
            var transformedResult = transformFn(sinkValue);
            accumulatedResults.push(transformedResult);
            return accumulatedResults;
        }, [])
            .sampleWith(most_last_1.last(testInputs$).delay(waitForFinishDelay))
            .take(1);
    };
}
/**
 * @typedef {{diagram: string, values:*}} Input
 * only one key,value pair though
 */
/**
 * @typedef {Object.<string, Input>} SourceInput
 * only one key,value pair though
 */
/**
 *
 * @param {Number} tickNum
 * @param {Array<SourceInput>} inputs
 * @returns {Array<SourceInput>} a similar array of input but with a
 * diagram with only one character taken from the input diagram at
 * position tickNum
 */
function projectAtIndex(tickNum, inputs) {
    return ramda_1.map(function mapInputs(sourceInput) {
        return ramda_1.map(function projectDiagramAtIndex(input) {
            return {
                diagram: input.diagram[tickNum],
                values: input.values
            };
        }, sourceInput);
    }, inputs);
}
//////
// Main functions
/**
 * Tests a function against sources' test input values and the expected
 * values defined in a test case object.
 * The function to test is executed, and its sinks collected. When there are
 * no more inputs to send through the sources, output from each sink are
 * collected in an array, then passed through a transform function.
 * That transform function can be used to remove fields, which are irrelevant
 * or non-reproducible (for instance timestamps), before comparison.
 * Actual outputs for each sink are compared against expected outputs,
 * by means of a `analyzeTestResults` function.
 * That function can throw in case of failed assertion.
 *
 * @param {Array<SourceInput>} inputs
 * @param {TestResults} expected Object which contains all the relevant data
 * relevant to the test case : expected outputs, test message,
 * comparison function, output transformation, etc.
 * @param {function(Sources):Sinks} testFn Function to test
 * @param {{timeUnit: Number, waitForFinishDelay: Number}} settings
 * @throws
 */
function runTestScenario(inputs, expected, testFn, settings) {
    assertSignature('runTestScenario', arguments, [
        { inputs: U.isArrayOf(isSourceInput) },
        { testCase: isExpectedRecord },
        { testFn: U.isFunction },
        { settings: U.isNullableObject },
    ]);
    // Set default values if any
    settings = settings || {};
    var tickDuration = settings.tickDuration ?
        settings.tickDuration :
        tickDurationDefault;
    /** @type {Object.<string, observable>} */
    // Create the subjects which will receive the input data
    // There is a standard subject for each source declared in `inputs`
    var sourcesSubjects = ramda_1.reduce(function makeSubjects(accSubjects, input) {
        accSubjects[ramda_1.keys(input)[0]] = most_subject_1.subject();
        return accSubjects;
    }, {}, inputs);
    // Maximum length of input diagram strings
    // Ex:
    // a : '--x-x--'
    // b : '-x-x-'
    // -> maxLen = 7
    var maxLen = Math.max.apply(null, ramda_1.map(function (sourceInput) { return ramda_1.values(sourceInput)[0].diagram.length; }, inputs));
    /** @type {Array<Number>} */
    // Make an index array [0..maxLen] for iteration purposes
    var indexRange = mapIndexed(function (input, index) { return index; }, new Array(maxLen));
    /** @type Observable<Null>*/
    // Make a single chained observable which :
    // - waits some delay before starting to emit
    // - then for n in [0..maxLen]
    //   - emits the m values in position n in the input diagram, in `inputs`
    // array order, `m` being the number of input sources
    // wait for that emission to finish before nexting (`concat`)
    // That way we ENSURE that :
    // -a--
    // -b--     if a and b are in the same vertical (emission time), they
    // will always be emitted in the same order in every execution of the
    // test scenario
    // -a-
    // b--      values that are chronologically further in the diagram will
    // always be emitted later
    // This allows to have predictable and consistent data when analyzing
    // test results. That was not the case when using the `setTimeOut`
    // scheduler to handle delays.
    var testInputs$ = ramda_1.reduce(function makeInputs$(accEmitInputs$, tickNo) {
        return accEmitInputs$
            .delay(tickDuration)
            .concat($.from(projectAtIndex(tickNo, inputs))
            .tap(function emitInputs(sourceInput) {
            // input :: {sourceName : {{diagram : char, values: Array<*>}}
            var sourceName = ramda_1.keys(sourceInput)[0];
            var input = sourceInput[sourceName];
            var c = input.diagram;
            var values = input.values || {};
            var sourceSubject = sourcesSubjects[sourceName];
            var errorVal = (values && values['#']) || '#';
            if (c) {
                // case when the diagram for that particular source is
                // finished but other sources might still go on
                // In any case, there is nothing to emit
                switch (c) {
                    case '-':
                        //                      console.log('- doing nothing')
                        break;
                    case '#':
                        sourceSubject.error({ data: errorVal });
                        break;
                    case '|':
                        sourceSubject.complete();
                        break;
                    default:
                        var val = values.hasOwnProperty(c) ? values[c] : c;
                        console.log('emitting for source ' + sourceName + ' ' + val);
                        sourceSubject.next(val);
                        break;
                }
            }
        }));
    }, $.empty(), indexRange)
        .multicast();
    // Execute the function to be tested (for example a cycle component)
    // with the source subjects
    console.groupCollapsed('runTestScenario: executing test function');
    var testSinks = testFn(sourcesSubjects);
    console.groupEnd();
    if (!isOptSinks(testSinks)) {
        throw 'encountered a sink which is not an observable!';
    }
    /** @type {Object.<string, Observable<Array<Output>>>} */
    // Gather the results in an array for easier processing
    var sinksResults = ramda_1.mapObjIndexed(getTestResults(testInputs$, expected, settings), testSinks);
    assertContract(hasTestCaseForEachSink, [expected, ramda_1.keys(sinksResults)], 'runTestScenario : in testCase, could not find test inputs for all sinks!');
    // Side-effect : execute `analyzeTestResults` function which
    // makes use of `assert` and can lead to program interruption
    /** @type {Object.<string, Observable<Array<Output>>>} */
    var resultAnalysis = ramda_1.mapObjIndexed(analyzeTestResults(expected), sinksResults);
    // This takes care of actually starting the producers
    // which generate the execution of the test assertions
    $.mergeArray(removeNullsFromArray(ramda_1.values(resultAnalysis)))
        .subscribe({
        next: rxlog('Test completed for sink:'),
        error: rxlog('An error occurred while executing test!'),
        complete: rxlog('Tests completed!')
    });
    testInputs$.subscribe({
        next: function () {
        },
        error: rxlog('An error occurred while emitting test inputs'),
        complete: rxlog('test inputs emitted')
    });
}
exports.runTestScenario = runTestScenario;
