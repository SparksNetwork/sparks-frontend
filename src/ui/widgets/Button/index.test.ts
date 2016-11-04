/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { DOMSource, mockDOMSource, VNode, div } from '@motorcycle/dom';
import { just } from 'most';
import {
  ButtonSources, ButtonSinks, Button, ButtonAttrs, ButtonProps, ButtonChildren
}
  from './';
import * as styles from './styles';
const select = require('snabbdom-selector').default;

// This function exists because @motorcycle/dom v3.0.0 does not yet
// have a common interface for mockDOMSource to implement
function mockAsDomSource(mockConfig): DOMSource {
  return mockDOMSource(mockConfig) as any as DOMSource;
}

let defaultSources: ButtonSources = {
  DOM: mockAsDomSource({})
};

describe(`Button widget`, () => {
  it(`has a DOM stream in its sinks`, () => {
    const sinks: ButtonSinks = Button(defaultSources);

    assert.ok(sinks.hasOwnProperty(`DOM`));
  });

  describe(`view`, () => {
    it(`has a styled BUTTON element as root`, (done) => {
      const sinks: ButtonSinks = Button(defaultSources);

      sinks.DOM.observe((view: VNode) => {
        const matches = select(`button.${styles.uniqueRoot}.${styles.root}`, view);

        assert.strictEqual(matches.length, 1);
      })
        .catch(done);

      done();
    });
  });

  it(`sets attributes on BUTTON element`, (done) => {
    const attrs: ButtonAttrs =
      {
        id: `anId`
      };

    const sinks: ButtonSinks =
      Button({ DOM: mockAsDomSource({}), attrs$: just(attrs) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      assert.strictEqual(matches[0].data.attrs.id, attrs.id);
    })
      .catch(done);

    done();
  });

  it(`sets properties on BUTTON element`, (done) => {
    const props: ButtonProps =
      {
        disabled: true
      };

    const sinks: ButtonSinks =
      Button({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      assert.strictEqual(matches[0].data.props.disabled, props.disabled);
    })
      .catch(done);

    done();
  });

  it(`sets children`, (done) => {
    const children: ButtonChildren = [`button`];

    let sinks: ButtonSinks =
      Button({ DOM: mockAsDomSource({}), children$: just(children) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      assert.strictEqual(matches[0].children[0].text, children[0]);
    })
      .catch(done);

    const otherChildren: ButtonChildren = [div(`button`)];

    sinks =
      Button({ DOM: mockAsDomSource({}), children$: just(otherChildren) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      assert.strictEqual(matches[0].children[0].sel, otherChildren[0][`sel`]);
      assert.strictEqual(matches[0].children[0].text, otherChildren[0][`text`]);
    })
      .catch(done);

    done();
  });
});
