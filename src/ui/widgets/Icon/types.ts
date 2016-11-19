import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type IconSinks = Sinks &
  {
    dom: Stream<VNode>;
  };

export type IconSources = Sources &
  {
    dom: DOMSource;
    props$: Stream<IconProps>;
  };

export type IconProps =
  {
    src?: string;
    icon?: string;
  }

export type IconModel = {
  child: VNode;
};
