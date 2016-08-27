import { Module, VNode, VNodeData } from '@motorcycle/dom';
export interface PolyglotVNodeData extends VNodeData {
    polyglot: any;
}
export interface PolyglotVNode extends VNode {
    data: PolyglotVNodeData;
}
export declare function makePolyglotModule(translations: any): Module;
