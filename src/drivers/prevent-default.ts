import { Stream, never } from 'most';

export function preventDefault(input: Stream<Event>) {
  input.observe(ev => ev.preventDefault());

  return never();
}
