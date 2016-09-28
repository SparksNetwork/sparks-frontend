import * as assert from 'assert'
import { runTestScenario } from '../test/runTestScenario'
import * as $ from 'most'

function plan (n) {
  return function _done (done) {
    if (--n === 0) {
      done()
    }
  }
}

describe("Testings runTestScenario helper", () => {
  it('runTestScenario(testSources, testCase, testFn, settings) :', (done) => {
    const assertAsync = plan(3)

    function analyzeTestResults(actual, expected, message) {
      assert.deepEqual(actual, expected, message)
      assertAsync(done)
    }

    const inputs = [
      {a: {diagram: 'xy|', values: {x: 'a-0', y: 'a-1'}}},
      {b: {diagram: 'xyz|', values: {x: 'b-0', y: 'b-1', z: 'b-2'}}}
    ]

    /** @type TestResults */
    const testCase = {
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
        transformFn: x => 't-' + x,
      },
      o: {
        outputs: ['o-b-0', 'o-b-1', 'o-b-2'],
        successMessage: 'sink o produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      }
    }

    const testFn = sources => ({
      m: $.merge(sources.a, sources.b).map((x => 'm-' + x)),
      n: sources.a.map(x => 'n-' + x),
      o: sources.b.delay(3).map(x => 'o-' + x)
    })

    runTestScenario(inputs, testCase, testFn, {
      timeUnit: 10,
      waitForFinishDelay: 30
    })
  })

  it('runTestScenario(inputs, testCase, testFn, settings) : Main case', (done) => {
    const assertAsync = plan(3)
    function analyzeTestResults(actual, expected, message) {
      assert.deepEqual(actual, expected, message)
      assertAsync(done)
    }

    const inputs = [
      {a: {diagram: 'xy|', values: {x: 'a-0', y: 'a-1'}}},
      {b: {diagram: 'xyz|', values: {x: 'b-0', y: 'b-1', z: 'b-2'}}},
    ]

    /** @type TestResults */
    const expected = {
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
          transformFn: x => 't-' + x,
        },
        o: {
          outputs: ['o-b-0', 'o-b-1', 'o-b-2'],
          successMessage: 'sink o produces the expected values',
          analyzeTestResults: analyzeTestResults,
          transformFn: undefined,
        }
      }

    const testFn = sources => ({
      m: $.merge(sources.a, sources.b).map((x => 'm-' + x)),
      n: sources.a.map(x => 'n-' + x),
      o: sources.b.delay(3).map(x => 'o-' + x)
    })

    runTestScenario(inputs, expected, testFn, {
      tickDuration: 10,
      waitForFinishDelay: 30
    })
  })
})
