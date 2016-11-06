/// <reference path="../../../../typings/index.d.ts" />
import * as assert from 'assert';
import { DOMSource, mockDOMSource, VNode, div } from '@motorcycle/dom';
import { just } from 'most';
import { ButtonSources, ButtonSinks, Button, ButtonProps }
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

  it(`sets properties on BUTTON element`, (done) => {
    const props: ButtonProps =
      {
        disabled: true,
        id: `anId`
      };

    const sinks: ButtonSinks =
      Button({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      assert.strictEqual(matches[0].data.props.disabled, props.disabled);
      assert.strictEqual(matches[0].data.props.id, props.id);
    })
      .catch(done);

    done();
  });

  it(`sets children of the BUTTON element`, (done) => {
    const children: Array<string> = [`a button`];
    const props: ButtonProps =
      {
        children
      };

    let sinks: ButtonSinks =
      Button({ DOM: mockAsDomSource({}), props$: just(props) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      const vNode: VNode = matches[0];
      const vNodeChildren: Array<VNode> = vNode.children as Array<VNode>;
      assert.ok(vNodeChildren);
      const childVNode: VNode = vNodeChildren[0];
      assert.ok(childVNode);
      assert.strictEqual(childVNode.text, children[0]);
    })
      .catch(done);

    const otherChildren: Array<VNode> = [ div(`a button`) ];
    const otherProps: ButtonProps =
      {
        children: otherChildren
      };

    sinks = Button({ DOM: mockAsDomSource({}), props$: just(otherProps) });

    sinks.DOM.observe((view: VNode) => {
      const matches = select(`button.${styles.uniqueRoot}`, view);

      const vNode: VNode = matches[0];
      const vNodeChildren: Array<VNode> = vNode.children as Array<VNode>;
      assert.ok(vNodeChildren);
      const childVNode: VNode = vNodeChildren[0];
      assert.ok(childVNode);
      assert.strictEqual(childVNode.sel, otherChildren[0].sel);
      assert.strictEqual(childVNode.text, otherChildren[0].text);
    })
      .catch(done);

    done();
  });

  it(`has a model stream in its sinks`, () => {
    const sinks: ButtonSinks = Button(defaultSources);

    assert.ok(sinks.hasOwnProperty(`model$`));
  });
});
