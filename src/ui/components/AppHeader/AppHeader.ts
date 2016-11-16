import { AppHeaderSources, AppHeaderSinks, AppHeaderModel } from './';
import { combineObj } from '../../../helpers';
import { Stream } from 'most';
import { message$ } from './message$';
import { update } from './update';
import { ViewModel, view } from './view';

export function AppHeader(sources: AppHeaderSources): AppHeaderSinks {
  const model$: Stream<AppHeaderModel> =
    message$(sources)
      .map(update);

  const viewModel$: Stream<ViewModel> =
    combineObj<ViewModel>({ model$ });

  return {
    dom: viewModel$.map(view),
    model$
  }
}
