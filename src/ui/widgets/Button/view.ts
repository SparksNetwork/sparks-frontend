import { VNode, button } from '@motorcycle/dom';
import { merge } from 'ramda';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector'
import { ButtonModel } from './';

export function view(model: ButtonModel): VNode {
  const props: ButtonModel = merge({}, model);
  delete props.children;

  const rootVNode: VNode =
    button(
      asSelector(styles.uniqueRoot, styles.root),
      { props },
      model.children
    );

  return rootVNode;
}
