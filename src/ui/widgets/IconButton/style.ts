import { cssRule } from 'typestyle';

export const host: string = `.sn-icon-button`;

cssRule(
  host,
  {
    display: `inline-block`,
    position: `relative`,
    padding: `8px`,
    outline: `none`,
    '-webkit-user-select': `none`,
    '-moz-user-select': `none`,
    '-ms-user-select': `none`,
    userSelect: `none`,
    cursor: `pointer`,
    zIndex: 0,
    lineHeight: 1,
    width: `40px`,
    height: `40px`,
    '-webkit-tap-highlight-color': [
      `rgba(0, 0, 0, 0)`,
      `transparent`,
    ],
    boxSizing: `border-box`,
  }
);
