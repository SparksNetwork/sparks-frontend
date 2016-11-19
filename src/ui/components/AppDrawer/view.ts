import { AppDrawerModel } from './';
import { VNode, div } from '@motorcycle/dom';
import * as style from './style';

export function view(model: AppDrawerModel): VNode {
  const { opened } = model;

  const host: VNode =
    div(style.host,
      { class: { [`${style.opened.substring(1)}`]: opened } }, [
        div(style.scrim),
        div(style.content, [`AppDrawer`])
      ]);

  return host;
}
