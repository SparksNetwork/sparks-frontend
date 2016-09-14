import { Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';

export interface Sources {
  [name: string]: any;
}

export type Sink = Stream<any> | ((...args: any[]) => Stream<any>);
export interface Sinks {
  [name: string]: Sink;
}

export interface Component {
  (sources: Sources): Sinks;
}

export interface DOMSources extends Sources {
  DOM: DOMSource;
}
export interface DOMSinks extends Sinks {
  DOM: Stream<VNode>;
}

export interface DOMComponent extends Component {
  (sources: DOMSources): DOMSinks;
}

