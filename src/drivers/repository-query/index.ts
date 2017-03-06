// import { create } from '@most/create';
import hold from '@most/hold';
import {
  Repository,
  ContextMap,
  Context,
  HashMap,
  Payload,
  QueryHandler
} from '../../types/repository';
import { Stream } from 'most';
import { tryCatch } from 'ramda';

// Helper functions
function errorHandler(e: Error, repository: Repository, context: Context, params: Payload): Error {
  console.error('makeDomainQueryDriver: an error occured', e);
  console.warn('estra info: repository, context, params', repository, context, params);

  return e;
}

/**
 * Driver factory which takes a configuration object and returns a driver.
 * This drivers runs live query on a repository fetching data about bounded contexts.
 * The configuration object maps a context to a function which receives some arguments
 * constituting a query and returns a stream of data matching that query.
 * @param repository
 * @param config
 * @returns {(sink:any)=>{query: ((context:Context, params:Params)=>Stream<any>)}}
 */
export function makeDomainQueryDriver(repository: Repository, config: ContextMap) {
  const queryCache: HashMap<HashMap<Stream<any>>> = {};

  function getCachedQuery(context: Context, params: Payload): Stream<any> {
    return queryCache && queryCache[context] && queryCache[context][JSON.stringify(params)]
  }

  function setCachedQuery(cachedValue: Stream<any>, context: Context, params: Payload) {
    queryCache[context] = queryCache[context] || {};
    queryCache[context][JSON.stringify(params)] = cachedValue;
  }

  return function (sink?: any) {
    // not used, this is a read-only driver
    void sink;

    // NOTE : If I dont cache, problem maybe with stream completion
    return {
      query: function query(context: Context, params: Payload) {
        const cachedQuery = getCachedQuery(context, params);

        if (cachedQuery) {
          return cachedQuery
        }
        else {
          const fnToExec: QueryHandler = config[context];
          const wrappedFn: QueryHandler = tryCatch(fnToExec, errorHandler);
          // NOTE : the query is a behavior (not an event), it must be memoized
          // It must also be multicasted as it it cached, hence can have multiple subscribers
          const liveQuery$: Stream<any> = wrappedFn(repository, context, params).thru(hold);
          setCachedQuery(liveQuery$, context, params);

          return liveQuery$;
        }
      }
    }
  }
}
