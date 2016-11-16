import { Sources, Sinks } from '../../../components/types';
import { Stream } from 'most';
import { DOMSource, VNode } from '@motorcycle/dom';
import { AppHeaderModel } from '../';

export type AppSources = Sources &
  {
    dom: DOMSource;
  };

export type AppSinks = Sinks &
  {
    dom: Stream<VNode>;
    model$: Stream<AppModel>;
  };

export type AppModel =
  {
    appHeaderModel: AppHeaderModel;
  };
