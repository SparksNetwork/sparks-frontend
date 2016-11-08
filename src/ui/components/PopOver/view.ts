import { VNode, div } from '@motorcycle/dom';
import {
  cssClassesAsSelector as asSelector
} from '../../helpers/cssClassesAsSelector';
import * as styles from './styles';
import { PopOverModel } from './';

export type ViewModel =
  {
    model: PopOverModel;
  };

export function view(viewModel: ViewModel): VNode {
  const { model } = viewModel;
  const { id, message } = model;

  const rootVNode: VNode =
    div(asSelector(styles.uniqueRoot),
      { attrs: { id } }, [
        div(asSelector(styles.message), message)
      ]);

  return rootVNode;
}
