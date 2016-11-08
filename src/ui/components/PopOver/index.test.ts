/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { DOMSource, mockDOMSource, VNode } from '@motorcycle/dom';
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

const defaultProps: PopOverProps =
  {
    message: ``
  };

const defaultSources: PopOverSources =
  {
    DOM: mockAsDomSource({}),
    props$: just(defaultProps)
  };

describe(`PopOver widget`, () => {
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

  it(`sets an optional id property on root DIV element`, (done) => {
    const props: PopOverProps =
      mergedProps(
        {
          id: `anId`
        }
      );

    let sinks: PopOverSinks =
      PopOver(sourcesWithProps(props));

    sinks.DOM.observe(view => {
      const matches: Array<VNode> =
        domSelect(`div.${styles.uniqueRoot}#${props.id}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    done();
  });

  it.only(`sets a message in message DIV element`, (done) => {
    const props: PopOverProps =
      {
        message: `a message`
      };

    let sinks: PopOverSinks =
      PopOver(sourcesWithProps(props));

    sinks.DOM.observe(view => {
      const matches: Array<VNode> =
        domSelect(`div.${styles.message}`, view);

      assert.strictEqual(matches[0].text, props.message);
    })
      .catch(done);

    const otherProps: PopOverProps =
      {
        message: `other message`
      };

    sinks =
      PopOver(sourcesWithProps(otherProps));

    sinks.DOM.observe(view => {
      const matches: Array<VNode> =
        domSelect(`div.${styles.message}`, view);

      assert.strictEqual(matches[0].text, otherProps.message);
    })
      .catch(done);

    done();
  });
});

function mergedProps(props: any): PopOverProps {
  return merge(defaultProps, props);
}

function sourcesWithProps(props: PopOverProps): PopOverSources {
  return merge(defaultSources, { props$: just(props) });
}
