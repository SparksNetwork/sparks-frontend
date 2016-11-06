import { VNode, DOMSource } from '@motorcycle/dom';
import { Stream } from 'most';

export type ButtonProps = {
  children?: Array<VNode | string>;
  disabled?: boolean;
  id?: string;
};

export type ButtonSources = {
  DOM: DOMSource;
  props$?: Stream<ButtonProps>;
};

export type ButtonModel = ButtonProps & {
  children: Array<VNode | string>;
  disabled: boolean;
  id: string;
};

export type ButtonSinks = {
  DOM: Stream<VNode>;
  model$: Stream<ButtonModel>;
}
