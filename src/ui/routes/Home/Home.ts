import isolate from '@cycle/isolate';
import { HomeSinks, HomeSources } from './';
import { Stream, just } from 'most';
import { AppSinks, AppSources, AppProps, App } from '../../components';

function Home(homeSources: HomeSources): HomeSinks {
  const { dom } = homeSources;

  const props$: Stream<AppProps> =
    just({
      routeName: `home`,
    });

  const sources: AppSources =
    {
      dom,
      props$,
    };

  const app: AppSinks = App(sources);

  return {
    dom: app.dom
  };
}

export function HomeRoute(sources: HomeSources): HomeSinks {
  return isolate(Home)(sources);
}
