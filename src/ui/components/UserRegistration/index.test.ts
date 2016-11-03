/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { VNode, DOMSource, mockDOMSource } from '@motorcycle/dom';
import { UserRegistration, UserRegistrationSinks, UserRegistrationSources }
  from './';
import * as styles from './styles';
const domSelect = require('snabbdom-selector').default;

// This function exists because @motorcycle/dom v3.0.0 does not yet
// have a common interface for mockDOMSource to implement
function mockAsDomSource(mockConfig): DOMSource {
  return mockDOMSource(mockConfig) as any as DOMSource;
}

let defaultSources: UserRegistrationSources = {
  DOM: mockAsDomSource({})
};

describe(`UserRegistration`, () => {
  it(`has a DOM stream in its sinks`, () => {
    const sinks: UserRegistrationSinks = UserRegistration(defaultSources);
    Function.prototype(sinks);
  });

  describe(`view`, () => {
    it(`has a styled DIV element as root`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`div.${styles.uniqueRoot}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has a FORM element`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`div.${styles.uniqueRoot} form`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has an email address Input component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`.sn-input #UserRegistrationEmailAddressInput`, view);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].data.attrs.type, `email`);
      })
        .catch(done);

      done();
    });

    it(`has a password Input component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`.sn-input #UserRegistrationPasswordInput`, view);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].data.attrs.type, `password`);
      })
        .catch(done);

      done();
    });

    it.skip(`has a sign-up Button component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`#UserRegistrationSignUpButton`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });
  });
});
