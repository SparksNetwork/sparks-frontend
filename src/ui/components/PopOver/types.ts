import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';

export type PopOverSinks =
  Sinks &
  {
    DOM: Stream<VNode>;
  };

export type PopOverSources =
  Sources &
  {
    DOM: DOMSource;
  };
