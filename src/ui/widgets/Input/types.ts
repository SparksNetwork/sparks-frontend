import { DOMSource, VNode } from '@motorcycle/dom';
import { Stream } from 'most';

type Validator = {
  (value?: string): boolean;
};

export type InputProps = {
  autocapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autocomplete?: string;
  autocorrect?: 'on' | 'off';
  autofocus?: boolean;
  disabled?: boolean;
  float?: boolean;
  id?: string;
  inputmode?: 'verbatim' | 'latin' | 'latin-name' | 'latin-prose' | 'full-width-latin' | 'kana' | 'katakana' | 'numeric' | 'tel' | 'email' | 'url';
  max?: string;
  maxlength?: number;
  min?: string;
  minlength?: number;
  name?: string;
  novalidate?: boolean;
  pattern?: RegExp;
  placeholder?: string;
  readonly?: boolean;
  size?: number;
  step?: number;
  type?: 'text' | 'password' | 'email';
  validator?: Validator;
  value?: string;
}

export type InputDefaultProps = InputProps & {
  disabled: boolean;
  float: boolean;
  id: string;
  placeholder: string;
  type: 'text' | 'password' | 'email';
  validator: Validator;
  value: string;
};

export type InputSources = {
  DOM: DOMSource;
  props$?: Stream<InputProps>;
};

export type InputDefaultSources = {
  DOM: DOMSource;
  props$: Stream<InputDefaultProps>;
};

export type InputModel = InputProps & {
  value: string;
  valid: boolean;
};

export type InputSinks = {
  DOM: Stream<VNode>;
  model$: Stream<InputModel>;
}
