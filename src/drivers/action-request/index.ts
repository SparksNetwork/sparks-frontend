import { Stream } from 'most';
//import { create } from '@most/create';
//import hold from '@most/hold';
import { tryCatch, mapObjIndexed } from 'ramda';
import { async as asyncSubjectFactory } from 'most-subject';
import {
  Context,
  ActionResult,
  Repository,
  Params,
  DomainActionHandler,
  ContextCommandMap,
  DomainAction
} from '../../types/repository';

// Helper functions
function errorHandler(e: Error, repository: Repository, context: Context, params: Params): Error {
  console.error('makeDomainActionDriver: an error occured', e);
  console.warn('estra info: repository, context, params', repository, context, params);

  return e;
}

function isPromise(obj: any): boolean {
  return !!obj.then
}

function isError(obj: any) {
  return obj instanceof Error
}

function eventEmitterFactory(_: any, context: Context, __: any) {
  void context;

  return asyncSubjectFactory()
}

/**
 * Driver factory which takes a configuration object and returns a driver.
 * The returned driver will be handling action requests arriving on its input stream (sink) via:
 * - the context and command parameters of the action request are matched to a action handler
 * function
 * - that function is executed on incoming input from the sink and additional useful values
 *   + repository : enclose API allowing to use a specific data repository
 *   + context : passed back for reference to the callback function
 * @param repository
 * @param config
 * @returns {(sink$:Stream<DomainAction>)=>{getResponse: ((context:string)=>AsyncSubject<T>)}}
 */
export function makeDomainActionDriver(repository: Repository, config: ContextCommandMap) {
  // Create a subject for each context defined in config
  const eventEmitters = mapObjIndexed(eventEmitterFactory, config);

  return function (sink$: Stream<DomainAction>) {
    const source$ = sink$.map(function executeAction(action: DomainAction) {
      const { context, command, params } = action;
      const fnToExec: DomainActionHandler = config[context][command];
      const wrappedFn: DomainActionHandler = tryCatch(fnToExec, errorHandler);
      const actionResult: ActionResult = wrappedFn(repository, context, params);

      if (isPromise(actionResult)) {
        actionResult
          .then((result: any) => ({
            request: { repository, context, params },
            err: null,
            response: result
          }))
          .catch((e: Error) => ({
            request: { repository, context, params },
            err: e,
            response: null
          }))
          .then((actionReponse: any) => {
            eventEmitters[context].next(actionReponse);
          })
      }
      else {
        // not a promise, hence synchronously returned value or exception from tryCatch
        if (isError(actionResult)) {
          eventEmitters[context].error(actionResult)
        }
        else {
          eventEmitters[context].next({
            request: { repository, context, params },
            err: null,
            response: actionResult
          })
        }
      }
    });

    source$.drain();

    return {
      getResponse: function getResponse(context: string) {
        return eventEmitters[context]
      }
    };
  }
}
