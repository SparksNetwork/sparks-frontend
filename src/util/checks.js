/// <reference path="../../typings/index.d.ts" />
"use strict";
var ramda_1 = require('ramda');
var $ = require('most');
// import {isEmpty} from './most/isEmpty'
var IsEmptySink = function IsEmptySink(sink) {
    this.sink = sink;
    this.isEmpty = true;
};
IsEmptySink.prototype.event = function event(t, x) {
    this.isEmpty = false;
    this.sink.event(t, false);
    this.sink.end(t, x);
};
IsEmptySink.prototype.error = function error(t, e) {
    this.sink.error(t, e);
};
IsEmptySink.prototype.end = function end(t, x) {
    if (this.isEmpty) {
        this.sink.event(t, true);
        this.sink.end(t, x);
    }
};
var IsEmpty = function IsEmpty(source) {
    this.source = source;
};
IsEmpty.prototype.run = function run(sink, scheduler) {
    return this.source.run(new IsEmptySink(sink), scheduler);
};
var isEmpty = function (stream) {
    return new stream.constructor(new IsEmpty(stream.source));
};
var mapIndexed = ramda_1.addIndex(ramda_1.map);
function assertSignature(fnName, _arguments, vRules) {
    var argNames = ramda_1.flatten(ramda_1.map(ramda_1.keys, vRules));
    var ruleFns = ramda_1.flatten(ramda_1.map(function (vRule) {
        return ramda_1.values(vRule)[0];
    }, vRules));
    var args = mapIndexed(function (vRule, index) {
        return _arguments[index];
    }, vRules);
    var validatedArgs = mapIndexed(function (value, index) {
        var ruleFn = ruleFns[index];
        return ruleFn(value);
    }, args);
    var hasFailed = ramda_1.reduce(function (acc, value) {
        return isFalse(value) || acc;
    }, false, validatedArgs);
    if (hasFailed) {
        var validationMessages = mapIndexed(function (errorMessageOrBool, index) {
            return isTrue(errorMessageOrBool) ?
                '' :
                [
                    // `${fnName}: argument ${argNames[index]} fails rule
                    // ${vRules[index].name}`, // cant find a way to do it typescript
                    (fnName + ": argument " + argNames[index] + " fails validation rule}"),
                    isBoolean(errorMessageOrBool) ? '' : errorMessageOrBool
                ].join(': ');
        }, validatedArgs).join('\n');
        var errorMessage = ['assertSignature:', validationMessages].join(' ');
        throw errorMessage;
    }
    return !hasFailed;
}
exports.assertSignature = assertSignature;
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
function assertContract(contractFn, contractArgs, errorMessage) {
    var boolOrError = contractFn.apply(null, contractArgs);
    var isPredicateSatisfied = isBoolean(boolOrError);
    if (!isPredicateSatisfied) {
        throw "assertContract: fails contract " + contractFn.name + "\n" + errorMessage + "\n " + boolOrError;
    }
    return true;
}
exports.assertContract = assertContract;
function checkSignature(obj, signature, signatureErrorMessages, isStrict) {
    var arrMessages = [];
    var strict = defaultsTo(isStrict, false);
    // Check that object properties in the signature match it
    ramda_1.mapObjIndexed(function (predicate, property) {
        if (!(predicate(obj[property]))) {
            arrMessages.push(signatureErrorMessages[property]);
        }
    }, signature);
    // Check that object properties are all in the signature if strict is set
    if (strict) {
        ramda_1.mapObjIndexed(function (value, property) {
            if (!(property in signature)) {
                arrMessages.push("Object cannot contain a property called " + property);
            }
        }, obj);
    }
    return arrMessages.join("").length === 0 ? true : arrMessages;
}
exports.checkSignature = checkSignature;
function unfoldObjOverload(obj, overloads) {
    var result = { _index: 0 };
    var index = 0;
    overloads.some(function (overload) {
        // can only be one property
        var property = ramda_1.keys(overload)[0];
        var predicate = ramda_1.values(overload)[0];
        var predicateEval = predicate(obj);
        if (predicateEval) {
            result[property] = obj;
            result._index = index;
        }
        index++;
        return predicateEval;
    });
    return result;
}
exports.unfoldObjOverload = unfoldObjOverload;
function defaultsTo(obj, defaultsTo) {
    return !obj ? defaultsTo : obj;
}
exports.defaultsTo = defaultsTo;
/**
 * Returns true iff the parameter is a boolean whose value is false.
 * This hence does both type checking and value checking
 * @param obj
 * @returns {boolean}
 */
