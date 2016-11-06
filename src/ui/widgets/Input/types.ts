import { DOMSource, VNode } from '@motorcycle/dom';
import { Stream } from 'most';

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
  pattern?: RegExp;
  placeholder?: string;
  readonly?: boolean;
  size?: number;
  step?: number;
  type?: 'text' | 'password' | 'email';
  value?: string;
}

export type InputSources = {
  DOM: DOMSource;
  props$?: Stream<InputProps>;
};

export type InputModel = InputProps & {
  value: string;
};

export type InputSinks = {
  DOM: Stream<VNode>;
  model$: Stream<InputModel>;
}
