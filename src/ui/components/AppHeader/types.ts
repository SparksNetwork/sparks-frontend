import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type AppHeaderSources = Sources &
  {
    dom: DOMSource;
  };

export type AppHeaderSinks = Sinks &
  {
    dom: Stream<VNode>;
    model$: Stream<AppHeaderModel>;
  };

export type AppHeaderModel =
  {
    style: CSSProperties &
    {
      transitionDuration: string;
      transform: string;
    };
    hasShadow: boolean;
  };
