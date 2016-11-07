/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { DOMSource, mockDOMSource } from '@motorcycle/dom';
import { just } from 'most';
import { merge } from 'ramda';
import {
  PasswordStrengthSources, PasswordStrengthSinks, PasswordStrength,
  PasswordStrengthProps
} from './';
import * as styles from './styles';
const domSelect = require(`snabbdom-selector`).default;

// This function exists because @motorcycle/dom v3.0.0 does not yet
// have a common interface for mockDOMSource to implement
function mockAsDomSource(mockConfig): DOMSource {
  return mockDOMSource(mockConfig) as any as DOMSource;
}

const defaultSources: PasswordStrengthSources =
  {
    DOM: mockAsDomSource({}),
    props$: just({ password: `` })
  };

describe(`PasswordStrength component`, () => {
  it(`validates password`, (done) => {
    const props: PasswordStrengthProps =
      {
        password: `a valid secret`
      };

    let sinks: PasswordStrengthSinks =
      PasswordStrength(merge(defaultSources, { props$: just(props) }));

    sinks.model$.observe(model => {
      assert.ok(model.valid);
    })
      .catch(done);

    sinks.DOM.observe((view) => {
      const matches = domSelect(`.${styles.success}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    const otherProps: PasswordStrengthProps =
      {
        password: `not`
      };

    sinks = PasswordStrength(merge(defaultSources, { props$: just(otherProps) }));

    sinks.model$.observe(model => {
      assert.ok(!model.valid);
    })
      .catch(done);

    sinks.DOM.observe((view) => {
      const matches = domSelect(`.${styles.error}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    done();
  });

  describe(`view`, () => {
    it(`has a styled DIV element as root`, (done) => {
      const sinks: PasswordStrengthSinks = PasswordStrength(defaultSources);

      sinks.DOM.observe((view) => {
        const matches = domSelect(`div.${styles.uniqueRoot}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has a styled DIV element as list heading`, (done) => {
      const sinks: PasswordStrengthSinks = PasswordStrength(defaultSources);

      sinks.DOM.observe((view) => {
        const matches = domSelect(`div.${styles.listHeading}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has a styled SPAN element as message`, (done) => {
      const sinks: PasswordStrengthSinks = PasswordStrength(defaultSources);

      sinks.DOM.observe((view) => {
        const matches = domSelect(`span.${styles.message}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });
  });
});
