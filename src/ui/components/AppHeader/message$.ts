import { AppHeaderSources } from './';
import * as style from './style';
import { Stream, fromEvent } from 'most';
import { combineObj } from '../../../helpers';

export type Message =
  {
    top: number;
    transitionDuration: string;
    hasShadow: boolean;
  };

type ScrollProps =
  {
    height: number;
    scrollTop: number;
  };

export function message$(sources: AppHeaderSources): Stream<Message> {
  const { dom } = sources;

  const height$: Stream<number> =
    dom.select(style.host)
      .elements()
      .take(2)
      .map((elements: Array<HTMLElement>) => {
        return elements.length > 0 ?
          elements[0].offsetHeight :
          0;
      });

  // @TODO This workaround needs to live in the DOM driver.
  const scroll$: Stream<Event> =
    fromEvent(`scroll`, window);

  const scrollTop$: Stream<number> =
    scroll$
      .map(event => (event.currentTarget as Window).pageYOffset)
      .skipRepeats()
      .startWith(0);

  const message$: Stream<Message> =
    combineObj<ScrollProps>(
      {
        height$,
        scrollTop$,
      }
    )
      .map(scrollState);

  return message$;
}

let _top: number = 0;
let _previousScrollTop: number = 0;
let _initScrollTop: number = 0;
let _initTimestamp: number = 0;
let _wasScrollingDown: boolean = false;
let _previousTimestamp: number = 0;

function scrollState(props: ScrollProps): Message {
  const {
    height,
    scrollTop,
  } = props;

  let top: number = 0;
  let transitionDuration = `0ms`;
  let hasShadow: boolean = false;

  if (!height)
    return { top, transitionDuration, hasShadow };

  const maxAllowedMoveDistance: number = height + 5;
  const previousTop: number = _top;
  const deltaScrollTop: number = scrollTop - _previousScrollTop;

  top = clamp(previousTop + deltaScrollTop, 0, maxAllowedMoveDistance);

  const absoluteDeltaScrollTop: number = Math.abs(deltaScrollTop);
  const now: number = Date.now();
  const isScrollingDown: boolean = scrollTop > _previousScrollTop;

  const isNormalScrollSpeed: boolean =
    absoluteDeltaScrollTop < 100;

  const shouldInitScrollPosition: boolean =
    isNormalScrollSpeed &&
    (now - _initTimestamp > 300 || _wasScrollingDown !== isScrollingDown);

  if (shouldInitScrollPosition) {
    _initScrollTop = scrollTop;
    _initTimestamp = now;
  }

  const scrolledBeyondAllowedMoveDistance: boolean =
    isNormalScrollSpeed && scrollTop >= maxAllowedMoveDistance;

  const allowHeaderToSnap: boolean =
    isNormalScrollSpeed &&
    scrolledBeyondAllowedMoveDistance &&
    (Math.abs(_initScrollTop - scrollTop) > 30 ||
      absoluteDeltaScrollTop > 10);

  const snapOutOfScreen: boolean =
    isNormalScrollSpeed && allowHeaderToSnap && isScrollingDown;

  if (snapOutOfScreen)
    top = maxAllowedMoveDistance;
  else if (allowHeaderToSnap)
    top = 0;

  if (allowHeaderToSnap) {
    const scrollVelocity: number =
      deltaScrollTop / (now - _previousTimestamp);

    transitionDuration =
      `${clamp((top - previousTop) / scrollVelocity, 0, 300)}ms`;

  } else if (scrolledBeyondAllowedMoveDistance) {
    top = previousTop;
  }

  _previousScrollTop = scrollTop;
  _top = top;
  _wasScrollingDown = isScrollingDown;
  _previousTimestamp = now;

  const isOnScreen: boolean =
    height !== 0 && _top < height;

  const hasContentBelow: boolean =
    _top === 0 ?
      scrollTop > 0 :
      scrollTop - maxAllowedMoveDistance >= 0;

  hasShadow = isOnScreen && hasContentBelow;

  return { top, transitionDuration, hasShadow };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
