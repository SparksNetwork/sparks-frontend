import * as theme from '../../style/theme';
import { resetFontCss, resetListCss } from '../../style/helpers'
import { style } from 'typestyle';

// internal variables

const errorColor: string = theme.textErrorColor;
const successColor: string = theme.textSuccessColor;

export const uniqueRoot: string = `sn-password-strength`;

export const root: string =
  style(
    {
      position: `relative`
    }
  );

export const listHeading: string =
  style(
    resetFontCss(),
    {
      color: theme.textColor
    }
  );

export const list: string =
  style(
    resetListCss()
  );

export const error: string =
  style(
    {
      color: errorColor,
      display: `table-row`
    }
  );

export const success: string =
  style(
    {
      color: successColor,
      display: `table-row`
    }
  );

export const message: string =
  style(
    {
      paddingLeft: `8px`
    }
  );
