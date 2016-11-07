import { Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources, Sinks } from '../../../components/types';

export type PasswordStrengthSources = Sources & {
  DOM: DOMSource;
  props$: Stream<PasswordStrengthProps>;
}

export type PasswordStrengthProps = {
  password: string;
};

export type PasswordStrengthSinks = Sinks & {
  DOM: Stream<VNode>;
  model$: Stream<PasswordStrengthModel>;
};

export type PasswordStrengthModel = {
  valid: boolean;
};
