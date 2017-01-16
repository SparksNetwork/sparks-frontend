export type Context = string;
export type ActionResult = any;
export type Repository = any;
export type Params = any;
export interface DomainActionHandler {
  (repository: Repository, context: Context, params: Params): any;
}
export interface CommandMap {
  [command: string]: DomainActionHandler;
}
export interface ContextCommandMap {
  [context: string]: CommandMap;
}
export interface DomainAction {
  context: Context;
  command: string;
  params: Params;
}
export interface QueryHandler {
  (repository: Repository, context: Context, params: Params): any;
}
export interface ContextMap {
  [context: string]: QueryHandler;
}
export interface HashMap<T> {
  [context: string]: T;
}
