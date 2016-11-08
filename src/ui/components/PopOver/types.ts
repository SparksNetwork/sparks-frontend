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
    props$: Stream<PopOverProps>
  };

export type PopOverProps =
  {
    id?: string;
    message: string
  };

export type PopOverModel =
  {
    id: string;
    message: string;
  };
