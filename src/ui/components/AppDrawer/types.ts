import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type AppDrawerSinks = Sinks &
  {
    dom: Stream<VNode>;
  };

export type AppDrawerSources = Sources &
  {
    dom: DOMSource;
    props$: Stream<AppDrawerProps>;
  };

export type AppDrawerProps =
  {
    opened: boolean;
  };

export type AppDrawerModel =
  {
    opened: boolean;
  };
