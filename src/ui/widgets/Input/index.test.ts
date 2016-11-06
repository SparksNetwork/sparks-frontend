/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { VNode, DOMSource, mockDOMSource } from '@motorcycle/dom';
import { just } from 'most';
import { Input, InputSources, InputSinks, InputProps } from './';
import * as styles from './styles';
const domSelect = require(`snabbdom-selector`).default;

// This function exists because @motorcycle/dom v3.0.0 does not yet
// have a common interface for mockDOMSource to implement
function mockAsDomSource(mockConfig): DOMSource {
  return mockDOMSource(mockConfig) as any as DOMSource;
}

let defaultSources: InputSources;

describe(`Input component`, () => {

  beforeEach(() => {
    defaultSources = { DOM: mockAsDomSource({}) };
  });

  it(`has a DOM stream in its sinks`, () => {
    const sinks: InputSinks = Input(defaultSources);
    Function.prototype(sinks);
  });

  describe(`view`, () => {
    it(`has a styled DIV element as root`, (done) => {
      const sinks: InputSinks = Input(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`div.${styles.root}`, view);

        assert.strictEqual(matches.length, 1);
        done();
      })
        .catch(done);
    });

    it(`has a styled LABEL element as container`, (done) => {
      const sinks: InputSinks = Input(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`label.${styles.container}`, view);

        assert.strictEqual(matches.length, 1);
        done();
      })
        .catch(done);
    });

    it(`has a styled INPUT element as input`, (done) => {
      const sinks: InputSinks = Input(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

        assert.strictEqual(matches.length, 1);
        done();
      })
        .catch(done);
    });

    it(`has a styled SPAN element as label`, (done) => {
      const sinks: InputSinks = Input(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = domSelect(`span.${styles.label}`, view);

        assert.strictEqual(matches.length, 1);
        done();
      })
        .catch(done);
    });
  });

  it(`sets properties on INPUT element`, (done) => {
    let props: InputProps =
      {
        autocapitalize: 'words',
        autocomplete: `maybe`,
        autocorrect: 'on',
        autofocus: true,
        disabled: true,
        inputmode: 'verbatim',
        id: `anId`,
        max: `9`,
        maxlength: 7,
        min: `1`,
        minlength: 3,
        name: `MyInput`,
        pattern: /.+/,
        placeholder: `My label`,
        readonly: true,
        size: 10,
        step: 2,
        type: 'text',
        value: `initial value`
      }
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

      assert.strictEqual(
        matches[0].data.props.autocapitalize, props.autocapitalize);
      assert.strictEqual(
        matches[0].data.props.autocomplete, props.autocomplete);
      assert.strictEqual(
        matches[0].data.props.autocorrect, props.autocorrect);
      assert.strictEqual(
        matches[0].data.props.autofocus, props.autofocus);
      assert.strictEqual(
        matches[0].data.props.disabled, props.disabled);
      assert.strictEqual(
        matches[0].data.props.inputmode, props.inputmode);
      assert.strictEqual(
        matches[0].data.props.id, props.id);
      assert.strictEqual(
        matches[0].data.props.max, props.max);
      assert.strictEqual(
        matches[0].data.props.maxlength, props.maxlength);
      assert.strictEqual(
        matches[0].data.props.min, props.min);
      assert.strictEqual(
        matches[0].data.props.minlength, props.minlength);
      assert.strictEqual(
        matches[0].data.props.name, props.name);
      assert.strictEqual(
        matches[0].data.props.pattern, props.pattern);
      assert.strictEqual(
        matches[0].data.props.placeholder, props.placeholder);
      assert.strictEqual(
        matches[0].data.props.readonly, props.readonly);
      assert.strictEqual(
        matches[0].data.props.size, props.size);
      assert.strictEqual(
        matches[0].data.props.step, props.step);
      assert.strictEqual(
        matches[0].data.props.type, props.type);
      assert.strictEqual(
        matches[0].data.props.value, props.value);
    })
      .catch(done);

    let otherProps: InputProps =
      {
        autocapitalize: 'none',
        autocomplete: `no`,
        autocorrect: 'off',
        autofocus: false,
        disabled: false,
        inputmode: 'latin',
        id: `anotherId`,
        max: `8`,
        maxlength: 6,
        min: `2`,
        minlength: 4,
        name: `MyOtherInput`,
        pattern: /$a.+/,
        placeholder: `My other label`,
        readonly: false,
        size: 9,
        step: 3,
        type: 'email',
        value: `other initial value`
      }
    sinks =
      Input({ DOM: mockAsDomSource({}), props$: just(otherProps) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

      assert.strictEqual(
        matches[0].data.props.autocapitalize, otherProps.autocapitalize);
      assert.strictEqual(
        matches[0].data.props.autocomplete, otherProps.autocomplete);
      assert.strictEqual(
        matches[0].data.props.autocorrect, otherProps.autocorrect);
      assert.strictEqual(
        matches[0].data.props.autofocus, otherProps.autofocus);
      assert.strictEqual(
        matches[0].data.props.disabled, otherProps.disabled);
      assert.strictEqual(
        matches[0].data.props.inputmode, otherProps.inputmode);
      assert.strictEqual(
        matches[0].data.props.id, otherProps.id);
      assert.strictEqual(
        matches[0].data.props.max, otherProps.max);
      assert.strictEqual(
        matches[0].data.props.maxlength, otherProps.maxlength);
      assert.strictEqual(
        matches[0].data.props.min, otherProps.min);
      assert.strictEqual(
        matches[0].data.props.minlength, otherProps.minlength);
      assert.strictEqual(
        matches[0].data.props.name, otherProps.name);
      assert.strictEqual(
        matches[0].data.props.pattern, otherProps.pattern);
      assert.strictEqual(
        matches[0].data.props.placeholder, otherProps.placeholder);
      assert.strictEqual(
        matches[0].data.props.readonly, otherProps.readonly);
      assert.strictEqual(
        matches[0].data.props.size, otherProps.size);
      assert.strictEqual(
        matches[0].data.props.step, otherProps.step);
      assert.strictEqual(
        matches[0].data.props.type, otherProps.type);
      assert.strictEqual(
        matches[0].data.props.value, otherProps.value);
      done();
    })
      .catch(done);
  });

  it(`sets placeholder property value as label text`, (done) => {
    let props: InputProps = { placeholder: `My label` };
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.label}`, view);

      assert.strictEqual(matches[0].text, props.placeholder);
    })
      .catch(done);

    let otherProps: InputProps = { placeholder: `My other label` };
    sinks =
      Input({ DOM: mockAsDomSource({}), props$: just(otherProps) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.label}`, view);

      assert.strictEqual(matches[0].text, otherProps.placeholder);
    })
      .catch(done);

    done();
  });

  it(`sets active style on label`, (done) => {
    let props: InputProps = { value: `some content`, float: true };
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.labelActive}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    let otherProps: InputProps = { value: `some content`, float: false };
    sinks =
      Input({ DOM: mockAsDomSource({}), props$: just(otherProps) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.notFloatLabelActive}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    done();
  });

  it(`has a model stream in its sinks`, () => {
    const sinks: InputSinks = Input(defaultSources);

    assert.ok(sinks.hasOwnProperty(`model$`));
  });
});
