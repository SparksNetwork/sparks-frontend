import { cssRule } from 'typestyle';

// internal variables
const primaryColor: string = `#202020`;

export const host: string =
  `#sn-app`;

cssRule(
  host,
  {
    display: `block`,
    position: `relative`,
    paddingTop: `130px`,
    paddingBottom: `64px`,
    minHeight: `100vh`,
    '-webkit-tap-highlight-color': `rgba(0, 0, 0, 0)`,
    color: primaryColor
  }
);
