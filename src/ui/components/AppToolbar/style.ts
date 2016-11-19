import { cssRule, extend } from 'typestyle';
import { layoutHorizontal, layoutCenter, layoutFlex } from '../../style/flex-layout';

export const host: string = `.sn-app-toolbar`;

cssRule(
  host,
  extend(
    layoutHorizontal,
    layoutCenter,
    {
      position: `relative`,
      height: `64px`,
      padding: `0 16px`,
      pointerEvents: `none`,
      fontSize: `20px`,
    }
  )
);

cssRule(
  `${host} > *`,
  {
    pointerEvents: `auto`,
  }
);

export const mainTitle: string = `.sn-app-toolbar-main-title`;

cssRule(
  mainTitle,
  extend(
    layoutFlex,
    {
      pointerEvents: `none`
    }
  )
);
