import { cssRule, extend } from 'typestyle';
import { layoutFixedTop } from '../../style/flex-layout';

// internal variables

const backgroundColor: string =
  `rgba(255, 255, 255, 0.95)`;

export const host: string = `#sn-app-header`;

cssRule(
  host,
  extend(
    layoutFixedTop,
    {
      zIndex: 1,
      backgroundColor,
      display: `block`,
      transitionTimingFunction: `linear`,
      transitionProperty: [
        `-webkit-transform`,
        `transform`,
      ],
    }
  )
);

cssRule(
  `${host}::after`,
  {
    position: `absolute`,
    right: 0,
    bottom: `-10px`,
    left: 0,
    width: `100%`,
    height: `10px`,
    content: `""`,
    transition: `opacity 0.4s`,
    pointerEvents: `none`,
    opacity: 0,
    boxShadow: `inset 0px 5px 6px -3px rgba(0, 0, 0, 0.2)`,
    willChange: `opacity`,
  }
);

export const shadow: string = `.shadow`;

cssRule(
  `${host}${shadow}::after`,
  {
    opacity: 1,
  }
);
