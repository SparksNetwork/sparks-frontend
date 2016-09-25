import * as assert from 'assert';
import ComponentRouter from './index';
import * as most from 'most';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
import { mockDOMSource, h1, VNode, DOMSource } from '@motorcycle/dom';

const mockedDOMSource = mockDOMSource({}) as any as DOMSource;

const component = {
  DOM: most.of(h1({}, 'Hello World')),
  route$: most.of('/path')
};

const match = { path: '/', value: () => component };

const router: RouterSource = {
  path: () => most.empty(),
  define: () => most.of(match)
} as any as RouterSource;

const routes$ = most.of({
  '/': component
});

describe('ComponentRouter', function () {
  it('should return the latest components sinks', function () {
    const { DOM } = ComponentRouter({
      DOM: mockedDOMSource,
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
    });
  });
});
