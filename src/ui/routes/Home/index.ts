import isolate from '@cycle/isolate';
import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';
import { AppSinks, App } from '../../components';

type HomeSources = Sources &
  {
    dom: DOMSource;
  };

type HomeSinks = Sinks &
  {
    dom: Stream<VNode>
  };

function Home(sources: HomeSources): HomeSinks {
  const app: AppSinks = App(sources);

  return {
    dom: app.dom
  };
}

export function HomeRoute(sources) {
  return isolate(Home)(sources);
}
