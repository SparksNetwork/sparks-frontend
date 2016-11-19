import { IconButtonModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export function view(model: IconButtonModel): VNode {
  const { className, icon } = model;

  const host: VNode =
    div(style.host + className, [ icon ]);

  return host;
}
