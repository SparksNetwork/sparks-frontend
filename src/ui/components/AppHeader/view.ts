import { AppHeaderModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export type ViewModel =
  {
    model: AppHeaderModel;
  };

export function view(viewModel: ViewModel): VNode {
  const { model } = viewModel;

  const root: VNode =
    div(`${style.host}${model.hasShadow ? style.shadow : ''}`,
      { style: model.style },
      [`Application Header`]);

  return root;
}
