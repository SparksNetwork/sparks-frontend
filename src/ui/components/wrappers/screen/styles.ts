import * as theme from '../../style/theme';
import * as vars from '../../style/vars'
import { resetFontCss, resetBoxModelCss } from '../../style/helpers'
import { style } from 'typestyle';

// internal variables
const pageBackgroundColor = theme.backgroundColor;

export const root = style(
  resetFontCss(),
  {
    color: vars.textColor,
    backgroundColor: pageBackgroundColor,
    display: `block`,
    position: `absolute`,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflowX: `visible`,
    overflowY: `hidden`,
    zIndex: 2,
    fontSize: vars.fontSize,
    '-ms-overflow-style': `none`,
    transform: `translate3d(0, 0, 0)`,
    '&::-webkit-scrollbar': {
      display: `none`
    }
  }
);

export const content = style(
  resetBoxModelCss(),
  {
    backgroundColor: pageBackgroundColor,
    position: `absolute`,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    overflow: `auto`,
    '-webkit-overflow-scrolling': `touch`,
    zIndex: 0,
    '-ms-touch-action': `pan-y`
  }
);

export const background = style(
  resetBoxModelCss(),
  {
    backgroundColor: pageBackgroundColor,
    position: `absolute`,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  }
);
