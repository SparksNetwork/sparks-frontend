export interface RouteDefinitions {
  [pathname: string]: any;
}

export default function switchPath(path: string, routes: RouteDefinitions): { path: string, value: any };

