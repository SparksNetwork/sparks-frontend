import { AppModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export function view(model: AppModel): VNode {
  const { childViews } = model;
  const { appHeaderView, appDrawerView } = childViews;

  const root: VNode =
    div(style.host, [
      `Application`,
      appHeaderView,
      appDrawerView
    ]);

  return root;
}
