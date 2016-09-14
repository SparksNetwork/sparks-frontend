import { Stream } from 'most';

export type Sources = {
  [name: string]: any;
}

export type Sinks = {
  [name: string]: (...args: any[]) => Stream<any> | Stream<any>;
}

export type Component = (sources: Sources) => Sinks;
  