import { Stream } from 'most';
import { VNode } from '@motorcycle/dom';
export declare type LoginSinks = {
    DOM: Stream<VNode>;
    route$: Stream<string>;
};
declare var _default: (sources: any) => {
    DOM: Stream<VNode>;
    route$: Stream<any>;
};
export default _default;
