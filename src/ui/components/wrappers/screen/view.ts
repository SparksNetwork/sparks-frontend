import { VNode, div } from '@motorcycle/dom';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../../helpers/cssClassesAsSelector';

export function view(childView: VNode): VNode {

  const root: VNode =
    div(asSelector(styles.root), [
      div(asSelector(styles.background)),
      div(asSelector(styles.content) ,[
        childView
      ])
    ]);

  return root;
}
