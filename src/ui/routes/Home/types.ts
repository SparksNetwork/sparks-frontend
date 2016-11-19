import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type HomeSources = Sources &
  {
    dom: DOMSource;
  };

export type HomeSinks = Sinks &
  {
    dom: Stream<VNode>
  };
