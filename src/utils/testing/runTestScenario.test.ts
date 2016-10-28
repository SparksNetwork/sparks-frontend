/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert'
import {runTestScenario} from './runTestScenario'
import {makeMockDOMSource} from './mockDOM'
import * as $ from 'most'

function plan(n) {
  return function _done(done) {
    if (--n === 0) {
      done()
    }
  }
}

describe("When inputs are simulating regular stream behaviour", () => {
  it('emits the inputs in order of (i,j) where i is the (row) index of the' +
    ' source in the input array, and j is the (column) index of the' +
    ' emitted input value in the source diagram', (done) => {
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

describe("When inputs are simulating an object", () => {
  it('constructs the object according to the mock handler, and emits the' +
    ' input values through that', (done) => {
    const assertAsync = plan(3)

    function analyzeTestResults(actual, expected, message) {
      assert.deepEqual(actual, expected, message)
      assertAsync(done)
    }

    function noop() {
    }

    function makeDummyClickEvent(value) {
      return {
        preventDefault: noop,
        tap: x => console.log(x),
        target: {
          value: value
        }
      }
    }

    function makeDummyHoverEvent(value) {
      return {
        value: value
      }
    }

    const inputs = [
      {
        'DOM!input@click': {
          diagram: 'xy|', values: {
            x: makeDummyClickEvent('a-0'), y: makeDummyClickEvent('a-1')
          }
        }
      },
      {
        'DOM!a@hover': {
          diagram: 'xyz|', values: {
            x: makeDummyHoverEvent('a-0'),
            y: makeDummyHoverEvent('a-1'),
            z: makeDummyHoverEvent('a-2'),
          }
        }
      },
      {b: {diagram: 'xyz|', values: {x: 'b-0', y: 'b-1', z: 'b-2'}}},
    ]

    const testFn = function testFn(sources) {
      return {
        m: sources.DOM.select('input').events('click')
          .tap(ev => ev.preventDefault())
          .map(x => 'm-' + x.target.value),
        n: sources.DOM.select('a').events('hover').map(x => 'n-' + x.value),
        o: sources.b.delay(3).map(x => 'o-' + x)
      }
    }

    /** @type TestResults */
    const expected = {
      m: {
        outputs: ['m-a-0','m-a-1'],
        successMessage: 'sink m produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      n: {
        outputs: ['t-n-a-0', 't-n-a-1', 't-n-a-2'],
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

    runTestScenario(inputs, expected, testFn, {
      tickDuration: 10,
      waitForFinishDelay: 30,
      mocks: {
        DOM: makeMockDOMSource
      },
      errorHandler : function (err) {
        done(err)
      }
    })
  })
})

// TODO : test errorHandler settings
// TODO : test error handling (basically all thrown exceptions should have a
// test)
// skipped for now, as being of lower priority, and subject to future changes
