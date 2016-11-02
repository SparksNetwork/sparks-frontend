import { VNode, div, input, label, span } from '@motorcycle/dom';
import { InputAttrs, InputProps } from './';
import * as styles from './styles';
import { classes, cssRule } from 'typestyle';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector';

export type ViewSpecs = {
  attrs: InputAttrs;
  props: InputProps;
  value: string;
}

export function view(specs: ViewSpecs): VNode {
  pseudoPlaceholderHack();

  return rootVNode(specs);
}

function rootVNode(specs: ViewSpecs): VNode {
  const rootVNode: VNode =
    div(
      asSelector(
        classes(
          styles.uniqueRoot,
          styles.root,
          specs.props.disabled && styles.disabled)),
      [ containerVNode(specs) ]
    );

  return rootVNode;
}

function containerVNode(specs: ViewSpecs): VNode {
  const containerVNode: VNode =
    label(asSelector(styles.container), [
      inputVNode(specs),
      labelVNode(specs),
    ]);

  return containerVNode;
}

function inputVNode(specs: ViewSpecs): VNode {
  const { attrs, props } = specs;
  const inputAttrs = Object.assign({}, attrs);
  delete inputAttrs[`float`];

  const inputVNode: VNode =
    input(asSelector(styles.textInputUnderbar),
      { attrs: inputAttrs, props });

  return inputVNode;
}

function labelVNode(specs: ViewSpecs): VNode {
  const { attrs, value } = specs;
  const { float, placeholder } = attrs;

  const labelVNode: VNode =
    span(asSelector(styles.label),
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
