import { Message } from './message$';
import { AppHeaderModel } from './';

let _top: number = 0;
let _previousScrollTop: number = 0;
let _initScrollTop: number = 0;
let _initTimestamp: number = 0;
let _wasScrollingDown: boolean = false;
let _previousTimestamp: number = 0;

export function update(message: Message): AppHeaderModel {
  const { height, scrollTop } = message;

  let top: number = 0;
  let transitionDuration: string = `0ms`;
  let hasShadow: boolean = false;

  if (!height)
    return appHeaderModel({ transitionDuration, top, hasShadow });;

  const maxAllowedMoveDistance: number = height + 5;
  const previousTop: number = _top;
  const deltaScrollTop: number = scrollTop - _previousScrollTop;

  top = clamp(previousTop + deltaScrollTop, 0, maxAllowedMoveDistance);

  const absoluteDeltaScrollTop: number = Math.abs(deltaScrollTop);

  // @TODO Date must come through a driver.
  const now: number = Date.now();
  const isScrollingDown: boolean = scrollTop > _previousScrollTop;

  const SCROLL_SPEED_LIMIT_PIXELS: number = 100;

  const isNormalScrollSpeed: boolean =
    absoluteDeltaScrollTop < SCROLL_SPEED_LIMIT_PIXELS;

  const INIT_SCROLL_TIME_TO_WAIT: number = 300;

  const shouldInitScrollPosition: boolean =
    isNormalScrollSpeed &&
    (now - _initTimestamp > INIT_SCROLL_TIME_TO_WAIT ||
      _wasScrollingDown !== isScrollingDown);

  if (shouldInitScrollPosition) {
    _initScrollTop = scrollTop;
    _initTimestamp = now;
  }

  const scrolledBeyondAllowedMoveDistance: boolean =
    isNormalScrollSpeed && scrollTop >= maxAllowedMoveDistance;

  const SCROLL_SNAP_SENSITIVITY_PIXELS: number = 10;
  const PAUSED_SCROLL_SNAP_SENSITIVITY_PIXELS: number = 30;

  const allowHeaderToSnap: boolean =
    isNormalScrollSpeed &&
    scrolledBeyondAllowedMoveDistance &&
    (Math.abs(_initScrollTop - scrollTop) > PAUSED_SCROLL_SNAP_SENSITIVITY_PIXELS ||
      absoluteDeltaScrollTop > SCROLL_SNAP_SENSITIVITY_PIXELS);

  const snapHeaderOutsideViewport: boolean =
    isNormalScrollSpeed && allowHeaderToSnap && isScrollingDown;

  if (snapHeaderOutsideViewport)
    top = maxAllowedMoveDistance;
  else if (allowHeaderToSnap)
    top = 0;

  if (allowHeaderToSnap) {
    const scrollVelocity: number =
      deltaScrollTop / (now - _previousTimestamp);

    const MAX_TRANSITION_DURATION: number = 300;
    const MIN_TRANSITION_DURATION: number = 0;

    transitionDuration =
      clamp((top - previousTop) / scrollVelocity,
        MIN_TRANSITION_DURATION,
        MAX_TRANSITION_DURATION) +
      `ms`;

  } else if (scrolledBeyondAllowedMoveDistance) {
    top = previousTop;
  }

  updateGlobals({ scrollTop, top, isScrollingDown, now });

  hasShadow =
    isOnScreen(height) &&
    hasContentBelow(scrollTop, maxAllowedMoveDistance);

  return appHeaderModel({ transitionDuration, top, hasShadow });;
}

function appHeaderModel(specs: any): AppHeaderModel {
  const { transitionDuration, top, hasShadow } = specs;

  const model: AppHeaderModel =
    {
      style: {
        transitionDuration,
        transform: `translate3d(0px, ${-top}px, 0px)`,
      },
      hasShadow,
    };

  return model;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function updateGlobals(specs: any) {
  const {scrollTop, top, isScrollingDown, now} = specs;

  _previousScrollTop = scrollTop;
  _top = top;
  _wasScrollingDown = isScrollingDown;
  _previousTimestamp = now;
}

function isOnScreen(height): boolean {
  return height !== 0 && _top < height;
}

function hasContentBelow(scrollTop, maxAllowedMoveDistance): boolean {
  return _top === 0 ?
    scrollTop > 0 :
    scrollTop - maxAllowedMoveDistance >= 0;
}
