import {
  mapObjIndexed, flatten, keys, always, reject, isNil, uniq, allPass, pipe, reduce, all, either,
  map, values, equals, addIndex, flip, difference, isEmpty, where, both, curry, defaultTo
} from 'ramda';
import { ERROR_MESSAGE_PREFIX } from '../components/properties';
import { merge as mergeM } from 'most';

const mapIndexed = addIndex(map);

// Type checking typings
/**
 * @typedef {String} ErrorMessage
 */
/**
 * @typedef {Boolean|Array<ErrorMessage>} SignatureCheck
 * Note : The booleam can only be true
 */

// Component typings
/**
 * @typedef {String} SourceName
 */
/**
 * @typedef {String} SinkName
 */
/**
 * @typedef {Observable} Source
 */
/**
 * @typedef {Observable|Null} Sink
 */
/**
 * @typedef {Object.<string, Source>} Sources
 */
/**
 * @typedef {Object.<string, Sink>} Sinks
 */
/**
 * @typedef {?Object.<string, ?Object>} Settings
 */
/**
 * @typedef {function(Sink, Array<Sink>, Settings):Sink} mergeSink
 */
/**
 * @typedef {Object} DetailedComponentDef
 * @property {?function(Sources, Settings)} makeLocalSources
 * @property {?function(Settings)} makeLocalSettings
 * @property {?function(Sources, Settings):Sinks} makeOwnSinks
 * @property {Object.<SinkName, mergeSink> | function} mergeSinks
 * @property {function(Sinks):Boolean} sinksContract
 * @property {function(Sources):Boolean} sourcesContract
 */
/**
 * @typedef {Object} ShortComponentDef
 * @property {?function(Sources, Settings)} makeLocalSources
 * @property {?function(Settings)} makeLocalSettings
 * @property {?function(Sources, Settings):Sinks} makeOwnSinks
 * @property {function(Component, Array<Component>, Sources, Settings)}
 * computeSinks
 * @property {function(Sinks):Boolean} sinksContract
 * @property {function(Sources):Boolean} sourcesContract
 */
/**
 * @typedef {function(Sources, Settings):Sinks} Component
 */

///////
// Helpers

/**
 * Throws an exception if the arguments parameter fails at least one
 * validation rule
 * Note that all arguments are mandatory, i.e. the function does not deal with
 * optional arguments
 * @param {String} fnName
 * @param {Array<*>} _arguments
 * @param {[Array<Object.<string, Predicate|PredicateWithError>>]} vRules
 * Validation rules.
 *
 * Given f(x, y) =  x + y, with x both int, in the body of `f`, include
 * function f(x, y) {
   *   assertSignature ('f', arguments, [{x:isInteger},{y:isInteger}],
   *                  'one of the parameters is not an integer!')
   *   ...
   * }
 */
function assertSignature(fnName: any, _arguments: any, vRules: any) {
  const argNames = flatten(map(keys, vRules))
  const ruleFns = flatten(map(function (vRule) {
    return values(vRule)[0]
  }, vRules));

  const args = mapIndexed(function (vRule: any, index) {
    void vRule;
    return _arguments[index]
  }, vRules);

  const validatedArgs = mapIndexed((value, index) => {
    const ruleFn: any = ruleFns[index]
    return ruleFn(value)
  }, args);

  const hasFailed = reduce((acc, value) => {
    return isFalse(value) || acc
  }, false, validatedArgs);

  if (hasFailed) {
    const validationMessages = mapIndexed((errorMessageOrBool, index) => {
        return isTrue(errorMessageOrBool) ?
          '' :
          [
            `${fnName}: argument ${argNames[index]} fails rule ${vRules[index].name}`,
            isBoolean(errorMessageOrBool) ? '' : errorMessageOrBool
          ].join(': ')
      }, validatedArgs
    ).join('\n');

    const errorMessage = ['assertSignature:', validationMessages].join(' ');
    throw errorMessage
  }

  return !hasFailed
}

