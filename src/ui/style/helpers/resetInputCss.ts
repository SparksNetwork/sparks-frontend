import { extend } from 'typestyle';
import { resetBaseCss, resetBoxModelCss } from './'

export function resetInputCss(): NestedCSSProperties {
  return extend(
    resetBaseCss(),
    resetBoxModelCss(),
    {
      verticalAlign: `top`,
      outline: `none`,
      lineHeight: 1
    }
  );
}
