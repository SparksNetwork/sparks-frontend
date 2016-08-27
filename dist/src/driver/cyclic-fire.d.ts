import { Stream } from 'most';
import firebase = require('firebase');
export declare const POPUP: string;
export declare const REDIRECT: string;
export declare const LOGOUT: string;
export declare type Action = 'popup' | 'redirect' | 'logout';
export declare type AuthInput = {
    type: Action;
    provider: string;
};
export declare type FirebaseSource = (...args) => Stream<{
    key: string;
    value: any;
}>;
export declare type QueueSink = Stream<any>;
export declare type AuthSource = Stream<firebase.User>;
export declare type AuthSink = Stream<AuthInput>;
export declare function makeAuthDriver(firebase: any): (input$: Stream<{
    type: "popup" | "redirect" | "logout";
    provider: string;
}>) => Stream<{
    credential: firebase.auth.AuthCredential | null;
    user: firebase.User | null;
}>;
export declare const makeFirebaseDriver: (ref: firebase.database.Reference) => () => (...args: any[]) => any;
export declare function makeQueueDriver(ref: firebase.database.Reference, src?: string, dest?: string): (sink$: Stream<any>) => (listenerKey: string) => Stream<{
    key: any;
    value: any;
}>;
