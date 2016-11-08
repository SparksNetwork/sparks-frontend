/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { VNode, DOMSource, mockDOMSource } from '@motorcycle/dom';
import {
  UserRegistration, UserRegistrationSinks, UserRegistrationSources,
  UserRegistrationModel
} from './';
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

describe(`UserRegistration component`, () => {
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

    it(`has an email address Input component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`.sn-input #UserRegistrationEmailAddressInput`, view);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].data.props.type, `email`);
      })
        .catch(done);

      done();
    });

    it(`has an email address PopOver component`, (done) => {
      const sinks: UserRegistrationSinks =
        UserRegistration(defaultSources);

      sinks.DOM.observe(view => {
        const matches: Array<VNode> =
          domSelect(`.sn-pop-over#UserRegistrationEmailAddressInfo`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has a password Input component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`.sn-input #UserRegistrationPasswordInput`, view);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].data.props.type, `password`);
      })
        .catch(done);

      done();
    });

    it(`has a PasswordStrength component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`.sn-password-strength`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });

    it(`has a sign-up Button component`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`.sn-button#UserRegistrationSignUpButton`, view);

        assert.strictEqual(matches.length, 1);
        assert.strictEqual(matches[0].children[0].text, `Sign up`);
      })
        .catch(done);

      done();
    });
  });

  it(`has a model stream in its sinks`, () => {
    const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

    assert.ok(sinks.hasOwnProperty(`model$`));
  });

  describe(`model stream`, () => {
    it(`emits model objects`, (done) => {
      const sinks: UserRegistrationSinks = UserRegistration(defaultSources);

      sinks.model$.observe((model: UserRegistrationModel) => {
        assert.strictEqual(typeof model, `object`);
      })
        .catch(done);

      done();
    });
  });
});