/**
 * Test against a predicate, and throws an exception if the predicate
 * is not satisfied
 * @param {function(*): (Boolean|String)} contractFn Predicate that must be
 * satisfy. Returns true if predicate is satisfied, otherwise return a
 * string to report about the predicate failure
 * @param {Array<*>} contractArgs
 * @param {String} errorMessage
 * @returns {Boolean}
 * @throws
 */
function assertContract(contractFn: any, contractArgs: any, errorMessage: any) {
  const boolOrError = contractFn.apply(null, contractArgs);
  const isPredicateSatisfied = isBoolean(boolOrError) && boolOrError;

  if (!isPredicateSatisfied) {
    throw `assertContract: fails contract ${contractFn.name}\n${errorMessage}\n ${boolOrError}`
  }
  return true
}

/**
 * Returns:
 * - `true` if the object passed as parameter passes all the predicates on
 * its properties
 * - an array with the concatenated error messages otherwise
 * @param obj
 * @param {Object.<string, Predicate>} signature
 * @param {Object.<string, string>} signatureErrorMessages
 * @param {Boolean=false} isStrict When `true` signals that the object
 * should not have properties other than the ones checked for
 * @returns {Boolean | Array<String>}
 */
function checkSignature(obj: any, signature: any, signatureErrorMessages: any, isStrict: any) {
  let arrMessages = [] as any;
  let strict = !!isStrict;

  // Check that object properties in the signature match it
  mapObjIndexed((predicate: any, property) => {
    if (!predicate(obj[property])) {
      arrMessages.push(signatureErrorMessages[property])
    }
  }, signature);

  // Check that object properties are all in the signature if strict is set
  if (strict) {
    mapObjIndexed((value: any, property) => {
      void value;
      if (!(property in signature)) {
        arrMessages.push(`Object cannot contain a property called ${property}`)
      }
    }, obj)
  }

  return isEmpty(arrMessages) ? true : arrMessages
}

/**
 * Returns an object whose keys :
 * - the first key found in `obj` for which the matching predicate was
 * fulfilled. Predicates are tested in order of indexing of the array.
 * - `_index` the index in the array where a predicate was fulfilled if
 * any, undefined otherwise
 * Ex : unfoldObjOverload('DOM', {sourceName: isString, predicate:
    * isPredicate})
 * Result : {sourceName : 'DOM'}
 * @param obj
 * @param {Array<Object.<string, Predicate>>} overloads
 * @returns {{}}
 */
function unfoldObjOverload(obj: any, overloads: any) {
  let result = {} as any;
  let index = 0;

  overloads.some((overload: any) => {
    // can only be one property
    const property = keys(overload)[0];
    const predicate: any = values(overload)[0];
    const predicateEval = predicate(obj);

    if (predicateEval) {
      result[property] = obj;
      result._index = index
    }
    index++;

    return predicateEval
  });
  return result
}

/**
 * Returns true iff the parameter is a boolean whose value is false.
 * This hence does both type checking and value checking
 * @param obj
 * @returns {boolean}
 */
function isFalse(obj: any) {
  return isBoolean(obj) ? !obj : false
}

/**
 * Returns true iff the parameter is a boolean whose value is false.
 * This hence does both type checking and value checking
 * @param obj
 * @returns {boolean}
 */
function isTrue(obj: any) {
  return isBoolean(obj) ? obj : false
}

function isMergeSinkFn(obj: any) {
  return isFunction(obj)
}

/**
 * Returns true iff the passed parameter is null or undefined OR a POJO
 * @param {Object} obj
 * @returns {boolean}
 */
function isNullableObject(obj: any) {
  // Note that `==` is used instead of `===`
  // This allows to test for `undefined` and `null` at the same time
  return obj == null || typeof obj === 'object'
}

/**
 *
 * @param obj
 * @returns {SignatureCheck}
 */
