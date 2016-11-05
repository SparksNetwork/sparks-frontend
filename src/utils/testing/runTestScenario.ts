import {
  identity, mapObjIndexed, values, all as allR, addIndex,
  reduce as reduceR, keys as keysR, drop, isNil, map
} from 'ramda'

import {
  isOptSinks, removeNullsFromArray, assertSignature, assertContract,
  isString, isFunction, isArray, isUndefined, isArrayOf, isNullableObject
} from './checks'

import * as $ from 'most'
import {last} from 'most-last'
import {subject} from 'most-subject'

// stub the console for instance if we are running in node environment
console.groupEnd = console.groupEnd || console.log
console.groupCollapsed = console.groupCollapsed || console.log

const mapIndexed = addIndex(map)
const tickDurationDefault = 5

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

//////
// Contract and signature checking helpers
function isSourceInput(obj: any) {
  return obj && keysR(obj).length === 1
    && isString((values(obj)[0] as any).diagram)
}

function isExpectedStruct(record) {
  return (!record.transformFn || isFunction(record.transformFn)) &&
    record.outputs && isArray(record.outputs) &&
    record.analyzeTestResults && isFunction(record.analyzeTestResults) &&
    (!record.successMessage || isString(record.successMessage))
}

function isExpectedRecord(obj) {
  return allR(isExpectedStruct, values(obj))
}

function hasTestCaseForEachSink(testCase, sinkNames) {
  const _sinkNames = drop(1, sinkNames)
  return allR(sinkName => testCase[sinkName as any], _sinkNames)
}

//////
// test execution helpers

function analyzeTestResultsCurried(analyzeTestResultsFn, expectedResults,
                                   successMessage) {
  return function (actual) {
    return analyzeTestResultsFn(actual, expectedResults, successMessage)
  }
}

function analyzeTestResults(testExpectedOutputs) {
  return function analyzeTestResults(sinkResults$, sinkName) {
    const expected = testExpectedOutputs[sinkName]
    // Case the component returns a sink with no expected value
    // That is a legit possibility, we might not want to test for all
    // the sinks returned by a component
    if (isNil(expected)) return null

    const expectedResults = expected.outputs
    const successMessage = expected.successMessage
    const analyzeTestResultsFn = expected.analyzeTestResults

    return sinkResults$
    // `analyzeTestResultsFn` should include `assert` which
    // throw if the test fails
      .tap(analyzeTestResultsCurried(
        analyzeTestResultsFn, expectedResults, successMessage
        )
      )
  }
}

function getTestResults(testInputs$, expected, settings) {
  const defaultWaitForFinishDelay = 50
  const waitForFinishDelay = settings.waitForFinishDelay
    || defaultWaitForFinishDelay

  return function getTestResults(sink$, sinkName) {
    if (isUndefined(sink$)) {
      console.warn('getTestResults: received an undefined sink ' + sinkName)
      return $.of([])
    }

    return sink$
      .scan(function buildResults(accumulatedResults, sinkValue) {
        const transformFn = expected[sinkName].transformFn || identity
        const transformedResult = transformFn(sinkValue)
        accumulatedResults.push(transformedResult);

        return accumulatedResults;
      }, [])
      // Give it some time to process the inputs,
      // after the inputs have finished being emitted
      // That's arbitrary, keep it in mind that the testing helper
      // is not suitable for functions with large processing delay
      // between input and the corresponding output
      .sampleWith(last(testInputs$).delay(waitForFinishDelay))
      .take(1)
  }
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
  return map(function mapInputs(sourceInput) {
    return map(function projectDiagramAtIndex(input: any) {
      return {
        diagram: input.diagram[tickNum],
        values: input.values
      }
    }, sourceInput as any)
  }, inputs)
}

function isStreamSource(inputStr) {
  return !isMockSource(inputStr)
}

function isMockSource(inputStr) {
  return inputStr.indexOf('!') > -1
}

function isValidSourceName(sourceName) {
  return !!sourceName
}

function hasMock(mockedSourcesHandlers, sourceName) {
  return mockedSourcesHandlers[sourceName]
}

function getMock(mockedSourcesHandlers, sourceName) {
  return mockedSourcesHandlers[sourceName]
}

