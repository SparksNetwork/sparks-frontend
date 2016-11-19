import { IconModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export function view(model: IconModel): VNode {
  const { child } = model;

  const host: VNode =
    div(style.host, [
      child,
    ]);

  return host;
}
