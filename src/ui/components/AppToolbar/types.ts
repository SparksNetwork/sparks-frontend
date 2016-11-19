import { Sources, Sinks } from '../../../components/types';
import { DOMSource, VNode } from '@motorcycle/dom';
import { Stream } from 'most';

export type AppToolbarSources = Sources &
  {
    dom: DOMSource;
    childViews$: Stream<Array<VNode>>;
  };

export type AppToolbarSinks = Sinks &
  {
    dom: Stream<VNode>;
  };

export type AppToolbarModel =
  {
    childViews: Array<VNode>;
  };
