import { VNode, button } from '@motorcycle/dom';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector'
import { ButtonAttrs, ButtonProps, ButtonChildren } from './';

export type ViewSpecs = {
  attrs: ButtonAttrs;
  props: ButtonProps;
  children: ButtonChildren;
};

export function view(specs: ViewSpecs): VNode {
  const { attrs, props, children } = specs;

  const rootVNode: VNode =
    button(
      asSelector(styles.uniqueRoot, styles.root),
      { attrs, props },
      children
    );

  return rootVNode;
}