function isNullableComponentDef(obj: any) {
  // Note that `==` is used instead of `===`
  // This allows to test for `undefined` and `null` at the same time

  return isNil(obj) || checkSignature(obj, {
      makeLocalSources: either(isNil, isFunction),
      makeLocalSettings: either(isNil, isFunction),
      makeOwnSinks: either(isNil, isFunction),
      mergeSinks: (mergeSinks: any) => {
        if (obj.computeSinks) {
          return !mergeSinks
        }
        else {
          return either(isNil, either(isObject, isFunction))(mergeSinks)
        }
      },
      computeSinks: either(isNil, isFunction),
      sinksContract: either(isNil, isFunction)
    }, {
      makeLocalSources: 'makeLocalSources must be undefined or a function',
      makeLocalSettings: 'makeLocalSettings must be undefined or a' +
      ' function',
      makeOwnSinks: 'makeOwnSinks must be undefined or a function',
      mergeSinks: 'mergeSinks can only be defined when `computeSinks` is' +
      ' not, and when so, it must be undefined, an object or a function',
      computeSinks: 'computeSinks must be undefined or a function',
      sinksContract: 'sinksContract must be undefined or a function'
    }, true)
}

function isUndefined(obj: any) {
  return typeof obj === 'undefined'
}

function isFunction(obj: any) {
  return typeof(obj) === 'function'
}

function isObject(obj: any) {
  return typeof(obj) == 'object'
}

function isBoolean(obj: any) {
  return typeof(obj) == 'boolean'
}

function isString(obj: any) {
  return typeof(obj) == 'string'
}

function isArray(obj: any) {
  return Array.isArray(obj)
}

function isEmptyArray(obj: any) {
  return allPass([isEmpty, isArray])(obj);
}

/**
 * Returns a function which returns true if its parameter is an array,
 * and each element of the array satisfies a given predicate
 * @param {function(*):Boolean} predicateFn
 * @returns {function():Boolean}
 */
function isArrayOf(predicateFn: any) {
  // TODO : should I throw instead of returning false?? I think I should
  if (typeof predicateFn !== 'function') {
    console.error('isArrayOf: predicateFn is not a function!!');
    return always(false)
  }

  return function _isArrayOf(obj: any) {
    if (!Array.isArray(obj)) {
      return false
    }

    return all(predicateFn, obj)
  }
}

function isVNode(obj: any) {
  return ["children", "data", "elm", "key", "sel", "text"]
    .every(prop => prop in obj)
}

/**
 *
 * @param {Predicate} predicateKey
 * @param {Predicate} predicateValue
 * @returns {Predicate}
 * @throws when either predicate is not a function
 */
function isHashMap(predicateKey: any, predicateValue: any) {
  assertContract(isFunction, [predicateKey], 'isHashMap : first argument must be a' +
    ' predicate function!');
  assertContract(isFunction, [predicateValue], 'isHashMap : second argument must be a' +
    ' predicate function!');

  return both(
    pipe(keys, all(predicateKey)),
    pipe(values, all(predicateValue))
  );
}

/**
 * check that an object :
 * - does not have any extra properties than the expected ones (strictness)
 * - that its properties follow the defined specs
 * Note that if a property is optional, the spec must include that case
 * @param {Object.<String, Predicate>} recordSpec
 * @returns {Predicate}
 * @throws when recordSpec is not an object
 *
 * Example :
 * - isStrictRecordOf({a : isNumber, b : isString})({a:1, b:'2'}) -> true
 * - isStrictRecordOf({a : isNumber, b : isString})({a:1, b:'2', c:3}) -> false
 * - isStrictRecordOf({a : isNumber, b : isString})({a:1, b:2}) -> false
 */
function isStrictRecord(recordSpec: any) {
  assertContract(isObject, [recordSpec], 'isStrictRecord : record specification argument must be' +
    ' a valid object!');

  return allPass([
      // 1. no extra properties, i.e. all properties in obj are in recordSpec
      // return true if recordSpec.keys - obj.keys is empty
      pipe(keys, flip(difference)(keys(recordSpec)), isEmpty),
      // 2. the properties in recordSpec all pass their corresponding predicate
      // pipe(obj => mapR(key => recordSpec[key](obj[key]), keys(recordSpec)), all(identity)),
      where(recordSpec)
    ]
  )
}

