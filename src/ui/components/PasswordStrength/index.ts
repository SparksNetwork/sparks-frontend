export * from './types';
import {
  PasswordStrengthSources, PasswordStrengthSinks, PasswordStrengthModel
} from './';
import { Stream } from 'most';
import { view } from './view';

export function PasswordStrength(
  sources: PasswordStrengthSources): PasswordStrengthSinks {

  const model$: Stream<PasswordStrengthModel> =
    sources.props$
      .map(props => {
        const valid: boolean = props.password.length > 5;

        return { valid };
      });

  return {
    DOM: model$.map(view),
    model$
  }
}
