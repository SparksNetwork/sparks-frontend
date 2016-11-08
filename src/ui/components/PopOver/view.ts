import { VNode, div } from '@motorcycle/dom';
import {
  cssClassesAsSelector as asSelector
} from '../../helpers/cssClassesAsSelector';
import * as styles from './styles';

export function view(): VNode {
  const rootVNode: VNode =
    div(asSelector(styles.uniqueRoot), [
      div(asSelector(styles.message))
    ]);

  return rootVNode;
}
