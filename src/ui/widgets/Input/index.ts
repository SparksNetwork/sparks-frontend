import { Stream, just } from 'most';
import { combineObj } from '../../../helpers';
import { DOMSource, VNode } from '@motorcycle/dom';
import { intent } from './intent';
import { view, ViewSpecs } from './view';

type InputElementAttrs = {
  autocapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autocomplete?: string;
  autocorrect?: 'on' | 'off';
  autofocus?: boolean;
  disabled?: boolean;
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
  type?: string;
  value?: string;
}

export type InputAttrs = InputElementAttrs & {
  float?: boolean;
  id?: string;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
};

export type InputProps = {
  disabled?: boolean;
}

export type InputSources = {
  DOM: DOMSource;
  attrs$?: Stream<InputAttrs>;
  props$?: Stream<InputProps>;
};

export type InputSinks = {
  DOM: Stream<VNode>;
}

export function Input(sources: InputSources) {
  const sourcesWithDefaults: InputSources = sourcesWithAppliedDefaults(sources);
  const { value$ } = intent(sourcesWithDefaults);
  const { attrs$, props$ } = sourcesWithDefaults;

  const state$: Stream<ViewSpecs> =
    combineObj({ attrs$, props$, value$ }) as Stream<ViewSpecs>;

  return {
    DOM: state$.map(view)
  }
}

function sourcesWithAppliedDefaults(sources: InputSources): InputSources {
  return {
    DOM: sources.DOM,
    attrs$: attrsWithDefaults$(sources),
    props$: propsWithDefaults$(sources)
  };
}

function attrsWithDefaults$(sources: InputSources): Stream<InputAttrs> {
  const { attrs$ = just({}) } = sources;
  const defaultAttrs: InputAttrs =
    { float: false, id: ``, placeholder: ``, type: 'text', value: `` };

  return attrs$.map(attrs => Object.assign(defaultAttrs, attrs));
}

function propsWithDefaults$(sources: InputSources): Stream<InputProps> {
  const { props$ = just({}) } = sources;
  const defaultProps: InputProps = { disabled: false };

  return props$.map(props => Object.assign(defaultProps, props));
}
