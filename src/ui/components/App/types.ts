import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type AppSources = Sources &
  {
    dom: DOMSource;
    props$: Stream<AppProps>;
  };

export type AppProps =
  {
    routeName: string;
  };

export type AppSinks = Sinks &
  {
    dom: Stream<VNode>;
  };

export type AppModel =
  {
    childViews: AppModelChildViews;
  };

export type AppModelChildViews =
  {
    appHeaderView: VNode;
    appDrawerView: VNode;
  };
