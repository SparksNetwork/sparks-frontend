import { Stream, Source } from 'most';

let callCount = 0;
const run = function () {
  ++callCount;
  return { dispose: Function.prototype };
};

export function mockStream<T>() {
  const source = { run } as any as Source<T>;
  return { stream: new Stream<T>(source), callCount() { return callCount; } };
}
