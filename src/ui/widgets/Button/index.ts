export * from './types';
import { ButtonSources, ButtonSinks, ButtonProps, ButtonModel } from './types';
import { Stream, just } from 'most';
import { merge } from 'ramda';
import { message$ } from './message$';
import { update } from './update';
import { view } from './view';

export function Button(sources: ButtonSources): ButtonSinks {
  const model$: Stream<ButtonModel> =
    message$(sourcesWithAppliedDefaults(sources))
      .map(update);

  return {
    DOM: model$.map(view),
    model$
  };
}

function sourcesWithAppliedDefaults(sources: ButtonSources): ButtonSources {
  return merge(sources, { props$: propsWithDefaults$(sources) });
}

function propsWithDefaults$(sources: ButtonSources): Stream<ButtonProps> {
  const { props$ = just({}) } = sources;
  const defaultProps: ButtonProps =
    {
      children: [],
      disabled: false,
      id: ``
    };

  return props$.map(props => merge(defaultProps, props));
}
