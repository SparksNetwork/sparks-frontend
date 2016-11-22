import { Stream, switchLatest, map } from 'most';

export function switchMap<A, B>(f: (a: A) => Stream<B>, stream: Stream<A>): Stream<B> {
  return switchLatest(map(f, stream));
}