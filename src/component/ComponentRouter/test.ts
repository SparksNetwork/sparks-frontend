import * as assert from 'assert';
import ComponentRouter from './index';
import * as most from 'most';
import { mockDOMSource, h1, VNode, } from '@motorcycle/dom';

const DOMSource = mockDOMSource({});
const component = {
  DOM: most.of(h1({}, 'Hello World')),
  route$: most.of('/path')
};
const match = { path: '/', value: () => component };
const router = {
  path: () => most.empty(),
  define: () => most.of(match)
};
const routes$ = most.of({
  '/': component
});

describe('ComponentRouter', function () {
  it('should return the latest components sinks', function () {
    const { DOM } = ComponentRouter({
      DOM: DOMSource,
      router,
      routes$
    });

    assert(typeof DOM.observe === 'function');

    const expected: { sel: string, text: string }[] = [
      { sel: 'div.loading.___cycle1', text: 'Loading....' },
      { sel: 'h1.___cycle1', text: 'Hello World' }
    ];

    return DOM.observe(function (vNode: VNode) {
      const { sel, text } = expected.shift() || { sel: '', text: '' };
      if (!vNode) {
        assert.fail();
      }

      assert.strictEqual(vNode.sel as string, (sel as string));
      assert.strictEqual(vNode.text as string, (text as string));
    })
  });
});
