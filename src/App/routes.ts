import { RouteDefinitions } from '@motorcycle/router';
import { fromPromise } from 'most';

declare const System: any;

export const routes: RouteDefinitions =
  {
    '/': loadRoute(System.import('screens/Home'), 'Home'),
  };

function loadRoute(promise: any, componentName: string) {
  return function callingRoute(sources: any) {
    return fromPromise(promise)
      .map((module: any) => module[componentName](sources));
  };
}