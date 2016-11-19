import { cssRule, extend } from 'typestyle';
import { layoutInline, layoutCenterCenter } from '../../style/flex-layout';

export const host: string = `.sn-icon`;

cssRule(
  host,
  extend(
    layoutInline,
    layoutCenterCenter,
    {
      position: `relative`,
      verticalAlign: `middle`,
      fill: `currentColor`,
      stroke: `none`,
      width: `24px`,
      height: `24px`,
    }
  )
);
