import { AppSources, AppSinks, AppModel } from './';
import { AppHeaderSinks, AppHeader } from '../';
import { combineObj } from '../../../helpers';
import { Stream } from 'most';
import { Children, ViewModel, view } from './view';

export function App(sources: AppSources): AppSinks {
  const appHeader: AppHeaderSinks = AppHeader(sources);

  const model$: Stream<AppModel> =
    combineObj<AppModel>({ appHeaderModel$: appHeader.model$ });

  const children$: Stream<Children> =
    combineObj<Children>({ appHeader: appHeader.dom });

  const viewModel$: Stream<ViewModel> =
    combineObj<ViewModel>({ model$, children$ });

  return {
    dom: viewModel$.map(view),
    model$
  };
}
