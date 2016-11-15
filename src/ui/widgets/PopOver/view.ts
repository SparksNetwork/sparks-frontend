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
  const { id, message, wrapperStyle } = model;

  const rootVNode: VNode =
    div(
      asSelector(
        styles.uniqueRoot,
        styles.container
      ),
      { attrs: { id }, style: { display: `none` } }, [
        div(
          asSelector(
            styles.wrapper,
          ),
          { style: wrapperStyle },
          [
            div(
              asSelector(
                styles.popOverContent,
                styles.typeInfo,
              ), [
                div(asSelector(styles.message), message)
              ])
          ])
      ]);

  return rootVNode;
}
