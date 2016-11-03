/// <reference path="../../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { VNode, DOMSource, mockDOMSource } from '@motorcycle/dom';
import { just } from 'most';
import { Input, InputSources, InputSinks, InputAttrs, InputProps, TEXT, EMAIL }
  from './';
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

  it(`sets attributes on INPUT element`, (done) => {
    let attrs: InputAttrs =
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
        type: TEXT,
        value: `initial value`
      }
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), attrs$: just(attrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

      assert.strictEqual(
        matches[0].data.attrs.autocapitalize, attrs.autocapitalize);
      assert.strictEqual(
        matches[0].data.attrs.autocomplete, attrs.autocomplete);
      assert.strictEqual(
        matches[0].data.attrs.autocorrect, attrs.autocorrect);
      assert.strictEqual(
        matches[0].data.attrs.autofocus, attrs.autofocus);
      assert.strictEqual(
        matches[0].data.attrs.disabled, attrs.disabled);
      assert.strictEqual(
        matches[0].data.attrs.inputmode, attrs.inputmode);
      assert.strictEqual(
        matches[0].data.attrs.id, attrs.id);
      assert.strictEqual(
        matches[0].data.attrs.max, attrs.max);
      assert.strictEqual(
        matches[0].data.attrs.maxlength, attrs.maxlength);
      assert.strictEqual(
        matches[0].data.attrs.min, attrs.min);
      assert.strictEqual(
        matches[0].data.attrs.minlength, attrs.minlength);
      assert.strictEqual(
        matches[0].data.attrs.name, attrs.name);
      assert.strictEqual(
        matches[0].data.attrs.pattern, attrs.pattern);
      assert.strictEqual(
        matches[0].data.attrs.placeholder, attrs.placeholder);
      assert.strictEqual(
        matches[0].data.attrs.readonly, attrs.readonly);
      assert.strictEqual(
        matches[0].data.attrs.size, attrs.size);
      assert.strictEqual(
        matches[0].data.attrs.step, attrs.step);
      assert.strictEqual(
        matches[0].data.attrs.type, attrs.type);
      assert.strictEqual(
        matches[0].data.attrs.value, attrs.value);
    })
      .catch(done);

    let otherAttrs: InputAttrs =
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
        type: EMAIL,
        value: `other initial value`
      }
    sinks =
      Input({ DOM: mockAsDomSource({}), attrs$: just(otherAttrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

      assert.strictEqual(
        matches[0].data.attrs.autocapitalize, otherAttrs.autocapitalize);
      assert.strictEqual(
        matches[0].data.attrs.autocomplete, otherAttrs.autocomplete);
      assert.strictEqual(
        matches[0].data.attrs.autocorrect, otherAttrs.autocorrect);
      assert.strictEqual(
        matches[0].data.attrs.autofocus, otherAttrs.autofocus);
      assert.strictEqual(
        matches[0].data.attrs.disabled, otherAttrs.disabled);
      assert.strictEqual(
        matches[0].data.attrs.inputmode, otherAttrs.inputmode);
      assert.strictEqual(
        matches[0].data.attrs.id, otherAttrs.id);
      assert.strictEqual(
        matches[0].data.attrs.max, otherAttrs.max);
      assert.strictEqual(
        matches[0].data.attrs.maxlength, otherAttrs.maxlength);
      assert.strictEqual(
        matches[0].data.attrs.min, otherAttrs.min);
      assert.strictEqual(
        matches[0].data.attrs.minlength, otherAttrs.minlength);
      assert.strictEqual(
        matches[0].data.attrs.name, otherAttrs.name);
      assert.strictEqual(
        matches[0].data.attrs.pattern, otherAttrs.pattern);
      assert.strictEqual(
        matches[0].data.attrs.placeholder, otherAttrs.placeholder);
      assert.strictEqual(
        matches[0].data.attrs.readonly, otherAttrs.readonly);
      assert.strictEqual(
        matches[0].data.attrs.size, otherAttrs.size);
      assert.strictEqual(
        matches[0].data.attrs.step, otherAttrs.step);
      assert.strictEqual(
        matches[0].data.attrs.type, otherAttrs.type);
      assert.strictEqual(
        matches[0].data.attrs.value, otherAttrs.value);
      done();
    })
      .catch(done);
  });

  it(`sets properties on INPUT element`, (done) => {
    let props: InputProps = { disabled: true };
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

      assert.strictEqual(matches[0].data.props.disabled, props.disabled);
    })
      .catch(done);

    let otherProps: InputProps = { disabled: false };
    sinks = Input({ DOM: mockAsDomSource({}), props$: just(otherProps) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`input.${styles.textInputUnderbar}`, view);

      assert.strictEqual(matches[0].data.props.disabled, otherProps.disabled);
    })
      .catch(done);

    done();
  });

  it(`sets placeholder attribute value as label text`, (done) => {
    let attrs: InputAttrs = { placeholder: `My label` };
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), attrs$: just(attrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.label}`, view);

      assert.strictEqual(matches[0].text, attrs.placeholder);
    })
      .catch(done);

    let otherAttrs: InputAttrs = { placeholder: `My other label` };
    sinks =
      Input({ DOM: mockAsDomSource({}), attrs$: just(otherAttrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.label}`, view);

      assert.strictEqual(matches[0].text, otherAttrs.placeholder);
    })
      .catch(done);

    done();
  });

  it(`sets active style on label`, (done) => {
    let attrs: InputAttrs = { value: `some content`, float: true };
    let sinks: InputSinks =
      Input({ DOM: mockAsDomSource({}), attrs$: just(attrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.labelActive}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    let otherAttrs: InputAttrs = { value: `some content`, float: false };
    sinks =
      Input({ DOM: mockAsDomSource({}), attrs$: just(otherAttrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = domSelect(`span.${styles.notFloatLabelActive}`, view);

      assert.strictEqual(matches.length, 1);
    })
      .catch(done);

    done();
  });
});