/**
 * Returns true iff the parameter `obj` represents a component.
 * @param obj
 * @returns {boolean}
 */
function isComponent(obj: any) {
  // Without a type system, we just test that it is a function
  return isFunction(obj)
}

function isObservable(obj: any) {
  // duck typing in the absence of a type system
  return isFunction(obj.subscribe)
}

function isSource(obj: any) {
  return isObservable(obj)
}

function isSources(obj: any) {
  // We check the minimal contract which is not to be nil
  // In `cycle`, sources can have both regular
  // objects and observables (sign that the design could be improved).
  // Regular objects are injected dependencies (DOM, router?) which
  // are initialized in the drivers, and should be separated from
  // `sources`. `sources` could then have an homogeneous type which
  // could be checked properly
  return !isNil(obj)
}

function isOptSinks(obj: any) {
  // obj can be null
  return !obj || all(either(isNil, isObservable), values(obj))
}

function isArrayOptSinks(arrSinks: any) {
  return all(isOptSinks, arrSinks)
}

function assertSourcesContracts(sources: any, sourcesContract: any) {
  // Check sources contracts
  assertContract(isSources, [sources],
    'm : `sources` parameter is invalid');
  assertContract(sourcesContract, [sources], 'm: `sources`' +
    ' parameter fails contract ' + sourcesContract.name);
}

function assertSinksContracts(sinks: any, sinksContract: any) {
  assertContract(isOptSinks, [sinks],
    'mergeSinks must return a hash of observable sink');
  assertContract(sinksContract, [sinks],
    'fails custom contract ' + sinksContract.name);
}

function assertSettingsContracts(mergedSettings: any, settingsContract: any) {
  // Check settings contracts
  assertContract(settingsContract, [mergedSettings], 'm: `settings`' +
    ' parameter fails contract ' + settingsContract.name);
}

