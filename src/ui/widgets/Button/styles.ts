import { style, extend } from 'typestyle';
import {
  ellipsisCss,
  inlineBlockCss,
  resetBaseCss,
  resetBoxModelCss,
  resetCursorCss,
  resetFontCss
}
  from '../../style/helpers';
import * as vars from '../../style/vars';
import * as theme from '../../style/theme';

// internal variables
const buttonPadding: string = `4px 10px`;
const buttonLineHeight: string = `32px`;
const buttonColor: string = `#fff`;
const buttonBackgroundColor: string = theme.highlightColor;
const buttonBorderRadius: string = `3px`;

export const uniqueRoot: string = `sn-button`;

export const root: string = style(
  buttonCss()
);

function buttonCss(): NestedCSSProperties {
  return extend(
    ellipsisCss(),
    inlineBlockCss(),
    resetBaseCss(),
    resetBoxModelCss(),
    resetCursorCss(),
    resetFontCss(),
    {
      height: `auto`,
      textDecoration: `none`,
      padding: buttonPadding,
      fontSize: vars.fontSize,
      lineHeight: buttonLineHeight,
      letterSpacing: vars.letterSpacing,
      color: buttonColor,
      verticalAlign: `middle`,
      backgroundColor: buttonBackgroundColor,
      border: `0px solid currentColor`,
      borderRadius: buttonBorderRadius,
      transition: `none`
    }
  );
}
