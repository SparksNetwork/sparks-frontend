import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type AppHeaderSources = Sources &
  {
    dom: DOMSource;
    childViews$: Stream<Array<VNode>>;
  };

export type AppHeaderSinks = Sinks &
  {
    dom: Stream<VNode>;
  };

export type AppHeaderModel =
  {
    style: CSSProperties &
    {
      transitionDuration: string;
      transform: string;
    };
    hasShadow: boolean;
    childViews: Array<VNode>;
  };
