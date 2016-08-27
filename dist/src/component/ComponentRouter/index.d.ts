/// <reference path="../../../typings/index.d.ts" />
import { Stream } from 'most';
import { VNode } from '@motorcycle/dom';
import { RouteDefinitions } from 'cyclic-router/lib/interfaces';
import { Pathname } from '@cycle/history/lib/interfaces';
export declare type ComponentRouterSources = {
    DOM: any;
    router: any;
    routes$: Stream<RouteDefinitions>;
};
export declare type ComponentRouterSinks = {
    DOM: Stream<VNode>;
    route$: Stream<Pathname>;
    pluck: (sink: string) => any;
};
declare var _default: (sources: {
    DOM: any;
    router: any;
    routes$: Stream<RouteDefinitions>;
}) => {
    DOM: Stream<VNode>;
    route$: Stream<string>;
    pluck: (sink: string) => any;
};
export default _default;
