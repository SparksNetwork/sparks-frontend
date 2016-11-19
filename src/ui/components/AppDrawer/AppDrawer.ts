import { AppDrawerSinks, AppDrawerSources, AppDrawerModel } from './';
import { Stream } from 'most';
import { view } from './view';

export function AppDrawer(sources: AppDrawerSources): AppDrawerSinks {
  const { props$ } = sources;

  const model$: Stream<AppDrawerModel> = props$

  return {
    dom: model$.map(view)
  };
}
