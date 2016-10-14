import { Sinks } from '../components/types';
import { Stream, never, just } from 'most';
import { curryN, prop } from 'ramda';

/* used to add good typings to curried functions */
interface PropOrNever {
  <SinkType>(sinkName: string, sinks: Sinks): Stream<SinkType>;
  <SinkType>(sinkName: string): (sinks: Sinks) => Stream<SinkType>;
}
export const propOrNever: PropOrNever = curryN(2, function mergeFlatten<T>(sinkName: string, sinks: Sinks): Stream<T> {
  const sink = prop(sinkName, sinks);

  return sink
    ? sink instanceof Stream ? sink : just(sink)
    : never();
}) as PropOrNever; // lets TS know for sure this matches the interface