function computeSources(inputs, mockedSourcesHandlers, sourceFactory) {
  function makeSources(accSources, input) {
    const inputKey = keysR(input)[0];

    if (isStreamSource(inputKey)) {
      // Case when the inputs are to emulate a stream
      // Ex : 'authentication'
      // Create the subjects which will receive the input data
      /** @type {Object.<string, Stream>} */
      accSources.sources[inputKey] = accSources.streams[inputKey] = subject()
      return accSources
    }
    else if (isMockSource(inputKey)) {
      // Case when the inputs are to mock an object
      // Ex : 'DOM!selector@event'
      const [sourceName, sourceSpecs] = inputKey.split('!')

      // Check the source name is valid (not empty etc.)
      if (!isValidSourceName(sourceName)) {
        throw `Invalid source name ${sourceName}!`
      }

      // Check that the sourceName has a handler function passed in settings
      if (!hasMock(mockedSourcesHandlers, sourceName)) {
        throw `mock is not defined in settings for source ${sourceName}`
      }

      // Pass the input string to the mock function
      const mock = getMock(mockedSourcesHandlers, sourceName)
      // Note : `mock` could be executed several times
      // for instance: DOM!sel1@click, DOM!sel2@click
      // So the mock function should receive the current mocked object
      // and return another one
      let stream = sourceFactory[inputKey] || subject();
      accSources.streams[inputKey] = stream
      accSources.sources[sourceName] = mock(accSources.sources[sourceName], sourceSpecs, stream)
    }
    else {
      throw 'unknown source format!'
    }

    return accSources
  }

  return reduceR(makeSources, {
    sources: {},
    streams: {}
  }, inputs)
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
    {inputs: isArrayOf(isSourceInput)},
    {testCase: isExpectedRecord},
    {testFn: isFunction},
    {settings: isNullableObject},
  ])

  // Set default values if any
  const defaultErrorHandler = function (err) {
    console.error('An error occurred while executing test!', err)
  }

  settings = settings || {}
  const mockedSourcesHandlers = settings.mocks || {}
  const sourceFactory = settings.sourceFactory || {}
  const errorHandler = settings.errorHandler || defaultErrorHandler;
  const tickDuration = settings.tickDuration
    ? settings.tickDuration
    : tickDurationDefault

  // @type {{sources: Object.<string, *>, streams: Object.<string, Stream>}}

  let sourcesStruct = computeSources(inputs, mockedSourcesHandlers, sourceFactory);

  // Maximum length of input diagram strings
  // Ex:
  // a : '--x-x--'
  // b : '-x-x-'
  // -> maxLen = 7
  const maxLen = Math.max.apply(null,
    map(sourceInput => (values(sourceInput)[0] as any).diagram.length, inputs)
  )

  /** @type {Array<Number>} */
    // Make an index array [0..maxLen] for iteration purposes
  const indexRange = mapIndexed((input, index) => index, new Array(maxLen))

  /** @type Stream<Null>*/
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
  const testInputs$ = reduceR(function makeInputs$(accEmitInputs$, tickNo) {
      return accEmitInputs$
        .delay(tickDuration)
        .concat(
          $.from(projectAtIndex(tickNo, inputs))
            .tap(function emitInputs(sourceInput) {
              // input :: {sourceName : {{diagram : char, values: Array<*>}}
              const sourceName = keysR(sourceInput)[0]
              const input = sourceInput[sourceName]
              const c = input.diagram
              const values = input.values || {}
              const sourceSubject = sourcesStruct.streams[sourceName]
              const errorVal = (values && values['#']) || '#'

              if (c) {
                // case when the diagram for that particular source is
                // finished but other sources might still go on
                // In any case, there is nothing to emit
                switch (c) {
                  case '-':
                    // do nothing
                    break;
                  case '#':
                    sourceSubject.error({data: errorVal})
                    break;
                  case '|':
                    sourceSubject.complete()
                    break;
                  default:
                    const val = values.hasOwnProperty(c) ? values[c] : c;
                    console.log('emitting for source ' + sourceName + ' ' + val)
                    sourceSubject.next(val)
                    break;
                }
              }
            })
        )
    }, $.empty(), indexRange)
      .multicast()

  // Execute the function to be tested (for example a cycle component)
  // with the source subjects
  console.groupCollapsed('runTestScenario: executing test function')
  let testSinks = testFn(sourcesStruct.sources)
  console.groupEnd()

  if (!isOptSinks(testSinks)) {
    throw 'encountered a sink which is not an observable!'
  }

  /** @type {Object.<string, Stream<Array<Output>>>} */
    // Gather the results in an array for easier processing
  const sinksResults = mapObjIndexed(
    getTestResults(testInputs$, expected, settings),
    testSinks
    )

  assertContract(hasTestCaseForEachSink, [expected, keysR(sinksResults)],
    'runTestScenario : in test Case, could not find test inputs for all sinks!'
  )

  // Side-effect : execute `analyzeTestResults` function which
  // makes use of `assert` and can lead to program interruption
  /** @type {Object.<string, Stream<Array<Output>>>} */
  const resultAnalysis = mapObjIndexed(
    analyzeTestResults(expected),
    sinksResults
  )

  const allResults = removeNullsFromArray(values(resultAnalysis))
  // This takes care of actually starting the producers
  // which generate the execution of the test assertions
  $.mergeArray(allResults)
    .subscribe({
      next: x => console.warn('Test completed for sink:', x),
      error: function (err) {
        console.error('An error occurred while executing test!', err);
        errorHandler(err);
      },
      complete: x => console.warn('Tests completed!'),
    })
  testInputs$.subscribe({
      next: x => undefined,
      error: function (err) {
        console.error('An error occurred while emitting test inputs!', err);
        errorHandler(err);
      },
      complete: x => console.warn('test inputs emitted'),
    }
  )
}

export {
  runTestScenario
}
