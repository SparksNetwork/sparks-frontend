import { Stream, Sink, Scheduler, Disposable } from 'most';

export function mockStream<T>() {
  let callCount = 0;

  return {
    stream: new Stream<T>({
      run(sink: Sink<T>, scheduler: Scheduler) {
        Function.prototype(sink, scheduler);

        ++callCount;

        return { dispose: Function.prototype } as Disposable<T>;
      },
    }),

    callCount() { return callCount; },
  };
}