function isFalse(obj) {
    return isBoolean(obj) ? !obj : false;
}
/**
 * Returns true iff the parameter is a boolean whose value is false.
 * This hence does both type checking and value checking
 * @param obj
 * @returns {boolean}
 */
function isTrue(obj) {
    return isBoolean(obj) ? obj : false;
}
function isMergeSinkFn(obj) {
    return isFunction(obj);
}
exports.isMergeSinkFn = isMergeSinkFn;
/**
 * Returns true iff the passed parameter is null or undefined OR a POJO
 * @param {Object} obj
 * @returns {boolean}
 */
function isNullableObject(obj) {
    // Note that `==` is used instead of `===`
    // This allows to test for `undefined` and `null` at the same time
    return obj == null || typeof obj === 'object';
}
exports.isNullableObject = isNullableObject;
/**
 *
 * @param obj
 * @returns {SignatureCheck}
 */
function isNullableComponentDef(obj) {
    // Note that `==` is used instead of `===`
    // This allows to test for `undefined` and `null` at the same time
    return ramda_1.isNil(obj) || checkSignature(obj, {
        makeLocalSources: ramda_1.either(ramda_1.isNil, isFunction),
        makeLocalSettings: ramda_1.either(ramda_1.isNil, isFunction),
        makeOwnSinks: ramda_1.either(ramda_1.isNil, isFunction),
        mergeSinks: function (mergeSinks) {
            if (obj.computeSinks) {
                return !mergeSinks;
            }
            else {
                return ramda_1.either(ramda_1.isNil, ramda_1.either(isObject, isFunction))(mergeSinks);
            }
        },
        computeSinks: ramda_1.either(ramda_1.isNil, isFunction),
        sinksContract: ramda_1.either(ramda_1.isNil, isFunction)
    }, {
        makeLocalSources: 'makeLocalSources must be undefined or a function',
        makeLocalSettings: 'makeLocalSettings must be undefined or a' +
            ' function',
        makeOwnSinks: 'makeOwnSinks must be undefined or a function',
        mergeSinks: 'mergeSinks can only be defined when `computeSinks` is' +
            ' not, and when so, it must be undefined, an object or a function',
        computeSinks: 'computeSinks must be undefined or a function',
        sinksContract: 'sinksContract must be undefined or a function'
    }, true);
}
exports.isNullableComponentDef = isNullableComponentDef;
function isUndefined(obj) {
    return typeof obj === 'undefined';
}
exports.isUndefined = isUndefined;
function isFunction(obj) {
    return typeof (obj) === 'function';
}
exports.isFunction = isFunction;
function isObject(obj) {
    return typeof (obj) == 'object';
}
exports.isObject = isObject;
function isBoolean(obj) {
    return typeof (obj) == 'boolean';
}
exports.isBoolean = isBoolean;
function isString(obj) {
    return typeof (obj) == 'string';
}
exports.isString = isString;
function isArray(obj) {
    return Array.isArray(obj);
}
exports.isArray = isArray;
/**
 * Returns a function which returns true if its parameter is an array,
 * and each element of the array satisfies a given predicate
 * @param {function(*):Boolean} predicateFn
 * @returns {function():Boolean}
 */
function isArrayOf(predicateFn) {
    if (typeof predicateFn !== 'function') {
        console.error('isArrayOf: predicateFn is not a function!!');
        return ramda_1.always(false);
    }
    return function _isArrayOf(obj) {
        if (!Array.isArray(obj)) {
            return false;
        }
        return ramda_1.all(predicateFn, obj);
    };
}
exports.isArrayOf = isArrayOf;
function isVNode(obj) {
    return ["children", "data", "elm", "key", "sel", "text"]
        .every(function (prop) { return prop in obj; });
}
exports.isVNode = isVNode;
/**
 * Returns true iff the parameter `obj` represents a component.
 * @param obj
 * @returns {boolean}
 */
