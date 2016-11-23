import { Stream, map } from 'most';
import { RouteDefinitions, RouterSources, DefineReturn } from '@motorcycle/router';

export function Router<Sources, Sinks>(
  definitions: RouteDefinitions,
  sources: RouterSources<Sources>): Stream<Sinks>
{
  const component$: Stream<DefineReturn> =
    sources.router.define(definitions);

  const sinks$: Stream<Sinks> =
    map(callComponent<RouterSources<Sources>, Sinks>(sources), component$);

  return sinks$;
}

function callComponent<Sources, Sinks>(sources: RouterSources<Sources>) {
  return function ({ path, value }: DefineReturn): Sinks {
    return value({ ...sources as any, router: sources.router.path(path as string) });
  };
}