// from https://github.com/substack/deep-freeze/blob/master/index.js
function deepFreeze(o: any) {
  Object.freeze(o);

  Object.getOwnPropertyNames(o).forEach(function (prop) {
    if (o.hasOwnProperty(prop)
      && o[prop] !== null
      && (typeof o[prop] === "object" || typeof o[prop] === "function")
      && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });

  return o;
}

function makeErrorMessage(errorMessage: any) {
  return ERROR_MESSAGE_PREFIX + errorMessage;
}

/**
 * Adds `tap` logging/tracing information to all sinks
 * @param {Sinks} sinks
 * @param {Settings} settings Settings with which the parent component is
 * called
 * @returns {*}
 */
function trace(sinks: any, settings: any) {
  // NTH: some actual tracing happening
  void settings;
  return sinks
}

function removeNullsFromArray(arr: any) {
  return reject(isNil, arr)
}

function removeEmptyVNodes(arrVNode: any) {
  return reduce((accNonEmptyVNodes: any, vNode) => {
    return (isNullVNode(vNode)) ?
      accNonEmptyVNodes :
      (accNonEmptyVNodes.push(vNode), accNonEmptyVNodes)
  }, [], arrVNode)
}

function isNullVNode(vNode: any) {
  return equals(vNode.children, []) &&
    equals(vNode.data, {}) &&
    isUndefined(vNode.elm) &&
    isUndefined(vNode.key) &&
    isUndefined(vNode.sel) &&
    isUndefined(vNode.text)
}

/**
 * For each element object of the array, returns the indicated property of
 * that object, if it exists, null otherwise.
 * For instance, `projectSinksOn('a', obj)` with obj :
 * - [{a: ..., b: ...}, {b:...}]
 * - result : [..., null]
 * @param {String} prop
 * @param {Array<*>} obj
 * @returns {Array<*>}
 */
function projectSinksOn(prop: any, obj: any) {
  return map((x: any) => x ? x[prop] : null, obj)
}

/**
 * Returns an array with the set of sink names extracted from an array of
 * sinks. The ordering of those names should not be relied on.
 * For instance:
 * - [{DOM, auth},{DOM, route}]
 * results in ['DOM','auth','route']
 * @param {Array<Sinks>} aSinks
 * @returns {Array<String>}
 */
function getSinkNamesFromSinksArray(aSinks: any) {
  return uniq(flatten(map(getValidKeys, aSinks)))
}

function getValidKeys(obj: any) {
  let validKeys = [] as any;
  mapObjIndexed((value, key) => {
    if (value != null) {
      validKeys.push(key)
    }
  }, obj);

  return validKeys
}

/**
 * Turns a sink which is empty into a sink which emits `Null`
 * This is necessary for use in combination with `combineLatest`
 * As a matter of fact, `combineLatest(obs1, obs2)` will block till both
 * observables emit at least one value. So if `obs2` is empty, it will
 * never emit anything
 * @param sink
 * @returns {Observable|*}
 */
function emitNullIfEmpty(sink: any) {
  return isNil(sink) ?
    null :
    mergeM(
      sink,
      sink.isEmpty().filter((x: any) => x).map((x: any) => void x, null)
    )
}

function makeDivVNode(x: any) {
  return {
    "children": undefined,
    "data": {},
    "elm": undefined,
    "key": undefined,
    "sel": "div",
    "text": x
  }
}

function _handleError(msg: any, e: any) {
  console.error(`${msg}`, e);
  throw e;
}

const handleError = curry(_handleError);

function preventDefault(e: any) {
  e.preventDefault();
}

//IE workaround for lack of function name property on Functions
//getFunctionName :: (* -> *) -> String
const getFunctionName = (r => (fn: Function) => {
  return fn.name || ((('' + fn).match(r) || [])[1] || 'Anonymous');
})(/^\s*function\s*([^\(]*)/i);

// cf.
// http://stackoverflow.com/questions/9479046/is-there-any-non-eval-way-to-create-a-function-with-a-runtime-determined-name
function NamedFunction(name: string, args: Array<string>, body: string, scope: any, values?: any) {
  if (typeof args == "string") {
    values = scope, scope = body, body = args, args = [];
  }
  if (!Array.isArray(scope) || !Array.isArray(values)) {
    if (typeof scope == "object") {
      var keys = Object.keys(scope);
      values = keys.map(function (p) {
        return scope[p];
      });
      scope = keys;
    }
    else {
      values = [];
      scope = [];
    }
  }
  return Function(scope, "function " + name + "(" + args.join(", ") + ") {\n" + body + "\n}\nreturn " + name + ";").apply(null, values);
}

// decorateWith(decoratingFn, fnToDecorate), where log :: fn -> fn such as both have same name
// and possibly throw exception if that make sense to decoratingFn
function decorateWithOne(decoratorSpec: { before: Function, after: Function, name?: string },
                         fnToDecorate: Function) {
  const fnToDecorateName = getFunctionName(fnToDecorate);

  return NamedFunction(fnToDecorateName, [], `
      const args = [].slice.call(arguments);
      const decoratingFn = makeFunctionDecorator(decoratorSpec);
      return decoratingFn(args, fnToDecorateName, fnToDecorate);
`,
    { makeFunctionDecorator, decoratorSpec, fnToDecorate, fnToDecorateName });
}

const decorateWith = curry(function decorateWith(decoratingFnsSpecs: Array<any>, fnToDecorate) {
  return decoratingFnsSpecs.reduce((acc, decoratingFn) => {
    return decorateWithOne(decoratingFn, acc)
  }, fnToDecorate)
});

/**
 * NOTE : incorrect declaration...
 * before(fnToDecorate, fnToDecorateName, args) or nil
 * after(fnToDecorate, fnToDecorateName, result) or nil
 * but not both nil
 * @returns {function(fnToDecorate: Function, fnToDecorateName:String, args:Array<*>)}
 */
function makeFunctionDecorator({ before, after, name }:{ before: Function, after: Function, name?: string }) {
  // we can have one of the two not specified, but if we have none, there is no decorator to make
  if ((typeof before !== 'function') && (typeof after !== 'function')) {
    throw `makeFunctionDecorator: you need to specify 'before' OR 'after' as decorating functions. 
    You passed falsy values for both!`
  }

  const decoratorFnName = defaultTo('anonymousDecorator', name) as string;

  // trick to get the same name for the returned function
  // cf.
  // http://stackoverflow.com/questions/9479046/is-there-any-non-eval-way-to-create-a-function-with-a-runtime-determined-name
  const obj = {
    [decoratorFnName](args: any, fnToDecorateName: string, fnToDecorate: Function) {
      before && before(args, fnToDecorateName, fnToDecorate);

      const result = fnToDecorate(...args);

      return after
        ? after(result, fnToDecorateName, fnToDecorate)
        : result;
    }
  };

  return obj[decoratorFnName];
}

const assertFunctionContractDecoratorSpecs = (fnContract: any) => ({
  before: (args: Array<any>, fnToDecorateName: string) => {
    const checkDomain = fnContract.checkDomain;
    const contractFnName = getFunctionName(checkDomain);
    const passed = checkDomain(...args);

    if (!isBoolean(passed) || (isBoolean(passed) && !passed)) {
      // contract is failed
      console.error(`assertFunctionContractDecorator: ${fnToDecorateName} fails contract ${contractFnName} \n
${isString(passed) ? passed : ''}`);
      throw `assertFunctionContractDecorator: ${fnToDecorateName} fails contract ${contractFnName}`
    }
  },
  after: (result: any, fnToDecorateName: string) => {
    const checkCodomain = fnContract.checkCodomain;
    const contractFnName = getFunctionName(checkCodomain);
    const passed = checkCodomain(result);

    if (!isBoolean(passed) || (isBoolean(passed) && !passed)) {
      // contract is failed
      console.error(`assertFunctionContractDecorator: ${fnToDecorateName} fails contract ${contractFnName} \n
${isString(passed) ? passed : ''}`);
      throw `assertFunctionContractDecorator: ${fnToDecorateName} fails contract ${contractFnName}`
    }

    return result;
  }
});

const logFnTrace = (title: string, paramSpecs: Array<string>) => ({
  before: (args: Array<any>, fnToDecorateName: string) =>
    console.info(`==> ${title.toUpperCase()} | ${fnToDecorateName}(${paramSpecs.join(', ')}): `, args),
  after: (result: any, fnToDecorateName: string) => {
    console.info(`<== ${title.toUpperCase()} | ${fnToDecorateName} <- `, result);
    return result
  },
});


export {
  makeDivVNode,
  handleError,
  assertSignature,
  assertContract,
  checkSignature,
  unfoldObjOverload,
  projectSinksOn,
  getSinkNamesFromSinksArray,
  removeNullsFromArray,
  removeEmptyVNodes,
  emitNullIfEmpty,
  isNullableObject,
  isNullableComponentDef,
  isHashMap,
  isStrictRecord,
  isComponent,
  isUndefined,
  isFunction,
  isVNode,
  isObject,
  isBoolean,
  isString,
  isArray,
  isEmptyArray,
  isArrayOf,
  isObservable,
  isSource,
  isOptSinks,
  isMergeSinkFn,
  isArrayOptSinks,
  assertSourcesContracts,
  assertSinksContracts,
  assertSettingsContracts,
  deepFreeze,
  makeErrorMessage,
  trace,
  preventDefault,
  getFunctionName,
  decorateWithOne,
  decorateWith,
  makeFunctionDecorator,
  assertFunctionContractDecoratorSpecs,
  logFnTrace
}
