export * from './types';
import { PopOverSinks, PopOverSources, PopOverModel } from './';
import { message$ } from './message$';
import { update } from './update';
import { view, ViewModel } from './view';
import { Stream } from 'most';
import { combineObj } from '../../../helpers/mostjs/';

export function PopOver(sources: PopOverSources): PopOverSinks {
  const model$: Stream<PopOverModel> =
    message$(sources)
      .map(update);

  const viewModel$: Stream<ViewModel> =
    combineObj<ViewModel>({ model$ });

  return {
    DOM: viewModel$.map(view)
  };
}
