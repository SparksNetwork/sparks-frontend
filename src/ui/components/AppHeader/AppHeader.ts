import { AppHeaderSources, AppHeaderSinks, AppHeaderModel } from './';
import { Stream } from 'most';
import { message$ } from './message$';
import { update } from './update';
import { view } from './view';

export function AppHeader(sources: AppHeaderSources): AppHeaderSinks {
  const model$: Stream<AppHeaderModel> =
    message$(sources)
      .map(update);

  return {
    dom: model$.map(view),
  }
}
