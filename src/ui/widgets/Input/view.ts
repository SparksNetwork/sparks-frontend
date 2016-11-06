import { VNode, div, input, label, span } from '@motorcycle/dom';
import { merge } from 'ramda';
import { InputModel } from './';
import * as styles from './styles';
import { classes, cssRule } from 'typestyle';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector';

export function view(model: InputModel): VNode {
  pseudoPlaceholderHack();

  return rootVNode(model);
}

function rootVNode(model: InputModel): VNode {
  const rootVNode: VNode =
    div(
      asSelector(
          styles.uniqueRoot,
          styles.root,
          model.disabled && styles.disabled),
      [ containerVNode(model) ]
    );

  return rootVNode;
}

function containerVNode(model: InputModel): VNode {
  const containerVNode: VNode =
    label(asSelector(styles.container), [
      inputVNode(model),
      labelVNode(model),
    ]);

  return containerVNode;
}

function inputVNode(model: InputModel): VNode {
  const props: InputModel = merge({}, model);
  delete props[`float`];

  const inputVNode: VNode =
    input(asSelector(styles.textInputUnderbar),
      { props });

  return inputVNode;
}

function labelVNode(model: InputModel): VNode {
  const { float, placeholder, value } = model;

  const labelVNode: VNode =
    span(
      {
        props: {
          className: classes(
            styles.label,
            ( value && float ) && styles.labelActive,
            ( value && !float ) && styles.notFloatLabelActive)
        }
      },
      placeholder as string);

  return labelVNode;
}

// @TODO update when https://github.com/typestyle/typestyle/issues/26
function pseudoPlaceholderHack() {
  cssRule(
    styles.textInputWebkitPlaceholder.selector,
    styles.textInputWebkitPlaceholder.object);

  cssRule(
    styles.textInputMozPlaceholder.selector,
    styles.textInputMozPlaceholder.object);

  cssRule(
    styles.textInputMSPlaceholder.selector,
    styles.textInputMSPlaceholder.object);
}
