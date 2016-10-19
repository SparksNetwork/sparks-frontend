/// <reference path="../../../typings/index.d.ts" />

/**
 * Test plan
 *
 * A. Testing strategy
 * Main case tests must cover HaveParent x Signature x Children
 * That makes for 2 x 3 potential tests:
 * - Signature : whether Signature 1 or 2
 * - Children : whether the component has no children, 1 child, or several
 * children (We assume here that if the tests pass for two children, they will
 * pass for any number of children > 2)
 *
 * We will reduce the number of tests to perform to: 3 x (3 > 2 ?1 :2) by:
 * - assuming that the behaviour linked to the signature is
 * independent of the behaviour linked to the other arguments. Hence that
 * behaviour can be tested 'for free' on the way to testing expected
 * behaviour under the rest of the arguments.
 *
 * We hence remain with 3 tests to perform:
 * - (0,1,2) children
 * which will include along the way:
 * - default for optional properties (eqFn)
 * - signature 1 and 2
 *
 * B. Test scenarii
 */

import * as assert from 'assert'
import * as $ from 'most'
import {SwitchCase, Case} from '../combinator/Switch'
import {m} from '../combinator/m'
import {h, div} from '@motorcycle/dom'
import {runTestScenario} from '../test/runTestScenario'

function plan(n) {
  return function _done(done) {
    if (--n === 0) {
      done()
    }
  }
}

