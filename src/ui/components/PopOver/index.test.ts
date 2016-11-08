/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { DOMSource, mockDOMSource } from '@motorcycle/dom';
import { PopOverSinks, PopOverSources, PopOver, PopOverProps } from './';
import * as styles from './styles';
import { merge } from 'ramda';
import { just } from 'most';
const domSelect = require('snabbdom-selector').default;

// This function exists because @motorcycle/dom v3.0.0 does not yet
// have a common interface for mockDOMSource to implement
function mockAsDomSource(mockConfig): DOMSource {
  return mockDOMSource(mockConfig) as any as DOMSource;
}

let defaultSources: PopOverSources =
  {
    DOM: mockAsDomSource({}),
    props$: just({})
  };

describe.only(`PopOver widget`, () => {
  describe(`view`, () => {
    it(`has a styled DIV element as root`, (done) => {
      const sinks: PopOverSinks = PopOver(defaultSources);

      sinks.DOM.observe(view => {
        const matches = domSelect(`div.${styles.uniqueRoot}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has a styled DIV element as message`, (done) => {
      const sinks: PopOverSinks = PopOver(defaultSources);

      sinks.DOM.observe(view => {
        const matches = domSelect(`div.${styles.message}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });
  });

  it(`sets an id property on root DIV element`, (done) => {
    const props: PopOverProps =
      {
        id: `anId`
      };

    let sinks: PopOverSinks =
      PopOver(merge(defaultSources, { props$: just(props) }));

    sinks.DOM.observe(view => {
      const matches: Array<string> =
        domSelect(`div.${styles.uniqueRoot}#${props.id}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    done();
  });
});
