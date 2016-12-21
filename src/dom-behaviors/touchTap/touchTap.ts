import { Stream, multicast, constant, delay, just, during } from 'most';
import { events, DomSource } from '@motorcycle/dom';

const touchStart = events('touchstart');
const touchEnd = events('touchend');
const TAP_DELAY = 300; // milliseconds

export function touchTap(dom: DomSource): Stream<Event> {
  const touchStart$: Stream<Event> = touchStart(dom);
  const touchEnd$: Stream<Event> = touchEnd(dom);

  const timeWindow$: Stream<Stream<void>> =
    multicast(constant(delay(TAP_DELAY, just(void 0)), touchStart$));

  return multicast(during(timeWindow$, touchEnd$));
}