describe('Testing Switch component', () => {
  it('edge cases - no children - switch on source', (done) => {
    const mComponent = m(SwitchCase, {
      on: 'switch$',
      sinkNames: ['DOM', 'a', 'b']
    }, [m(Case, {caseWhen: true}, [])])

    const inputs = [
      {DOM1: {diagram: '-a--b--c--d--e--f--a'}},
      {DOM2: {diagram: '-a-b-c-d-e-f-abb-c-d'}},]

    /** @type TestResults */
    const expected = {
      DOM: {
        outputs: [],
        successMessage: 'sink DOM produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      a: {
        outputs: [],
        successMessage: 'sink a produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      b: {
        outputs: [],
        successMessage: 'sink b produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
    }

    function analyzeTestResults(actual, expected, message) {
      assert.deepEqual(actual, expected, message)
      done()
    }

    const testFn = mComponent

    assert.throws(function () {
      runTestScenario(inputs, expected, testFn, {
        tickDuration: 5,
        waitForFinishDelay: 30
      })
    }, /contract/, 'Throws if the switch combinator is called with no' +
      ' child component to switch to')
    done()
  })

  it('main cases - 1 child - switch on source - one case', (done) => {
    const assertAsync = plan(3)

    const childComponent1 = function childComponent1(sources, settings) {
      return {
        DOM: sources.DOM1.take(4)
          .tap(console.warn.bind(console, 'DOM : component 1: '))
          .map(x => h('span', {}, `Component 1 : ${x}`))
          .concat($.never()),
        a: sources.userAction$.map(x => `Component1 - user action : ${x}`)
      }
    }
    const childComponent2 = function childComponent1(sources, settings) {
      return {
        DOM: sources.DOM2.take(4)
          .tap(console.warn.bind(console, 'DOM : component 2: '))
          .map(x => h('span', {}, `Component 2 : ${x}`))
          .concat($.never()),
        b: sources.userAction$.map(x => `Component2 - user action : ${x}`)
      }
    }

    const mComponent = m(SwitchCase, {
      on: 'switch$',
      sinkNames: ['DOM', 'a', 'b'],
      eqFn: (a, b) => a === b
    }, [
      m(Case, {caseWhen: true}, [childComponent1, childComponent2])
    ])

    const inputs = [
      {DOM1: {diagram: '-a--b--c--d--e--f--a'}},
      {DOM2: {diagram: '-a-b-c-d-e-f-abb-c-d'}},
      {
        userAction$: {
          diagram: 'abc-b-ac--ab---c',
          values: {a: 'click', b: 'select', c: 'hover',}
        }
      },
      {
        switch$: {
          //diagr: '-a--b--c--d--e--f--a',
          //diagr: '-a-b-c-d-e-f-abb-c-d',
          //userA: 'abc-b-ac--ab---c',
          diagram: '-t-f-tttttff-t', values: {
            t: true,
            f: false,
          }
        }
      }
    ]

    function makeVNode(x, y) {
      return div([
        h('span', {}, `Component 1 : ${x}`),
        h('span', {}, `Component 2 : ${y}`),
      ])
    }

    const vNodes = [
      makeVNode('c', 'd'),
      //      makeVNode('c','e'), // won't happen because combineLatest
      // (a,b) needs a first value for both a and b to emits its first value
      //      makeVNode('d','e'),
      makeVNode('f', 'b'),
      makeVNode('f', 'c'),
      makeVNode('a', 'c'),
      makeVNode('a', 'd'),
    ]

    /** @type TestResults */
    const expected = {
      DOM: {
        outputs: vNodes,
        successMessage: 'sink DOM produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      a: {
        outputs: [
          'Component1 - user action : hover',
          'Component1 - user action : click',
          'Component1 - user action : hover',
          'Component1 - user action : click',
          'Component1 - user action : hover',
        ],
        successMessage: 'sink a produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      b: {
        outputs: [
          'Component2 - user action : hover',
          'Component2 - user action : click',
          'Component2 - user action : hover',
          'Component2 - user action : click',
          'Component2 - user action : hover',
        ],
        successMessage: 'sink b produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
    }

    function analyzeTestResults(actual, expected, message) {
      assert.deepEqual(actual, expected, message)
      assertAsync(done)
    }

    const testFn = mComponent

    runTestScenario(inputs, expected, testFn, {
      tickDuration: 5,
      waitForFinishDelay: 30
    })
  })

  it('main cases - 2 children - switch on condition - two cases', (done) => {
    const assertAsync = plan(3)

    const childComponent1 = function childComponent1(sources, settings) {
      return {
        DOM: sources.DOM1.take(4)
          .tap(console.warn.bind(console, 'DOM : component 1: '))
          .map(x => h('span', {}, `Component 1 : ${x}`))
          .concat($.never()),
        a: sources.userAction$.map(x => `Component1 - user action : ${x}`)
      }
    }
    const childComponent2 = function childComponent1(sources, settings) {
      return {
        DOM: sources.DOM2.take(4)
          .tap(console.warn.bind(console, 'DOM : component 2: '))
          .map(x => h('span', {}, `Component 2 : ${x}`))
          .concat($.never()),
        b: sources.userAction$.map(x => `Component2 - user action : ${x}`)
      }
    }
    const childComponent3 = function childComponent1(sources, settings) {
      return {
        DOM: sources.DOM2.take(4)
          .tap(console.warn.bind(console, 'DOM : component 3: '))
          .map(x => h('span', {}, `Component 3 : ${x}`))
          .concat($.never()),
        b: sources.userAction$.map(x => `Component3 - user action : ${x}`)
      }
    }

    const mComponent = m(SwitchCase, {
      on: (sources, settings) => sources.sweatch$,
      sinkNames: ['DOM', 'a', 'b']
    }, [
      m(Case, {caseWhen: true}, [childComponent1, childComponent2]),
      m(Case, {caseWhen: false}, [childComponent3])
    ])

    const inputs = [
      {DOM1: {diagram: '-a--b--c--d--e--f--a'}},
      {DOM2: {diagram: '-a-b-c-d-e-f-abb-c-d'}},
      {
        userAction$: {
          diagram: 'abc-b-ac--ab---c',
          values: {a: 'click', b: 'select', c: 'hover',}
        }
      },
      {
        'sweatch$': {
          //diagr: '-a--b--c--d--e--f--a',
          //diagr: '-a-b-c-d-e-f-abb-c-d',
          //userA: 'abc-b-ac--ab---c',
        diagram: '-t-f-tttttff-t', values: {
//          diagram: 'f-------------', values: {// TODO : works if there is a
            // second f!!!
            t: true,
            f: false,
          }
        }
      }
    ]

    function makeVNode(x, y, z) {
      return !z ?
        div([
          h('span', {}, `Component 1 : ${x}`),
          h('span', {}, `Component 2 : ${y}`),
        ]) :
        h('span', {}, `Component 3 : ${z}`)
    }

    const vNodes = [
      makeVNode('', '', 'c'),
      makeVNode('c', 'd', undefined),
      //      makeVNode('c','e'), // won't happen because combineLatest
      // (a,b) needs a first value for both a and b to emits its first value
      //      makeVNode('d','e'),
      makeVNode('', '', 'f'),
      makeVNode('', '', 'a'),
      makeVNode('f', 'b', undefined),
      makeVNode('f', 'c', undefined),
      makeVNode('a', 'c', undefined),
      makeVNode('a', 'd', undefined),
    ]

    /** @type TestResults */
    const expected = {
      DOM: {
        outputs: vNodes,
        successMessage: 'sink DOM produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      a: {
        outputs: [
          'Component1 - user action : hover',
          'Component1 - user action : click',
          'Component1 - user action : hover',
          'Component1 - user action : click',
          'Component1 - user action : hover',
        ],
        successMessage: 'sink a produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
      b: {
        outputs: [
          // basically all userAction after first value of switch$ is emitted
          "Component2 - user action : hover",
          "Component3 - user action : select",
          "Component2 - user action : click",
          "Component2 - user action : hover",
          "Component2 - user action : click",
          "Component3 - user action : select",
          "Component2 - user action : hover"
        ],
        successMessage: 'sink b produces the expected values',
        analyzeTestResults: analyzeTestResults,
        transformFn: undefined,
      },
    }

    function analyzeTestResults(actual, expected, message) {
      // debugger
      assert.deepEqual(actual, expected, message)
      assertAsync(done)
    }

    const testFn = mComponent

    runTestScenario(inputs, expected, testFn, {
      tickDuration: 3,
      waitForFinishDelay: 30
    })
  })
})

