import { extend } from 'typestyle';
import { resetOverflowCss } from './'

export function ellipsisCss(): NestedCSSProperties {
  return extend(
    resetOverflowCss(),
    {
      textOverflow: `ellipsis`
    }
  );
}
