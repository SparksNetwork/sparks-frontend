import { VNode, button } from '@motorcycle/dom';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector'
import { ButtonAttrs, ButtonChildren } from './';

export type ViewSpecs = {
  attrs: ButtonAttrs;
  children: ButtonChildren;
};

export function view(specs: ViewSpecs): VNode {
  const { attrs, children } = specs;

  const rootVNode: VNode =
    button(
      asSelector(styles.uniqueRoot, styles.root),
      { attrs },
      children
    );

  return rootVNode;
}
