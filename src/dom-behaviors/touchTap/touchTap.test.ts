import * as assert from 'assert';
import { mockDomSource } from '@motorcycle/dom';
import { mockStream } from '../../../tests/helpers';
import { touchTap } from './touchTap';

describe('touchTap', () => {
  it('shares a single source to multiple listeners', (done) => {
    const { stream: touchStart$, callCount: touchStartCount } = mockStream<Event>();
    const { stream: touchEnd$, callCount: touchEndCount } = mockStream<Event>();

    const domSource = mockDomSource({
      touchstart: touchStart$,
      touchend: touchEnd$,
    });

    const touchTap$ = touchTap(domSource);

    touchTap$.drain();
    touchTap$.drain();

    setTimeout(() => {
      assert.strictEqual(touchStartCount(), 1);
      assert.strictEqual(touchEndCount(), 1);
      done();
    });
  });
});
