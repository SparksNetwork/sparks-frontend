import { AppModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export type ViewModel =
  {
    model: AppModel;
    children: Children;
  };

export type Children =
  {
    appHeader: VNode
  };

export function view(viewModel: ViewModel): VNode {
  const { children } = viewModel;
  const { appHeader } = children;

  const root: VNode =
    div(style.host,
      {}, [
        `Application`,
        appHeader
      ]);

  return root;
}
