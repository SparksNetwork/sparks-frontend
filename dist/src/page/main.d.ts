import { AuthSource, AuthSink, FirebaseSource, QueueSink } from '../driver/cyclic-fire';
import { Stream } from 'most';
import { VNode, DOMSource } from '@motorcycle/dom';
import { RouterSource } from 'cyclic-router/lib/RouterSource';
export declare type MainSinks = {
    DOM: Stream<VNode>;
    router: Stream<string>;
    auth$: AuthSink;
    queue$: QueueSink;
};
export declare type MainSources = {
    DOM: DOMSource;
    router: RouterSource;
    auth$: AuthSource;
    firebase: FirebaseSource;
};
export declare function main(sources: MainSources): {
    DOM: Stream<VNode>;
    router: Stream<string>;
    auth$: Stream<{
        type: "popup" | "redirect" | "logout";
        provider: string;
    }>;
    queue$: Stream<any>;
};
