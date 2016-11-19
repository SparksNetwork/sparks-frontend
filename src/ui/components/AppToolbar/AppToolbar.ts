import { AppToolbarSinks, AppToolbarSources, AppToolbarModel } from './';
import { combineObj } from '../../../helpers';
import { view } from './view';
import { Stream } from 'most';

export function AppToolbar(sources: AppToolbarSources): AppToolbarSinks {
  const model$: Stream<AppToolbarModel> =
    combineObj<AppToolbarModel>({
      childViews$: sources.childViews$
    });

  return {
    dom: model$.map(view),
  };
}
