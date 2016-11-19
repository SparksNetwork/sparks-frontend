import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';

export type IconButtonSinks = Sinks &
  {
    dom: Stream<VNode>;
  };

export type IconButtonSources = Sources &
  {
    dom: DOMSource;
    props$: Stream<IconButtonProps>;
  };

export type IconButtonProps =
  {
    className?: string;
    src?: string;
    icon?: string;
  };

export type IconButtonModel =
  {
    className: string;
    icon: VNode;
  };
