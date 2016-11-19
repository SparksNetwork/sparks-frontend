import { AppHeaderModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export function view(model: AppHeaderModel): VNode {
  const {
    style: inlineStyle,
    hasShadow,
    childViews
  } = model;

  const root: VNode =
    div(style.host,
      { style: inlineStyle, class: { [`${style.shadow.substring(1)}`]: hasShadow } },
      childViews);

  return root;
}
