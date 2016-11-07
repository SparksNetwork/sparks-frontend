export * from './types';
import {
  InputSources, InputDefaultSources, InputSinks, InputDefaultProps, InputModel
} from './';
import { Stream, just } from 'most';
import { merge } from 'ramda';
import { message$ } from './message$';
import { update } from './update';
import { view } from './view';

export function Input(sources: InputSources): InputSinks {
  const model$: Stream<InputModel> =
    message$(sourcesWithAppliedDefaults(sources))
      .map(update);

  return {
    DOM: model$.map(view),
    model$
  }
}

function sourcesWithAppliedDefaults(sources: InputSources): InputDefaultSources {
  return merge(sources, { props$: propsWithDefaults$(sources) });
}

function propsWithDefaults$(sources: InputSources): Stream<InputDefaultProps> {
  const { props$ = just({}) } = sources;
  const defaultProps: InputDefaultProps =
    {
      disabled: false,
      float: false,
      id: ``,
      placeholder: ``,
      type: 'text',
      validator: defaultValidator,
      value: ``
    };

  return props$.map(props => merge(defaultProps, props));
}

function defaultValidator(): boolean {
  return true;
}
