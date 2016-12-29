import * as assert from 'assert';
import { just } from 'most';
import { mockDomSource } from '@motorcycle/dom';
import { RouterInput, HistoryInput, Path } from '@motorcycle/router';
import { augmentWithAnchorClicks } from './augmentWithAnchorClicks';
import { DomSources } from '../../types';

function Component(sources: DomSources) {
  Function.prototype(sources);
  return {};
}

describe('augmentWithAnchorClicks', () => {
  describe('given a Component function', () => {
    it('returns a new Component function', () => {
      const newComponent = augmentWithAnchorClicks(Component);

      assert.strictEqual(typeof newComponent, 'function');
      assert.notStrictEqual(Component, newComponent);
    });

    describe('Augmented Component', () => {
      describe('given Sources containing `.dom` DomSource', () => {
        it('returns router sink', () => {
          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: mockDomSource({}) });

          assert.ok(sinks.hasOwnProperty('router'));
        });

        describe('router sink', () => {
          it('is of type RouterInput', () => {
            const AugmentedComponent = augmentWithAnchorClicks(Component);

            const sinks = AugmentedComponent({ dom: mockDomSource({}) });

            const router: RouterInput = sinks.router;

            assert.strictEqual(typeof router.observe, 'function');
          });
        });

        it('returns other sinks', () => {
          const otherSink = just({});

          function Component(sources: DomSources) {
            Function.prototype(sources);
            return { other: otherSink };
          }

          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: mockDomSource({}) });

          assert.strictEqual(sinks.other, otherSink);
        });

        it('calls prevent default on events', () => {
          let called = 0;
          const event = {
            preventDefault() { ++called; },
            target: { pathname: '/hello' },
          };

          const domSource = mockDomSource({
            A: {
              click: just(event),
            },
          });

          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: domSource });

          return sinks.router.take(1).drain().then(() => {
            assert.strictEqual(called, 1);
          });
        });

        it('emits router changes on anchor clicks', (done) => {
          const firstEventTarget = {
            preventDefault() { },
            target: { pathname: '/hello' },
          };
          const secondEventTarget = {
            preventDefault() { },
            target: { pathname: '/world' },
          };

          const domSource = mockDomSource({
            A: {
              click: just(firstEventTarget).concat(just(secondEventTarget)),
            },
          });

          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: domSource });

          const expected = [
            '/hello',
            '/world',
          ];

          sinks.router.take(2).observe(function (routerInput: HistoryInput | Path) {
            assert.strictEqual(routerInput, expected.shift());

            if (expected.length === 0)
              done();
          });
        });

        it('emits router changes on anchor touch events', (done) => {
          const firstEventTarget = {
            preventDefault() { },
            target: { pathname: '/hello' },
          };
          const secondEventTarget = {
            preventDefault() { },
            target: { pathname: '/world' },
          };

          const domSource = mockDomSource({
            A: {
              touchstart: just(firstEventTarget).concat(just(secondEventTarget)),
              touchend: just(firstEventTarget).concat(just(secondEventTarget)),
            },
          });

          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: domSource });

          const expected = [
            '/hello',
            '/world',
          ];

          sinks.router.take(2).observe(function (routerInput: HistoryInput | Path) {
            assert.strictEqual(routerInput, expected.shift());

            if (expected.length === 0)
              done();
          });
        });

        it('does not emit router changes no anchor touch events longer than 300 ms', (done) => {
          const eventTarget = {
            preventDefault() {},
            target: { pathname: '/hello' },
          };

          const domSource = mockDomSource({
            A: {
              touchstart: just(eventTarget),
              touchend: just(eventTarget).delay(350),
            },
          });

          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: domSource });

          sinks.router.observe(() => {
            done(new Error('Should not emit touch events lasting longer than 300ms'));
          });

          // No timeout is needed because if the above stream emits
          // done() will be called multiple times causing test failure
          done();
        });

        it('merges other route changes not originating from anchor clicks', (done) => {
          const domSource = mockDomSource({});

          function Component(sources: DomSources) {
            Function.prototype(sources);

            return {
              router: just('/path'),
            };
          }

          const AugmentedComponent = augmentWithAnchorClicks(Component);

          const sinks = AugmentedComponent({ dom: domSource });

          sinks.router
            .observe(path => {
              assert.strictEqual(path, '/path');
              done();
            })
            .catch(done);
        });
      });
    });
  });
});
