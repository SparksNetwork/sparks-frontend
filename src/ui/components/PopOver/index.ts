export * from './types';
import { PopOverSinks, PopOverSources, PopOverModel } from './';
import { view, ViewModel } from './view';
import { Stream } from 'most';
import { combineObj } from '../../../helpers/mostjs/';

export function PopOver(sources: PopOverSources): PopOverSinks {
  const model$: Stream<PopOverModel> =
    sources.props$
      .map(props => {
        return {
          id: props.id as string
        };
      });

  const viewModel$: Stream<ViewModel> =
    combineObj<ViewModel>({ model$ });

  return {
    DOM: viewModel$.map(view)
  };
}
