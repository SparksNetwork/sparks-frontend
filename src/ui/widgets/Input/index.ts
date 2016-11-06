export * from './types';
import { InputSources, InputSinks, InputProps, InputModel } from './';
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

function sourcesWithAppliedDefaults(sources: InputSources): InputSources {
  return merge(sources, { props$: propsWithDefaults$(sources) });
}

function propsWithDefaults$(sources: InputSources): Stream<InputProps> {
  const { props$ = just({}) } = sources;
  const defaultProps: InputProps =
    {
      disabled: false,
      float: false,
      id: ``,
      placeholder: ``,
      type: 'text',
      value: ``
    };

  return props$.map(props => merge(defaultProps, props));
}
