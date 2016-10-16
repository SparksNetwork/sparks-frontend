import { Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';

export type Source<T> =
  Stream<T>
  | ((...args: any[]) => Stream<T>)
  | { [name: string]: Stream<T> | ((...args: any[]) => Stream<T>) | Source<T> }
  | any;

export interface Sources {
  [key: string]: Source<any>;
}

export type Sink<T> = Stream<T> | ((...args: any[]) => Stream<T>);

export interface Sinks {
  [name: string]: Sink<any>;
}

export interface Component<Sources, Sinks> {
  (sources: Sources): Sinks;
}

export type DOMComponent =
    Component<Sources & { DOM: DOMSource }, Sinks & { DOM: Stream<VNode> }>;