function isComponent(obj) {
    // Without a type system, we just test that it is a function
    return isFunction(obj);
}
exports.isComponent = isComponent;
function isObservable(obj) {
    // duck typing in the absence of a type system
    return isFunction(obj.subscribe);
}
exports.isObservable = isObservable;
function isSource(obj) {
    return isObservable(obj);
}
exports.isSource = isSource;
function isSources(obj) {
    // We check the minimal contract which is not to be nil
    // In `cycle`, sources can have both regular
    // objects and observables (sign that the design could be improved).
    // Regular objects are injected dependencies (DOM, router?) which
    // are initialized in the drivers, and should be separated from
    // `sources`. `sources` could then have an homogeneous type which
    // could be checked properly
    return !ramda_1.isNil(obj);
}
function isOptSinks(obj) {
    // obj can be null
    return !obj || ramda_1.all(ramda_1.either(ramda_1.isNil, isObservable), ramda_1.values(obj));
}
exports.isOptSinks = isOptSinks;
function isArrayOptSinks(arrSinks) {
    return ramda_1.all(isOptSinks, arrSinks);
}
exports.isArrayOptSinks = isArrayOptSinks;
function assertSourcesContracts(sources, sourcesContract) {
    // Check sources contracts
    assertContract(isSources, [sources], 'm : `sources` parameter is invalid');
    assertContract(sourcesContract, [sources], 'm: `sources`' +
        ' parameter fails contract ' + sourcesContract.name);
}
exports.assertSourcesContracts = assertSourcesContracts;
function assertSinksContracts(sinks, sinksContract) {
    assertContract(isOptSinks, [sinks], 'mergeSinks must return a hash of observable sink');
    assertContract(sinksContract, [sinks], 'fails custom contract ' + sinksContract.name);
}
exports.assertSinksContracts = assertSinksContracts;
function assertSettingsContracts(mergedSettings, settingsContract) {
    // Check settings contracts
    assertContract(settingsContract, [mergedSettings], 'm: `settings`' +
        ' parameter fails contract ' + settingsContract.name);
}
exports.assertSettingsContracts = assertSettingsContracts;
/**
 * Adds `tap` logging/tracing information to all sinks
 * @param {Sinks} sinks
 * @param {Settings} settings Settings with which the parent component is
 * called
 * @returns {*}
 */
function trace(sinks, settings) {
    // TODO BRC
    return sinks;
}
exports.trace = trace;
function removeNullsFromArray(arr) {
    return ramda_1.reject(ramda_1.isNil, arr);
}
exports.removeNullsFromArray = removeNullsFromArray;
function removeEmptyVNodes(arrVNode) {
    return ramda_1.reduce(function (accNonEmptyVNodes, vNode) {
        return (isNullVNode(vNode)) ?
            accNonEmptyVNodes :
            (accNonEmptyVNodes.push(vNode), accNonEmptyVNodes);
    }, [], arrVNode);
}
exports.removeEmptyVNodes = removeEmptyVNodes;
function isNullVNode(vNode) {
    return ramda_1.equals(vNode.children, []) &&
        ramda_1.equals(vNode.data, {}) &&
        isUndefined(vNode.elm) &&
        isUndefined(vNode.key) &&
        isUndefined(vNode.sel) &&
        isUndefined(vNode.text);
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
function projectSinksOn(prop, obj) {
    return ramda_1.map(function (x) { return x ? x[prop] : null; }, obj);
}
exports.projectSinksOn = projectSinksOn;
/**
 * Returns an array with the set of sink names extracted from an array of
 * sinks. The ordering of those names should not be relied on.
 * For instance:
 * - [{DOM, auth},{DOM, route}]
 * results in ['DOM','auth','route']
 * @param {Array<Sinks>} aSinks
 * @returns {Array<String>}
 */
function getSinkNamesFromSinksArray(aSinks) {
    return ramda_1.uniq(ramda_1.flatten(ramda_1.map(getValidKeys, aSinks)));
}
exports.getSinkNamesFromSinksArray = getSinkNamesFromSinksArray;
function getValidKeys(obj) {
    var validKeys = [];
    ramda_1.mapObjIndexed(function (value, key) {
        if (value != null) {
            validKeys.push(key);
        }
    }, obj);
    return validKeys;
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
function emitNullIfEmpty(sink) {
    return ramda_1.isNil(sink) ?
        null :
        $.merge(sink, 
        // TODO TYS : recreate Rx.Obs.isEmpty in most
        // https://github.com/Reactive-Extensions/RxJS/blob/master/src/core/linq/observable/isempty.js
        // https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/core/operators/isempty.md
        // see also tests
        // https://github.com/Reactive-Extensions/RxJS/blob/master/tests/observable/isempty.js
        isEmpty(sink).filter(function (x) { return x; }).map(function (x) { return null; }));
}
exports.emitNullIfEmpty = emitNullIfEmpty;
function makeDivVNode(x) {
    return {
        "children": undefined,
        "data": {},
        "elm": undefined,
        "key": undefined,
        "sel": "div",
        "text": x
    };
}
exports.makeDivVNode = makeDivVNode;
