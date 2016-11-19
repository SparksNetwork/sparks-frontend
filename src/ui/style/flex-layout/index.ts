import { extend } from 'typestyle';

export const layout: CSSProperties =
  {
    display: [
      `-ms-flexbox`,
      `-webkit-flex`,
      `flex`,
    ],
  };

export const layoutInline: CSSProperties =
  {
    display: [
      `-ms-inline-flexbox`,
      `-webkit-inline-flex`,
      `inline-flex`,
    ]
  };

export const layoutHorizontal: CSSProperties =
  extend(
    layout,
    {
      '-ms-flex-direction': `row`,
      '-webkit-flex-direction': `row`,
      flexDirection: `row`,
    }
  );

export const layoutFlex: CSSProperties =
  {
    '-ms-flex': `1 1 0.000000001px`,
    '-webkit-flex': 1,
    flex: 1,
    '-webkit-flex-basis': `0.000000001px`,
    flexBasis: `0.000000001px`,
  };

/* alignment in cross axis */

export const layoutCenter: CSSProperties =
  {
    '-ms-flex-align': `center`,
    '-webkit-align-items': `center`,
    alignItems: `center`,
  };

/* alignment in main axis */

export const layoutCenterJustified: CSSProperties =
  {
    '-ms-flex-pack': `center`,
    '-webkit-justify-content': `center`,
    justifyContent: 'center',
  };

export const layoutCenterCenter: CSSProperties =
  extend(
    layoutCenter,
    layoutCenterJustified,
  );

/* fixed position */

export const layoutFixedTop: CSSProperties =
  {
    position: `fixed`,
    top: 0,
    right: 0,
    left: 0,
  };
