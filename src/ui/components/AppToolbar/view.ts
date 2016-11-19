import { AppToolbarModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export function view(model: AppToolbarModel): VNode {
  const { childViews } = model;

  const host: VNode =
    div(style.host, childViews);

  return host;
}
