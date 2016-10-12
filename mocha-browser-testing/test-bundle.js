/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:8080/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 160);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = Stream;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Stream (source) {
  this.source = source
}


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Disposable__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__SettableDisposable__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Promise__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__most_prelude__);
/* harmony export (immutable) */ exports["f"] = tryDispose;
/* harmony export (immutable) */ exports["a"] = create;
/* harmony export (immutable) */ exports["b"] = empty;
/* harmony export (immutable) */ exports["d"] = all;
/* unused harmony export promised */
/* harmony export (immutable) */ exports["c"] = settable;
/* harmony export (immutable) */ exports["e"] = once;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





var map = __WEBPACK_IMPORTED_MODULE_3__most_prelude__["map"]
var identity = __WEBPACK_IMPORTED_MODULE_3__most_prelude__["id"]

/**
 * Call disposable.dispose.  If it returns a promise, catch promise
 * error and forward it through the provided sink.
 * @param {number} t time
 * @param {{dispose: function}} disposable
 * @param {{error: function}} sink
 * @return {*} result of disposable.dispose
 */
function tryDispose (t, disposable, sink) {
  var result = disposeSafely(disposable)
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__Promise__["a" /* isPromise */])(result)
    ? result.catch(function (e) {
      sink.error(t, e)
    })
    : result
}

/**
 * Create a new Disposable which will dispose its underlying resource
 * at most once.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @return {Disposable}
 */
function create (dispose, data) {
  return once(new __WEBPACK_IMPORTED_MODULE_0__Disposable__["a" /* default */](dispose, data))
}

/**
 * Create a noop disposable. Can be used to satisfy a Disposable
 * requirement when no actual resource needs to be disposed.
 * @return {Disposable|exports|module.exports}
 */
function empty () {
  return new __WEBPACK_IMPORTED_MODULE_0__Disposable__["a" /* default */](identity, void 0)
}

/**
 * Create a disposable that will dispose all input disposables in parallel.
 * @param {Array<Disposable>} disposables
 * @return {Disposable}
 */
function all (disposables) {
  return create(disposeAll, disposables)
}

function disposeAll (disposables) {
  return Promise.all(map(disposeSafely, disposables))
}

function disposeSafely (disposable) {
  try {
    return disposable.dispose()
  } catch (e) {
    return Promise.reject(e)
  }
}

/**
 * Create a disposable from a promise for another disposable
 * @param {Promise<Disposable>} disposablePromise
 * @return {Disposable}
 */
function promised (disposablePromise) {
  return create(disposePromise, disposablePromise)
}

function disposePromise (disposablePromise) {
  return disposablePromise.then(disposeOne)
}

function disposeOne (disposable) {
  return disposable.dispose()
}

/**
 * Create a disposable proxy that allows its underlying disposable to
 * be set later.
 * @return {SettableDisposable}
 */
function settable () {
  return new __WEBPACK_IMPORTED_MODULE_1__SettableDisposable__["a" /* default */]()
}

/**
 * Wrap an existing disposable (which may not already have been once()d)
 * so that it will only dispose its underlying resource at most once.
 * @param {{ dispose: function() }} disposable
 * @return {Disposable} wrapped disposable
 */
function once (disposable) {
  return new __WEBPACK_IMPORTED_MODULE_0__Disposable__["a" /* default */](disposeMemoized, memoized(disposable))
}

function disposeMemoized (memoized) {
  if (!memoized.disposed) {
    memoized.disposed = true
    memoized.value = disposeSafely(memoized.disposable)
    memoized.disposable = void 0
  }

  return memoized.value
}

function memoized (disposable) {
  return { disposed: false, disposable: disposable, value: void 0 }
}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = Pipe;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * A sink mixin that simply forwards event, end, and error to
 * another sink.
 * @param sink
 * @constructor
 */
function Pipe (sink) {
  this.sink = sink
}

Pipe.prototype.event = function (t, x) {
  return this.sink.event(t, x)
}

Pipe.prototype.end = function (t, x) {
  return this.sink.end(t, x)
}

Pipe.prototype.error = function (t, e) {
  return this.sink.error(t, e)
}


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.mostPrelude = global.mostPrelude || {})));
}(this, (function (exports) { 'use strict';

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// Non-mutating array operations

// cons :: a -> [a] -> [a]
// a with x prepended
function cons (x, a) {
  var l = a.length
  var b = new Array(l + 1)
  b[0] = x
  for (var i = 0; i < l; ++i) {
    b[i + 1] = a[i]
  }
  return b
}

// append :: a -> [a] -> [a]
// a with x appended
function append (x, a) {
  var l = a.length
  var b = new Array(l + 1)
  for (var i = 0; i < l; ++i) {
    b[i] = a[i]
  }

  b[l] = x
  return b
}

// drop :: Int -> [a] -> [a]
// drop first n elements
function drop (n, a) { // eslint-disable-line complexity
  if (n < 0) {
    throw new TypeError('n must be >= 0')
  }

  var l = a.length
  if (n === 0 || l === 0) {
    return a
  }

  if (n >= l) {
    return []
  }

  return unsafeDrop(n, a, l - n)
}

// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop (n, a, l) {
  var b = new Array(l)
  for (var i = 0; i < l; ++i) {
    b[i] = a[n + i]
  }
  return b
}

// tail :: [a] -> [a]
// drop head element
function tail (a) {
  return drop(1, a)
}

// copy :: [a] -> [a]
// duplicate a (shallow duplication)
function copy (a) {
  var l = a.length
  var b = new Array(l)
  for (var i = 0; i < l; ++i) {
    b[i] = a[i]
  }
  return b
}

// map :: (a -> b) -> [a] -> [b]
// transform each element with f
function map (f, a) {
  var l = a.length
  var b = new Array(l)
  for (var i = 0; i < l; ++i) {
    b[i] = f(a[i])
  }
  return b
}

// reduce :: (a -> b -> a) -> a -> [b] -> a
// accumulate via left-fold
function reduce (f, z, a) {
  var r = z
  for (var i = 0, l = a.length; i < l; ++i) {
    r = f(r, a[i], i)
  }
  return r
}

// replace :: a -> Int -> [a]
// replace element at index
function replace (x, i, a) { // eslint-disable-line complexity
  if (i < 0) {
    throw new TypeError('i must be >= 0')
  }

  var l = a.length
  var b = new Array(l)
  for (var j = 0; j < l; ++j) {
    b[j] = i === j ? x : a[j]
  }
  return b
}

// remove :: Int -> [a] -> [a]
// remove element at index
function remove (i, a) {  // eslint-disable-line complexity
  if (i < 0) {
    throw new TypeError('i must be >= 0')
  }

  var l = a.length
  if (l === 0 || i >= l) { // exit early if index beyond end of array
    return a
  }

  if (l === 1) { // exit early if index in bounds and length === 1
    return []
  }

  return unsafeRemove(i, a, l - 1)
}

// unsafeRemove :: Int -> [a] -> Int -> [a]
// Internal helper to remove element at index
function unsafeRemove (i, a, l) {
  var b = new Array(l)
  var j
  for (j = 0; j < i; ++j) {
    b[j] = a[j]
  }
  for (j = i; j < l; ++j) {
    b[j] = a[j + 1]
  }

  return b
}

// removeAll :: (a -> boolean) -> [a] -> [a]
// remove all elements matching a predicate
function removeAll (f, a) {
  var l = a.length
  var b = new Array(l)
  var j = 0
  for (var x, i = 0; i < l; ++i) {
    x = a[i]
    if (!f(x)) {
      b[j] = x
      ++j
    }
  }

  b.length = j
  return b
}

// findIndex :: a -> [a] -> Int
// find index of x in a, from the left
function findIndex (x, a) {
  for (var i = 0, l = a.length; i < l; ++i) {
    if (x === a[i]) {
      return i
    }
  }
  return -1
}

// isArrayLike :: * -> boolean
// Return true iff x is array-like
function isArrayLike (x) {
  return x != null && typeof x.length === 'number' && typeof x !== 'function'
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */

// id :: a -> a
var id = function (x) { return x; }

// compose :: (b -> c) -> (a -> b) -> (a -> c)
var compose = function (f, g) { return function (x) { return f(g(x)); }; }

// apply :: (a -> b) -> a -> b
var apply = function (f, x) { return f(x); }

// curry2 :: ((a, b) -> c) -> (a -> b -> c)
function curry2 (f) {
  function curried (a, b) {
    switch (arguments.length) {
      case 0: return curried
      case 1: return function (b) { return f(a, b); }
      default: return f(a, b)
    }
  }
  return curried
}

// curry3 :: ((a, b, c) -> d) -> (a -> b -> c -> d)
function curry3 (f) {
  function curried (a, b, c) { // eslint-disable-line complexity
    switch (arguments.length) {
      case 0: return curried
      case 1: return curry2(function (b, c) { return f(a, b, c); })
      case 2: return function (c) { return f(a, b, c); }
      default:return f(a, b, c)
    }
  }
  return curried
}

exports.cons = cons;
exports.append = append;
exports.drop = drop;
exports.tail = tail;
exports.copy = copy;
exports.map = map;
exports.reduce = reduce;
exports.replace = replace;
exports.remove = remove;
exports.removeAll = removeAll;
exports.findIndex = findIndex;
exports.isArrayLike = isArrayLike;
exports.id = id;
exports.compose = compose;
exports.apply = apply;
exports.curry2 = curry2;
exports.curry3 = curry3;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=prelude.js.map


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__most_prelude__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__source_from__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__source_periodic__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_symbol_observable__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_symbol_observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__observable_subscribe__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__combinator_thru__ = __webpack_require__(109);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__source_fromEvent__ = __webpack_require__(130);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__combinator_observe__ = __webpack_require__(104);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__combinator_loop__ = __webpack_require__(102);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__combinator_accumulate__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__source_unfold__ = __webpack_require__(135);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__source_iterate__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__source_generate__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__combinator_build__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__combinator_transform__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__combinator_applicative__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__combinator_transduce__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__combinator_flatMap__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__combinator_continueWith__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__combinator_concatMap__ = __webpack_require__(97);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__combinator_mergeConcurrently__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__combinator_merge__ = __webpack_require__(103);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__combinator_combine__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__combinator_sample__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__combinator_zip__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__combinator_switch__ = __webpack_require__(108);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__combinator_filter__ = __webpack_require__(100);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__combinator_slice__ = __webpack_require__(107);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__ = __webpack_require__(110);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__combinator_delay__ = __webpack_require__(98);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__combinator_timestamp__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__combinator_limit__ = __webpack_require__(101);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__combinator_promises__ = __webpack_require__(105);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__combinator_errors__ = __webpack_require__(99);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__most_multicast__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__most_multicast___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_32__most_multicast__);
/* harmony reexport (binding) */ __webpack_require__.d(exports, "fromEvent", function() { return __WEBPACK_IMPORTED_MODULE_33__source_fromEvent__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "unfold", function() { return __WEBPACK_IMPORTED_MODULE_34__source_unfold__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "iterate", function() { return __WEBPACK_IMPORTED_MODULE_35__source_iterate__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "generate", function() { return __WEBPACK_IMPORTED_MODULE_36__source_generate__["a"]; });
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */








/**
 * Core stream type
 * @type {Stream}
 */
/* harmony reexport (binding) */ __webpack_require__.d(exports, "Stream", function() { return __WEBPACK_IMPORTED_MODULE_0__Stream__["a"]; });


// Add of and empty to constructor for fantasy-land compat
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].of = __WEBPACK_IMPORTED_MODULE_2__source_core__["a" /* of */]
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].empty = __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]
// Add from to constructor for ES Observable compat
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].from = __WEBPACK_IMPORTED_MODULE_3__source_from__["a" /* from */]
/* harmony reexport (binding) */ __webpack_require__.d(exports, "just", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "of", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "periodic", function() { return __WEBPACK_IMPORTED_MODULE_4__source_periodic__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "from", function() { return __WEBPACK_IMPORTED_MODULE_3__source_from__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "never", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "empty", function() { return __WEBPACK_IMPORTED_MODULE_2__source_core__["b"]; });


// -----------------------------------------------------------------------
// Draft ES Observable proposal interop
// https://github.com/zenparsing/es-observable



__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.subscribe = function (subscriber) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__observable_subscribe__["a" /* subscribe */])(subscriber, this)
}

__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype[__WEBPACK_IMPORTED_MODULE_5_symbol_observable___default.a] = function () {
  return this
}

// -----------------------------------------------------------------------
// Fluent adapter



/**
 * Adapt a functional stream transform to fluent style.
 * It applies f to the this stream object
 * @param  {function(s: Stream): Stream} f function that
 * receives the stream itself and must return a new stream
 * @return {Stream}
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.thru = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__combinator_thru__["a" /* thru */])(f, this)
}

// -----------------------------------------------------------------------
// Adapting other sources

/**
 * Create a stream of events from the supplied EventTarget or EventEmitter
 * @param {String} event event name
 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter. The source
 *  must support either addEventListener/removeEventListener (w3c EventTarget:
 *  http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-EventTarget),
 *  or addListener/removeListener (node EventEmitter: http://nodejs.org/api/events.html)
 * @returns {Stream} stream of events of the specified type from the source
 */


// -----------------------------------------------------------------------
// Observing



/* harmony reexport (binding) */ __webpack_require__.d(exports, "drain", function() { return __WEBPACK_IMPORTED_MODULE_8__combinator_observe__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "forEach", function() { return __WEBPACK_IMPORTED_MODULE_8__combinator_observe__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "observe", function() { return __WEBPACK_IMPORTED_MODULE_8__combinator_observe__["b"]; });


/**
 * Process all the events in the stream
 * @returns {Promise} promise that fulfills when the stream ends, or rejects
 *  if the stream fails with an unhandled error.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.observe = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.forEach = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__combinator_observe__["b" /* observe */])(f, this)
}

/**
 * Consume all events in the stream, without providing a function to process each.
 * This causes a stream to become active and begin emitting events, and is useful
 * in cases where all processing has been setup upstream via other combinators, and
 * there is no need to process the terminal events.
 * @returns {Promise} promise that fulfills when the stream ends, or rejects
 *  if the stream fails with an unhandled error.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.drain = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__combinator_observe__["a" /* drain */])(this)
}

// -------------------------------------------------------



/* harmony reexport (binding) */ __webpack_require__.d(exports, "loop", function() { return __WEBPACK_IMPORTED_MODULE_9__combinator_loop__["a"]; });


/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.loop = function (stepper, seed) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_9__combinator_loop__["a" /* loop */])(stepper, seed, this)
}

// -------------------------------------------------------



/* harmony reexport (binding) */ __webpack_require__.d(exports, "scan", function() { return __WEBPACK_IMPORTED_MODULE_10__combinator_accumulate__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "reduce", function() { return __WEBPACK_IMPORTED_MODULE_10__combinator_accumulate__["b"]; });


/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @returns {Stream} new stream containing successive reduce results
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.scan = function (f, initial) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__combinator_accumulate__["a" /* scan */])(f, initial, this)
}

/**
 * Reduce the stream to produce a single result.  Note that reducing an infinite
 * stream will return a Promise that never fulfills, but that may reject if an error
 * occurs.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial optional initial value
 * @returns {Promise} promise for the file result of the reduce
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.reduce = function (f, initial) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_10__combinator_accumulate__["b" /* reduce */])(f, initial, this)
}

// -----------------------------------------------------------------------
// Building and extending






/* harmony reexport (binding) */ __webpack_require__.d(exports, "concat", function() { return __WEBPACK_IMPORTED_MODULE_11__combinator_build__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "startWith", function() { return __WEBPACK_IMPORTED_MODULE_11__combinator_build__["b"]; });


/**
 * @param {Stream} tail
 * @returns {Stream} new stream containing all items in this followed by
 *  all items in tail
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.concat = function (tail) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__combinator_build__["a" /* concat */])(this, tail)
}

/**
 * @param {*} x value to prepend
 * @returns {Stream} a new stream with x prepended
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.startWith = function (x) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_11__combinator_build__["b" /* cons */])(x, this)
}

// -----------------------------------------------------------------------
// Transforming




/* harmony reexport (binding) */ __webpack_require__.d(exports, "map", function() { return __WEBPACK_IMPORTED_MODULE_12__combinator_transform__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "constant", function() { return __WEBPACK_IMPORTED_MODULE_12__combinator_transform__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "tap", function() { return __WEBPACK_IMPORTED_MODULE_12__combinator_transform__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "ap", function() { return __WEBPACK_IMPORTED_MODULE_13__combinator_applicative__["a"]; });


/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @returns {Stream} stream containing items transformed by f
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.map = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__combinator_transform__["b" /* map */])(f, this)
}

/**
 * Assume this stream contains functions, and apply each function to each item
 * in the provided stream.  This generates, in effect, a cross product.
 * @param {Stream} xs stream of items to which
 * @returns {Stream} stream containing the cross product of items
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.ap = function (xs) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_13__combinator_applicative__["a" /* ap */])(this, xs)
}

/**
 * Replace each value in the stream with x
 * @param {*} x
 * @returns {Stream} stream containing items replaced with x
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.constant = function (x) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__combinator_transform__["c" /* constant */])(x, this)
}

/**
 * Perform a side effect for each item in the stream
 * @param {function(x:*):*} f side effect to execute for each item. The
 *  return value will be discarded.
 * @returns {Stream} new stream containing the same items as this stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.tap = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_12__combinator_transform__["a" /* tap */])(f, this)
}

// -----------------------------------------------------------------------
// Transducer support



/* harmony reexport (binding) */ __webpack_require__.d(exports, "transduce", function() { return __WEBPACK_IMPORTED_MODULE_14__combinator_transduce__["a"]; });


/**
 * Transform this stream by passing its events through a transducer.
 * @param  {function} transducer transducer function
 * @return {Stream} stream of events transformed by the transducer
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.transduce = function (transducer) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_14__combinator_transduce__["a" /* transduce */])(transducer, this)
}

// -----------------------------------------------------------------------
// FlatMapping



/* harmony reexport (binding) */ __webpack_require__.d(exports, "flatMap", function() { return __WEBPACK_IMPORTED_MODULE_15__combinator_flatMap__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "join", function() { return __WEBPACK_IMPORTED_MODULE_15__combinator_flatMap__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "chain", function() { return __WEBPACK_IMPORTED_MODULE_15__combinator_flatMap__["a"]; });


/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.flatMap = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.chain = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__combinator_flatMap__["a" /* flatMap */])(f, this)
}

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.join = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_15__combinator_flatMap__["b" /* join */])(this)
}



/* harmony reexport (binding) */ __webpack_require__.d(exports, "continueWith", function() { return __WEBPACK_IMPORTED_MODULE_16__combinator_continueWith__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "flatMapEnd", function() { return __WEBPACK_IMPORTED_MODULE_16__combinator_continueWith__["a"]; });


/**
 * Map the end event to a new stream, and begin emitting its values.
 * @param {function(x:*):Stream} f function that receives the end event value,
 * and *must* return a new Stream to continue with.
 * @returns {Stream} new stream that emits all events from the original stream,
 * followed by all events from the stream returned by f.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.continueWith = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.flatMapEnd = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_16__combinator_continueWith__["a" /* continueWith */])(f, this)
}



/* harmony reexport (binding) */ __webpack_require__.d(exports, "concatMap", function() { return __WEBPACK_IMPORTED_MODULE_17__combinator_concatMap__["a"]; });


__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.concatMap = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_17__combinator_concatMap__["a" /* concatMap */])(f, this)
}

// -----------------------------------------------------------------------
// Concurrent merging



/* harmony reexport (binding) */ __webpack_require__.d(exports, "mergeConcurrently", function() { return __WEBPACK_IMPORTED_MODULE_18__combinator_mergeConcurrently__["b"]; });


/**
 * Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer, limiting the number of inner streams that may
 * be active concurrently.
 * @param {number} concurrency at most this many inner streams will be
 *  allowed to be active concurrently.
 * @return {Stream<X>} new stream containing all events of all inner
 *  streams, with limited concurrency.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.mergeConcurrently = function (concurrency) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_18__combinator_mergeConcurrently__["b" /* mergeConcurrently */])(concurrency, this)
}

// -----------------------------------------------------------------------
// Merging



/* harmony reexport (binding) */ __webpack_require__.d(exports, "mergeArray", function() { return __WEBPACK_IMPORTED_MODULE_19__combinator_merge__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "merge", function() { return __WEBPACK_IMPORTED_MODULE_19__combinator_merge__["b"]; });


/**
 * Merge this stream and all the provided streams
 * @returns {Stream} stream containing items from this stream and s in time
 * order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.merge = function (/* ...streams*/) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_19__combinator_merge__["a" /* mergeArray */])(__WEBPACK_IMPORTED_MODULE_1__most_prelude__["cons"](this, arguments))
}

// -----------------------------------------------------------------------
// Combining



/* harmony reexport (binding) */ __webpack_require__.d(exports, "combineArray", function() { return __WEBPACK_IMPORTED_MODULE_20__combinator_combine__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "combine", function() { return __WEBPACK_IMPORTED_MODULE_20__combinator_combine__["a"]; });


/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.combine = function (f /*, ...streams*/) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_20__combinator_combine__["b" /* combineArray */])(f, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["replace"](this, 0, arguments))
}

// -----------------------------------------------------------------------
// Sampling



/* harmony reexport (binding) */ __webpack_require__.d(exports, "sampleWith", function() { return __WEBPACK_IMPORTED_MODULE_21__combinator_sample__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "sampleArray", function() { return __WEBPACK_IMPORTED_MODULE_21__combinator_sample__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "sample", function() { return __WEBPACK_IMPORTED_MODULE_21__combinator_sample__["c"]; });


/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  signal's latest value will be propagated
 * @returns {Stream} sampled stream of values
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.sampleWith = function (sampler) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__combinator_sample__["a" /* sampleWith */])(sampler, this)
}

/**
 * When an event arrives on this stream, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @returns {Stream} stream of sampled and transformed values
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.sample = function (f /* ...streams */) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_21__combinator_sample__["b" /* sampleArray */])(f, this, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["tail"](arguments))
}

// -----------------------------------------------------------------------
// Zipping



/* harmony reexport (binding) */ __webpack_require__.d(exports, "zip", function() { return __WEBPACK_IMPORTED_MODULE_22__combinator_zip__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "zipArray", function() { return __WEBPACK_IMPORTED_MODULE_22__combinator_zip__["b"]; });


/**
 * Pair-wise combine items with those in s. Given 2 streams:
 * [1,2,3] zipWith f [4,5,6] -> [f(1,4),f(2,5),f(3,6)]
 * Note: zip causes fast streams to buffer and wait for slow streams.
 * @param {function(a:Stream, b:Stream, ...):*} f function to combine items
 * @returns {Stream} new stream containing pairs
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.zip = function (f /*, ...streams*/) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_22__combinator_zip__["b" /* zipArray */])(f, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["replace"](this, 0, arguments))
}

// -----------------------------------------------------------------------
// Switching



/* harmony reexport (binding) */ __webpack_require__.d(exports, "switchLatest", function() { return __WEBPACK_IMPORTED_MODULE_23__combinator_switch__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "switch", function() { return __WEBPACK_IMPORTED_MODULE_23__combinator_switch__["a"]; });


/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @returns {Stream} switching stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.switch = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.switchLatest = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_23__combinator_switch__["a" /* switchLatest */])(this)
}

// -----------------------------------------------------------------------
// Filtering



/* harmony reexport (binding) */ __webpack_require__.d(exports, "distinct", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_filter__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "skipRepeats", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_filter__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "filter", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_filter__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "distinctBy", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_filter__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "skipRepeatsWith", function() { return __WEBPACK_IMPORTED_MODULE_24__combinator_filter__["c"]; });


/**
 * Retain only items matching a predicate
 * stream:                           -12345678-
 * filter(x => x % 2 === 0, stream): --2-4-6-8-
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.filter = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_24__combinator_filter__["b" /* filter */])(p, this)
}

/**
 * Skip repeated events, using === to compare items
 * stream:           -abbcd-
 * distinct(stream): -ab-cd-
 * @returns {Stream} stream with no repeated events
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipRepeats = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_24__combinator_filter__["a" /* skipRepeats */])(this)
}

/**
 * Skip repeated events, using supplied equals function to compare items
 * @param {function(a:*, b:*):boolean} equals function to compare items
 * @returns {Stream} stream with no repeated events
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipRepeatsWith = function (equals) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_24__combinator_filter__["c" /* skipRepeatsWith */])(equals, this)
}

// -----------------------------------------------------------------------
// Slicing



/* harmony reexport (binding) */ __webpack_require__.d(exports, "slice", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_slice__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "skip", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_slice__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "take", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_slice__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "skipWhile", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_slice__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "takeWhile", function() { return __WEBPACK_IMPORTED_MODULE_25__combinator_slice__["e"]; });


/**
 * stream:          -abcd-
 * take(2, stream): -ab|
 * @param {Number} n take up to this many events
 * @returns {Stream} stream containing at most the first n items from this stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.take = function (n) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_slice__["c" /* take */])(n, this)
}

/**
 * stream:          -abcd->
 * skip(2, stream): ---cd->
 * @param {Number} n skip this many events
 * @returns {Stream} stream not containing the first n events
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skip = function (n) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_slice__["b" /* skip */])(n, this)
}

/**
 * Slice a stream by event index. Equivalent to, but more efficient than
 * stream.take(end).skip(start);
 * NOTE: Negative start and end are not supported
 * @param {Number} start skip all events before the start index
 * @param {Number} end allow all events from the start index to the end index
 * @returns {Stream} stream containing items where start <= index < end
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.slice = function (start, end) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_slice__["a" /* slice */])(start, end, this)
}

/**
 * stream:                        -123451234->
 * takeWhile(x => x < 5, stream): -1234|
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items up to, but not including, the
 * first item for which p returns falsy.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.takeWhile = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_slice__["e" /* takeWhile */])(p, this)
}

/**
 * stream:                        -123451234->
 * skipWhile(x => x < 5, stream): -----51234->
 * @param {function(x:*):boolean} p predicate
 * @returns {Stream} stream containing items following *and including* the
 * first item for which p returns falsy.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipWhile = function (p) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_25__combinator_slice__["d" /* skipWhile */])(p, this)
}

// -----------------------------------------------------------------------
// Time slicing



/* harmony reexport (binding) */ __webpack_require__.d(exports, "until", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "skipUntil", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "since", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "during", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "takeUntil", function() { return __WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["a"]; });


/**
 * stream:                    -a-b-c-d-e-f-g->
 * signal:                    -------x
 * takeUntil(signal, stream): -a-b-c-|
 * @param {Stream} signal retain only events in stream before the first
 * event in signal
 * @returns {Stream} new stream containing only events that occur before
 * the first event in signal.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.until = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.takeUntil = function (signal) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["a" /* takeUntil */])(signal, this)
}

/**
 * stream:                    -a-b-c-d-e-f-g->
 * signal:                    -------x
 * takeUntil(signal, stream): -------d-e-f-g->
 * @param {Stream} signal retain only events in stream at or after the first
 * event in signal
 * @returns {Stream} new stream containing only events that occur after
 * the first event in signal.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.since = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.skipUntil = function (signal) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["b" /* skipUntil */])(signal, this)
}

/**
 * stream:                    -a-b-c-d-e-f-g->
 * timeWindow:                -----s
 * s:                               -----t
 * stream.during(timeWindow): -----c-d-e-|
 * @param {Stream<Stream>} timeWindow a stream whose first event (s) represents
 *  the window start time.  That event (s) is itself a stream whose first event (t)
 *  represents the window end time
 * @returns {Stream} new stream containing only events within the provided timespan
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.during = function (timeWindow) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_26__combinator_timeslice__["c" /* during */])(timeWindow, this)
}

// -----------------------------------------------------------------------
// Delaying



/* harmony reexport (binding) */ __webpack_require__.d(exports, "delay", function() { return __WEBPACK_IMPORTED_MODULE_27__combinator_delay__["a"]; });


/**
 * @param {Number} delayTime milliseconds to delay each item
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.delay = function (delayTime) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_27__combinator_delay__["a" /* delay */])(delayTime, this)
}

// -----------------------------------------------------------------------
// Getting event timestamp


/* harmony reexport (binding) */ __webpack_require__.d(exports, "timestamp", function() { return __WEBPACK_IMPORTED_MODULE_28__combinator_timestamp__["a"]; });


/**
 * Expose event timestamps into the stream. Turns a Stream<X> into
 * Stream<{time:t, value:X}>
 * @returns {Stream<{time:number, value:*}>}
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.timestamp = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_28__combinator_timestamp__["a" /* timestamp */])(this)
}

// -----------------------------------------------------------------------
// Rate limiting



/* harmony reexport (binding) */ __webpack_require__.d(exports, "debounce", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_limit__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "throttle", function() { return __WEBPACK_IMPORTED_MODULE_29__combinator_limit__["b"]; });


/**
 * Limit the rate of events
 * stream:              abcd----abcd----
 * throttle(2, stream): a-c-----a-c-----
 * @param {Number} period time to suppress events
 * @returns {Stream} new stream that skips events for throttle period
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.throttle = function (period) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_limit__["b" /* throttle */])(period, this)
}

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * stream:              abcd----abcd----
 * debounce(2, stream): -----d-------d--
 * @param {Number} period events occuring more frequently than this
 *  on the provided scheduler will be suppressed
 * @returns {Stream} new debounced stream
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.debounce = function (period) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_29__combinator_limit__["a" /* debounce */])(period, this)
}

// -----------------------------------------------------------------------
// Awaiting Promises



/* harmony reexport (binding) */ __webpack_require__.d(exports, "fromPromise", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_promises__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "awaitPromises", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_promises__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "await", function() { return __WEBPACK_IMPORTED_MODULE_30__combinator_promises__["b"]; });


/**
 * Await promises, turning a Stream<Promise<X>> into Stream<X>.  Preserves
 * event order, but timeshifts events based on promise resolution time.
 * @returns {Stream<X>} stream containing non-promise values
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.await = function () {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_30__combinator_promises__["b" /* awaitPromises */])(this)
}

// -----------------------------------------------------------------------
// Error handling



/* harmony reexport (binding) */ __webpack_require__.d(exports, "recoverWith", function() { return __WEBPACK_IMPORTED_MODULE_31__combinator_errors__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "flatMapError", function() { return __WEBPACK_IMPORTED_MODULE_31__combinator_errors__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "throwError", function() { return __WEBPACK_IMPORTED_MODULE_31__combinator_errors__["c"]; });


/**
 * If this stream encounters an error, recover and continue with items from stream
 * returned by f.
 * stream:                  -a-b-c-X-
 * f(X):                           d-e-f-g-
 * flatMapError(f, stream): -a-b-c-d-e-f-g-
 * @param {function(error:*):Stream} f function which returns a new stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.recoverWith = __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.flatMapError = function (f) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_31__combinator_errors__["b" /* flatMapError */])(f, this)
}

// -----------------------------------------------------------------------
// Multicasting



/* harmony reexport (default from non-hamory) */ __webpack_require__.d(exports, "multicast", function() { return __WEBPACK_IMPORTED_MODULE_32__most_multicast___default.a; });


/**
 * Transform the stream into multicast stream.  That means that many subscribers
 * to the stream will not cause multiple invocations of the internal machinery.
 * @returns {Stream} new stream which will multicast events to all observers.
 */
__WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */].prototype.multicast = function () {
  return __WEBPACK_IMPORTED_MODULE_32__most_multicast___default()(this)
}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fatalError__ = __webpack_require__(21);
/* harmony export (immutable) */ exports["a"] = PropagateTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function PropagateTask (run, value, sink) {
  this._run = run
  this.value = value
  this.sink = sink
  this.active = true
}

PropagateTask.event = function (value, sink) {
  return new PropagateTask(emit, value, sink)
}

PropagateTask.end = function (value, sink) {
  return new PropagateTask(end, value, sink)
}

PropagateTask.error = function (value, sink) {
  return new PropagateTask(error, value, sink)
}

PropagateTask.prototype.dispose = function () {
  this.active = false
}

PropagateTask.prototype.run = function (t) {
  if (!this.active) {
    return
  }
  this._run(t, this.value, this.sink)
}

PropagateTask.prototype.error = function (t, e) {
  if (!this.active) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__fatalError__["a" /* default */])(e)
  }
  this.sink.error(t, e)
}

function error (t, e, sink) {
  sink.error(t, e)
}

function emit (t, x, sink) {
  sink.event(t, x)
}

function end (t, x, sink) {
  sink.end(t, x)
}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = of;
/* harmony export (immutable) */ exports["b"] = empty;
/* harmony export (immutable) */ exports["c"] = never;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Stream containing only x
 * @param {*} x
 * @returns {Stream}
 */
function of (x) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Just(x))
}

function Just (x) {
  this.value = x
}

Just.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__["a" /* default */](runJust, this.value, sink))
}

function runJust (t, x, sink) {
  sink.event(t, x)
  sink.end(t, void 0)
}

/**
 * Stream containing no events and ends immediately
 * @returns {Stream}
 */
function empty () {
  return EMPTY
}

function EmptySource () {}

EmptySource.prototype.run = function (sink, scheduler) {
  var task = __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__["a" /* default */].end(void 0, sink)
  scheduler.asap(task)

  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* create */](disposeEmpty, task)
}

function disposeEmpty (task) {
  return task.dispose()
}

var EMPTY = new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new EmptySource())

/**
 * Stream containing no events and never ends
 * @returns {Stream}
 */
function never () {
  return NEVER
}

function NeverSource () {}

NeverSource.prototype.run = function () {
  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["b" /* empty */]()
}

var NEVER = new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new NeverSource())


/***/ },
/* 7 */
/***/ function(module, exports) {

"use strict";
"use strict";
function isElement(obj) {
    return typeof HTMLElement === "object" ?
        obj instanceof HTMLElement || obj instanceof DocumentFragment :
        obj && typeof obj === "object" && obj !== null &&
            (obj.nodeType === 1 || obj.nodeType === 11) &&
            typeof obj.nodeName === "string";
}
exports.SCOPE_PREFIX = "$$MOTORCYCLEDOM$$-";
function getElement(selectors) {
    var domElement = (typeof selectors === "string"
        ? document.querySelector(selectors) : selectors);
    if (typeof selectors === "string" && domElement === null) {
        throw new Error("Cannot render into unknown element `" + selectors + "`");
    }
    else if (!isElement(domElement)) {
        throw new Error("Given container is not a DOM element neither a " +
            "selector string.");
    }
    return domElement;
}
exports.getElement = getElement;
function getScope(namespace) {
    return namespace
        .filter(function (c) { return c.indexOf(exports.SCOPE_PREFIX) > -1; })
        .slice(-1) // only need the latest, most specific, isolated boundary
        .join("");
}
exports.getScope = getScope;
function getSelectors(namespace) {
    return namespace.filter(function (c) { return c.indexOf(exports.SCOPE_PREFIX) === -1; }).join(" ");
}
exports.getSelectors = getSelectors;
function classNameFromVNode(vNode) {
    var cn = selectorParser(vNode.sel).className;
    if (!vNode.data) {
        return cn;
    }
    var _a = vNode.data, dataClass = _a.class, props = _a.props;
    if (dataClass) {
        var c = Object.keys(vNode.data.class)
            .filter(function (cl) { return vNode.data.class[cl]; });
        cn += " " + c.join(" ");
    }
    if (props && props.className) {
        cn += " " + props.className;
    }
    return cn.trim();
}
exports.classNameFromVNode = classNameFromVNode;
var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;
function selectorParser(selector) {
    if (selector === void 0) { selector = ""; }
    var tagName = "div";
    var id = "";
    var classes = [];
    var tagParts = selector.split(classIdSplit);
    if (notClassId.test(tagParts[1]) || selector === "") {
        tagName = "div";
    }
    var part;
    var type;
    for (var i = 0; i < tagParts.length; i++) {
        part = tagParts[i];
        if (!part) {
            continue;
        }
        type = part.charAt(0);
        if (!tagName) {
            tagName = part;
        }
        else if (type === ".") {
            classes.push(part.substring(1, part.length));
        }
        else if (type === "#") {
            id = part.substring(1, part.length);
        }
    }
    return {
        tagName: tagName,
        id: id,
        className: classes.join(" "),
    };
}
exports.selectorParser = selectorParser;
//# sourceMappingURL=util.js.map

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var most_1 = __webpack_require__(4);
function isStream(x) {
    return x instanceof most_1.Stream;
}
function mutateStreamWithNS(vNode) {
    addNS(vNode.data, vNode.children, vNode.sel);
}
function addNS(data, children, selector) {
    data.ns = "http://www.w3.org/2000/svg";
    if (selector !== "foreignObject" && typeof children !== "undefined" && Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
            if (isStream(children[i])) {
                children[i] = children[i].tap(mutateStreamWithNS);
            }
            else {
                addNS(children[i].data, children[i].children, children[i].sel);
            }
        }
    }
}
exports.h = function (selector, b, c) {
    var data = {};
    var children;
    var text;
    var i;
    if (arguments.length === 3) {
        data = b;
        if (Array.isArray(c)) {
            children = c;
        }
        else if (typeof c === 'string' || typeof c === 'number') {
            text = String(c);
        }
    }
    else if (arguments.length === 2) {
        if (Array.isArray(b)) {
            children = b;
        }
        else if (typeof b === 'string' || typeof b === 'number') {
            text = String(b);
        }
        else {
            data = b;
        }
    }
    if (Array.isArray(children)) {
        children = children.filter(Boolean);
        for (i = 0; i < children.length; ++i) {
            if (typeof children[i] === 'string' || typeof children[i] === 'number') {
                children[i] = MotorcycleVNode.createTextVNode(String(children[i]));
            }
        }
    }
    if (selector[0] === 's' && selector[1] === 'v' && selector[2] === 'g') {
        addNS(data, children, selector);
    }
    return MotorcycleVNode.create(selector, data, children, text, undefined, data && data.key);
};
var MotorcycleVNode = (function () {
    function MotorcycleVNode(sel, data, children, text, elm, key) {
        this.sel = sel;
        this.data = data;
        this.children = children;
        this.text = text;
        this.elm = elm;
        this.key = key;
    }
    MotorcycleVNode.create = function (sel, data, children, text, elm, key) {
        return new MotorcycleVNode(sel, data, children, text, elm, key);
    };
    MotorcycleVNode.createTextVNode = function (text) {
        return new MotorcycleVNode(undefined, undefined, undefined, text, undefined, undefined);
    };
    return MotorcycleVNode;
}());
exports.MotorcycleVNode = MotorcycleVNode;
//# sourceMappingURL=hyperscript.js.map

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../typings/index.d.ts" />
var ramda_1 = __webpack_require__(10);
var $ = __webpack_require__(4);
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

//  Ramda v0.22.1
//  https://github.com/ramda/ramda
//  (c) 2013-2016 Scott Sauyet, Michael Hurley, and David Chambers
//  Ramda may be freely distributed under the MIT license.

;(function() {

  'use strict';

  /**
     * A special placeholder value used to specify "gaps" within curried functions,
     * allowing partial application of any combination of arguments, regardless of
     * their positions.
     *
     * If `g` is a curried ternary function and `_` is `R.__`, the following are
     * equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2, _)(1, 3)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @constant
     * @memberOf R
     * @since v0.6.0
     * @category Function
     * @example
     *
     *      var greet = R.replace('{name}', R.__, 'Hello, {name}!');
     *      greet('Alice'); //=> 'Hello, Alice!'
     */
    var __ = { '@@functional/placeholder': true };

    /* eslint-disable no-unused-vars */
    var _arity = function _arity(n, fn) {
        /* eslint-disable no-unused-vars */
        switch (n) {
        case 0:
            return function () {
                return fn.apply(this, arguments);
            };
        case 1:
            return function (a0) {
                return fn.apply(this, arguments);
            };
        case 2:
            return function (a0, a1) {
                return fn.apply(this, arguments);
            };
        case 3:
            return function (a0, a1, a2) {
                return fn.apply(this, arguments);
            };
        case 4:
            return function (a0, a1, a2, a3) {
                return fn.apply(this, arguments);
            };
        case 5:
            return function (a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments);
            };
        case 6:
            return function (a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments);
            };
        case 7:
            return function (a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments);
            };
        case 8:
            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments);
            };
        case 9:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments);
            };
        case 10:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments);
            };
        default:
            throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
        }
    };

    var _arrayFromIterator = function _arrayFromIterator(iter) {
        var list = [];
        var next;
        while (!(next = iter.next()).done) {
            list.push(next.value);
        }
        return list;
    };

    var _arrayOf = function _arrayOf() {
        return Array.prototype.slice.call(arguments);
    };

    var _cloneRegExp = function _cloneRegExp(pattern) {
        return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
    };

    var _complement = function _complement(f) {
        return function () {
            return !f.apply(this, arguments);
        };
    };

    /**
     * Private `concat` function to merge two array-like objects.
     *
     * @private
     * @param {Array|Arguments} [set1=[]] An array-like object.
     * @param {Array|Arguments} [set2=[]] An array-like object.
     * @return {Array} A new, merged array.
     * @example
     *
     *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
     */
    var _concat = function _concat(set1, set2) {
        set1 = set1 || [];
        set2 = set2 || [];
        var idx;
        var len1 = set1.length;
        var len2 = set2.length;
        var result = [];
        idx = 0;
        while (idx < len1) {
            result[result.length] = set1[idx];
            idx += 1;
        }
        idx = 0;
        while (idx < len2) {
            result[result.length] = set2[idx];
            idx += 1;
        }
        return result;
    };

    var _containsWith = function _containsWith(pred, x, list) {
        var idx = 0;
        var len = list.length;
        while (idx < len) {
            if (pred(x, list[idx])) {
                return true;
            }
            idx += 1;
        }
        return false;
    };

    var _filter = function _filter(fn, list) {
        var idx = 0;
        var len = list.length;
        var result = [];
        while (idx < len) {
            if (fn(list[idx])) {
                result[result.length] = list[idx];
            }
            idx += 1;
        }
        return result;
    };

    var _forceReduced = function _forceReduced(x) {
        return {
            '@@transducer/value': x,
            '@@transducer/reduced': true
        };
    };

    // String(x => x) evaluates to "x => x", so the pattern may not match.
    var _functionName = function _functionName(f) {
        // String(x => x) evaluates to "x => x", so the pattern may not match.
        var match = String(f).match(/^function (\w*)/);
        return match == null ? '' : match[1];
    };

    var _has = function _has(prop, obj) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    var _identity = function _identity(x) {
        return x;
    };

    var _isArguments = function () {
        var toString = Object.prototype.toString;
        return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
            return toString.call(x) === '[object Arguments]';
        } : function _isArguments(x) {
            return _has('callee', x);
        };
    }();

    /**
     * Tests whether or not an object is an array.
     *
     * @private
     * @param {*} val The object to test.
     * @return {Boolean} `true` if `val` is an array, `false` otherwise.
     * @example
     *
     *      _isArray([]); //=> true
     *      _isArray(null); //=> false
     *      _isArray({}); //=> false
     */
    var _isArray = Array.isArray || function _isArray(val) {
        return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
    };

    var _isFunction = function _isFunction(x) {
        return Object.prototype.toString.call(x) === '[object Function]';
    };

    /**
     * Determine if the passed argument is an integer.
     *
     * @private
     * @param {*} n
     * @category Type
     * @return {Boolean}
     */
    var _isInteger = Number.isInteger || function _isInteger(n) {
        return n << 0 === n;
    };

    var _isNumber = function _isNumber(x) {
        return Object.prototype.toString.call(x) === '[object Number]';
    };

    var _isObject = function _isObject(x) {
        return Object.prototype.toString.call(x) === '[object Object]';
    };

    var _isPlaceholder = function _isPlaceholder(a) {
        return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
    };

    var _isRegExp = function _isRegExp(x) {
        return Object.prototype.toString.call(x) === '[object RegExp]';
    };

    var _isString = function _isString(x) {
        return Object.prototype.toString.call(x) === '[object String]';
    };

    var _isTransformer = function _isTransformer(obj) {
        return typeof obj['@@transducer/step'] === 'function';
    };

    var _map = function _map(fn, functor) {
        var idx = 0;
        var len = functor.length;
        var result = Array(len);
        while (idx < len) {
            result[idx] = fn(functor[idx]);
            idx += 1;
        }
        return result;
    };

    // Based on https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
    var _objectAssign = function _objectAssign(target) {
        if (target == null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }
        var output = Object(target);
        var idx = 1;
        var length = arguments.length;
        while (idx < length) {
            var source = arguments[idx];
            if (source != null) {
                for (var nextKey in source) {
                    if (_has(nextKey, source)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
            idx += 1;
        }
        return output;
    };

    var _of = function _of(x) {
        return [x];
    };

    var _pipe = function _pipe(f, g) {
        return function () {
            return g.call(this, f.apply(this, arguments));
        };
    };

    var _pipeP = function _pipeP(f, g) {
        return function () {
            var ctx = this;
            return f.apply(ctx, arguments).then(function (x) {
                return g.call(ctx, x);
            });
        };
    };

    // \b matches word boundary; [\b] matches backspace
    var _quote = function _quote(s) {
        var escaped = s.replace(/\\/g, '\\\\').replace(/[\b]/g, '\\b')    // \b matches word boundary; [\b] matches backspace
    .replace(/\f/g, '\\f').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t').replace(/\v/g, '\\v').replace(/\0/g, '\\0');
        return '"' + escaped.replace(/"/g, '\\"') + '"';
    };

    var _reduced = function _reduced(x) {
        return x && x['@@transducer/reduced'] ? x : {
            '@@transducer/value': x,
            '@@transducer/reduced': true
        };
    };

    /**
     * An optimized, private array `slice` implementation.
     *
     * @private
     * @param {Arguments|Array} args The array or arguments object to consider.
     * @param {Number} [from=0] The array index to slice from, inclusive.
     * @param {Number} [to=args.length] The array index to slice to, exclusive.
     * @return {Array} A new, sliced array.
     * @example
     *
     *      _slice([1, 2, 3, 4, 5], 1, 3); //=> [2, 3]
     *
     *      var firstThreeArgs = function(a, b, c, d) {
     *        return _slice(arguments, 0, 3);
     *      };
     *      firstThreeArgs(1, 2, 3, 4); //=> [1, 2, 3]
     */
    var _slice = function _slice(args, from, to) {
        switch (arguments.length) {
        case 1:
            return _slice(args, 0, args.length);
        case 2:
            return _slice(args, from, args.length);
        default:
            var list = [];
            var idx = 0;
            var len = Math.max(0, Math.min(args.length, to) - from);
            while (idx < len) {
                list[idx] = args[from + idx];
                idx += 1;
            }
            return list;
        }
    };

    /**
     * Polyfill from <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString>.
     */
    var _toISOString = function () {
        var pad = function pad(n) {
            return (n < 10 ? '0' : '') + n;
        };
        return typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
            return d.toISOString();
        } : function _toISOString(d) {
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
        };
    }();

    var _xfBase = {
        init: function () {
            return this.xf['@@transducer/init']();
        },
        result: function (result) {
            return this.xf['@@transducer/result'](result);
        }
    };

    var _xwrap = function () {
        function XWrap(fn) {
            this.f = fn;
        }
        XWrap.prototype['@@transducer/init'] = function () {
            throw new Error('init not implemented on XWrap');
        };
        XWrap.prototype['@@transducer/result'] = function (acc) {
            return acc;
        };
        XWrap.prototype['@@transducer/step'] = function (acc, x) {
            return this.f(acc, x);
        };
        return function _xwrap(fn) {
            return new XWrap(fn);
        };
    }();

    var _aperture = function _aperture(n, list) {
        var idx = 0;
        var limit = list.length - (n - 1);
        var acc = new Array(limit >= 0 ? limit : 0);
        while (idx < limit) {
            acc[idx] = _slice(list, idx, idx + n);
            idx += 1;
        }
        return acc;
    };

    var _assign = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

    /**
     * Similar to hasMethod, this checks whether a function has a [methodname]
     * function. If it isn't an array it will execute that function otherwise it
     * will default to the ramda implementation.
     *
     * @private
     * @param {Function} fn ramda implemtation
     * @param {String} methodname property to check for a custom implementation
     * @return {Object} Whatever the return value of the method is.
     */
    var _checkForMethod = function _checkForMethod(methodname, fn) {
        return function () {
            var length = arguments.length;
            if (length === 0) {
                return fn();
            }
            var obj = arguments[length - 1];
            return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
        };
    };

    /**
     * Optimized internal one-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curry1 = function _curry1(fn) {
        return function f1(a) {
            if (arguments.length === 0 || _isPlaceholder(a)) {
                return f1;
            } else {
                return fn.apply(this, arguments);
            }
        };
    };

    /**
     * Optimized internal two-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curry2 = function _curry2(fn) {
        return function f2(a, b) {
            switch (arguments.length) {
            case 0:
                return f2;
            case 1:
                return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
                    return fn(a, _b);
                });
            default:
                return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
                    return fn(_a, b);
                }) : _isPlaceholder(b) ? _curry1(function (_b) {
                    return fn(a, _b);
                }) : fn(a, b);
            }
        };
    };

    /**
     * Optimized internal three-arity curry function.
     *
     * @private
     * @category Function
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curry3 = function _curry3(fn) {
        return function f3(a, b, c) {
            switch (arguments.length) {
            case 0:
                return f3;
            case 1:
                return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
                    return fn(a, _b, _c);
                });
            case 2:
                return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
                    return fn(_a, b, _c);
                }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
                    return fn(a, _b, _c);
                }) : _curry1(function (_c) {
                    return fn(a, b, _c);
                });
            default:
                return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
                    return fn(_a, _b, c);
                }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
                    return fn(_a, b, _c);
                }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
                    return fn(a, _b, _c);
                }) : _isPlaceholder(a) ? _curry1(function (_a) {
                    return fn(_a, b, c);
                }) : _isPlaceholder(b) ? _curry1(function (_b) {
                    return fn(a, _b, c);
                }) : _isPlaceholder(c) ? _curry1(function (_c) {
                    return fn(a, b, _c);
                }) : fn(a, b, c);
            }
        };
    };

    /**
     * Internal curryN function.
     *
     * @private
     * @category Function
     * @param {Number} length The arity of the curried function.
     * @param {Array} received An array of arguments received thus far.
     * @param {Function} fn The function to curry.
     * @return {Function} The curried function.
     */
    var _curryN = function _curryN(length, received, fn) {
        return function () {
            var combined = [];
            var argsIdx = 0;
            var left = length;
            var combinedIdx = 0;
            while (combinedIdx < received.length || argsIdx < arguments.length) {
                var result;
                if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
                    result = received[combinedIdx];
                } else {
                    result = arguments[argsIdx];
                    argsIdx += 1;
                }
                combined[combinedIdx] = result;
                if (!_isPlaceholder(result)) {
                    left -= 1;
                }
                combinedIdx += 1;
            }
            return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
        };
    };

    /**
     * Returns a function that dispatches with different strategies based on the
     * object in list position (last argument). If it is an array, executes [fn].
     * Otherwise, if it has a function with [methodname], it will execute that
     * function (functor case). Otherwise, if it is a transformer, uses transducer
     * [xf] to return a new transformer (transducer case). Otherwise, it will
     * default to executing [fn].
     *
     * @private
     * @param {String} methodname property to check for a custom implementation
     * @param {Function} xf transducer to initialize if object is transformer
     * @param {Function} fn default ramda implementation
     * @return {Function} A function that dispatches on object in list position
     */
    var _dispatchable = function _dispatchable(methodname, xf, fn) {
        return function () {
            var length = arguments.length;
            if (length === 0) {
                return fn();
            }
            var obj = arguments[length - 1];
            if (!_isArray(obj)) {
                var args = _slice(arguments, 0, length - 1);
                if (typeof obj[methodname] === 'function') {
                    return obj[methodname].apply(obj, args);
                }
                if (_isTransformer(obj)) {
                    var transducer = xf.apply(null, args);
                    return transducer(obj);
                }
            }
            return fn.apply(this, arguments);
        };
    };

    var _dropLastWhile = function dropLastWhile(pred, list) {
        var idx = list.length - 1;
        while (idx >= 0 && pred(list[idx])) {
            idx -= 1;
        }
        return _slice(list, 0, idx + 1);
    };

    var _xall = function () {
        function XAll(f, xf) {
            this.xf = xf;
            this.f = f;
            this.all = true;
        }
        XAll.prototype['@@transducer/init'] = _xfBase.init;
        XAll.prototype['@@transducer/result'] = function (result) {
            if (this.all) {
                result = this.xf['@@transducer/step'](result, true);
            }
            return this.xf['@@transducer/result'](result);
        };
        XAll.prototype['@@transducer/step'] = function (result, input) {
            if (!this.f(input)) {
                this.all = false;
                result = _reduced(this.xf['@@transducer/step'](result, false));
            }
            return result;
        };
        return _curry2(function _xall(f, xf) {
            return new XAll(f, xf);
        });
    }();

    var _xany = function () {
        function XAny(f, xf) {
            this.xf = xf;
            this.f = f;
            this.any = false;
        }
        XAny.prototype['@@transducer/init'] = _xfBase.init;
        XAny.prototype['@@transducer/result'] = function (result) {
            if (!this.any) {
                result = this.xf['@@transducer/step'](result, false);
            }
            return this.xf['@@transducer/result'](result);
        };
        XAny.prototype['@@transducer/step'] = function (result, input) {
            if (this.f(input)) {
                this.any = true;
                result = _reduced(this.xf['@@transducer/step'](result, true));
            }
            return result;
        };
        return _curry2(function _xany(f, xf) {
            return new XAny(f, xf);
        });
    }();

    var _xaperture = function () {
        function XAperture(n, xf) {
            this.xf = xf;
            this.pos = 0;
            this.full = false;
            this.acc = new Array(n);
        }
        XAperture.prototype['@@transducer/init'] = _xfBase.init;
        XAperture.prototype['@@transducer/result'] = function (result) {
            this.acc = null;
            return this.xf['@@transducer/result'](result);
        };
        XAperture.prototype['@@transducer/step'] = function (result, input) {
            this.store(input);
            return this.full ? this.xf['@@transducer/step'](result, this.getCopy()) : result;
        };
        XAperture.prototype.store = function (input) {
            this.acc[this.pos] = input;
            this.pos += 1;
            if (this.pos === this.acc.length) {
                this.pos = 0;
                this.full = true;
            }
        };
        XAperture.prototype.getCopy = function () {
            return _concat(_slice(this.acc, this.pos), _slice(this.acc, 0, this.pos));
        };
        return _curry2(function _xaperture(n, xf) {
            return new XAperture(n, xf);
        });
    }();

    var _xdrop = function () {
        function XDrop(n, xf) {
            this.xf = xf;
            this.n = n;
        }
        XDrop.prototype['@@transducer/init'] = _xfBase.init;
        XDrop.prototype['@@transducer/result'] = _xfBase.result;
        XDrop.prototype['@@transducer/step'] = function (result, input) {
            if (this.n > 0) {
                this.n -= 1;
                return result;
            }
            return this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xdrop(n, xf) {
            return new XDrop(n, xf);
        });
    }();

    var _xdropLast = function () {
        function XDropLast(n, xf) {
            this.xf = xf;
            this.pos = 0;
            this.full = false;
            this.acc = new Array(n);
        }
        XDropLast.prototype['@@transducer/init'] = _xfBase.init;
        XDropLast.prototype['@@transducer/result'] = function (result) {
            this.acc = null;
            return this.xf['@@transducer/result'](result);
        };
        XDropLast.prototype['@@transducer/step'] = function (result, input) {
            if (this.full) {
                result = this.xf['@@transducer/step'](result, this.acc[this.pos]);
            }
            this.store(input);
            return result;
        };
        XDropLast.prototype.store = function (input) {
            this.acc[this.pos] = input;
            this.pos += 1;
            if (this.pos === this.acc.length) {
                this.pos = 0;
                this.full = true;
            }
        };
        return _curry2(function _xdropLast(n, xf) {
            return new XDropLast(n, xf);
        });
    }();

    var _xdropRepeatsWith = function () {
        function XDropRepeatsWith(pred, xf) {
            this.xf = xf;
            this.pred = pred;
            this.lastValue = undefined;
            this.seenFirstValue = false;
        }
        XDropRepeatsWith.prototype['@@transducer/init'] = function () {
            return this.xf['@@transducer/init']();
        };
        XDropRepeatsWith.prototype['@@transducer/result'] = function (result) {
            return this.xf['@@transducer/result'](result);
        };
        XDropRepeatsWith.prototype['@@transducer/step'] = function (result, input) {
            var sameAsLast = false;
            if (!this.seenFirstValue) {
                this.seenFirstValue = true;
            } else if (this.pred(this.lastValue, input)) {
                sameAsLast = true;
            }
            this.lastValue = input;
            return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xdropRepeatsWith(pred, xf) {
            return new XDropRepeatsWith(pred, xf);
        });
    }();

    var _xdropWhile = function () {
        function XDropWhile(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
        XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
        XDropWhile.prototype['@@transducer/step'] = function (result, input) {
            if (this.f) {
                if (this.f(input)) {
                    return result;
                }
                this.f = null;
            }
            return this.xf['@@transducer/step'](result, input);
        };
        return _curry2(function _xdropWhile(f, xf) {
            return new XDropWhile(f, xf);
        });
    }();

    var _xfilter = function () {
        function XFilter(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XFilter.prototype['@@transducer/init'] = _xfBase.init;
        XFilter.prototype['@@transducer/result'] = _xfBase.result;
        XFilter.prototype['@@transducer/step'] = function (result, input) {
            return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
        };
        return _curry2(function _xfilter(f, xf) {
            return new XFilter(f, xf);
        });
    }();

    var _xfind = function () {
        function XFind(f, xf) {
            this.xf = xf;
            this.f = f;
            this.found = false;
        }
        XFind.prototype['@@transducer/init'] = _xfBase.init;
        XFind.prototype['@@transducer/result'] = function (result) {
            if (!this.found) {
                result = this.xf['@@transducer/step'](result, void 0);
            }
            return this.xf['@@transducer/result'](result);
        };
        XFind.prototype['@@transducer/step'] = function (result, input) {
            if (this.f(input)) {
                this.found = true;
                result = _reduced(this.xf['@@transducer/step'](result, input));
            }
            return result;
        };
        return _curry2(function _xfind(f, xf) {
            return new XFind(f, xf);
        });
    }();

    var _xfindIndex = function () {
        function XFindIndex(f, xf) {
            this.xf = xf;
            this.f = f;
            this.idx = -1;
            this.found = false;
        }
        XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
        XFindIndex.prototype['@@transducer/result'] = function (result) {
            if (!this.found) {
                result = this.xf['@@transducer/step'](result, -1);
            }
            return this.xf['@@transducer/result'](result);
        };
        XFindIndex.prototype['@@transducer/step'] = function (result, input) {
            this.idx += 1;
            if (this.f(input)) {
                this.found = true;
                result = _reduced(this.xf['@@transducer/step'](result, this.idx));
            }
            return result;
        };
        return _curry2(function _xfindIndex(f, xf) {
            return new XFindIndex(f, xf);
        });
    }();

    var _xfindLast = function () {
        function XFindLast(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XFindLast.prototype['@@transducer/init'] = _xfBase.init;
        XFindLast.prototype['@@transducer/result'] = function (result) {
            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
        };
        XFindLast.prototype['@@transducer/step'] = function (result, input) {
            if (this.f(input)) {
                this.last = input;
            }
            return result;
        };
        return _curry2(function _xfindLast(f, xf) {
            return new XFindLast(f, xf);
        });
    }();

    var _xfindLastIndex = function () {
        function XFindLastIndex(f, xf) {
            this.xf = xf;
            this.f = f;
            this.idx = -1;
            this.lastIdx = -1;
        }
        XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;
        XFindLastIndex.prototype['@@transducer/result'] = function (result) {
            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
        };
        XFindLastIndex.prototype['@@transducer/step'] = function (result, input) {
            this.idx += 1;
            if (this.f(input)) {
                this.lastIdx = this.idx;
            }
            return result;
        };
        return _curry2(function _xfindLastIndex(f, xf) {
            return new XFindLastIndex(f, xf);
        });
    }();

    var _xmap = function () {
        function XMap(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XMap.prototype['@@transducer/init'] = _xfBase.init;
        XMap.prototype['@@transducer/result'] = _xfBase.result;
        XMap.prototype['@@transducer/step'] = function (result, input) {
            return this.xf['@@transducer/step'](result, this.f(input));
        };
        return _curry2(function _xmap(f, xf) {
            return new XMap(f, xf);
        });
    }();

    var _xreduceBy = function () {
        function XReduceBy(valueFn, valueAcc, keyFn, xf) {
            this.valueFn = valueFn;
            this.valueAcc = valueAcc;
            this.keyFn = keyFn;
            this.xf = xf;
            this.inputs = {};
        }
        XReduceBy.prototype['@@transducer/init'] = _xfBase.init;
        XReduceBy.prototype['@@transducer/result'] = function (result) {
            var key;
            for (key in this.inputs) {
                if (_has(key, this.inputs)) {
                    result = this.xf['@@transducer/step'](result, this.inputs[key]);
                    if (result['@@transducer/reduced']) {
                        result = result['@@transducer/value'];
                        break;
                    }
                }
            }
            this.inputs = null;
            return this.xf['@@transducer/result'](result);
        };
        XReduceBy.prototype['@@transducer/step'] = function (result, input) {
            var key = this.keyFn(input);
            this.inputs[key] = this.inputs[key] || [
                key,
                this.valueAcc
            ];
            this.inputs[key][1] = this.valueFn(this.inputs[key][1], input);
            return result;
        };
        return _curryN(4, [], function _xreduceBy(valueFn, valueAcc, keyFn, xf) {
            return new XReduceBy(valueFn, valueAcc, keyFn, xf);
        });
    }();

    var _xtake = function () {
        function XTake(n, xf) {
            this.xf = xf;
            this.n = n;
            this.i = 0;
        }
        XTake.prototype['@@transducer/init'] = _xfBase.init;
        XTake.prototype['@@transducer/result'] = _xfBase.result;
        XTake.prototype['@@transducer/step'] = function (result, input) {
            this.i += 1;
            var ret = this.n === 0 ? result : this.xf['@@transducer/step'](result, input);
            return this.i >= this.n ? _reduced(ret) : ret;
        };
        return _curry2(function _xtake(n, xf) {
            return new XTake(n, xf);
        });
    }();

    var _xtakeWhile = function () {
        function XTakeWhile(f, xf) {
            this.xf = xf;
            this.f = f;
        }
        XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
        XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
        XTakeWhile.prototype['@@transducer/step'] = function (result, input) {
            return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
        };
        return _curry2(function _xtakeWhile(f, xf) {
            return new XTakeWhile(f, xf);
        });
    }();

    /**
     * Adds two values.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a
     * @param {Number} b
     * @return {Number}
     * @see R.subtract
     * @example
     *
     *      R.add(2, 3);       //=>  5
     *      R.add(7)(10);      //=> 17
     */
    var add = _curry2(function add(a, b) {
        return Number(a) + Number(b);
    });

    /**
     * Applies a function to the value at the given index of an array, returning a
     * new copy of the array with the element at the given index replaced with the
     * result of the function application.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category List
     * @sig (a -> a) -> Number -> [a] -> [a]
     * @param {Function} fn The function to apply.
     * @param {Number} idx The index.
     * @param {Array|Arguments} list An array-like object whose value
     *        at the supplied index will be replaced.
     * @return {Array} A copy of the supplied array-like object with
     *         the element at index `idx` replaced with the value
     *         returned by applying `fn` to the existing element.
     * @see R.update
     * @example
     *
     *      R.adjust(R.add(10), 1, [0, 1, 2]);     //=> [0, 11, 2]
     *      R.adjust(R.add(10))(1)([0, 1, 2]);     //=> [0, 11, 2]
     */
    var adjust = _curry3(function adjust(fn, idx, list) {
        if (idx >= list.length || idx < -list.length) {
            return list;
        }
        var start = idx < 0 ? list.length : 0;
        var _idx = start + idx;
        var _list = _concat(list);
        _list[_idx] = fn(list[_idx]);
        return _list;
    });

    /**
     * Returns `true` if all elements of the list match the predicate, `false` if
     * there are any that don't.
     *
     * Dispatches to the `all` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @param {Function} fn The predicate function.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the predicate is satisfied by every element, `false`
     *         otherwise.
     * @see R.any, R.none, R.transduce
     * @example
     *
     *      var lessThan2 = R.flip(R.lt)(2);
     *      var lessThan3 = R.flip(R.lt)(3);
     *      R.all(lessThan2)([1, 2]); //=> false
     *      R.all(lessThan3)([1, 2]); //=> true
     */
    var all = _curry2(_dispatchable('all', _xall, function all(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            if (!fn(list[idx])) {
                return false;
            }
            idx += 1;
        }
        return true;
    }));

    /**
     * Returns a function that always returns the given value. Note that for
     * non-primitives the value returned is a reference to the original value.
     *
     * This function is known as `const`, `constant`, or `K` (for K combinator) in
     * other languages and libraries.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig a -> (* -> a)
     * @param {*} val The value to wrap in a function
     * @return {Function} A Function :: * -> val.
     * @example
     *
     *      var t = R.always('Tee');
     *      t(); //=> 'Tee'
     */
    var always = _curry1(function always(val) {
        return function () {
            return val;
        };
    });

    /**
     * Returns `true` if both arguments are `true`; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Logic
     * @sig * -> * -> *
     * @param {Boolean} a A boolean value
     * @param {Boolean} b A boolean value
     * @return {Boolean} `true` if both arguments are `true`, `false` otherwise
     * @see R.both
     * @example
     *
     *      R.and(true, true); //=> true
     *      R.and(true, false); //=> false
     *      R.and(false, true); //=> false
     *      R.and(false, false); //=> false
     */
    var and = _curry2(function and(a, b) {
        return a && b;
    });

    /**
     * Returns `true` if at least one of elements of the list match the predicate,
     * `false` otherwise.
     *
     * Dispatches to the `any` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @param {Function} fn The predicate function.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the predicate is satisfied by at least one element, `false`
     *         otherwise.
     * @see R.all, R.none, R.transduce
     * @example
     *
     *      var lessThan0 = R.flip(R.lt)(0);
     *      var lessThan2 = R.flip(R.lt)(2);
     *      R.any(lessThan0)([1, 2]); //=> false
     *      R.any(lessThan2)([1, 2]); //=> true
     */
    var any = _curry2(_dispatchable('any', _xany, function any(fn, list) {
        var idx = 0;
        while (idx < list.length) {
            if (fn(list[idx])) {
                return true;
            }
            idx += 1;
        }
        return false;
    }));

    /**
     * Returns a new list, composed of n-tuples of consecutive elements If `n` is
     * greater than the length of the list, an empty list is returned.
     *
     * Dispatches to the `aperture` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category List
     * @sig Number -> [a] -> [[a]]
     * @param {Number} n The size of the tuples to create
     * @param {Array} list The list to split into `n`-tuples
     * @return {Array} The new list.
     * @see R.transduce
     * @example
     *
     *      R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]
     *      R.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]
     *      R.aperture(7, [1, 2, 3, 4, 5]); //=> []
     */
    var aperture = _curry2(_dispatchable('aperture', _xaperture, _aperture));

    /**
     * Returns a new list containing the contents of the given list, followed by
     * the given element.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig a -> [a] -> [a]
     * @param {*} el The element to add to the end of the new list.
     * @param {Array} list The list whose contents will be added to the beginning of the output
     *        list.
     * @return {Array} A new list containing the contents of the old list followed by `el`.
     * @see R.prepend
     * @example
     *
     *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
     *      R.append('tests', []); //=> ['tests']
     *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
     */
    var append = _curry2(function append(el, list) {
        return _concat(list, [el]);
    });

    /**
     * Applies function `fn` to the argument list `args`. This is useful for
     * creating a fixed-arity function from a variadic function. `fn` should be a
     * bound function if context is significant.
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category Function
     * @sig (*... -> a) -> [*] -> a
     * @param {Function} fn
     * @param {Array} args
     * @return {*}
     * @see R.call, R.unapply
     * @example
     *
     *      var nums = [1, 2, 3, -99, 42, 6, 7];
     *      R.apply(Math.max, nums); //=> 42
     */
    var apply = _curry2(function apply(fn, args) {
        return fn.apply(this, args);
    });

    /**
     * Makes a shallow clone of an object, setting or overriding the specified
     * property with the given value. Note that this copies and flattens prototype
     * properties onto the new object as well. All non-primitive properties are
     * copied by reference.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @sig String -> a -> {k: v} -> {k: v}
     * @param {String} prop the property name to set
     * @param {*} val the new value
     * @param {Object} obj the object to clone
     * @return {Object} a new object similar to the original except for the specified property.
     * @see R.dissoc
     * @example
     *
     *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
     */
    var assoc = _curry3(function assoc(prop, val, obj) {
        var result = {};
        for (var p in obj) {
            result[p] = obj[p];
        }
        result[prop] = val;
        return result;
    });

    /**
     * Makes a shallow clone of an object, setting or overriding the nodes required
     * to create the given path, and placing the specific value at the tail end of
     * that path. Note that this copies and flattens prototype properties onto the
     * new object as well. All non-primitive properties are copied by reference.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @sig [String] -> a -> {k: v} -> {k: v}
     * @param {Array} path the path to set
     * @param {*} val the new value
     * @param {Object} obj the object to clone
     * @return {Object} a new object similar to the original except along the specified path.
     * @see R.dissocPath
     * @example
     *
     *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
     */
    var assocPath = _curry3(function assocPath(path, val, obj) {
        switch (path.length) {
        case 0:
            return val;
        case 1:
            return assoc(path[0], val, obj);
        default:
            return assoc(path[0], assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
        }
    });

    /**
     * Creates a function that is bound to a context.
     * Note: `R.bind` does not provide the additional argument-binding capabilities of
     * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
     *
     * @func
     * @memberOf R
     * @since v0.6.0
     * @category Function
     * @category Object
     * @sig (* -> *) -> {*} -> (* -> *)
     * @param {Function} fn The function to bind to context
     * @param {Object} thisObj The context to bind `fn` to
     * @return {Function} A function that will execute in the context of `thisObj`.
     * @see R.partial
     * @example
     *
     *      var log = R.bind(console.log, console);
     *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
     *      // logs {a: 2}
     */
    var bind = _curry2(function bind(fn, thisObj) {
        return _arity(fn.length, function () {
            return fn.apply(thisObj, arguments);
        });
    });

    /**
     * Restricts a number to be within a range.
     *
     * Also works for other ordered types such as Strings and Dates.
     *
     * @func
     * @memberOf R
     * @since v0.20.0
     * @category Relation
     * @sig Ord a => a -> a -> a -> a
     * @param {Number} minimum number
     * @param {Number} maximum number
     * @param {Number} value to be clamped
     * @return {Number} Returns the clamped value
     * @example
     *
     *      R.clamp(1, 10, -1) // => 1
     *      R.clamp(1, 10, 11) // => 10
     *      R.clamp(1, 10, 4)  // => 4
     */
    var clamp = _curry3(function clamp(min, max, value) {
        if (min > max) {
            throw new Error('min must not be greater than max in clamp(min, max, value)');
        }
        return value < min ? min : value > max ? max : value;
    });

    /**
     * Makes a comparator function out of a function that reports whether the first
     * element is less than the second.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (a, b -> Boolean) -> (a, b -> Number)
     * @param {Function} pred A predicate function of arity two.
     * @return {Function} A Function :: a -> b -> Int that returns `-1` if a < b, `1` if b < a, otherwise `0`.
     * @example
     *
     *      var cmp = R.comparator((a, b) => a.age < b.age);
     *      var people = [
     *        // ...
     *      ];
     *      R.sort(cmp, people);
     */
    var comparator = _curry1(function comparator(pred) {
        return function (a, b) {
            return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
        };
    });

    /**
     * Returns a curried equivalent of the provided function, with the specified
     * arity. The curried function has two unusual capabilities. First, its
     * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
     * following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value `R.__` may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is `R.__`, the
     * following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @since v0.5.0
     * @category Function
     * @sig Number -> (* -> a) -> (* -> a)
     * @param {Number} length The arity for the returned function.
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curry
     * @example
     *
     *      var sumArgs = (...args) => R.sum(args);
     *
     *      var curriedAddFourNumbers = R.curryN(4, sumArgs);
     *      var f = curriedAddFourNumbers(1, 2);
     *      var g = f(3);
     *      g(4); //=> 10
     */
    var curryN = _curry2(function curryN(length, fn) {
        if (length === 1) {
            return _curry1(fn);
        }
        return _arity(length, _curryN(length, [], fn));
    });

    /**
     * Decrements its argument.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Math
     * @sig Number -> Number
     * @param {Number} n
     * @return {Number}
     * @see R.inc
     * @example
     *
     *      R.dec(42); //=> 41
     */
    var dec = add(-1);

    /**
     * Returns the second argument if it is not `null`, `undefined` or `NaN`
     * otherwise the first argument is returned.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category Logic
     * @sig a -> b -> a | b
     * @param {a} val The default value.
     * @param {b} val The value to return if it is not null or undefined
     * @return {*} The the second value or the default value
     * @example
     *
     *      var defaultTo42 = R.defaultTo(42);
     *
     *      defaultTo42(null);  //=> 42
     *      defaultTo42(undefined);  //=> 42
     *      defaultTo42('Ramda');  //=> 'Ramda'
     *      defaultTo42(parseInt('string')); //=> 42
     */
    var defaultTo = _curry2(function defaultTo(d, v) {
        return v == null || v !== v ? d : v;
    });

    /**
     * Finds the set (i.e. no duplicates) of all elements in the first list not
     * contained in the second list. Duplication is determined according to the
     * value returned by applying the supplied predicate to two list elements.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The elements in `list1` that are not in `list2`.
     * @see R.difference, R.symmetricDifference, R.symmetricDifferenceWith
     * @example
     *
     *      var cmp = (x, y) => x.a === y.a;
     *      var l1 = [{a: 1}, {a: 2}, {a: 3}];
     *      var l2 = [{a: 3}, {a: 4}];
     *      R.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]
     */
    var differenceWith = _curry3(function differenceWith(pred, first, second) {
        var out = [];
        var idx = 0;
        var firstLen = first.length;
        while (idx < firstLen) {
            if (!_containsWith(pred, first[idx], second) && !_containsWith(pred, first[idx], out)) {
                out.push(first[idx]);
            }
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a new object that does not contain a `prop` property.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category Object
     * @sig String -> {k: v} -> {k: v}
     * @param {String} prop the name of the property to dissociate
     * @param {Object} obj the object to clone
     * @return {Object} a new object similar to the original but without the specified property
     * @see R.assoc
     * @example
     *
     *      R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}
     */
    var dissoc = _curry2(function dissoc(prop, obj) {
        var result = {};
        for (var p in obj) {
            if (p !== prop) {
                result[p] = obj[p];
            }
        }
        return result;
    });

    /**
     * Makes a shallow clone of an object, omitting the property at the given path.
     * Note that this copies and flattens prototype properties onto the new object
     * as well. All non-primitive properties are copied by reference.
     *
     * @func
     * @memberOf R
     * @since v0.11.0
     * @category Object
     * @sig [String] -> {k: v} -> {k: v}
     * @param {Array} path the path to set
     * @param {Object} obj the object to clone
     * @return {Object} a new object without the property at path
     * @see R.assocPath
     * @example
     *
     *      R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}
     */
    var dissocPath = _curry2(function dissocPath(path, obj) {
        switch (path.length) {
        case 0:
            return obj;
        case 1:
            return dissoc(path[0], obj);
        default:
            var head = path[0];
            var tail = _slice(path, 1);
            return obj[head] == null ? obj : assoc(head, dissocPath(tail, obj[head]), obj);
        }
    });

    /**
     * Divides two numbers. Equivalent to `a / b`.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The first value.
     * @param {Number} b The second value.
     * @return {Number} The result of `a / b`.
     * @see R.multiply
     * @example
     *
     *      R.divide(71, 100); //=> 0.71
     *
     *      var half = R.divide(R.__, 2);
     *      half(42); //=> 21
     *
     *      var reciprocal = R.divide(1);
     *      reciprocal(4);   //=> 0.25
     */
    var divide = _curry2(function divide(a, b) {
        return a / b;
    });

    /**
     * Returns a new list excluding the leading elements of a given list which
     * satisfy the supplied predicate function. It passes each value to the supplied
     * predicate function, skipping elements while the predicate function returns
     * `true`. The predicate function is applied to one argument: *(value)*.
     *
     * Dispatches to the `dropWhile` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} A new array.
     * @see R.takeWhile, R.transduce, R.addIndex
     * @example
     *
     *      var lteTwo = x => x <= 2;
     *
     *      R.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]
     */
    var dropWhile = _curry2(_dispatchable('dropWhile', _xdropWhile, function dropWhile(pred, list) {
        var idx = 0;
        var len = list.length;
        while (idx < len && pred(list[idx])) {
            idx += 1;
        }
        return _slice(list, idx);
    }));

    /**
     * Returns the empty value of its argument's type. Ramda defines the empty
     * value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other
     * types are supported if they define `<Type>.empty` and/or
     * `<Type>.prototype.empty`.
     *
     * Dispatches to the `empty` method of the first argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category Function
     * @sig a -> a
     * @param {*} x
     * @return {*}
     * @example
     *
     *      R.empty(Just(42));      //=> Nothing()
     *      R.empty([1, 2, 3]);     //=> []
     *      R.empty('unicorns');    //=> ''
     *      R.empty({x: 1, y: 2});  //=> {}
     */
    // else
    var empty = _curry1(function empty(x) {
        return x != null && typeof x.empty === 'function' ? x.empty() : x != null && x.constructor != null && typeof x.constructor.empty === 'function' ? x.constructor.empty() : _isArray(x) ? [] : _isString(x) ? '' : _isObject(x) ? {} : _isArguments(x) ? function () {
            return arguments;
        }() : // else
        void 0;
    });

    /**
     * Creates a new object by recursively evolving a shallow copy of `object`,
     * according to the `transformation` functions. All non-primitive properties
     * are copied by reference.
     *
     * A `transformation` function will not be invoked if its corresponding key
     * does not exist in the evolved object.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Object
     * @sig {k: (v -> v)} -> {k: v} -> {k: v}
     * @param {Object} transformations The object specifying transformation functions to apply
     *        to the object.
     * @param {Object} object The object to be transformed.
     * @return {Object} The transformed object.
     * @example
     *
     *      var tomato  = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};
     *      var transformations = {
     *        firstName: R.trim,
     *        lastName: R.trim, // Will not get invoked.
     *        data: {elapsed: R.add(1), remaining: R.add(-1)}
     *      };
     *      R.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}
     */
    var evolve = _curry2(function evolve(transformations, object) {
        var result = {};
        var transformation, key, type;
        for (key in object) {
            transformation = transformations[key];
            type = typeof transformation;
            result[key] = type === 'function' ? transformation(object[key]) : type === 'object' ? evolve(transformations[key], object[key]) : object[key];
        }
        return result;
    });

    /**
     * Returns the first element of the list which matches the predicate, or
     * `undefined` if no element matches.
     *
     * Dispatches to the `find` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> a | undefined
     * @param {Function} fn The predicate function used to determine if the element is the
     *        desired one.
     * @param {Array} list The array to consider.
     * @return {Object} The element found, or `undefined`.
     * @see R.transduce
     * @example
     *
     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
     *      R.find(R.propEq('a', 2))(xs); //=> {a: 2}
     *      R.find(R.propEq('a', 4))(xs); //=> undefined
     */
    var find = _curry2(_dispatchable('find', _xfind, function find(fn, list) {
        var idx = 0;
        var len = list.length;
        while (idx < len) {
            if (fn(list[idx])) {
                return list[idx];
            }
            idx += 1;
        }
    }));

    /**
     * Returns the index of the first element of the list which matches the
     * predicate, or `-1` if no element matches.
     *
     * Dispatches to the `findIndex` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category List
     * @sig (a -> Boolean) -> [a] -> Number
     * @param {Function} fn The predicate function used to determine if the element is the
     * desired one.
     * @param {Array} list The array to consider.
     * @return {Number} The index of the element found, or `-1`.
     * @see R.transduce
     * @example
     *
     *      var xs = [{a: 1}, {a: 2}, {a: 3}];
     *      R.findIndex(R.propEq('a', 2))(xs); //=> 1
     *      R.findIndex(R.propEq('a', 4))(xs); //=> -1
     */
    var findIndex = _curry2(_dispatchable('findIndex', _xfindIndex, function findIndex(fn, list) {
        var idx = 0;
        var len = list.length;
        while (idx < len) {
            if (fn(list[idx])) {
                return idx;
            }
            idx += 1;
        }
        return -1;
    }));

    /**
     * Returns the last element of the list which matches the predicate, or
     * `undefined` if no element matches.
     *
     * Dispatches to the `findLast` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category List
     * @sig (a -> Boolean) -> [a] -> a | undefined
     * @param {Function} fn The predicate function used to determine if the element is the
     * desired one.
     * @param {Array} list The array to consider.
     * @return {Object} The element found, or `undefined`.
     * @see R.transduce
     * @example
     *
     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
     *      R.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}
     *      R.findLast(R.propEq('a', 4))(xs); //=> undefined
     */
    var findLast = _curry2(_dispatchable('findLast', _xfindLast, function findLast(fn, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            if (fn(list[idx])) {
                return list[idx];
            }
            idx -= 1;
        }
    }));

    /**
     * Returns the index of the last element of the list which matches the
     * predicate, or `-1` if no element matches.
     *
     * Dispatches to the `findLastIndex` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category List
     * @sig (a -> Boolean) -> [a] -> Number
     * @param {Function} fn The predicate function used to determine if the element is the
     * desired one.
     * @param {Array} list The array to consider.
     * @return {Number} The index of the element found, or `-1`.
     * @see R.transduce
     * @example
     *
     *      var xs = [{a: 1, b: 0}, {a:1, b: 1}];
     *      R.findLastIndex(R.propEq('a', 1))(xs); //=> 1
     *      R.findLastIndex(R.propEq('a', 4))(xs); //=> -1
     */
    var findLastIndex = _curry2(_dispatchable('findLastIndex', _xfindLastIndex, function findLastIndex(fn, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            if (fn(list[idx])) {
                return idx;
            }
            idx -= 1;
        }
        return -1;
    }));

    /**
     * Iterate over an input `list`, calling a provided function `fn` for each
     * element in the list.
     *
     * `fn` receives one argument: *(value)*.
     *
     * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
     * arrays), unlike the native `Array.prototype.forEach` method. For more
     * details on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
     *
     * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
     * the original array. In some libraries this function is named `each`.
     *
     * Dispatches to the `forEach` method of the second argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category List
     * @sig (a -> *) -> [a] -> [a]
     * @param {Function} fn The function to invoke. Receives one argument, `value`.
     * @param {Array} list The list to iterate over.
     * @return {Array} The original list.
     * @see R.addIndex
     * @example
     *
     *      var printXPlusFive = x => console.log(x + 5);
     *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
     *      // logs 6
     *      // logs 7
     *      // logs 8
     */
    var forEach = _curry2(_checkForMethod('forEach', function forEach(fn, list) {
        var len = list.length;
        var idx = 0;
        while (idx < len) {
            fn(list[idx]);
            idx += 1;
        }
        return list;
    }));

    /**
     * Creates a new object from a list key-value pairs. If a key appears in
     * multiple pairs, the rightmost pair is included in the object.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category List
     * @sig [[k,v]] -> {k: v}
     * @param {Array} pairs An array of two-element arrays that will be the keys and values of the output object.
     * @return {Object} The object made by pairing up `keys` and `values`.
     * @see R.toPairs, R.pair
     * @example
     *
     *      R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}
     */
    var fromPairs = _curry1(function fromPairs(pairs) {
        var result = {};
        var idx = 0;
        while (idx < pairs.length) {
            result[pairs[idx][0]] = pairs[idx][1];
            idx += 1;
        }
        return result;
    });

    /**
     * Takes a list and returns a list of lists where each sublist's elements are
     * all "equal" according to the provided equality function.
     *
     * @func
     * @memberOf R
     * @since v0.21.0
     * @category List
     * @sig ((a, a) → Boolean) → [a] → [[a]]
     * @param {Function} fn Function for determining whether two given (adjacent)
     *        elements should be in the same group
     * @param {Array} list The array to group. Also accepts a string, which will be
     *        treated as a list of characters.
     * @return {List} A list that contains sublists of equal elements,
     *         whose concatenations are equal to the original list.
     * @example
     *
     * R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])
     * //=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]
     *
     * R.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])
     * //=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]
     *
     * R.groupWith(R.eqBy(isVowel), 'aestiou')
     * //=> ['ae', 'st', 'iou']
     */
    var groupWith = _curry2(function (fn, list) {
        var res = [];
        var idx = 0;
        var len = list.length;
        while (idx < len) {
            var nextidx = idx + 1;
            while (nextidx < len && fn(list[idx], list[nextidx])) {
                nextidx += 1;
            }
            res.push(list.slice(idx, nextidx));
            idx = nextidx;
        }
        return res;
    });

    /**
     * Returns `true` if the first argument is greater than the second; `false`
     * otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord a => a -> a -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @see R.lt
     * @example
     *
     *      R.gt(2, 1); //=> true
     *      R.gt(2, 2); //=> false
     *      R.gt(2, 3); //=> false
     *      R.gt('a', 'z'); //=> false
     *      R.gt('z', 'a'); //=> true
     */
    var gt = _curry2(function gt(a, b) {
        return a > b;
    });

    /**
     * Returns `true` if the first argument is greater than or equal to the second;
     * `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord a => a -> a -> Boolean
     * @param {Number} a
     * @param {Number} b
     * @return {Boolean}
     * @see R.lte
     * @example
     *
     *      R.gte(2, 1); //=> true
     *      R.gte(2, 2); //=> true
     *      R.gte(2, 3); //=> false
     *      R.gte('a', 'z'); //=> false
     *      R.gte('z', 'a'); //=> true
     */
    var gte = _curry2(function gte(a, b) {
        return a >= b;
    });

    /**
     * Returns whether or not an object has an own property with the specified name
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category Object
     * @sig s -> {s: x} -> Boolean
     * @param {String} prop The name of the property to check for.
     * @param {Object} obj The object to query.
     * @return {Boolean} Whether the property exists.
     * @example
     *
     *      var hasName = R.has('name');
     *      hasName({name: 'alice'});   //=> true
     *      hasName({name: 'bob'});     //=> true
     *      hasName({});                //=> false
     *
     *      var point = {x: 0, y: 0};
     *      var pointHas = R.has(R.__, point);
     *      pointHas('x');  //=> true
     *      pointHas('y');  //=> true
     *      pointHas('z');  //=> false
     */
    var has = _curry2(_has);

    /**
     * Returns whether or not an object or its prototype chain has a property with
     * the specified name
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category Object
     * @sig s -> {s: x} -> Boolean
     * @param {String} prop The name of the property to check for.
     * @param {Object} obj The object to query.
     * @return {Boolean} Whether the property exists.
     * @example
     *
     *      function Rectangle(width, height) {
     *        this.width = width;
     *        this.height = height;
     *      }
     *      Rectangle.prototype.area = function() {
     *        return this.width * this.height;
     *      };
     *
     *      var square = new Rectangle(2, 2);
     *      R.hasIn('width', square);  //=> true
     *      R.hasIn('area', square);  //=> true
     */
    var hasIn = _curry2(function hasIn(prop, obj) {
        return prop in obj;
    });

    /**
     * Returns true if its arguments are identical, false otherwise. Values are
     * identical if they reference the same memory. `NaN` is identical to `NaN`;
     * `0` and `-0` are not identical.
     *
     * @func
     * @memberOf R
     * @since v0.15.0
     * @category Relation
     * @sig a -> a -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @example
     *
     *      var o = {};
     *      R.identical(o, o); //=> true
     *      R.identical(1, 1); //=> true
     *      R.identical(1, '1'); //=> false
     *      R.identical([], []); //=> false
     *      R.identical(0, -0); //=> false
     *      R.identical(NaN, NaN); //=> true
     */
    // SameValue algorithm
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Step 6.a: NaN == NaN
    var identical = _curry2(function identical(a, b) {
        // SameValue algorithm
        if (a === b) {
            // Steps 1-5, 7-10
            // Steps 6.b-6.e: +0 != -0
            return a !== 0 || 1 / a === 1 / b;
        } else {
            // Step 6.a: NaN == NaN
            return a !== a && b !== b;
        }
    });

    /**
     * A function that does nothing but return the parameter supplied to it. Good
     * as a default or placeholder function.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig a -> a
     * @param {*} x The value to return.
     * @return {*} The input value, `x`.
     * @example
     *
     *      R.identity(1); //=> 1
     *
     *      var obj = {};
     *      R.identity(obj) === obj; //=> true
     */
    var identity = _curry1(_identity);

    /**
     * Creates a function that will process either the `onTrue` or the `onFalse`
     * function depending upon the result of the `condition` predicate.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Logic
     * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
     * @param {Function} condition A predicate function
     * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
     * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
     * @return {Function} A new unary function that will process either the `onTrue` or the `onFalse`
     *                    function depending upon the result of the `condition` predicate.
     * @see R.unless, R.when
     * @example
     *
     *      var incCount = R.ifElse(
     *        R.has('count'),
     *        R.over(R.lensProp('count'), R.inc),
     *        R.assoc('count', 1)
     *      );
     *      incCount({});           //=> { count: 1 }
     *      incCount({ count: 1 }); //=> { count: 2 }
     */
    var ifElse = _curry3(function ifElse(condition, onTrue, onFalse) {
        return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
            return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
        });
    });

    /**
     * Increments its argument.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Math
     * @sig Number -> Number
     * @param {Number} n
     * @return {Number}
     * @see R.dec
     * @example
     *
     *      R.inc(42); //=> 43
     */
    var inc = add(1);

    /**
     * Inserts the supplied element into the list, at index `index`. _Note that
     * this is not destructive_: it returns a copy of the list with the changes.
     * <small>No lists have been harmed in the application of this function.</small>
     *
     * @func
     * @memberOf R
     * @since v0.2.2
     * @category List
     * @sig Number -> a -> [a] -> [a]
     * @param {Number} index The position to insert the element
     * @param {*} elt The element to insert into the Array
     * @param {Array} list The list to insert into
     * @return {Array} A new Array with `elt` inserted at `index`.
     * @example
     *
     *      R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]
     */
    var insert = _curry3(function insert(idx, elt, list) {
        idx = idx < list.length && idx >= 0 ? idx : list.length;
        var result = _slice(list);
        result.splice(idx, 0, elt);
        return result;
    });

    /**
     * Inserts the sub-list into the list, at index `index`. _Note that this is not
     * destructive_: it returns a copy of the list with the changes.
     * <small>No lists have been harmed in the application of this function.</small>
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category List
     * @sig Number -> [a] -> [a] -> [a]
     * @param {Number} index The position to insert the sub-list
     * @param {Array} elts The sub-list to insert into the Array
     * @param {Array} list The list to insert the sub-list into
     * @return {Array} A new Array with `elts` inserted starting at `index`.
     * @example
     *
     *      R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]
     */
    var insertAll = _curry3(function insertAll(idx, elts, list) {
        idx = idx < list.length && idx >= 0 ? idx : list.length;
        return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
    });

    /**
     * Creates a new list with the separator interposed between elements.
     *
     * Dispatches to the `intersperse` method of the second argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category List
     * @sig a -> [a] -> [a]
     * @param {*} separator The element to add to the list.
     * @param {Array} list The list to be interposed.
     * @return {Array} The new list.
     * @example
     *
     *      R.intersperse('n', ['ba', 'a', 'a']); //=> ['ba', 'n', 'a', 'n', 'a']
     */
    var intersperse = _curry2(_checkForMethod('intersperse', function intersperse(separator, list) {
        var out = [];
        var idx = 0;
        var length = list.length;
        while (idx < length) {
            if (idx === length - 1) {
                out.push(list[idx]);
            } else {
                out.push(list[idx], separator);
            }
            idx += 1;
        }
        return out;
    }));

    /**
     * See if an object (`val`) is an instance of the supplied constructor. This
     * function will check up the inheritance chain, if any.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category Type
     * @sig (* -> {*}) -> a -> Boolean
     * @param {Object} ctor A constructor
     * @param {*} val The value to test
     * @return {Boolean}
     * @example
     *
     *      R.is(Object, {}); //=> true
     *      R.is(Number, 1); //=> true
     *      R.is(Object, 1); //=> false
     *      R.is(String, 's'); //=> true
     *      R.is(String, new String('')); //=> true
     *      R.is(Object, new String('')); //=> true
     *      R.is(Object, 's'); //=> false
     *      R.is(Number, {}); //=> false
     */
    var is = _curry2(function is(Ctor, val) {
        return val != null && val.constructor === Ctor || val instanceof Ctor;
    });

    /**
     * Tests whether or not an object is similar to an array.
     *
     * @func
     * @memberOf R
     * @since v0.5.0
     * @category Type
     * @category List
     * @sig * -> Boolean
     * @param {*} x The object to test.
     * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
     * @example
     *
     *      R.isArrayLike([]); //=> true
     *      R.isArrayLike(true); //=> false
     *      R.isArrayLike({}); //=> false
     *      R.isArrayLike({length: 10}); //=> false
     *      R.isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
     */
    var isArrayLike = _curry1(function isArrayLike(x) {
        if (_isArray(x)) {
            return true;
        }
        if (!x) {
            return false;
        }
        if (typeof x !== 'object') {
            return false;
        }
        if (_isString(x)) {
            return false;
        }
        if (x.nodeType === 1) {
            return !!x.length;
        }
        if (x.length === 0) {
            return true;
        }
        if (x.length > 0) {
            return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
        }
        return false;
    });

    /**
     * Checks if the input value is `null` or `undefined`.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Type
     * @sig * -> Boolean
     * @param {*} x The value to test.
     * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
     * @example
     *
     *      R.isNil(null); //=> true
     *      R.isNil(undefined); //=> true
     *      R.isNil(0); //=> false
     *      R.isNil([]); //=> false
     */
    var isNil = _curry1(function isNil(x) {
        return x == null;
    });

    /**
     * Returns a list containing the names of all the enumerable own properties of
     * the supplied object.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own properties.
     * @example
     *
     *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
     */
    // cover IE < 9 keys issues
    // Safari bug
    var keys = function () {
        // cover IE < 9 keys issues
        var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
        var nonEnumerableProps = [
            'constructor',
            'valueOf',
            'isPrototypeOf',
            'toString',
            'propertyIsEnumerable',
            'hasOwnProperty',
            'toLocaleString'
        ];
        // Safari bug
        var hasArgsEnumBug = function () {
            'use strict';
            return arguments.propertyIsEnumerable('length');
        }();
        var contains = function contains(list, item) {
            var idx = 0;
            while (idx < list.length) {
                if (list[idx] === item) {
                    return true;
                }
                idx += 1;
            }
            return false;
        };
        return typeof Object.keys === 'function' && !hasArgsEnumBug ? _curry1(function keys(obj) {
            return Object(obj) !== obj ? [] : Object.keys(obj);
        }) : _curry1(function keys(obj) {
            if (Object(obj) !== obj) {
                return [];
            }
            var prop, nIdx;
            var ks = [];
            var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
            for (prop in obj) {
                if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
                    ks[ks.length] = prop;
                }
            }
            if (hasEnumBug) {
                nIdx = nonEnumerableProps.length - 1;
                while (nIdx >= 0) {
                    prop = nonEnumerableProps[nIdx];
                    if (_has(prop, obj) && !contains(ks, prop)) {
                        ks[ks.length] = prop;
                    }
                    nIdx -= 1;
                }
            }
            return ks;
        });
    }();

    /**
     * Returns a list containing the names of all the properties of the supplied
     * object, including prototype properties.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Object
     * @sig {k: v} -> [k]
     * @param {Object} obj The object to extract properties from
     * @return {Array} An array of the object's own and prototype properties.
     * @example
     *
     *      var F = function() { this.x = 'X'; };
     *      F.prototype.y = 'Y';
     *      var f = new F();
     *      R.keysIn(f); //=> ['x', 'y']
     */
    var keysIn = _curry1(function keysIn(obj) {
        var prop;
        var ks = [];
        for (prop in obj) {
            ks[ks.length] = prop;
        }
        return ks;
    });

    /**
     * Returns the number of elements in the array by returning `list.length`.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category List
     * @sig [a] -> Number
     * @param {Array} list The array to inspect.
     * @return {Number} The length of the array.
     * @example
     *
     *      R.length([]); //=> 0
     *      R.length([1, 2, 3]); //=> 3
     */
    var length = _curry1(function length(list) {
        return list != null && _isNumber(list.length) ? list.length : NaN;
    });

    /**
     * Returns `true` if the first argument is less than the second; `false`
     * otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord a => a -> a -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @see R.gt
     * @example
     *
     *      R.lt(2, 1); //=> false
     *      R.lt(2, 2); //=> false
     *      R.lt(2, 3); //=> true
     *      R.lt('a', 'z'); //=> true
     *      R.lt('z', 'a'); //=> false
     */
    var lt = _curry2(function lt(a, b) {
        return a < b;
    });

    /**
     * Returns `true` if the first argument is less than or equal to the second;
     * `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord a => a -> a -> Boolean
     * @param {Number} a
     * @param {Number} b
     * @return {Boolean}
     * @see R.gte
     * @example
     *
     *      R.lte(2, 1); //=> false
     *      R.lte(2, 2); //=> true
     *      R.lte(2, 3); //=> true
     *      R.lte('a', 'z'); //=> true
     *      R.lte('z', 'a'); //=> false
     */
    var lte = _curry2(function lte(a, b) {
        return a <= b;
    });

    /**
     * The mapAccum function behaves like a combination of map and reduce; it
     * applies a function to each element of a list, passing an accumulating
     * parameter from left to right, and returning a final value of this
     * accumulator together with the new list.
     *
     * The iterator function receives two arguments, *acc* and *value*, and should
     * return a tuple *[acc, value]*.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category List
     * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.addIndex
     * @example
     *
     *      var digits = ['1', '2', '3', '4'];
     *      var appender = (a, b) => [a + b, a + b];
     *
     *      R.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]
     */
    var mapAccum = _curry3(function mapAccum(fn, acc, list) {
        var idx = 0;
        var len = list.length;
        var result = [];
        var tuple = [acc];
        while (idx < len) {
            tuple = fn(tuple[0], list[idx]);
            result[idx] = tuple[1];
            idx += 1;
        }
        return [
            tuple[0],
            result
        ];
    });

    /**
     * The mapAccumRight function behaves like a combination of map and reduce; it
     * applies a function to each element of a list, passing an accumulating
     * parameter from right to left, and returning a final value of this
     * accumulator together with the new list.
     *
     * Similar to `mapAccum`, except moves through the input list from the right to
     * the left.
     *
     * The iterator function receives two arguments, *acc* and *value*, and should
     * return a tuple *[acc, value]*.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category List
     * @sig (acc -> x -> (acc, y)) -> acc -> [x] -> (acc, [y])
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.addIndex
     * @example
     *
     *      var digits = ['1', '2', '3', '4'];
     *      var append = (a, b) => [a + b, a + b];
     *
     *      R.mapAccumRight(append, 0, digits); //=> ['04321', ['04321', '0432', '043', '04']]
     */
    var mapAccumRight = _curry3(function mapAccumRight(fn, acc, list) {
        var idx = list.length - 1;
        var result = [];
        var tuple = [acc];
        while (idx >= 0) {
            tuple = fn(tuple[0], list[idx]);
            result[idx] = tuple[1];
            idx -= 1;
        }
        return [
            tuple[0],
            result
        ];
    });

    /**
     * Tests a regular expression against a String. Note that this function will
     * return an empty array when there are no matches. This differs from
     * [`String.prototype.match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
     * which returns `null` when there are no matches.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category String
     * @sig RegExp -> String -> [String | Undefined]
     * @param {RegExp} rx A regular expression.
     * @param {String} str The string to match against
     * @return {Array} The list of matches or empty array.
     * @see R.test
     * @example
     *
     *      R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']
     *      R.match(/a/, 'b'); //=> []
     *      R.match(/a/, null); //=> TypeError: null does not have a method named "match"
     */
    var match = _curry2(function match(rx, str) {
        return str.match(rx) || [];
    });

    /**
     * mathMod behaves like the modulo operator should mathematically, unlike the
     * `%` operator (and by extension, R.modulo). So while "-17 % 5" is -2,
     * mathMod(-17, 5) is 3. mathMod requires Integer arguments, and returns NaN
     * when the modulus is zero or negative.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} m The dividend.
     * @param {Number} p the modulus.
     * @return {Number} The result of `b mod a`.
     * @example
     *
     *      R.mathMod(-17, 5);  //=> 3
     *      R.mathMod(17, 5);   //=> 2
     *      R.mathMod(17, -5);  //=> NaN
     *      R.mathMod(17, 0);   //=> NaN
     *      R.mathMod(17.2, 5); //=> NaN
     *      R.mathMod(17, 5.3); //=> NaN
     *
     *      var clock = R.mathMod(R.__, 12);
     *      clock(15); //=> 3
     *      clock(24); //=> 0
     *
     *      var seventeenMod = R.mathMod(17);
     *      seventeenMod(3);  //=> 2
     *      seventeenMod(4);  //=> 1
     *      seventeenMod(10); //=> 7
     */
    var mathMod = _curry2(function mathMod(m, p) {
        if (!_isInteger(m)) {
            return NaN;
        }
        if (!_isInteger(p) || p < 1) {
            return NaN;
        }
        return (m % p + p) % p;
    });

    /**
     * Returns the larger of its two arguments.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord a => a -> a -> a
     * @param {*} a
     * @param {*} b
     * @return {*}
     * @see R.maxBy, R.min
     * @example
     *
     *      R.max(789, 123); //=> 789
     *      R.max('a', 'b'); //=> 'b'
     */
    var max = _curry2(function max(a, b) {
        return b > a ? b : a;
    });

    /**
     * Takes a function and two values, and returns whichever value produces the
     * larger result when passed to the provided function.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Relation
     * @sig Ord b => (a -> b) -> a -> a -> a
     * @param {Function} f
     * @param {*} a
     * @param {*} b
     * @return {*}
     * @see R.max, R.minBy
     * @example
     *
     *      //  square :: Number -> Number
     *      var square = n => n * n;
     *
     *      R.maxBy(square, -3, 2); //=> -3
     *
     *      R.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5
     *      R.reduce(R.maxBy(square), 0, []); //=> 0
     */
    var maxBy = _curry3(function maxBy(f, a, b) {
        return f(b) > f(a) ? b : a;
    });

    /**
     * Create a new object with the own properties of the first object merged with
     * the own properties of the second object. If a key exists in both objects,
     * the value from the second object will be used.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> {k: v} -> {k: v}
     * @param {Object} l
     * @param {Object} r
     * @return {Object}
     * @see R.mergeWith, R.mergeWithKey
     * @example
     *
     *      R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
     *      //=> { 'name': 'fred', 'age': 40 }
     *
     *      var resetToDefault = R.merge(R.__, {x: 0});
     *      resetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}
     */
    var merge = _curry2(function merge(l, r) {
        return _assign({}, l, r);
    });

    /**
     * Merges a list of objects together into one object.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category List
     * @sig [{k: v}] -> {k: v}
     * @param {Array} list An array of objects
     * @return {Object} A merged object.
     * @see R.reduce
     * @example
     *
     *      R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}
     *      R.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}
     */
    var mergeAll = _curry1(function mergeAll(list) {
        return _assign.apply(null, [{}].concat(list));
    });

    /**
     * Creates a new object with the own properties of the two provided objects. If
     * a key exists in both objects, the provided function is applied to the key
     * and the values associated with the key in each object, with the result being
     * used as the value associated with the key in the returned object. The key
     * will be excluded from the returned object if the resulting value is
     * `undefined`.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Object
     * @sig (String -> a -> a -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} l
     * @param {Object} r
     * @return {Object}
     * @see R.merge, R.mergeWith
     * @example
     *
     *      let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r
     *      R.mergeWithKey(concatValues,
     *                     { a: true, thing: 'foo', values: [10, 20] },
     *                     { b: true, thing: 'bar', values: [15, 35] });
     *      //=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }
     */
    var mergeWithKey = _curry3(function mergeWithKey(fn, l, r) {
        var result = {};
        var k;
        for (k in l) {
            if (_has(k, l)) {
                result[k] = _has(k, r) ? fn(k, l[k], r[k]) : l[k];
            }
        }
        for (k in r) {
            if (_has(k, r) && !_has(k, result)) {
                result[k] = r[k];
            }
        }
        return result;
    });

    /**
     * Returns the smaller of its two arguments.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord a => a -> a -> a
     * @param {*} a
     * @param {*} b
     * @return {*}
     * @see R.minBy, R.max
     * @example
     *
     *      R.min(789, 123); //=> 123
     *      R.min('a', 'b'); //=> 'a'
     */
    var min = _curry2(function min(a, b) {
        return b < a ? b : a;
    });

    /**
     * Takes a function and two values, and returns whichever value produces the
     * smaller result when passed to the provided function.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Relation
     * @sig Ord b => (a -> b) -> a -> a -> a
     * @param {Function} f
     * @param {*} a
     * @param {*} b
     * @return {*}
     * @see R.min, R.maxBy
     * @example
     *
     *      //  square :: Number -> Number
     *      var square = n => n * n;
     *
     *      R.minBy(square, -3, 2); //=> 2
     *
     *      R.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1
     *      R.reduce(R.minBy(square), Infinity, []); //=> Infinity
     */
    var minBy = _curry3(function minBy(f, a, b) {
        return f(b) < f(a) ? b : a;
    });

    /**
     * Divides the first parameter by the second and returns the remainder. Note
     * that this function preserves the JavaScript-style behavior for modulo. For
     * mathematical modulo see `mathMod`.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The value to the divide.
     * @param {Number} b The pseudo-modulus
     * @return {Number} The result of `b % a`.
     * @see R.mathMod
     * @example
     *
     *      R.modulo(17, 3); //=> 2
     *      // JS behavior:
     *      R.modulo(-17, 3); //=> -2
     *      R.modulo(17, -3); //=> 2
     *
     *      var isOdd = R.modulo(R.__, 2);
     *      isOdd(42); //=> 0
     *      isOdd(21); //=> 1
     */
    var modulo = _curry2(function modulo(a, b) {
        return a % b;
    });

    /**
     * Multiplies two numbers. Equivalent to `a * b` but curried.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The first value.
     * @param {Number} b The second value.
     * @return {Number} The result of `a * b`.
     * @see R.divide
     * @example
     *
     *      var double = R.multiply(2);
     *      var triple = R.multiply(3);
     *      double(3);       //=>  6
     *      triple(4);       //=> 12
     *      R.multiply(2, 5);  //=> 10
     */
    var multiply = _curry2(function multiply(a, b) {
        return a * b;
    });

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts
     * exactly `n` parameters. Any extraneous parameters will not be passed to the
     * supplied function.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig Number -> (* -> a) -> (* -> a)
     * @param {Number} n The desired arity of the new function.
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
     *         arity `n`.
     * @example
     *
     *      var takesTwoArgs = (a, b) => [a, b];
     *
     *      takesTwoArgs.length; //=> 2
     *      takesTwoArgs(1, 2); //=> [1, 2]
     *
     *      var takesOneArg = R.nAry(1, takesTwoArgs);
     *      takesOneArg.length; //=> 1
     *      // Only `n` arguments are passed to the wrapped function
     *      takesOneArg(1, 2); //=> [1, undefined]
     */
    var nAry = _curry2(function nAry(n, fn) {
        switch (n) {
        case 0:
            return function () {
                return fn.call(this);
            };
        case 1:
            return function (a0) {
                return fn.call(this, a0);
            };
        case 2:
            return function (a0, a1) {
                return fn.call(this, a0, a1);
            };
        case 3:
            return function (a0, a1, a2) {
                return fn.call(this, a0, a1, a2);
            };
        case 4:
            return function (a0, a1, a2, a3) {
                return fn.call(this, a0, a1, a2, a3);
            };
        case 5:
            return function (a0, a1, a2, a3, a4) {
                return fn.call(this, a0, a1, a2, a3, a4);
            };
        case 6:
            return function (a0, a1, a2, a3, a4, a5) {
                return fn.call(this, a0, a1, a2, a3, a4, a5);
            };
        case 7:
            return function (a0, a1, a2, a3, a4, a5, a6) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
            };
        case 8:
            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
            };
        case 9:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
            };
        case 10:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
            };
        default:
            throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
        }
    });

    /**
     * Negates its argument.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Math
     * @sig Number -> Number
     * @param {Number} n
     * @return {Number}
     * @example
     *
     *      R.negate(42); //=> -42
     */
    var negate = _curry1(function negate(n) {
        return -n;
    });

    /**
     * Returns `true` if no elements of the list match the predicate, `false`
     * otherwise.
     *
     * Dispatches to the `any` method of the second argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> Boolean
     * @param {Function} fn The predicate function.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the predicate is not satisfied by every element, `false` otherwise.
     * @see R.all, R.any
     * @example
     *
     *      var isEven = n => n % 2 === 0;
     *
     *      R.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true
     *      R.none(isEven, [1, 3, 5, 7, 8, 11]); //=> false
     */
    var none = _curry2(_complement(_dispatchable('any', _xany, any)));

    /**
     * A function that returns the `!` of its argument. It will return `true` when
     * passed false-y value, and `false` when passed a truth-y one.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Logic
     * @sig * -> Boolean
     * @param {*} a any value
     * @return {Boolean} the logical inverse of passed argument.
     * @see R.complement
     * @example
     *
     *      R.not(true); //=> false
     *      R.not(false); //=> true
     *      R.not(0); //=> true
     *      R.not(1); //=> false
     */
    var not = _curry1(function not(a) {
        return !a;
    });

    /**
     * Returns the nth element of the given list or string. If n is negative the
     * element at index length + n is returned.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Number -> [a] -> a | Undefined
     * @sig Number -> String -> String
     * @param {Number} offset
     * @param {*} list
     * @return {*}
     * @example
     *
     *      var list = ['foo', 'bar', 'baz', 'quux'];
     *      R.nth(1, list); //=> 'bar'
     *      R.nth(-1, list); //=> 'quux'
     *      R.nth(-99, list); //=> undefined
     *
     *      R.nth(2, 'abc'); //=> 'c'
     *      R.nth(3, 'abc'); //=> ''
     */
    var nth = _curry2(function nth(offset, list) {
        var idx = offset < 0 ? list.length + offset : offset;
        return _isString(list) ? list.charAt(idx) : list[idx];
    });

    /**
     * Returns a function which returns its nth argument.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Function
     * @sig Number -> *... -> *
     * @param {Number} n
     * @return {Function}
     * @example
     *
     *      R.nthArg(1)('a', 'b', 'c'); //=> 'b'
     *      R.nthArg(-1)('a', 'b', 'c'); //=> 'c'
     */
    var nthArg = _curry1(function nthArg(n) {
        var arity = n < 0 ? 1 : n + 1;
        return curryN(arity, function () {
            return nth(n, arguments);
        });
    });

    /**
     * Creates an object containing a single key:value pair.
     *
     * @func
     * @memberOf R
     * @since v0.18.0
     * @category Object
     * @sig String -> a -> {String:a}
     * @param {String} key
     * @param {*} val
     * @return {Object}
     * @see R.pair
     * @example
     *
     *      var matchPhrases = R.compose(
     *        R.objOf('must'),
     *        R.map(R.objOf('match_phrase'))
     *      );
     *      matchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}
     */
    var objOf = _curry2(function objOf(key, val) {
        var obj = {};
        obj[key] = val;
        return obj;
    });

    /**
     * Returns a singleton array containing the value provided.
     *
     * Note this `of` is different from the ES6 `of`; See
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category Function
     * @sig a -> [a]
     * @param {*} x any value
     * @return {Array} An array wrapping `x`.
     * @example
     *
     *      R.of(null); //=> [null]
     *      R.of([42]); //=> [[42]]
     */
    var of = _curry1(_of);

    /**
     * Accepts a function `fn` and returns a function that guards invocation of
     * `fn` such that `fn` can only ever be called once, no matter how many times
     * the returned function is invoked. The first value calculated is returned in
     * subsequent invocations.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (a... -> b) -> (a... -> b)
     * @param {Function} fn The function to wrap in a call-only-once wrapper.
     * @return {Function} The wrapped function.
     * @example
     *
     *      var addOneOnce = R.once(x => x + 1);
     *      addOneOnce(10); //=> 11
     *      addOneOnce(addOneOnce(50)); //=> 11
     */
    var once = _curry1(function once(fn) {
        var called = false;
        var result;
        return _arity(fn.length, function () {
            if (called) {
                return result;
            }
            called = true;
            result = fn.apply(this, arguments);
            return result;
        });
    });

    /**
     * Returns `true` if one or both of its arguments are `true`. Returns `false`
     * if both arguments are `false`.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Logic
     * @sig * -> * -> *
     * @param {Boolean} a A boolean value
     * @param {Boolean} b A boolean value
     * @return {Boolean} `true` if one or both arguments are `true`, `false` otherwise
     * @see R.either
     * @example
     *
     *      R.or(true, true); //=> true
     *      R.or(true, false); //=> true
     *      R.or(false, true); //=> true
     *      R.or(false, false); //=> false
     */
    var or = _curry2(function or(a, b) {
        return a || b;
    });

    /**
     * Returns the result of "setting" the portion of the given data structure
     * focused by the given lens to the result of applying the given function to
     * the focused value.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig Lens s a -> (a -> a) -> s -> s
     * @param {Lens} lens
     * @param {*} v
     * @param {*} x
     * @return {*}
     * @see R.prop, R.lensIndex, R.lensProp
     * @example
     *
     *      var headLens = R.lensIndex(0);
     *
     *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
     */
    // `Identity` is a functor that holds a single value, where `map` simply
    // transforms the held value with the provided function.
    // The value returned by the getter function is first transformed with `f`,
    // then set as the value of an `Identity`. This is then mapped over with the
    // setter function of the lens.
    var over = function () {
        // `Identity` is a functor that holds a single value, where `map` simply
        // transforms the held value with the provided function.
        var Identity = function (x) {
            return {
                value: x,
                map: function (f) {
                    return Identity(f(x));
                }
            };
        };
        return _curry3(function over(lens, f, x) {
            // The value returned by the getter function is first transformed with `f`,
            // then set as the value of an `Identity`. This is then mapped over with the
            // setter function of the lens.
            return lens(function (y) {
                return Identity(f(y));
            })(x).value;
        });
    }();

    /**
     * Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.
     *
     * @func
     * @memberOf R
     * @since v0.18.0
     * @category List
     * @sig a -> b -> (a,b)
     * @param {*} fst
     * @param {*} snd
     * @return {Array}
     * @see R.objOf, R.of
     * @example
     *
     *      R.pair('foo', 'bar'); //=> ['foo', 'bar']
     */
    var pair = _curry2(function pair(fst, snd) {
        return [
            fst,
            snd
        ];
    });

    /**
     * Retrieve the value at a given path.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Object
     * @sig [String] -> {k: v} -> v | Undefined
     * @param {Array} path The path to use.
     * @param {Object} obj The object to retrieve the nested property from.
     * @return {*} The data at `path`.
     * @see R.prop
     * @example
     *
     *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
     *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
     */
    var path = _curry2(function path(paths, obj) {
        var val = obj;
        var idx = 0;
        while (idx < paths.length) {
            if (val == null) {
                return;
            }
            val = val[paths[idx]];
            idx += 1;
        }
        return val;
    });

    /**
     * If the given, non-null object has a value at the given path, returns the
     * value at that path. Otherwise returns the provided default value.
     *
     * @func
     * @memberOf R
     * @since v0.18.0
     * @category Object
     * @sig a -> [String] -> Object -> a
     * @param {*} d The default value.
     * @param {Array} p The path to use.
     * @param {Object} obj The object to retrieve the nested property from.
     * @return {*} The data at `path` of the supplied object or the default value.
     * @example
     *
     *      R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2
     *      R.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> "N/A"
     */
    var pathOr = _curry3(function pathOr(d, p, obj) {
        return defaultTo(d, path(p, obj));
    });

    /**
     * Returns `true` if the specified object property at given path satisfies the
     * given predicate; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Logic
     * @sig (a -> Boolean) -> [String] -> Object -> Boolean
     * @param {Function} pred
     * @param {Array} propPath
     * @param {*} obj
     * @return {Boolean}
     * @see R.propSatisfies, R.path
     * @example
     *
     *      R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true
     */
    var pathSatisfies = _curry3(function pathSatisfies(pred, propPath, obj) {
        return propPath.length > 0 && pred(path(propPath, obj));
    });

    /**
     * Returns a partial copy of an object containing only the keys specified. If
     * the key does not exist, the property is ignored.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig [k] -> {k: v} -> {k: v}
     * @param {Array} names an array of String property names to copy onto a new object
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties from `names` on it.
     * @see R.omit, R.props
     * @example
     *
     *      R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
     *      R.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}
     */
    var pick = _curry2(function pick(names, obj) {
        var result = {};
        var idx = 0;
        while (idx < names.length) {
            if (names[idx] in obj) {
                result[names[idx]] = obj[names[idx]];
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Similar to `pick` except that this one includes a `key: undefined` pair for
     * properties that don't exist.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig [k] -> {k: v} -> {k: v}
     * @param {Array} names an array of String property names to copy onto a new object
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties from `names` on it.
     * @see R.pick
     * @example
     *
     *      R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}
     *      R.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}
     */
    var pickAll = _curry2(function pickAll(names, obj) {
        var result = {};
        var idx = 0;
        var len = names.length;
        while (idx < len) {
            var name = names[idx];
            result[name] = obj[name];
            idx += 1;
        }
        return result;
    });

    /**
     * Returns a partial copy of an object containing only the keys that satisfy
     * the supplied predicate.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @sig (v, k -> Boolean) -> {k: v} -> {k: v}
     * @param {Function} pred A predicate to determine whether or not a key
     *        should be included on the output object.
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with only properties that satisfy `pred`
     *         on it.
     * @see R.pick, R.filter
     * @example
     *
     *      var isUpperCase = (val, key) => key.toUpperCase() === key;
     *      R.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}
     */
    var pickBy = _curry2(function pickBy(test, obj) {
        var result = {};
        for (var prop in obj) {
            if (test(obj[prop], prop, obj)) {
                result[prop] = obj[prop];
            }
        }
        return result;
    });

    /**
     * Returns a new list with the given element at the front, followed by the
     * contents of the list.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig a -> [a] -> [a]
     * @param {*} el The item to add to the head of the output list.
     * @param {Array} list The array to add to the tail of the output list.
     * @return {Array} A new array.
     * @see R.append
     * @example
     *
     *      R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']
     */
    var prepend = _curry2(function prepend(el, list) {
        return _concat([el], list);
    });

    /**
     * Returns a function that when supplied an object returns the indicated
     * property of that object, if it exists.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig s -> {s: a} -> a | Undefined
     * @param {String} p The property name
     * @param {Object} obj The object to query
     * @return {*} The value at `obj.p`.
     * @see R.path
     * @example
     *
     *      R.prop('x', {x: 100}); //=> 100
     *      R.prop('x', {}); //=> undefined
     */
    var prop = _curry2(function prop(p, obj) {
        return obj[p];
    });

    /**
     * Returns `true` if the specified object property is of the given type;
     * `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Type
     * @sig Type -> String -> Object -> Boolean
     * @param {Function} type
     * @param {String} name
     * @param {*} obj
     * @return {Boolean}
     * @see R.is, R.propSatisfies
     * @example
     *
     *      R.propIs(Number, 'x', {x: 1, y: 2});  //=> true
     *      R.propIs(Number, 'x', {x: 'foo'});    //=> false
     *      R.propIs(Number, 'x', {});            //=> false
     */
    var propIs = _curry3(function propIs(type, name, obj) {
        return is(type, obj[name]);
    });

    /**
     * If the given, non-null object has an own property with the specified name,
     * returns the value of that property. Otherwise returns the provided default
     * value.
     *
     * @func
     * @memberOf R
     * @since v0.6.0
     * @category Object
     * @sig a -> String -> Object -> a
     * @param {*} val The default value.
     * @param {String} p The name of the property to return.
     * @param {Object} obj The object to query.
     * @return {*} The value of given property of the supplied object or the default value.
     * @example
     *
     *      var alice = {
     *        name: 'ALICE',
     *        age: 101
     *      };
     *      var favorite = R.prop('favoriteLibrary');
     *      var favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');
     *
     *      favorite(alice);  //=> undefined
     *      favoriteWithDefault(alice);  //=> 'Ramda'
     */
    var propOr = _curry3(function propOr(val, p, obj) {
        return obj != null && _has(p, obj) ? obj[p] : val;
    });

    /**
     * Returns `true` if the specified object property satisfies the given
     * predicate; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Logic
     * @sig (a -> Boolean) -> String -> {String: a} -> Boolean
     * @param {Function} pred
     * @param {String} name
     * @param {*} obj
     * @return {Boolean}
     * @see R.propEq, R.propIs
     * @example
     *
     *      R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true
     */
    var propSatisfies = _curry3(function propSatisfies(pred, name, obj) {
        return pred(obj[name]);
    });

    /**
     * Acts as multiple `prop`: array of keys in, array of values out. Preserves
     * order.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig [k] -> {k: v} -> [v]
     * @param {Array} ps The property names to fetch
     * @param {Object} obj The object to query
     * @return {Array} The corresponding values or partially applied function.
     * @example
     *
     *      R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]
     *      R.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]
     *
     *      var fullName = R.compose(R.join(' '), R.props(['first', 'last']));
     *      fullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'
     */
    var props = _curry2(function props(ps, obj) {
        var len = ps.length;
        var out = [];
        var idx = 0;
        while (idx < len) {
            out[idx] = obj[ps[idx]];
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a list of numbers from `from` (inclusive) to `to` (exclusive).
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Number -> Number -> [Number]
     * @param {Number} from The first number in the list.
     * @param {Number} to One more than the last number in the list.
     * @return {Array} The list of numbers in tthe set `[a, b)`.
     * @example
     *
     *      R.range(1, 5);    //=> [1, 2, 3, 4]
     *      R.range(50, 53);  //=> [50, 51, 52]
     */
    var range = _curry2(function range(from, to) {
        if (!(_isNumber(from) && _isNumber(to))) {
            throw new TypeError('Both arguments to range must be numbers');
        }
        var result = [];
        var n = from;
        while (n < to) {
            result.push(n);
            n += 1;
        }
        return result;
    });

    /**
     * Returns a single item by iterating through the list, successively calling
     * the iterator function and passing it an accumulator value and the current
     * value from the array, and then passing the result to the next call.
     *
     * Similar to `reduce`, except moves through the input list from the right to
     * the left.
     *
     * The iterator function receives two values: *(acc, value)*
     *
     * Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse
     * arrays), unlike the native `Array.prototype.reduce` method. For more details
     * on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a,b -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.addIndex
     * @example
     *
     *      var pairs = [ ['a', 1], ['b', 2], ['c', 3] ];
     *      var flattenPairs = (acc, pair) => acc.concat(pair);
     *
     *      R.reduceRight(flattenPairs, [], pairs); //=> [ 'c', 3, 'b', 2, 'a', 1 ]
     */
    var reduceRight = _curry3(function reduceRight(fn, acc, list) {
        var idx = list.length - 1;
        while (idx >= 0) {
            acc = fn(acc, list[idx]);
            idx -= 1;
        }
        return acc;
    });

    /**
     * Returns a value wrapped to indicate that it is the final value of the reduce
     * and transduce functions. The returned value should be considered a black
     * box: the internal structure is not guaranteed to be stable.
     *
     * Note: this optimization is unavailable to functions not explicitly listed
     * above. For instance, it is not currently supported by reduceRight.
     *
     * @func
     * @memberOf R
     * @since v0.15.0
     * @category List
     * @sig a -> *
     * @param {*} x The final value of the reduce.
     * @return {*} The wrapped value.
     * @see R.reduce, R.transduce
     * @example
     *
     *      R.reduce(
     *        R.pipe(R.add, R.when(R.gte(R.__, 10), R.reduced)),
     *        0,
     *        [1, 2, 3, 4, 5]) // 10
     */
    var reduced = _curry1(_reduced);

    /**
     * Removes the sub-list of `list` starting at index `start` and containing
     * `count` elements. _Note that this is not destructive_: it returns a copy of
     * the list with the changes.
     * <small>No lists have been harmed in the application of this function.</small>
     *
     * @func
     * @memberOf R
     * @since v0.2.2
     * @category List
     * @sig Number -> Number -> [a] -> [a]
     * @param {Number} start The position to start removing elements
     * @param {Number} count The number of elements to remove
     * @param {Array} list The list to remove from
     * @return {Array} A new Array with `count` elements from `start` removed.
     * @example
     *
     *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
     */
    var remove = _curry3(function remove(start, count, list) {
        return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
    });

    /**
     * Replace a substring or regex match in a string with a replacement.
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category String
     * @sig RegExp|String -> String -> String -> String
     * @param {RegExp|String} pattern A regular expression or a substring to match.
     * @param {String} replacement The string to replace the matches with.
     * @param {String} str The String to do the search and replacement in.
     * @return {String} The result.
     * @example
     *
     *      R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'
     *      R.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'
     *
     *      // Use the "g" (global) flag to replace all occurrences:
     *      R.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'
     */
    var replace = _curry3(function replace(regex, replacement, str) {
        return str.replace(regex, replacement);
    });

    /**
     * Returns a new list or string with the elements or characters in reverse
     * order.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a]
     * @sig String -> String
     * @param {Array|String} list
     * @return {Array|String}
     * @example
     *
     *      R.reverse([1, 2, 3]);  //=> [3, 2, 1]
     *      R.reverse([1, 2]);     //=> [2, 1]
     *      R.reverse([1]);        //=> [1]
     *      R.reverse([]);         //=> []
     *
     *      R.reverse('abc');      //=> 'cba'
     *      R.reverse('ab');       //=> 'ba'
     *      R.reverse('a');        //=> 'a'
     *      R.reverse('');         //=> ''
     */
    var reverse = _curry1(function reverse(list) {
        return _isString(list) ? list.split('').reverse().join('') : _slice(list).reverse();
    });

    /**
     * Scan is similar to reduce, but returns a list of successively reduced values
     * from the left
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category List
     * @sig (a,b -> a) -> a -> [b] -> [a]
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {Array} A list of all intermediately reduced values.
     * @example
     *
     *      var numbers = [1, 2, 3, 4];
     *      var factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]
     */
    var scan = _curry3(function scan(fn, acc, list) {
        var idx = 0;
        var len = list.length;
        var result = [acc];
        while (idx < len) {
            acc = fn(acc, list[idx]);
            result[idx + 1] = acc;
            idx += 1;
        }
        return result;
    });

    /**
     * Returns the result of "setting" the portion of the given data structure
     * focused by the given lens to the given value.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig Lens s a -> a -> s -> s
     * @param {Lens} lens
     * @param {*} v
     * @param {*} x
     * @return {*}
     * @see R.prop, R.lensIndex, R.lensProp
     * @example
     *
     *      var xLens = R.lensProp('x');
     *
     *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
     *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
     */
    var set = _curry3(function set(lens, v, x) {
        return over(lens, always(v), x);
    });

    /**
     * Returns the elements of the given list or string (or object with a `slice`
     * method) from `fromIndex` (inclusive) to `toIndex` (exclusive).
     *
     * Dispatches to the `slice` method of the third argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.4
     * @category List
     * @sig Number -> Number -> [a] -> [a]
     * @sig Number -> Number -> String -> String
     * @param {Number} fromIndex The start index (inclusive).
     * @param {Number} toIndex The end index (exclusive).
     * @param {*} list
     * @return {*}
     * @example
     *
     *      R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']
     *      R.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']
     *      R.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']
     *      R.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']
     *      R.slice(0, 3, 'ramda');                     //=> 'ram'
     */
    var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, list) {
        return Array.prototype.slice.call(list, fromIndex, toIndex);
    }));

    /**
     * Returns a copy of the list, sorted according to the comparator function,
     * which should accept two values at a time and return a negative number if the
     * first value is smaller, a positive number if it's larger, and zero if they
     * are equal. Please note that this is a **copy** of the list. It does not
     * modify the original.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a,a -> Number) -> [a] -> [a]
     * @param {Function} comparator A sorting function :: a -> b -> Int
     * @param {Array} list The list to sort
     * @return {Array} a new array with its elements sorted by the comparator function.
     * @example
     *
     *      var diff = function(a, b) { return a - b; };
     *      R.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]
     */
    var sort = _curry2(function sort(comparator, list) {
        return _slice(list).sort(comparator);
    });

    /**
     * Sorts the list according to the supplied function.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig Ord b => (a -> b) -> [a] -> [a]
     * @param {Function} fn
     * @param {Array} list The list to sort.
     * @return {Array} A new list sorted by the keys generated by `fn`.
     * @example
     *
     *      var sortByFirstItem = R.sortBy(R.prop(0));
     *      var sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));
     *      var pairs = [[-1, 1], [-2, 2], [-3, 3]];
     *      sortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]
     *      var alice = {
     *        name: 'ALICE',
     *        age: 101
     *      };
     *      var bob = {
     *        name: 'Bob',
     *        age: -10
     *      };
     *      var clara = {
     *        name: 'clara',
     *        age: 314.159
     *      };
     *      var people = [clara, bob, alice];
     *      sortByNameCaseInsensitive(people); //=> [alice, bob, clara]
     */
    var sortBy = _curry2(function sortBy(fn, list) {
        return _slice(list).sort(function (a, b) {
            var aa = fn(a);
            var bb = fn(b);
            return aa < bb ? -1 : aa > bb ? 1 : 0;
        });
    });

    /**
     * Splits a given list or string at a given index.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig Number -> [a] -> [[a], [a]]
     * @sig Number -> String -> [String, String]
     * @param {Number} index The index where the array/string is split.
     * @param {Array|String} array The array/string to be split.
     * @return {Array}
     * @example
     *
     *      R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]
     *      R.splitAt(5, 'hello world');      //=> ['hello', ' world']
     *      R.splitAt(-1, 'foobar');          //=> ['fooba', 'r']
     */
    var splitAt = _curry2(function splitAt(index, array) {
        return [
            slice(0, index, array),
            slice(index, length(array), array)
        ];
    });

    /**
     * Splits a collection into slices of the specified length.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category List
     * @sig Number -> [a] -> [[a]]
     * @sig Number -> String -> [String]
     * @param {Number} n
     * @param {Array} list
     * @return {Array}
     * @example
     *
     *      R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]
     *      R.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']
     */
    var splitEvery = _curry2(function splitEvery(n, list) {
        if (n <= 0) {
            throw new Error('First argument to splitEvery must be a positive integer');
        }
        var result = [];
        var idx = 0;
        while (idx < list.length) {
            result.push(slice(idx, idx += n, list));
        }
        return result;
    });

    /**
     * Takes a list and a predicate and returns a pair of lists with the following properties:
     *
     *  - the result of concatenating the two output lists is equivalent to the input list;
     *  - none of the elements of the first output list satisfies the predicate; and
     *  - if the second output list is non-empty, its first element satisfies the predicate.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> [[a], [a]]
     * @param {Function} pred The predicate that determines where the array is split.
     * @param {Array} list The array to be split.
     * @return {Array}
     * @example
     *
     *      R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]
     */
    var splitWhen = _curry2(function splitWhen(pred, list) {
        var idx = 0;
        var len = list.length;
        var prefix = [];
        while (idx < len && !pred(list[idx])) {
            prefix.push(list[idx]);
            idx += 1;
        }
        return [
            prefix,
            _slice(list, idx)
        ];
    });

    /**
     * Subtracts its second argument from its first argument.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Math
     * @sig Number -> Number -> Number
     * @param {Number} a The first value.
     * @param {Number} b The second value.
     * @return {Number} The result of `a - b`.
     * @see R.add
     * @example
     *
     *      R.subtract(10, 8); //=> 2
     *
     *      var minus5 = R.subtract(R.__, 5);
     *      minus5(17); //=> 12
     *
     *      var complementaryAngle = R.subtract(90);
     *      complementaryAngle(30); //=> 60
     *      complementaryAngle(72); //=> 18
     */
    var subtract = _curry2(function subtract(a, b) {
        return Number(a) - Number(b);
    });

    /**
     * Returns all but the first element of the given list or string (or object
     * with a `tail` method).
     *
     * Dispatches to the `slice` method of the first argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a]
     * @sig String -> String
     * @param {*} list
     * @return {*}
     * @see R.head, R.init, R.last
     * @example
     *
     *      R.tail([1, 2, 3]);  //=> [2, 3]
     *      R.tail([1, 2]);     //=> [2]
     *      R.tail([1]);        //=> []
     *      R.tail([]);         //=> []
     *
     *      R.tail('abc');  //=> 'bc'
     *      R.tail('ab');   //=> 'b'
     *      R.tail('a');    //=> ''
     *      R.tail('');     //=> ''
     */
    var tail = _checkForMethod('tail', slice(1, Infinity));

    /**
     * Returns the first `n` elements of the given list, string, or
     * transducer/transformer (or object with a `take` method).
     *
     * Dispatches to the `take` method of the second argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Number -> [a] -> [a]
     * @sig Number -> String -> String
     * @param {Number} n
     * @param {*} list
     * @return {*}
     * @see R.drop
     * @example
     *
     *      R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']
     *      R.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
     *      R.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
     *      R.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
     *      R.take(3, 'ramda');               //=> 'ram'
     *
     *      var personnel = [
     *        'Dave Brubeck',
     *        'Paul Desmond',
     *        'Eugene Wright',
     *        'Joe Morello',
     *        'Gerry Mulligan',
     *        'Bob Bates',
     *        'Joe Dodge',
     *        'Ron Crotty'
     *      ];
     *
     *      var takeFive = R.take(5);
     *      takeFive(personnel);
     *      //=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']
     */
    var take = _curry2(_dispatchable('take', _xtake, function take(n, xs) {
        return slice(0, n < 0 ? Infinity : n, xs);
    }));

    /**
     * Returns a new list containing the last `n` elements of a given list, passing
     * each value to the supplied predicate function, and terminating when the
     * predicate function returns `false`. Excludes the element that caused the
     * predicate function to fail. The predicate function is passed one argument:
     * *(value)*.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} A new array.
     * @see R.dropLastWhile, R.addIndex
     * @example
     *
     *      var isNotOne = x => x !== 1;
     *
     *      R.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]
     */
    var takeLastWhile = _curry2(function takeLastWhile(fn, list) {
        var idx = list.length - 1;
        while (idx >= 0 && fn(list[idx])) {
            idx -= 1;
        }
        return _slice(list, idx + 1, Infinity);
    });

    /**
     * Returns a new list containing the first `n` elements of a given list,
     * passing each value to the supplied predicate function, and terminating when
     * the predicate function returns `false`. Excludes the element that caused the
     * predicate function to fail. The predicate function is passed one argument:
     * *(value)*.
     *
     * Dispatches to the `takeWhile` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} A new array.
     * @see R.dropWhile, R.transduce, R.addIndex
     * @example
     *
     *      var isNotFour = x => x !== 4;
     *
     *      R.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]
     */
    var takeWhile = _curry2(_dispatchable('takeWhile', _xtakeWhile, function takeWhile(fn, list) {
        var idx = 0;
        var len = list.length;
        while (idx < len && fn(list[idx])) {
            idx += 1;
        }
        return _slice(list, 0, idx);
    }));

    /**
     * Runs the given function with the supplied object, then returns the object.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (a -> *) -> a -> a
     * @param {Function} fn The function to call with `x`. The return value of `fn` will be thrown away.
     * @param {*} x
     * @return {*} `x`.
     * @example
     *
     *      var sayX = x => console.log('x is ' + x);
     *      R.tap(sayX, 100); //=> 100
     *      // logs 'x is 100'
     */
    var tap = _curry2(function tap(fn, x) {
        fn(x);
        return x;
    });

    /**
     * Calls an input function `n` times, returning an array containing the results
     * of those function calls.
     *
     * `fn` is passed one argument: The current value of `n`, which begins at `0`
     * and is gradually incremented to `n - 1`.
     *
     * @func
     * @memberOf R
     * @since v0.2.3
     * @category List
     * @sig (Number -> a) -> Number -> [a]
     * @param {Function} fn The function to invoke. Passed one argument, the current value of `n`.
     * @param {Number} n A value between `0` and `n - 1`. Increments after each function call.
     * @return {Array} An array containing the return values of all calls to `fn`.
     * @example
     *
     *      R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]
     */
    var times = _curry2(function times(fn, n) {
        var len = Number(n);
        var idx = 0;
        var list;
        if (len < 0 || isNaN(len)) {
            throw new RangeError('n must be a non-negative number');
        }
        list = new Array(len);
        while (idx < len) {
            list[idx] = fn(idx);
            idx += 1;
        }
        return list;
    });

    /**
     * Converts an object into an array of key, value arrays. Only the object's
     * own properties are used.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.4.0
     * @category Object
     * @sig {String: *} -> [[String,*]]
     * @param {Object} obj The object to extract from
     * @return {Array} An array of key, value arrays from the object's own properties.
     * @see R.fromPairs
     * @example
     *
     *      R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]
     */
    var toPairs = _curry1(function toPairs(obj) {
        var pairs = [];
        for (var prop in obj) {
            if (_has(prop, obj)) {
                pairs[pairs.length] = [
                    prop,
                    obj[prop]
                ];
            }
        }
        return pairs;
    });

    /**
     * Converts an object into an array of key, value arrays. The object's own
     * properties and prototype properties are used. Note that the order of the
     * output array is not guaranteed to be consistent across different JS
     * platforms.
     *
     * @func
     * @memberOf R
     * @since v0.4.0
     * @category Object
     * @sig {String: *} -> [[String,*]]
     * @param {Object} obj The object to extract from
     * @return {Array} An array of key, value arrays from the object's own
     *         and prototype properties.
     * @example
     *
     *      var F = function() { this.x = 'X'; };
     *      F.prototype.y = 'Y';
     *      var f = new F();
     *      R.toPairsIn(f); //=> [['x','X'], ['y','Y']]
     */
    var toPairsIn = _curry1(function toPairsIn(obj) {
        var pairs = [];
        for (var prop in obj) {
            pairs[pairs.length] = [
                prop,
                obj[prop]
            ];
        }
        return pairs;
    });

    /**
     * Transposes the rows and columns of a 2D list.
     * When passed a list of `n` lists of length `x`,
     * returns a list of `x` lists of length `n`.
     *
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig [[a]] -> [[a]]
     * @param {Array} list A 2D list
     * @return {Array} A 2D list
     * @example
     *
     *      R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]
     *      R.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]
     *
     * If some of the rows are shorter than the following rows, their elements are skipped:
     *
     *      R.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]
     */
    var transpose = _curry1(function transpose(outerlist) {
        var i = 0;
        var result = [];
        while (i < outerlist.length) {
            var innerlist = outerlist[i];
            var j = 0;
            while (j < innerlist.length) {
                if (typeof result[j] === 'undefined') {
                    result[j] = [];
                }
                result[j].push(innerlist[j]);
                j += 1;
            }
            i += 1;
        }
        return result;
    });

    /**
     * Removes (strips) whitespace from both ends of the string.
     *
     * @func
     * @memberOf R
     * @since v0.6.0
     * @category String
     * @sig String -> String
     * @param {String} str The string to trim.
     * @return {String} Trimmed version of `str`.
     * @example
     *
     *      R.trim('   xyz  '); //=> 'xyz'
     *      R.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']
     */
    var trim = function () {
        var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
        var zeroWidth = '\u200B';
        var hasProtoTrim = typeof String.prototype.trim === 'function';
        if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
            return _curry1(function trim(str) {
                var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
                var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
                return str.replace(beginRx, '').replace(endRx, '');
            });
        } else {
            return _curry1(function trim(str) {
                return str.trim();
            });
        }
    }();

    /**
     * `tryCatch` takes two functions, a `tryer` and a `catcher`. The returned
     * function evaluates the `tryer`; if it does not throw, it simply returns the
     * result. If the `tryer` *does* throw, the returned function evaluates the
     * `catcher` function and returns its result. Note that for effective
     * composition with this function, both the `tryer` and `catcher` functions
     * must return the same type of results.
     *
     * @func
     * @memberOf R
     * @since v0.20.0
     * @category Function
     * @sig (...x -> a) -> ((e, ...x) -> a) -> (...x -> a)
     * @param {Function} tryer The function that may throw.
     * @param {Function} catcher The function that will be evaluated if `tryer` throws.
     * @return {Function} A new function that will catch exceptions and send then to the catcher.
     * @example
     *
     *      R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true
     *      R.tryCatch(R.prop('x'), R.F)(null);      //=> false
     */
    var tryCatch = _curry2(function _tryCatch(tryer, catcher) {
        return _arity(tryer.length, function () {
            try {
                return tryer.apply(this, arguments);
            } catch (e) {
                return catcher.apply(this, _concat([e], arguments));
            }
        });
    });

    /**
     * Gives a single-word string description of the (native) type of a value,
     * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
     * attempt to distinguish user Object types any further, reporting them all as
     * 'Object'.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Type
     * @sig (* -> {*}) -> String
     * @param {*} val The value to test
     * @return {String}
     * @example
     *
     *      R.type({}); //=> "Object"
     *      R.type(1); //=> "Number"
     *      R.type(false); //=> "Boolean"
     *      R.type('s'); //=> "String"
     *      R.type(null); //=> "Null"
     *      R.type([]); //=> "Array"
     *      R.type(/[A-z]/); //=> "RegExp"
     */
    var type = _curry1(function type(val) {
        return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
    });

    /**
     * Takes a function `fn`, which takes a single array argument, and returns a
     * function which:
     *
     *   - takes any number of positional arguments;
     *   - passes these arguments to `fn` as an array; and
     *   - returns the result.
     *
     * In other words, R.unapply derives a variadic function from a function which
     * takes an array. R.unapply is the inverse of R.apply.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Function
     * @sig ([*...] -> a) -> (*... -> a)
     * @param {Function} fn
     * @return {Function}
     * @see R.apply
     * @example
     *
     *      R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'
     */
    var unapply = _curry1(function unapply(fn) {
        return function () {
            return fn(_slice(arguments));
        };
    });

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts
     * exactly 1 parameter. Any extraneous parameters will not be passed to the
     * supplied function.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Function
     * @sig (* -> b) -> (a -> b)
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
     *         arity 1.
     * @example
     *
     *      var takesTwoArgs = function(a, b) {
     *        return [a, b];
     *      };
     *      takesTwoArgs.length; //=> 2
     *      takesTwoArgs(1, 2); //=> [1, 2]
     *
     *      var takesOneArg = R.unary(takesTwoArgs);
     *      takesOneArg.length; //=> 1
     *      // Only 1 argument is passed to the wrapped function
     *      takesOneArg(1, 2); //=> [1, undefined]
     */
    var unary = _curry1(function unary(fn) {
        return nAry(1, fn);
    });

    /**
     * Returns a function of arity `n` from a (manually) curried function.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category Function
     * @sig Number -> (a -> b) -> (a -> c)
     * @param {Number} length The arity for the returned function.
     * @param {Function} fn The function to uncurry.
     * @return {Function} A new function.
     * @see R.curry
     * @example
     *
     *      var addFour = a => b => c => d => a + b + c + d;
     *
     *      var uncurriedAddFour = R.uncurryN(4, addFour);
     *      uncurriedAddFour(1, 2, 3, 4); //=> 10
     */
    var uncurryN = _curry2(function uncurryN(depth, fn) {
        return curryN(depth, function () {
            var currentDepth = 1;
            var value = fn;
            var idx = 0;
            var endIdx;
            while (currentDepth <= depth && typeof value === 'function') {
                endIdx = currentDepth === depth ? arguments.length : idx + value.length;
                value = value.apply(this, _slice(arguments, idx, endIdx));
                currentDepth += 1;
                idx = endIdx;
            }
            return value;
        });
    });

    /**
     * Builds a list from a seed value. Accepts an iterator function, which returns
     * either false to stop iteration or an array of length 2 containing the value
     * to add to the resulting list and the seed to be used in the next call to the
     * iterator function.
     *
     * The iterator function receives one argument: *(seed)*.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category List
     * @sig (a -> [b]) -> * -> [b]
     * @param {Function} fn The iterator function. receives one argument, `seed`, and returns
     *        either false to quit iteration or an array of length two to proceed. The element
     *        at index 0 of this array will be added to the resulting array, and the element
     *        at index 1 will be passed to the next call to `fn`.
     * @param {*} seed The seed value.
     * @return {Array} The final list.
     * @example
     *
     *      var f = n => n > 50 ? false : [-n, n + 10];
     *      R.unfold(f, 10); //=> [-10, -20, -30, -40, -50]
     */
    var unfold = _curry2(function unfold(fn, seed) {
        var pair = fn(seed);
        var result = [];
        while (pair && pair.length) {
            result[result.length] = pair[0];
            pair = fn(pair[1]);
        }
        return result;
    });

    /**
     * Returns a new list containing only one copy of each element in the original
     * list, based upon the value returned by applying the supplied predicate to
     * two list elements. Prefers the first item if two items compare equal based
     * on the predicate.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category List
     * @sig (a, a -> Boolean) -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list The array to consider.
     * @return {Array} The list of unique items.
     * @example
     *
     *      var strEq = R.eqBy(String);
     *      R.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]
     *      R.uniqWith(strEq)([{}, {}]);       //=> [{}]
     *      R.uniqWith(strEq)([1, '1', 1]);    //=> [1]
     *      R.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']
     */
    var uniqWith = _curry2(function uniqWith(pred, list) {
        var idx = 0;
        var len = list.length;
        var result = [];
        var item;
        while (idx < len) {
            item = list[idx];
            if (!_containsWith(pred, item, result)) {
                result[result.length] = item;
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Tests the final argument by passing it to the given predicate function. If
     * the predicate is not satisfied, the function will return the result of
     * calling the `whenFalseFn` function with the same argument. If the predicate
     * is satisfied, the argument is returned as is.
     *
     * @func
     * @memberOf R
     * @since v0.18.0
     * @category Logic
     * @sig (a -> Boolean) -> (a -> a) -> a -> a
     * @param {Function} pred        A predicate function
     * @param {Function} whenFalseFn A function to invoke when the `pred` evaluates
     *                               to a falsy value.
     * @param {*}        x           An object to test with the `pred` function and
     *                               pass to `whenFalseFn` if necessary.
     * @return {*} Either `x` or the result of applying `x` to `whenFalseFn`.
     * @see R.ifElse, R.when
     * @example
     *
     *      // coerceArray :: (a|[a]) -> [a]
     *      var coerceArray = R.unless(R.isArrayLike, R.of);
     *      coerceArray([1, 2, 3]); //=> [1, 2, 3]
     *      coerceArray(1);         //=> [1]
     */
    var unless = _curry3(function unless(pred, whenFalseFn, x) {
        return pred(x) ? x : whenFalseFn(x);
    });

    /**
     * Takes a predicate, a transformation function, and an initial value,
     * and returns a value of the same type as the initial value.
     * It does so by applying the transformation until the predicate is satisfied,
     * at which point it returns the satisfactory value.
     *
     * @func
     * @memberOf R
     * @since v0.20.0
     * @category Logic
     * @sig (a -> Boolean) -> (a -> a) -> a -> a
     * @param {Function} pred A predicate function
     * @param {Function} fn The iterator function
     * @param {*} init Initial value
     * @return {*} Final value that satisfies predicate
     * @example
     *
     *      R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128
     */
    var until = _curry3(function until(pred, fn, init) {
        var val = init;
        while (!pred(val)) {
            val = fn(val);
        }
        return val;
    });

    /**
     * Returns a new copy of the array with the element at the provided index
     * replaced with the given value.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category List
     * @sig Number -> a -> [a] -> [a]
     * @param {Number} idx The index to update.
     * @param {*} x The value to exist at the given index of the returned array.
     * @param {Array|Arguments} list The source array-like object to be updated.
     * @return {Array} A copy of `list` with the value at index `idx` replaced with `x`.
     * @see R.adjust
     * @example
     *
     *      R.update(1, 11, [0, 1, 2]);     //=> [0, 11, 2]
     *      R.update(1)(11)([0, 1, 2]);     //=> [0, 11, 2]
     */
    var update = _curry3(function update(idx, x, list) {
        return adjust(always(x), idx, list);
    });

    /**
     * Accepts a function `fn` and a list of transformer functions and returns a
     * new curried function. When the new function is invoked, it calls the
     * function `fn` with parameters consisting of the result of calling each
     * supplied handler on successive arguments to the new function.
     *
     * If more arguments are passed to the returned function than transformer
     * functions, those arguments are passed directly to `fn` as additional
     * parameters. If you expect additional arguments that don't need to be
     * transformed, although you can ignore them, it's best to pass an identity
     * function so that the new function reports the correct arity.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (x1 -> x2 -> ... -> z) -> [(a -> x1), (b -> x2), ...] -> (a -> b -> ... -> z)
     * @param {Function} fn The function to wrap.
     * @param {Array} transformers A list of transformer functions
     * @return {Function} The wrapped function.
     * @example
     *
     *      R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81
     *      R.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81
     *      R.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32
     *      R.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32
     */
    var useWith = _curry2(function useWith(fn, transformers) {
        return curryN(transformers.length, function () {
            var args = [];
            var idx = 0;
            while (idx < transformers.length) {
                args.push(transformers[idx].call(this, arguments[idx]));
                idx += 1;
            }
            return fn.apply(this, args.concat(_slice(arguments, transformers.length)));
        });
    });

    /**
     * Returns a list of all the enumerable own properties of the supplied object.
     * Note that the order of the output array is not guaranteed across different
     * JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {k: v} -> [v]
     * @param {Object} obj The object to extract values from
     * @return {Array} An array of the values of the object's own properties.
     * @example
     *
     *      R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]
     */
    var values = _curry1(function values(obj) {
        var props = keys(obj);
        var len = props.length;
        var vals = [];
        var idx = 0;
        while (idx < len) {
            vals[idx] = obj[props[idx]];
            idx += 1;
        }
        return vals;
    });

    /**
     * Returns a list of all the properties, including prototype properties, of the
     * supplied object.
     * Note that the order of the output array is not guaranteed to be consistent
     * across different JS platforms.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Object
     * @sig {k: v} -> [v]
     * @param {Object} obj The object to extract values from
     * @return {Array} An array of the values of the object's own and prototype properties.
     * @example
     *
     *      var F = function() { this.x = 'X'; };
     *      F.prototype.y = 'Y';
     *      var f = new F();
     *      R.valuesIn(f); //=> ['X', 'Y']
     */
    var valuesIn = _curry1(function valuesIn(obj) {
        var prop;
        var vs = [];
        for (prop in obj) {
            vs[vs.length] = obj[prop];
        }
        return vs;
    });

    /**
     * Returns a "view" of the given data structure, determined by the given lens.
     * The lens's focus determines which portion of the data structure is visible.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig Lens s a -> s -> a
     * @param {Lens} lens
     * @param {*} x
     * @return {*}
     * @see R.prop, R.lensIndex, R.lensProp
     * @example
     *
     *      var xLens = R.lensProp('x');
     *
     *      R.view(xLens, {x: 1, y: 2});  //=> 1
     *      R.view(xLens, {x: 4, y: 2});  //=> 4
     */
    // `Const` is a functor that effectively ignores the function given to `map`.
    // Using `Const` effectively ignores the setter function of the `lens`,
    // leaving the value returned by the getter function unmodified.
    var view = function () {
        // `Const` is a functor that effectively ignores the function given to `map`.
        var Const = function (x) {
            return {
                value: x,
                map: function () {
                    return this;
                }
            };
        };
        return _curry2(function view(lens, x) {
            // Using `Const` effectively ignores the setter function of the `lens`,
            // leaving the value returned by the getter function unmodified.
            return lens(Const)(x).value;
        });
    }();

    /**
     * Tests the final argument by passing it to the given predicate function. If
     * the predicate is satisfied, the function will return the result of calling
     * the `whenTrueFn` function with the same argument. If the predicate is not
     * satisfied, the argument is returned as is.
     *
     * @func
     * @memberOf R
     * @since v0.18.0
     * @category Logic
     * @sig (a -> Boolean) -> (a -> a) -> a -> a
     * @param {Function} pred       A predicate function
     * @param {Function} whenTrueFn A function to invoke when the `condition`
     *                              evaluates to a truthy value.
     * @param {*}        x          An object to test with the `pred` function and
     *                              pass to `whenTrueFn` if necessary.
     * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
     * @see R.ifElse, R.unless
     * @example
     *
     *      // truncate :: String -> String
     *      var truncate = R.when(
     *        R.propSatisfies(R.gt(R.__, 10), 'length'),
     *        R.pipe(R.take(10), R.append('…'), R.join(''))
     *      );
     *      truncate('12345');         //=> '12345'
     *      truncate('0123456789ABC'); //=> '0123456789…'
     */
    var when = _curry3(function when(pred, whenTrueFn, x) {
        return pred(x) ? whenTrueFn(x) : x;
    });

    /**
     * Takes a spec object and a test object; returns true if the test satisfies
     * the spec. Each of the spec's own properties must be a predicate function.
     * Each predicate is applied to the value of the corresponding property of the
     * test object. `where` returns true if all the predicates return true, false
     * otherwise.
     *
     * `where` is well suited to declaratively expressing constraints for other
     * functions such as `filter` and `find`.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category Object
     * @sig {String: (* -> Boolean)} -> {String: *} -> Boolean
     * @param {Object} spec
     * @param {Object} testObj
     * @return {Boolean}
     * @example
     *
     *      // pred :: Object -> Boolean
     *      var pred = where({
     *        a: equals('foo'),
     *        b: complement(equals('bar')),
     *        x: gt(__, 10),
     *        y: lt(__, 20)
     *      });
     *
     *      pred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true
     *      pred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false
     *      pred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false
     *      pred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false
     *      pred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false
     */
    var where = _curry2(function where(spec, testObj) {
        for (var prop in spec) {
            if (_has(prop, spec) && !spec[prop](testObj[prop])) {
                return false;
            }
        }
        return true;
    });

    /**
     * Wrap a function inside another to allow you to make adjustments to the
     * parameters, or do other processing either before the internal function is
     * called or with its results.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (a... -> b) -> ((a... -> b) -> a... -> c) -> (a... -> c)
     * @param {Function} fn The function to wrap.
     * @param {Function} wrapper The wrapper function.
     * @return {Function} The wrapped function.
     * @deprecated since v0.22.0
     * @example
     *
     *      var greet = name => 'Hello ' + name;
     *
     *      var shoutedGreet = R.wrap(greet, (gr, name) => gr(name).toUpperCase());
     *
     *      shoutedGreet("Kathy"); //=> "HELLO KATHY"
     *
     *      var shortenedGreet = R.wrap(greet, function(gr, name) {
     *        return gr(name.substring(0, 3));
     *      });
     *      shortenedGreet("Robert"); //=> "Hello Rob"
     */
    var wrap = _curry2(function wrap(fn, wrapper) {
        return curryN(fn.length, function () {
            return wrapper.apply(this, _concat([fn], arguments));
        });
    });

    /**
     * Creates a new list out of the two supplied by creating each possible pair
     * from the lists.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [b] -> [[a,b]]
     * @param {Array} as The first list.
     * @param {Array} bs The second list.
     * @return {Array} The list made by combining each possible pair from
     *         `as` and `bs` into pairs (`[a, b]`).
     * @example
     *
     *      R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
     */
    // = xprodWith(prepend); (takes about 3 times as long...)
    var xprod = _curry2(function xprod(a, b) {
        // = xprodWith(prepend); (takes about 3 times as long...)
        var idx = 0;
        var ilen = a.length;
        var j;
        var jlen = b.length;
        var result = [];
        while (idx < ilen) {
            j = 0;
            while (j < jlen) {
                result[result.length] = [
                    a[idx],
                    b[j]
                ];
                j += 1;
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Creates a new list out of the two supplied by pairing up equally-positioned
     * items from both lists. The returned list is truncated to the length of the
     * shorter of the two input lists.
     * Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [b] -> [[a,b]]
     * @param {Array} list1 The first array to consider.
     * @param {Array} list2 The second array to consider.
     * @return {Array} The list made by pairing up same-indexed elements of `list1` and `list2`.
     * @example
     *
     *      R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]
     */
    var zip = _curry2(function zip(a, b) {
        var rv = [];
        var idx = 0;
        var len = Math.min(a.length, b.length);
        while (idx < len) {
            rv[idx] = [
                a[idx],
                b[idx]
            ];
            idx += 1;
        }
        return rv;
    });

    /**
     * Creates a new object out of a list of keys and a list of values.
     * Key/value pairing is truncated to the length of the shorter of the two lists.
     * Note: `zipObj` is equivalent to `pipe(zipWith(pair), fromPairs)`.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category List
     * @sig [String] -> [*] -> {String: *}
     * @param {Array} keys The array that will be properties on the output object.
     * @param {Array} values The list of values on the output object.
     * @return {Object} The object made by pairing up same-indexed elements of `keys` and `values`.
     * @example
     *
     *      R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}
     */
    var zipObj = _curry2(function zipObj(keys, values) {
        var idx = 0;
        var len = Math.min(keys.length, values.length);
        var out = {};
        while (idx < len) {
            out[keys[idx]] = values[idx];
            idx += 1;
        }
        return out;
    });

    /**
     * Creates a new list out of the two supplied by applying the function to each
     * equally-positioned pair in the lists. The returned list is truncated to the
     * length of the shorter of the two input lists.
     *
     * @function
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a,b -> c) -> [a] -> [b] -> [c]
     * @param {Function} fn The function used to combine the two elements into one value.
     * @param {Array} list1 The first array to consider.
     * @param {Array} list2 The second array to consider.
     * @return {Array} The list made by combining same-indexed elements of `list1` and `list2`
     *         using `fn`.
     * @example
     *
     *      var f = (x, y) => {
     *        // ...
     *      };
     *      R.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);
     *      //=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]
     */
    var zipWith = _curry3(function zipWith(fn, a, b) {
        var rv = [];
        var idx = 0;
        var len = Math.min(a.length, b.length);
        while (idx < len) {
            rv[idx] = fn(a[idx], b[idx]);
            idx += 1;
        }
        return rv;
    });

    /**
     * A function that always returns `false`. Any passed in parameters are ignored.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Function
     * @sig * -> Boolean
     * @param {*}
     * @return {Boolean}
     * @see R.always, R.T
     * @example
     *
     *      R.F(); //=> false
     */
    var F = always(false);

    /**
     * A function that always returns `true`. Any passed in parameters are ignored.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Function
     * @sig * -> Boolean
     * @param {*}
     * @return {Boolean}
     * @see R.always, R.F
     * @example
     *
     *      R.T(); //=> true
     */
    var T = always(true);

    /**
     * Copies an object.
     *
     * @private
     * @param {*} value The value to be copied
     * @param {Array} refFrom Array containing the source references
     * @param {Array} refTo Array containing the copied source references
     * @param {Boolean} deep Whether or not to perform deep cloning.
     * @return {*} The copied value.
     */
    var _clone = function _clone(value, refFrom, refTo, deep) {
        var copy = function copy(copiedValue) {
            var len = refFrom.length;
            var idx = 0;
            while (idx < len) {
                if (value === refFrom[idx]) {
                    return refTo[idx];
                }
                idx += 1;
            }
            refFrom[idx + 1] = value;
            refTo[idx + 1] = copiedValue;
            for (var key in value) {
                copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
            }
            return copiedValue;
        };
        switch (type(value)) {
        case 'Object':
            return copy({});
        case 'Array':
            return copy([]);
        case 'Date':
            return new Date(value.valueOf());
        case 'RegExp':
            return _cloneRegExp(value);
        default:
            return value;
        }
    };

    var _createPartialApplicator = function _createPartialApplicator(concat) {
        return _curry2(function (fn, args) {
            return _arity(Math.max(0, fn.length - args.length), function () {
                return fn.apply(this, concat(args, arguments));
            });
        });
    };

    var _dropLast = function dropLast(n, xs) {
        return take(n < xs.length ? xs.length - n : 0, xs);
    };

    // Values of other types are only equal if identical.
    var _equals = function _equals(a, b, stackA, stackB) {
        if (identical(a, b)) {
            return true;
        }
        if (type(a) !== type(b)) {
            return false;
        }
        if (a == null || b == null) {
            return false;
        }
        if (typeof a.equals === 'function' || typeof b.equals === 'function') {
            return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
        }
        switch (type(a)) {
        case 'Arguments':
        case 'Array':
        case 'Object':
            if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
                return a === b;
            }
            break;
        case 'Boolean':
        case 'Number':
        case 'String':
            if (!(typeof a === typeof b && identical(a.valueOf(), b.valueOf()))) {
                return false;
            }
            break;
        case 'Date':
            if (!identical(a.valueOf(), b.valueOf())) {
                return false;
            }
            break;
        case 'Error':
            return a.name === b.name && a.message === b.message;
        case 'RegExp':
            if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
                return false;
            }
            break;
        case 'Map':
        case 'Set':
            if (!_equals(_arrayFromIterator(a.entries()), _arrayFromIterator(b.entries()), stackA, stackB)) {
                return false;
            }
            break;
        case 'Int8Array':
        case 'Uint8Array':
        case 'Uint8ClampedArray':
        case 'Int16Array':
        case 'Uint16Array':
        case 'Int32Array':
        case 'Uint32Array':
        case 'Float32Array':
        case 'Float64Array':
            break;
        case 'ArrayBuffer':
            break;
        default:
            // Values of other types are only equal if identical.
            return false;
        }
        var keysA = keys(a);
        if (keysA.length !== keys(b).length) {
            return false;
        }
        var idx = stackA.length - 1;
        while (idx >= 0) {
            if (stackA[idx] === a) {
                return stackB[idx] === b;
            }
            idx -= 1;
        }
        stackA.push(a);
        stackB.push(b);
        idx = keysA.length - 1;
        while (idx >= 0) {
            var key = keysA[idx];
            if (!(_has(key, b) && _equals(b[key], a[key], stackA, stackB))) {
                return false;
            }
            idx -= 1;
        }
        stackA.pop();
        stackB.pop();
        return true;
    };

    /**
     * `_makeFlat` is a helper function that returns a one-level or fully recursive
     * function based on the flag passed in.
     *
     * @private
     */
    var _makeFlat = function _makeFlat(recursive) {
        return function flatt(list) {
            var value, jlen, j;
            var result = [];
            var idx = 0;
            var ilen = list.length;
            while (idx < ilen) {
                if (isArrayLike(list[idx])) {
                    value = recursive ? flatt(list[idx]) : list[idx];
                    j = 0;
                    jlen = value.length;
                    while (j < jlen) {
                        result[result.length] = value[j];
                        j += 1;
                    }
                } else {
                    result[result.length] = list[idx];
                }
                idx += 1;
            }
            return result;
        };
    };

    var _reduce = function () {
        function _arrayReduce(xf, acc, list) {
            var idx = 0;
            var len = list.length;
            while (idx < len) {
                acc = xf['@@transducer/step'](acc, list[idx]);
                if (acc && acc['@@transducer/reduced']) {
                    acc = acc['@@transducer/value'];
                    break;
                }
                idx += 1;
            }
            return xf['@@transducer/result'](acc);
        }
        function _iterableReduce(xf, acc, iter) {
            var step = iter.next();
            while (!step.done) {
                acc = xf['@@transducer/step'](acc, step.value);
                if (acc && acc['@@transducer/reduced']) {
                    acc = acc['@@transducer/value'];
                    break;
                }
                step = iter.next();
            }
            return xf['@@transducer/result'](acc);
        }
        function _methodReduce(xf, acc, obj) {
            return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
        }
        var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
        return function _reduce(fn, acc, list) {
            if (typeof fn === 'function') {
                fn = _xwrap(fn);
            }
            if (isArrayLike(list)) {
                return _arrayReduce(fn, acc, list);
            }
            if (typeof list.reduce === 'function') {
                return _methodReduce(fn, acc, list);
            }
            if (list[symIterator] != null) {
                return _iterableReduce(fn, acc, list[symIterator]());
            }
            if (typeof list.next === 'function') {
                return _iterableReduce(fn, acc, list);
            }
            throw new TypeError('reduce: list must be array or iterable');
        };
    }();

    var _stepCat = function () {
        var _stepCatArray = {
            '@@transducer/init': Array,
            '@@transducer/step': function (xs, x) {
                xs.push(x);
                return xs;
            },
            '@@transducer/result': _identity
        };
        var _stepCatString = {
            '@@transducer/init': String,
            '@@transducer/step': function (a, b) {
                return a + b;
            },
            '@@transducer/result': _identity
        };
        var _stepCatObject = {
            '@@transducer/init': Object,
            '@@transducer/step': function (result, input) {
                return _assign(result, isArrayLike(input) ? objOf(input[0], input[1]) : input);
            },
            '@@transducer/result': _identity
        };
        return function _stepCat(obj) {
            if (_isTransformer(obj)) {
                return obj;
            }
            if (isArrayLike(obj)) {
                return _stepCatArray;
            }
            if (typeof obj === 'string') {
                return _stepCatString;
            }
            if (typeof obj === 'object') {
                return _stepCatObject;
            }
            throw new Error('Cannot create transformer for ' + obj);
        };
    }();

    var _xdropLastWhile = function () {
        function XDropLastWhile(fn, xf) {
            this.f = fn;
            this.retained = [];
            this.xf = xf;
        }
        XDropLastWhile.prototype['@@transducer/init'] = _xfBase.init;
        XDropLastWhile.prototype['@@transducer/result'] = function (result) {
            this.retained = null;
            return this.xf['@@transducer/result'](result);
        };
        XDropLastWhile.prototype['@@transducer/step'] = function (result, input) {
            return this.f(input) ? this.retain(result, input) : this.flush(result, input);
        };
        XDropLastWhile.prototype.flush = function (result, input) {
            result = _reduce(this.xf['@@transducer/step'], result, this.retained);
            this.retained = [];
            return this.xf['@@transducer/step'](result, input);
        };
        XDropLastWhile.prototype.retain = function (result, input) {
            this.retained.push(input);
            return result;
        };
        return _curry2(function _xdropLastWhile(fn, xf) {
            return new XDropLastWhile(fn, xf);
        });
    }();

    /**
     * Creates a new list iteration function from an existing one by adding two new
     * parameters to its callback function: the current index, and the entire list.
     *
     * This would turn, for instance, Ramda's simple `map` function into one that
     * more closely resembles `Array.prototype.map`. Note that this will only work
     * for functions in which the iteration callback function is the first
     * parameter, and where the list is the last parameter. (This latter might be
     * unimportant if the list parameter is not used.)
     *
     * @func
     * @memberOf R
     * @since v0.15.0
     * @category Function
     * @category List
     * @sig ((a ... -> b) ... -> [a] -> *) -> (a ..., Int, [a] -> b) ... -> [a] -> *)
     * @param {Function} fn A list iteration function that does not pass index or list to its callback
     * @return {Function} An altered list iteration function that passes (item, index, list) to its callback
     * @example
     *
     *      var mapIndexed = R.addIndex(R.map);
     *      mapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);
     *      //=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']
     */
    var addIndex = _curry1(function addIndex(fn) {
        return curryN(fn.length, function () {
            var idx = 0;
            var origFn = arguments[0];
            var list = arguments[arguments.length - 1];
            var args = _slice(arguments);
            args[0] = function () {
                var result = origFn.apply(this, _concat(arguments, [
                    idx,
                    list
                ]));
                idx += 1;
                return result;
            };
            return fn.apply(this, args);
        });
    });

    /**
     * Wraps a function of any arity (including nullary) in a function that accepts
     * exactly 2 parameters. Any extraneous parameters will not be passed to the
     * supplied function.
     *
     * @func
     * @memberOf R
     * @since v0.2.0
     * @category Function
     * @sig (* -> c) -> (a, b -> c)
     * @param {Function} fn The function to wrap.
     * @return {Function} A new function wrapping `fn`. The new function is guaranteed to be of
     *         arity 2.
     * @example
     *
     *      var takesThreeArgs = function(a, b, c) {
     *        return [a, b, c];
     *      };
     *      takesThreeArgs.length; //=> 3
     *      takesThreeArgs(1, 2, 3); //=> [1, 2, 3]
     *
     *      var takesTwoArgs = R.binary(takesThreeArgs);
     *      takesTwoArgs.length; //=> 2
     *      // Only 2 arguments are passed to the wrapped function
     *      takesTwoArgs(1, 2, 3); //=> [1, 2, undefined]
     */
    var binary = _curry1(function binary(fn) {
        return nAry(2, fn);
    });

    /**
     * Creates a deep copy of the value which may contain (nested) `Array`s and
     * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are not
     * copied, but assigned by their reference.
     *
     * Dispatches to a `clone` method if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig {*} -> {*}
     * @param {*} value The object or array to clone
     * @return {*} A new object or array.
     * @example
     *
     *      var objects = [{}, {}, {}];
     *      var objectsClone = R.clone(objects);
     *      objects[0] === objectsClone[0]; //=> false
     */
    var clone = _curry1(function clone(value) {
        return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
    });

    /**
     * Returns a curried equivalent of the provided function. The curried function
     * has two unusual capabilities. First, its arguments needn't be provided one
     * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
     * following are equivalent:
     *
     *   - `g(1)(2)(3)`
     *   - `g(1)(2, 3)`
     *   - `g(1, 2)(3)`
     *   - `g(1, 2, 3)`
     *
     * Secondly, the special placeholder value `R.__` may be used to specify
     * "gaps", allowing partial application of any combination of arguments,
     * regardless of their positions. If `g` is as above and `_` is `R.__`, the
     * following are equivalent:
     *
     *   - `g(1, 2, 3)`
     *   - `g(_, 2, 3)(1)`
     *   - `g(_, _, 3)(1)(2)`
     *   - `g(_, _, 3)(1, 2)`
     *   - `g(_, 2)(1)(3)`
     *   - `g(_, 2)(1, 3)`
     *   - `g(_, 2)(_, 3)(1)`
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (* -> a) -> (* -> a)
     * @param {Function} fn The function to curry.
     * @return {Function} A new, curried function.
     * @see R.curryN
     * @example
     *
     *      var addFourNumbers = (a, b, c, d) => a + b + c + d;
     *
     *      var curriedAddFourNumbers = R.curry(addFourNumbers);
     *      var f = curriedAddFourNumbers(1, 2);
     *      var g = f(3);
     *      g(4); //=> 10
     */
    var curry = _curry1(function curry(fn) {
        return curryN(fn.length, fn);
    });

    /**
     * Returns all but the first `n` elements of the given list, string, or
     * transducer/transformer (or object with a `drop` method).
     *
     * Dispatches to the `drop` method of the second argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Number -> [a] -> [a]
     * @sig Number -> String -> String
     * @param {Number} n
     * @param {*} list
     * @return {*}
     * @see R.take, R.transduce
     * @example
     *
     *      R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
     *      R.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']
     *      R.drop(3, ['foo', 'bar', 'baz']); //=> []
     *      R.drop(4, ['foo', 'bar', 'baz']); //=> []
     *      R.drop(3, 'ramda');               //=> 'da'
     */
    var drop = _curry2(_dispatchable('drop', _xdrop, function drop(n, xs) {
        return slice(Math.max(0, n), Infinity, xs);
    }));

    /**
     * Returns a list containing all but the last `n` elements of the given `list`.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category List
     * @sig Number -> [a] -> [a]
     * @sig Number -> String -> String
     * @param {Number} n The number of elements of `xs` to skip.
     * @param {Array} xs The collection to consider.
     * @return {Array}
     * @see R.takeLast
     * @example
     *
     *      R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']
     *      R.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']
     *      R.dropLast(3, ['foo', 'bar', 'baz']); //=> []
     *      R.dropLast(4, ['foo', 'bar', 'baz']); //=> []
     *      R.dropLast(3, 'ramda');               //=> 'ra'
     */
    var dropLast = _curry2(_dispatchable('dropLast', _xdropLast, _dropLast));

    /**
     * Returns a new list excluding all the tailing elements of a given list which
     * satisfy the supplied predicate function. It passes each value from the right
     * to the supplied predicate function, skipping elements while the predicate
     * function returns `true`. The predicate function is applied to one argument:
     * *(value)*.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category List
     * @sig (a -> Boolean) -> [a] -> [a]
     * @param {Function} fn The function called per iteration.
     * @param {Array} list The collection to iterate over.
     * @return {Array} A new array.
     * @see R.takeLastWhile, R.addIndex
     * @example
     *
     *      var lteThree = x => x <= 3;
     *
     *      R.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]
     */
    var dropLastWhile = _curry2(_dispatchable('dropLastWhile', _xdropLastWhile, _dropLastWhile));

    /**
     * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
     * cyclical data structures.
     *
     * Dispatches symmetrically to the `equals` methods of both arguments, if
     * present.
     *
     * @func
     * @memberOf R
     * @since v0.15.0
     * @category Relation
     * @sig a -> b -> Boolean
     * @param {*} a
     * @param {*} b
     * @return {Boolean}
     * @example
     *
     *      R.equals(1, 1); //=> true
     *      R.equals(1, '1'); //=> false
     *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
     *
     *      var a = {}; a.v = a;
     *      var b = {}; b.v = b;
     *      R.equals(a, b); //=> true
     */
    var equals = _curry2(function equals(a, b) {
        return _equals(a, b, [], []);
    });

    /**
     * Takes a predicate and a "filterable", and returns a new filterable of the
     * same type containing the members of the given filterable which satisfy the
     * given predicate.
     *
     * Dispatches to the `filter` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Filterable f => (a -> Boolean) -> f a -> f a
     * @param {Function} pred
     * @param {Array} filterable
     * @return {Array}
     * @see R.reject, R.transduce, R.addIndex
     * @example
     *
     *      var isEven = n => n % 2 === 0;
     *
     *      R.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]
     *
     *      R.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
     */
    // else
    var filter = _curry2(_dispatchable('filter', _xfilter, function (pred, filterable) {
        return _isObject(filterable) ? _reduce(function (acc, key) {
            if (pred(filterable[key])) {
                acc[key] = filterable[key];
            }
            return acc;
        }, {}, keys(filterable)) : // else
        _filter(pred, filterable);
    }));

    /**
     * Returns a new list by pulling every item out of it (and all its sub-arrays)
     * and putting them in a new array, depth-first.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [b]
     * @param {Array} list The array to consider.
     * @return {Array} The flattened list.
     * @see R.unnest
     * @example
     *
     *      R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);
     *      //=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
     */
    var flatten = _curry1(_makeFlat(true));

    /**
     * Returns a new function much like the supplied one, except that the first two
     * arguments' order is reversed.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (a -> b -> c -> ... -> z) -> (b -> a -> c -> ... -> z)
     * @param {Function} fn The function to invoke with its first two parameters reversed.
     * @return {*} The result of invoking `fn` with its first two parameters' order reversed.
     * @example
     *
     *      var mergeThree = (a, b, c) => [].concat(a, b, c);
     *
     *      mergeThree(1, 2, 3); //=> [1, 2, 3]
     *
     *      R.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]
     */
    var flip = _curry1(function flip(fn) {
        return curry(function (a, b) {
            var args = _slice(arguments);
            args[0] = b;
            args[1] = a;
            return fn.apply(this, args);
        });
    });

    /**
     * Returns the first element of the given list or string. In some libraries
     * this function is named `first`.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> a | Undefined
     * @sig String -> String
     * @param {Array|String} list
     * @return {*}
     * @see R.tail, R.init, R.last
     * @example
     *
     *      R.head(['fi', 'fo', 'fum']); //=> 'fi'
     *      R.head([]); //=> undefined
     *
     *      R.head('abc'); //=> 'a'
     *      R.head(''); //=> ''
     */
    var head = nth(0);

    /**
     * Returns all but the last element of the given list or string.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category List
     * @sig [a] -> [a]
     * @sig String -> String
     * @param {*} list
     * @return {*}
     * @see R.last, R.head, R.tail
     * @example
     *
     *      R.init([1, 2, 3]);  //=> [1, 2]
     *      R.init([1, 2]);     //=> [1]
     *      R.init([1]);        //=> []
     *      R.init([]);         //=> []
     *
     *      R.init('abc');  //=> 'ab'
     *      R.init('ab');   //=> 'a'
     *      R.init('a');    //=> ''
     *      R.init('');     //=> ''
     */
    var init = slice(0, -1);

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of those
     * elements common to both lists. Duplication is determined according to the
     * value returned by applying the supplied predicate to two list elements.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
     * @param {Function} pred A predicate function that determines whether
     *        the two supplied elements are equal.
     * @param {Array} list1 One list of items to compare
     * @param {Array} list2 A second list of items to compare
     * @return {Array} A new list containing those elements common to both lists.
     * @see R.intersection
     * @example
     *
     *      var buffaloSpringfield = [
     *        {id: 824, name: 'Richie Furay'},
     *        {id: 956, name: 'Dewey Martin'},
     *        {id: 313, name: 'Bruce Palmer'},
     *        {id: 456, name: 'Stephen Stills'},
     *        {id: 177, name: 'Neil Young'}
     *      ];
     *      var csny = [
     *        {id: 204, name: 'David Crosby'},
     *        {id: 456, name: 'Stephen Stills'},
     *        {id: 539, name: 'Graham Nash'},
     *        {id: 177, name: 'Neil Young'}
     *      ];
     *
     *      R.intersectionWith(R.eqBy(R.prop('id')), buffaloSpringfield, csny);
     *      //=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]
     */
    var intersectionWith = _curry3(function intersectionWith(pred, list1, list2) {
        var lookupList, filteredList;
        if (list1.length > list2.length) {
            lookupList = list1;
            filteredList = list2;
        } else {
            lookupList = list2;
            filteredList = list1;
        }
        var results = [];
        var idx = 0;
        while (idx < filteredList.length) {
            if (_containsWith(pred, filteredList[idx], lookupList)) {
                results[results.length] = filteredList[idx];
            }
            idx += 1;
        }
        return uniqWith(pred, results);
    });

    /**
     * Transforms the items of the list with the transducer and appends the
     * transformed items to the accumulator using an appropriate iterator function
     * based on the accumulator type.
     *
     * The accumulator can be an array, string, object or a transformer. Iterated
     * items will be appended to arrays and concatenated to strings. Objects will
     * be merged directly or 2-item arrays will be merged as key, value pairs.
     *
     * The accumulator can also be a transformer object that provides a 2-arity
     * reducing iterator function, step, 0-arity initial value function, init, and
     * 1-arity result extraction function result. The step function is used as the
     * iterator function in reduce. The result function is used to convert the
     * final accumulator into the return type and in most cases is R.identity. The
     * init function is used to provide the initial accumulator.
     *
     * The iteration is performed with R.reduce after initializing the transducer.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category List
     * @sig a -> (b -> b) -> [c] -> a
     * @param {*} acc The initial accumulator value.
     * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @example
     *
     *      var numbers = [1, 2, 3, 4];
     *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
     *
     *      R.into([], transducer, numbers); //=> [2, 3]
     *
     *      var intoArray = R.into([]);
     *      intoArray(transducer, numbers); //=> [2, 3]
     */
    var into = _curry3(function into(acc, xf, list) {
        return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), _clone(acc, [], [], false), list);
    });

    /**
     * Same as R.invertObj, however this accounts for objects with duplicate values
     * by putting the values into an array.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Object
     * @sig {s: x} -> {x: [ s, ... ]}
     * @param {Object} obj The object or array to invert
     * @return {Object} out A new object with keys
     * in an array.
     * @example
     *
     *      var raceResultsByFirstName = {
     *        first: 'alice',
     *        second: 'jake',
     *        third: 'alice',
     *      };
     *      R.invert(raceResultsByFirstName);
     *      //=> { 'alice': ['first', 'third'], 'jake':['second'] }
     */
    var invert = _curry1(function invert(obj) {
        var props = keys(obj);
        var len = props.length;
        var idx = 0;
        var out = {};
        while (idx < len) {
            var key = props[idx];
            var val = obj[key];
            var list = _has(val, out) ? out[val] : out[val] = [];
            list[list.length] = key;
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a new object with the keys of the given object as values, and the
     * values of the given object, which are coerced to strings, as keys. Note
     * that the last key found is preferred when handling the same value.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Object
     * @sig {s: x} -> {x: s}
     * @param {Object} obj The object or array to invert
     * @return {Object} out A new object
     * @example
     *
     *      var raceResults = {
     *        first: 'alice',
     *        second: 'jake'
     *      };
     *      R.invertObj(raceResults);
     *      //=> { 'alice': 'first', 'jake':'second' }
     *
     *      // Alternatively:
     *      var raceResults = ['alice', 'jake'];
     *      R.invertObj(raceResults);
     *      //=> { 'alice': '0', 'jake':'1' }
     */
    var invertObj = _curry1(function invertObj(obj) {
        var props = keys(obj);
        var len = props.length;
        var idx = 0;
        var out = {};
        while (idx < len) {
            var key = props[idx];
            out[obj[key]] = key;
            idx += 1;
        }
        return out;
    });

    /**
     * Returns `true` if the given value is its type's empty value; `false`
     * otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Logic
     * @sig a -> Boolean
     * @param {*} x
     * @return {Boolean}
     * @see R.empty
     * @example
     *
     *      R.isEmpty([1, 2, 3]);   //=> false
     *      R.isEmpty([]);          //=> true
     *      R.isEmpty('');          //=> true
     *      R.isEmpty(null);        //=> false
     *      R.isEmpty({});          //=> true
     *      R.isEmpty({length: 0}); //=> false
     */
    var isEmpty = _curry1(function isEmpty(x) {
        return x != null && equals(x, empty(x));
    });

    /**
     * Returns the last element of the given list or string.
     *
     * @func
     * @memberOf R
     * @since v0.1.4
     * @category List
     * @sig [a] -> a | Undefined
     * @sig String -> String
     * @param {*} list
     * @return {*}
     * @see R.init, R.head, R.tail
     * @example
     *
     *      R.last(['fi', 'fo', 'fum']); //=> 'fum'
     *      R.last([]); //=> undefined
     *
     *      R.last('abc'); //=> 'c'
     *      R.last(''); //=> ''
     */
    var last = nth(-1);

    /**
     * Returns the position of the last occurrence of an item in an array, or -1 if
     * the item is not included in the array. `R.equals` is used to determine
     * equality.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig a -> [a] -> Number
     * @param {*} target The item to find.
     * @param {Array} xs The array to search in.
     * @return {Number} the index of the target, or -1 if the target is not found.
     * @see R.indexOf
     * @example
     *
     *      R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6
     *      R.lastIndexOf(10, [1,2,3,4]); //=> -1
     */
    var lastIndexOf = _curry2(function lastIndexOf(target, xs) {
        if (typeof xs.lastIndexOf === 'function' && !_isArray(xs)) {
            return xs.lastIndexOf(target);
        } else {
            var idx = xs.length - 1;
            while (idx >= 0) {
                if (equals(xs[idx], target)) {
                    return idx;
                }
                idx -= 1;
            }
            return -1;
        }
    });

    /**
     * Takes a function and
     * a [functor](https://github.com/fantasyland/fantasy-land#functor),
     * applies the function to each of the functor's values, and returns
     * a functor of the same shape.
     *
     * Ramda provides suitable `map` implementations for `Array` and `Object`,
     * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
     *
     * Dispatches to the `map` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * Also treats functions as functors and will compose them together.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Functor f => (a -> b) -> f a -> f b
     * @param {Function} fn The function to be called on every element of the input `list`.
     * @param {Array} list The list to be iterated over.
     * @return {Array} The new list.
     * @see R.transduce, R.addIndex
     * @example
     *
     *      var double = x => x * 2;
     *
     *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
     *
     *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
     */
    var map = _curry2(_dispatchable('map', _xmap, function map(fn, functor) {
        switch (Object.prototype.toString.call(functor)) {
        case '[object Function]':
            return curryN(functor.length, function () {
                return fn.call(this, functor.apply(this, arguments));
            });
        case '[object Object]':
            return _reduce(function (acc, key) {
                acc[key] = fn(functor[key]);
                return acc;
            }, {}, keys(functor));
        default:
            return _map(fn, functor);
        }
    }));

    /**
     * An Object-specific version of `map`. The function is applied to three
     * arguments: *(value, key, obj)*. If only the value is significant, use
     * `map` instead.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Object
     * @sig ((*, String, Object) -> *) -> Object -> Object
     * @param {Function} fn
     * @param {Object} obj
     * @return {Object}
     * @see R.map
     * @example
     *
     *      var values = { x: 1, y: 2, z: 3 };
     *      var prependKeyAndDouble = (num, key, obj) => key + (num * 2);
     *
     *      R.mapObjIndexed(prependKeyAndDouble, values); //=> { x: 'x2', y: 'y4', z: 'z6' }
     */
    var mapObjIndexed = _curry2(function mapObjIndexed(fn, obj) {
        return _reduce(function (acc, key) {
            acc[key] = fn(obj[key], key, obj);
            return acc;
        }, {}, keys(obj));
    });

    /**
     * Creates a new object with the own properties of the two provided objects. If
     * a key exists in both objects, the provided function is applied to the values
     * associated with the key in each object, with the result being used as the
     * value associated with the key in the returned object. The key will be
     * excluded from the returned object if the resulting value is `undefined`.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Object
     * @sig (a -> a -> a) -> {a} -> {a} -> {a}
     * @param {Function} fn
     * @param {Object} l
     * @param {Object} r
     * @return {Object}
     * @see R.merge, R.mergeWithKey
     * @example
     *
     *      R.mergeWith(R.concat,
     *                  { a: true, values: [10, 20] },
     *                  { b: true, values: [15, 35] });
     *      //=> { a: true, b: true, values: [10, 20, 15, 35] }
     */
    var mergeWith = _curry3(function mergeWith(fn, l, r) {
        return mergeWithKey(function (_, _l, _r) {
            return fn(_l, _r);
        }, l, r);
    });

    /**
     * Takes a function `f` and a list of arguments, and returns a function `g`.
     * When applied, `g` returns the result of applying `f` to the arguments
     * provided initially followed by the arguments provided to `g`.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category Function
     * @sig ((a, b, c, ..., n) -> x) -> [a, b, c, ...] -> ((d, e, f, ..., n) -> x)
     * @param {Function} f
     * @param {Array} args
     * @return {Function}
     * @see R.partialRight
     * @example
     *
     *      var multiply = (a, b) => a * b;
     *      var double = R.partial(multiply, [2]);
     *      double(2); //=> 4
     *
     *      var greet = (salutation, title, firstName, lastName) =>
     *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
     *
     *      var sayHello = R.partial(greet, ['Hello']);
     *      var sayHelloToMs = R.partial(sayHello, ['Ms.']);
     *      sayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'
     */
    var partial = _createPartialApplicator(_concat);

    /**
     * Takes a function `f` and a list of arguments, and returns a function `g`.
     * When applied, `g` returns the result of applying `f` to the arguments
     * provided to `g` followed by the arguments provided initially.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category Function
     * @sig ((a, b, c, ..., n) -> x) -> [d, e, f, ..., n] -> ((a, b, c, ...) -> x)
     * @param {Function} f
     * @param {Array} args
     * @return {Function}
     * @see R.partial
     * @example
     *
     *      var greet = (salutation, title, firstName, lastName) =>
     *        salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';
     *
     *      var greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);
     *
     *      greetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'
     */
    var partialRight = _createPartialApplicator(flip(_concat));

    /**
     * Determines whether a nested path on an object has a specific value, in
     * `R.equals` terms. Most likely used to filter a list.
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category Relation
     * @sig [String] -> * -> {String: *} -> Boolean
     * @param {Array} path The path of the nested property to use
     * @param {*} val The value to compare the nested property with
     * @param {Object} obj The object to check the nested property in
     * @return {Boolean} `true` if the value equals the nested object property,
     *         `false` otherwise.
     * @example
     *
     *      var user1 = { address: { zipCode: 90210 } };
     *      var user2 = { address: { zipCode: 55555 } };
     *      var user3 = { name: 'Bob' };
     *      var users = [ user1, user2, user3 ];
     *      var isFamous = R.pathEq(['address', 'zipCode'], 90210);
     *      R.filter(isFamous, users); //=> [ user1 ]
     */
    var pathEq = _curry3(function pathEq(_path, val, obj) {
        return equals(path(_path, obj), val);
    });

    /**
     * Returns a new list by plucking the same named property off all objects in
     * the list supplied.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig k -> [{k: v}] -> [v]
     * @param {Number|String} key The key name to pluck off of each object.
     * @param {Array} list The array to consider.
     * @return {Array} The list of values for the given key.
     * @see R.props
     * @example
     *
     *      R.pluck('a')([{a: 1}, {a: 2}]); //=> [1, 2]
     *      R.pluck(0)([[1, 2], [3, 4]]);   //=> [1, 3]
     */
    var pluck = _curry2(function pluck(p, list) {
        return map(prop(p), list);
    });

    /**
     * Reasonable analog to SQL `select` statement.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @category Relation
     * @sig [k] -> [{k: v}] -> [{k: v}]
     * @param {Array} props The property names to project
     * @param {Array} objs The objects to query
     * @return {Array} An array of objects with just the `props` properties.
     * @example
     *
     *      var abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};
     *      var fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};
     *      var kids = [abby, fred];
     *      R.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]
     */
    // passing `identity` gives correct arity
    var project = useWith(_map, [
        pickAll,
        identity
    ]);

    /**
     * Returns `true` if the specified object property is equal, in `R.equals`
     * terms, to the given value; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig String -> a -> Object -> Boolean
     * @param {String} name
     * @param {*} val
     * @param {*} obj
     * @return {Boolean}
     * @see R.equals, R.propSatisfies
     * @example
     *
     *      var abby = {name: 'Abby', age: 7, hair: 'blond'};
     *      var fred = {name: 'Fred', age: 12, hair: 'brown'};
     *      var rusty = {name: 'Rusty', age: 10, hair: 'brown'};
     *      var alois = {name: 'Alois', age: 15, disposition: 'surly'};
     *      var kids = [abby, fred, rusty, alois];
     *      var hasBrownHair = R.propEq('hair', 'brown');
     *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
     */
    var propEq = _curry3(function propEq(name, val, obj) {
        return equals(val, obj[name]);
    });

    /**
     * Returns a single item by iterating through the list, successively calling
     * the iterator function and passing it an accumulator value and the current
     * value from the array, and then passing the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*. It may use
     * `R.reduced` to shortcut the iteration.
     *
     * Note: `R.reduce` does not skip deleted or unassigned indices (sparse
     * arrays), unlike the native `Array.prototype.reduce` method. For more details
     * on this behavior, see:
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description
     *
     * Dispatches to the `reduce` method of the third argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig ((a, b) -> a) -> a -> [b] -> a
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array.
     * @param {*} acc The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.reduced, R.addIndex
     * @example
     *
     *      var numbers = [1, 2, 3];
     *      var plus = (a, b) => a + b;
     *
     *      R.reduce(plus, 10, numbers); //=> 16
     */
    var reduce = _curry3(_reduce);

    /**
     * Groups the elements of the list according to the result of calling
     * the String-returning function `keyFn` on each element and reduces the elements
     * of each group to a single value via the reducer function `valueFn`.
     *
     * This function is basically a more general `groupBy` function.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.20.0
     * @category List
     * @sig ((a, b) -> a) -> a -> (b -> String) -> [b] -> {String: a}
     * @param {Function} valueFn The function that reduces the elements of each group to a single
     *        value. Receives two values, accumulator for a particular group and the current element.
     * @param {*} acc The (initial) accumulator value for each group.
     * @param {Function} keyFn The function that maps the list's element into a key.
     * @param {Array} list The array to group.
     * @return {Object} An object with the output of `keyFn` for keys, mapped to the output of
     *         `valueFn` for elements which produced that key when passed to `keyFn`.
     * @see R.groupBy, R.reduce
     * @example
     *
     *      var reduceToNamesBy = R.reduceBy((acc, student) => acc.concat(student.name), []);
     *      var namesByGrade = reduceToNamesBy(function(student) {
     *        var score = student.score;
     *        return score < 65 ? 'F' :
     *               score < 70 ? 'D' :
     *               score < 80 ? 'C' :
     *               score < 90 ? 'B' : 'A';
     *      });
     *      var students = [{name: 'Lucy', score: 92},
     *                      {name: 'Drew', score: 85},
     *                      // ...
     *                      {name: 'Bart', score: 62}];
     *      namesByGrade(students);
     *      // {
     *      //   'A': ['Lucy'],
     *      //   'B': ['Drew']
     *      //   // ...,
     *      //   'F': ['Bart']
     *      // }
     */
    var reduceBy = _curryN(4, [], _dispatchable('reduceBy', _xreduceBy, function reduceBy(valueFn, valueAcc, keyFn, list) {
        return _reduce(function (acc, elt) {
            var key = keyFn(elt);
            acc[key] = valueFn(_has(key, acc) ? acc[key] : valueAcc, elt);
            return acc;
        }, {}, list);
    }));

    /**
     * Like `reduce`, `reduceWhile` returns a single item by iterating through
     * the list, successively calling the iterator function. `reduceWhile` also
     * takes a predicate that is evaluated before each step. If the predicate returns
     * `false`, it "short-circuits" the iteration and returns the current value
     * of the accumulator.
     *
     * @func
     * @memberOf R
     * @since v0.22.0
     * @category List
     * @sig ((a, b) -> Boolean) -> ((a, b) -> a) -> a -> [b] -> a
     * @param {Function} pred The predicate. It is passed the accumulator and the
     *        current element.
     * @param {Function} fn The iterator function. Receives two values, the
     *        accumulator and the current element.
     * @param {*} a The accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.reduce, R.reduced
     * @example
     *
     *      var isOdd = (acc, x) => x % 2 === 1;
     *      var xs = [1, 3, 5, 60, 777, 800];
     *      R.reduceWhile(isOdd, R.add, 0, xs); //=> 9
     *
     *      var ys = [2, 4, 6]
     *      R.reduceWhile(isOdd, R.add, 111, ys); //=> 111
     */
    var reduceWhile = _curryN(4, [], function _reduceWhile(pred, fn, a, list) {
        return _reduce(function (acc, x) {
            return pred(acc, x) ? fn(acc, x) : _reduced(acc);
        }, a, list);
    });

    /**
     * The complement of `filter`.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig Filterable f => (a -> Boolean) -> f a -> f a
     * @param {Function} pred
     * @param {Array} filterable
     * @return {Array}
     * @see R.filter, R.transduce, R.addIndex
     * @example
     *
     *      var isOdd = (n) => n % 2 === 1;
     *
     *      R.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]
     *
     *      R.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}
     */
    var reject = _curry2(function reject(pred, filterable) {
        return filter(_complement(pred), filterable);
    });

    /**
     * Returns a fixed list of size `n` containing a specified identical value.
     *
     * @func
     * @memberOf R
     * @since v0.1.1
     * @category List
     * @sig a -> n -> [a]
     * @param {*} value The value to repeat.
     * @param {Number} n The desired size of the output list.
     * @return {Array} A new array containing `n` `value`s.
     * @example
     *
     *      R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']
     *
     *      var obj = {};
     *      var repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]
     *      repeatedObjs[0] === repeatedObjs[1]; //=> true
     */
    var repeat = _curry2(function repeat(value, n) {
        return times(always(value), n);
    });

    /**
     * Adds together all the elements of a list.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list An array of numbers
     * @return {Number} The sum of all the numbers in the list.
     * @see R.reduce
     * @example
     *
     *      R.sum([2,4,6,8,100,1]); //=> 121
     */
    var sum = reduce(add, 0);

    /**
     * Returns a new list containing the last `n` elements of the given list.
     * If `n > list.length`, returns a list of `list.length` elements.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category List
     * @sig Number -> [a] -> [a]
     * @sig Number -> String -> String
     * @param {Number} n The number of elements to return.
     * @param {Array} xs The collection to consider.
     * @return {Array}
     * @see R.dropLast
     * @example
     *
     *      R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']
     *      R.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']
     *      R.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
     *      R.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']
     *      R.takeLast(3, 'ramda');               //=> 'mda'
     */
    var takeLast = _curry2(function takeLast(n, xs) {
        return drop(n >= 0 ? xs.length - n : 0, xs);
    });

    /**
     * Initializes a transducer using supplied iterator function. Returns a single
     * item by iterating through the list, successively calling the transformed
     * iterator function and passing it an accumulator value and the current value
     * from the array, and then passing the result to the next call.
     *
     * The iterator function receives two values: *(acc, value)*. It will be
     * wrapped as a transformer to initialize the transducer. A transformer can be
     * passed directly in place of an iterator function. In both cases, iteration
     * may be stopped early with the `R.reduced` function.
     *
     * A transducer is a function that accepts a transformer and returns a
     * transformer and can be composed directly.
     *
     * A transformer is an an object that provides a 2-arity reducing iterator
     * function, step, 0-arity initial value function, init, and 1-arity result
     * extraction function, result. The step function is used as the iterator
     * function in reduce. The result function is used to convert the final
     * accumulator into the return type and in most cases is R.identity. The init
     * function can be used to provide an initial accumulator, but is ignored by
     * transduce.
     *
     * The iteration is performed with R.reduce after initializing the transducer.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category List
     * @sig (c -> c) -> (a,b -> a) -> a -> [b] -> a
     * @param {Function} xf The transducer function. Receives a transformer and returns a transformer.
     * @param {Function} fn The iterator function. Receives two values, the accumulator and the
     *        current element from the array. Wrapped as transformer, if necessary, and used to
     *        initialize the transducer
     * @param {*} acc The initial accumulator value.
     * @param {Array} list The list to iterate over.
     * @return {*} The final, accumulated value.
     * @see R.reduce, R.reduced, R.into
     * @example
     *
     *      var numbers = [1, 2, 3, 4];
     *      var transducer = R.compose(R.map(R.add(1)), R.take(2));
     *
     *      R.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]
     */
    var transduce = curryN(4, function transduce(xf, fn, acc, list) {
        return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
    });

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of the elements
     * of each list. Duplication is determined according to the value returned by
     * applying the supplied predicate to two list elements.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig (a -> a -> Boolean) -> [*] -> [*] -> [*]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The first and second lists concatenated, with
     *         duplicates removed.
     * @see R.union
     * @example
     *
     *      var l1 = [{a: 1}, {a: 2}];
     *      var l2 = [{a: 1}, {a: 4}];
     *      R.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]
     */
    var unionWith = _curry3(function unionWith(pred, list1, list2) {
        return uniqWith(pred, _concat(list1, list2));
    });

    /**
     * Takes a spec object and a test object; returns true if the test satisfies
     * the spec, false otherwise. An object satisfies the spec if, for each of the
     * spec's own properties, accessing that property of the object gives the same
     * value (in `R.equals` terms) as accessing that property of the spec.
     *
     * `whereEq` is a specialization of [`where`](#where).
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category Object
     * @sig {String: *} -> {String: *} -> Boolean
     * @param {Object} spec
     * @param {Object} testObj
     * @return {Boolean}
     * @see R.where
     * @example
     *
     *      // pred :: Object -> Boolean
     *      var pred = R.whereEq({a: 1, b: 2});
     *
     *      pred({a: 1});              //=> false
     *      pred({a: 1, b: 2});        //=> true
     *      pred({a: 1, b: 2, c: 3});  //=> true
     *      pred({a: 1, b: 1});        //=> false
     */
    var whereEq = _curry2(function whereEq(spec, testObj) {
        return where(map(equals, spec), testObj);
    });

    var _flatCat = function () {
        var preservingReduced = function (xf) {
            return {
                '@@transducer/init': _xfBase.init,
                '@@transducer/result': function (result) {
                    return xf['@@transducer/result'](result);
                },
                '@@transducer/step': function (result, input) {
                    var ret = xf['@@transducer/step'](result, input);
                    return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
                }
            };
        };
        return function _xcat(xf) {
            var rxf = preservingReduced(xf);
            return {
                '@@transducer/init': _xfBase.init,
                '@@transducer/result': function (result) {
                    return rxf['@@transducer/result'](result);
                },
                '@@transducer/step': function (result, input) {
                    return !isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
                }
            };
        };
    }();

    // Array.prototype.indexOf doesn't exist below IE9
    // manually crawl the list to distinguish between +0 and -0
    // NaN
    // non-zero numbers can utilise Set
    // all these types can utilise Set
    // null can utilise Set
    // anything else not covered above, defer to R.equals
    var _indexOf = function _indexOf(list, a, idx) {
        var inf, item;
        // Array.prototype.indexOf doesn't exist below IE9
        if (typeof list.indexOf === 'function') {
            switch (typeof a) {
            case 'number':
                if (a === 0) {
                    // manually crawl the list to distinguish between +0 and -0
                    inf = 1 / a;
                    while (idx < list.length) {
                        item = list[idx];
                        if (item === 0 && 1 / item === inf) {
                            return idx;
                        }
                        idx += 1;
                    }
                    return -1;
                } else if (a !== a) {
                    // NaN
                    while (idx < list.length) {
                        item = list[idx];
                        if (typeof item === 'number' && item !== item) {
                            return idx;
                        }
                        idx += 1;
                    }
                    return -1;
                }
                // non-zero numbers can utilise Set
                return list.indexOf(a, idx);
            // all these types can utilise Set
            case 'string':
            case 'boolean':
            case 'function':
            case 'undefined':
                return list.indexOf(a, idx);
            case 'object':
                if (a === null) {
                    // null can utilise Set
                    return list.indexOf(a, idx);
                }
            }
        }
        // anything else not covered above, defer to R.equals
        while (idx < list.length) {
            if (equals(list[idx], a)) {
                return idx;
            }
            idx += 1;
        }
        return -1;
    };

    var _xchain = _curry2(function _xchain(f, xf) {
        return map(f, _flatCat(xf));
    });

    /**
     * Takes a list of predicates and returns a predicate that returns true for a
     * given list of arguments if every one of the provided predicates is satisfied
     * by those arguments.
     *
     * The function returned is a curried function whose arity matches that of the
     * highest-arity predicate.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Logic
     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
     * @param {Array} preds
     * @return {Function}
     * @see R.anyPass
     * @example
     *
     *      var isQueen = R.propEq('rank', 'Q');
     *      var isSpade = R.propEq('suit', '♠︎');
     *      var isQueenOfSpades = R.allPass([isQueen, isSpade]);
     *
     *      isQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false
     *      isQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true
     */
    var allPass = _curry1(function allPass(preds) {
        return curryN(reduce(max, 0, pluck('length', preds)), function () {
            var idx = 0;
            var len = preds.length;
            while (idx < len) {
                if (!preds[idx].apply(this, arguments)) {
                    return false;
                }
                idx += 1;
            }
            return true;
        });
    });

    /**
     * Takes a list of predicates and returns a predicate that returns true for a
     * given list of arguments if at least one of the provided predicates is
     * satisfied by those arguments.
     *
     * The function returned is a curried function whose arity matches that of the
     * highest-arity predicate.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Logic
     * @sig [(*... -> Boolean)] -> (*... -> Boolean)
     * @param {Array} preds
     * @return {Function}
     * @see R.allPass
     * @example
     *
     *      var gte = R.anyPass([R.gt, R.equals]);
     *
     *      gte(3, 2); //=> true
     *      gte(2, 2); //=> true
     *      gte(2, 3); //=> false
     */
    var anyPass = _curry1(function anyPass(preds) {
        return curryN(reduce(max, 0, pluck('length', preds)), function () {
            var idx = 0;
            var len = preds.length;
            while (idx < len) {
                if (preds[idx].apply(this, arguments)) {
                    return true;
                }
                idx += 1;
            }
            return false;
        });
    });

    /**
     * ap applies a list of functions to a list of values.
     *
     * Dispatches to the `ap` method of the second argument, if present. Also
     * treats curried functions as applicatives.
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category Function
     * @sig [a -> b] -> [a] -> [b]
     * @sig Apply f => f (a -> b) -> f a -> f b
     * @param {Array} fns An array of functions
     * @param {Array} vs An array of values
     * @return {Array} An array of results of applying each of `fns` to all of `vs` in turn.
     * @example
     *
     *      R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]
     */
    // else
    var ap = _curry2(function ap(applicative, fn) {
        return typeof applicative.ap === 'function' ? applicative.ap(fn) : typeof applicative === 'function' ? function (x) {
            return applicative(x)(fn(x));
        } : // else
        _reduce(function (acc, f) {
            return _concat(acc, map(f, fn));
        }, [], applicative);
    });

    /**
     * Given a spec object recursively mapping properties to functions, creates a
     * function producing an object of the same structure, by mapping each property
     * to the result of calling its associated function with the supplied arguments.
     *
     * @func
     * @memberOf R
     * @since v0.20.0
     * @category Function
     * @sig {k: ((a, b, ..., m) -> v)} -> ((a, b, ..., m) -> {k: v})
     * @param {Object} spec an object recursively mapping properties to functions for
     *        producing the values for these properties.
     * @return {Function} A function that returns an object of the same structure
     * as `spec', with each property set to the value returned by calling its
     * associated function with the supplied arguments.
     * @see R.converge, R.juxt
     * @example
     *
     *      var getMetrics = R.applySpec({
     *                                      sum: R.add,
     *                                      nested: { mul: R.multiply }
     *                                   });
     *      getMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }
     */
    var applySpec = _curry1(function applySpec(spec) {
        spec = map(function (v) {
            return typeof v == 'function' ? v : applySpec(v);
        }, spec);
        return curryN(reduce(max, 0, pluck('length', values(spec))), function () {
            var args = arguments;
            return map(function (f) {
                return apply(f, args);
            }, spec);
        });
    });

    /**
     * Returns the result of calling its first argument with the remaining
     * arguments. This is occasionally useful as a converging function for
     * `R.converge`: the left branch can produce a function while the right branch
     * produces a value to be passed to that function as an argument.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category Function
     * @sig (*... -> a),*... -> a
     * @param {Function} fn The function to apply to the remaining arguments.
     * @param {...*} args Any number of positional arguments.
     * @return {*}
     * @see R.apply
     * @example
     *
     *      var indentN = R.pipe(R.times(R.always(' ')),
     *                           R.join(''),
     *                           R.replace(/^(?!$)/gm));
     *
     *      var format = R.converge(R.call, [
     *                                  R.pipe(R.prop('indent'), indentN),
     *                                  R.prop('value')
     *                              ]);
     *
     *      format({indent: 2, value: 'foo\nbar\nbaz\n'}); //=> '  foo\n  bar\n  baz\n'
     */
    var call = curry(function call(fn) {
        return fn.apply(this, _slice(arguments, 1));
    });

    /**
     * `chain` maps a function over a list and concatenates the results. `chain`
     * is also known as `flatMap` in some libraries
     *
     * Dispatches to the `chain` method of the second argument, if present,
     * according to the [FantasyLand Chain spec](https://github.com/fantasyland/fantasy-land#chain).
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category List
     * @sig Chain m => (a -> m b) -> m a -> m b
     * @param {Function} fn
     * @param {Array} list
     * @return {Array}
     * @example
     *
     *      var duplicate = n => [n, n];
     *      R.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]
     */
    var chain = _curry2(_dispatchable('chain', _xchain, function chain(fn, monad) {
        if (typeof monad === 'function') {
            return function () {
                return monad.call(this, fn.apply(this, arguments)).apply(this, arguments);
            };
        }
        return _makeFlat(false)(map(fn, monad));
    }));

    /**
     * Returns a function, `fn`, which encapsulates if/else-if/else logic.
     * `R.cond` takes a list of [predicate, transform] pairs. All of the arguments
     * to `fn` are applied to each of the predicates in turn until one returns a
     * "truthy" value, at which point `fn` returns the result of applying its
     * arguments to the corresponding transformer. If none of the predicates
     * matches, `fn` returns undefined.
     *
     * @func
     * @memberOf R
     * @since v0.6.0
     * @category Logic
     * @sig [[(*... -> Boolean),(*... -> *)]] -> (*... -> *)
     * @param {Array} pairs
     * @return {Function}
     * @example
     *
     *      var fn = R.cond([
     *        [R.equals(0),   R.always('water freezes at 0°C')],
     *        [R.equals(100), R.always('water boils at 100°C')],
     *        [R.T,           temp => 'nothing special happens at ' + temp + '°C']
     *      ]);
     *      fn(0); //=> 'water freezes at 0°C'
     *      fn(50); //=> 'nothing special happens at 50°C'
     *      fn(100); //=> 'water boils at 100°C'
     */
    var cond = _curry1(function cond(pairs) {
        var arity = reduce(max, 0, map(function (pair) {
            return pair[0].length;
        }, pairs));
        return _arity(arity, function () {
            var idx = 0;
            while (idx < pairs.length) {
                if (pairs[idx][0].apply(this, arguments)) {
                    return pairs[idx][1].apply(this, arguments);
                }
                idx += 1;
            }
        });
    });

    /**
     * Wraps a constructor function inside a curried function that can be called
     * with the same arguments and returns the same type. The arity of the function
     * returned is specified to allow using variadic constructor functions.
     *
     * @func
     * @memberOf R
     * @since v0.4.0
     * @category Function
     * @sig Number -> (* -> {*}) -> (* -> {*})
     * @param {Number} n The arity of the constructor function.
     * @param {Function} Fn The constructor function to wrap.
     * @return {Function} A wrapped, curried constructor function.
     * @example
     *
     *      // Variadic constructor function
     *      var Widget = () => {
     *        this.children = Array.prototype.slice.call(arguments);
     *        // ...
     *      };
     *      Widget.prototype = {
     *        // ...
     *      };
     *      var allConfigs = [
     *        // ...
     *      ];
     *      R.map(R.constructN(1, Widget), allConfigs); // a list of Widgets
     */
    var constructN = _curry2(function constructN(n, Fn) {
        if (n > 10) {
            throw new Error('Constructor with greater than ten arguments');
        }
        if (n === 0) {
            return function () {
                return new Fn();
            };
        }
        return curry(nAry(n, function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
            switch (arguments.length) {
            case 1:
                return new Fn($0);
            case 2:
                return new Fn($0, $1);
            case 3:
                return new Fn($0, $1, $2);
            case 4:
                return new Fn($0, $1, $2, $3);
            case 5:
                return new Fn($0, $1, $2, $3, $4);
            case 6:
                return new Fn($0, $1, $2, $3, $4, $5);
            case 7:
                return new Fn($0, $1, $2, $3, $4, $5, $6);
            case 8:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
            case 9:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
            case 10:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
            }
        }));
    });

    /**
     * Accepts a converging function and a list of branching functions and returns
     * a new function. When invoked, this new function is applied to some
     * arguments, each branching function is applied to those same arguments. The
     * results of each branching function are passed as arguments to the converging
     * function to produce the return value.
     *
     * @func
     * @memberOf R
     * @since v0.4.2
     * @category Function
     * @sig (x1 -> x2 -> ... -> z) -> [(a -> b -> ... -> x1), (a -> b -> ... -> x2), ...] -> (a -> b -> ... -> z)
     * @param {Function} after A function. `after` will be invoked with the return values of
     *        `fn1` and `fn2` as its arguments.
     * @param {Array} functions A list of functions.
     * @return {Function} A new function.
     * @example
     *
     *      var add = (a, b) => a + b;
     *      var multiply = (a, b) => a * b;
     *      var subtract = (a, b) => a - b;
     *
     *      //≅ multiply( add(1, 2), subtract(1, 2) );
     *      R.converge(multiply, [add, subtract])(1, 2); //=> -3
     *
     *      var add3 = (a, b, c) => a + b + c;
     *      R.converge(add3, [multiply, add, subtract])(1, 2); //=> 4
     */
    var converge = _curry2(function converge(after, fns) {
        return curryN(reduce(max, 0, pluck('length', fns)), function () {
            var args = arguments;
            var context = this;
            return after.apply(context, _map(function (fn) {
                return fn.apply(context, args);
            }, fns));
        });
    });

    /**
     * Counts the elements of a list according to how many match each value of a
     * key generated by the supplied function. Returns an object mapping the keys
     * produced by `fn` to the number of occurrences in the list. Note that all
     * keys are coerced to strings because of how JavaScript objects work.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig (a -> String) -> [a] -> {*}
     * @param {Function} fn The function used to map values to keys.
     * @param {Array} list The list to count elements from.
     * @return {Object} An object mapping keys to number of occurrences in the list.
     * @example
     *
     *      var numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];
     *      var letters = R.split('', 'abcABCaaaBBc');
     *      R.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}
     *      R.countBy(R.toLower)(letters);   //=> {'a': 5, 'b': 4, 'c': 3}
     */
    var countBy = reduceBy(function (acc, elem) {
        return acc + 1;
    }, 0);

    /**
     * Returns a new list without any consecutively repeating elements. Equality is
     * determined by applying the supplied predicate two consecutive elements. The
     * first element in a series of equal element is the one being preserved.
     *
     * Dispatches to the `dropRepeatsWith` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category List
     * @sig (a, a -> Boolean) -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list The array to consider.
     * @return {Array} `list` without repeating elements.
     * @see R.transduce
     * @example
     *
     *      var l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];
     *      R.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]
     */
    var dropRepeatsWith = _curry2(_dispatchable('dropRepeatsWith', _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
        var result = [];
        var idx = 1;
        var len = list.length;
        if (len !== 0) {
            result[0] = list[0];
            while (idx < len) {
                if (!pred(last(result), list[idx])) {
                    result[result.length] = list[idx];
                }
                idx += 1;
            }
        }
        return result;
    }));

    /**
     * Takes a function and two values in its domain and returns `true` if the
     * values map to the same value in the codomain; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.18.0
     * @category Relation
     * @sig (a -> b) -> a -> a -> Boolean
     * @param {Function} f
     * @param {*} x
     * @param {*} y
     * @return {Boolean}
     * @example
     *
     *      R.eqBy(Math.abs, 5, -5); //=> true
     */
    var eqBy = _curry3(function eqBy(f, x, y) {
        return equals(f(x), f(y));
    });

    /**
     * Reports whether two objects have the same value, in `R.equals` terms, for
     * the specified property. Useful as a curried predicate.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig k -> {k: v} -> {k: v} -> Boolean
     * @param {String} prop The name of the property to compare
     * @param {Object} obj1
     * @param {Object} obj2
     * @return {Boolean}
     *
     * @example
     *
     *      var o1 = { a: 1, b: 2, c: 3, d: 4 };
     *      var o2 = { a: 10, b: 20, c: 3, d: 40 };
     *      R.eqProps('a', o1, o2); //=> false
     *      R.eqProps('c', o1, o2); //=> true
     */
    var eqProps = _curry3(function eqProps(prop, obj1, obj2) {
        return equals(obj1[prop], obj2[prop]);
    });

    /**
     * Splits a list into sub-lists stored in an object, based on the result of
     * calling a String-returning function on each element, and grouping the
     * results according to values returned.
     *
     * Dispatches to the `groupBy` method of the second argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig (a -> String) -> [a] -> {String: [a]}
     * @param {Function} fn Function :: a -> String
     * @param {Array} list The array to group
     * @return {Object} An object with the output of `fn` for keys, mapped to arrays of elements
     *         that produced that key when passed to `fn`.
     * @see R.transduce
     * @example
     *
     *      var byGrade = R.groupBy(function(student) {
     *        var score = student.score;
     *        return score < 65 ? 'F' :
     *               score < 70 ? 'D' :
     *               score < 80 ? 'C' :
     *               score < 90 ? 'B' : 'A';
     *      });
     *      var students = [{name: 'Abby', score: 84},
     *                      {name: 'Eddy', score: 58},
     *                      // ...
     *                      {name: 'Jack', score: 69}];
     *      byGrade(students);
     *      // {
     *      //   'A': [{name: 'Dianne', score: 99}],
     *      //   'B': [{name: 'Abby', score: 84}]
     *      //   // ...,
     *      //   'F': [{name: 'Eddy', score: 58}]
     *      // }
     */
    var groupBy = _curry2(_checkForMethod('groupBy', reduceBy(function (acc, item) {
        if (acc == null) {
            acc = [];
        }
        acc.push(item);
        return acc;
    }, null)));

    /**
     * Given a function that generates a key, turns a list of objects into an
     * object indexing the objects by the given key. Note that if multiple
     * objects generate the same value for the indexing key only the last value
     * will be included in the generated object.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig (a -> String) -> [{k: v}] -> {k: {k: v}}
     * @param {Function} fn Function :: a -> String
     * @param {Array} array The array of objects to index
     * @return {Object} An object indexing each array element by the given property.
     * @example
     *
     *      var list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
     *      R.indexBy(R.prop('id'), list);
     *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
     */
    var indexBy = reduceBy(function (acc, elem) {
        return elem;
    }, null);

    /**
     * Returns the position of the first occurrence of an item in an array, or -1
     * if the item is not included in the array. `R.equals` is used to determine
     * equality.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig a -> [a] -> Number
     * @param {*} target The item to find.
     * @param {Array} xs The array to search in.
     * @return {Number} the index of the target, or -1 if the target is not found.
     * @see R.lastIndexOf
     * @example
     *
     *      R.indexOf(3, [1,2,3,4]); //=> 2
     *      R.indexOf(10, [1,2,3,4]); //=> -1
     */
    var indexOf = _curry2(function indexOf(target, xs) {
        return typeof xs.indexOf === 'function' && !_isArray(xs) ? xs.indexOf(target) : _indexOf(xs, target, 0);
    });

    /**
     * juxt applies a list of functions to a list of values.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Function
     * @sig [(a, b, ..., m) -> n] -> ((a, b, ..., m) -> [n])
     * @param {Array} fns An array of functions
     * @return {Function} A function that returns a list of values after applying each of the original `fns` to its parameters.
     * @see R.applySpec
     * @example
     *
     *      var getRange = R.juxt([Math.min, Math.max]);
     *      getRange(3, 4, 9, -3); //=> [-3, 9]
     */
    var juxt = _curry1(function juxt(fns) {
        return converge(_arrayOf, fns);
    });

    /**
     * Returns a lens for the given getter and setter functions. The getter "gets"
     * the value of the focus; the setter "sets" the value of the focus. The setter
     * should not mutate the data structure.
     *
     * @func
     * @memberOf R
     * @since v0.8.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
     * @param {Function} getter
     * @param {Function} setter
     * @return {Lens}
     * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
     * @example
     *
     *      var xLens = R.lens(R.prop('x'), R.assoc('x'));
     *
     *      R.view(xLens, {x: 1, y: 2});            //=> 1
     *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
     *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
     */
    var lens = _curry2(function lens(getter, setter) {
        return function (toFunctorFn) {
            return function (target) {
                return map(function (focus) {
                    return setter(focus, target);
                }, toFunctorFn(getter(target)));
            };
        };
    });

    /**
     * Returns a lens whose focus is the specified index.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig Number -> Lens s a
     * @param {Number} n
     * @return {Lens}
     * @see R.view, R.set, R.over
     * @example
     *
     *      var headLens = R.lensIndex(0);
     *
     *      R.view(headLens, ['a', 'b', 'c']);            //=> 'a'
     *      R.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']
     *      R.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']
     */
    var lensIndex = _curry1(function lensIndex(n) {
        return lens(nth(n), update(n));
    });

    /**
     * Returns a lens whose focus is the specified path.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig [String] -> Lens s a
     * @param {Array} path The path to use.
     * @return {Lens}
     * @see R.view, R.set, R.over
     * @example
     *
     *      var xyLens = R.lensPath(['x', 'y']);
     *
     *      R.view(xyLens, {x: {y: 2, z: 3}});            //=> 2
     *      R.set(xyLens, 4, {x: {y: 2, z: 3}});          //=> {x: {y: 4, z: 3}}
     *      R.over(xyLens, R.negate, {x: {y: 2, z: 3}});  //=> {x: {y: -2, z: 3}}
     */
    var lensPath = _curry1(function lensPath(p) {
        return lens(path(p), assocPath(p));
    });

    /**
     * Returns a lens whose focus is the specified property.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category Object
     * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
     * @sig String -> Lens s a
     * @param {String} k
     * @return {Lens}
     * @see R.view, R.set, R.over
     * @example
     *
     *      var xLens = R.lensProp('x');
     *
     *      R.view(xLens, {x: 1, y: 2});            //=> 1
     *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
     *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
     */
    var lensProp = _curry1(function lensProp(k) {
        return lens(prop(k), assoc(k));
    });

    /**
     * "lifts" a function to be the specified arity, so that it may "map over" that
     * many lists, Functions or other objects that satisfy the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category Function
     * @sig Number -> (*... -> *) -> ([*]... -> [*])
     * @param {Function} fn The function to lift into higher context
     * @return {Function} The lifted function.
     * @see R.lift, R.ap
     * @example
     *
     *      var madd3 = R.liftN(3, R.curryN(3, (...args) => R.sum(args)));
     *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
     */
    var liftN = _curry2(function liftN(arity, fn) {
        var lifted = curryN(arity, fn);
        return curryN(arity, function () {
            return _reduce(ap, map(lifted, arguments[0]), _slice(arguments, 1));
        });
    });

    /**
     * Returns the mean of the given list of numbers.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list
     * @return {Number}
     * @example
     *
     *      R.mean([2, 7, 9]); //=> 6
     *      R.mean([]); //=> NaN
     */
    var mean = _curry1(function mean(list) {
        return sum(list) / list.length;
    });

    /**
     * Returns the median of the given list of numbers.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list
     * @return {Number}
     * @example
     *
     *      R.median([2, 9, 7]); //=> 7
     *      R.median([7, 2, 10, 9]); //=> 8
     *      R.median([]); //=> NaN
     */
    var median = _curry1(function median(list) {
        var len = list.length;
        if (len === 0) {
            return NaN;
        }
        var width = 2 - len % 2;
        var idx = (len - width) / 2;
        return mean(_slice(list).sort(function (a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
        }).slice(idx, idx + width));
    });

    /**
     * Takes a predicate and a list or other "filterable" object and returns the
     * pair of filterable objects of the same type of elements which do and do not
     * satisfy, the predicate, respectively.
     *
     * @func
     * @memberOf R
     * @since v0.1.4
     * @category List
     * @sig Filterable f => (a -> Boolean) -> f a -> [f a, f a]
     * @param {Function} pred A predicate to determine which side the element belongs to.
     * @param {Array} filterable the list (or other filterable) to partition.
     * @return {Array} An array, containing first the subset of elements that satisfy the
     *         predicate, and second the subset of elements that do not satisfy.
     * @see R.filter, R.reject
     * @example
     *
     *      R.partition(R.contains('s'), ['sss', 'ttt', 'foo', 'bars']);
     *      // => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]
     *
     *      R.partition(R.contains('s'), { a: 'sss', b: 'ttt', foo: 'bars' });
     *      // => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]
     */
    var partition = juxt([
        filter,
        reject
    ]);

    /**
     * Performs left-to-right function composition. The leftmost function may have
     * any arity; the remaining functions must be unary.
     *
     * In some libraries this function is named `sequence`.
     *
     * **Note:** The result of pipe is not automatically curried.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (((a, b, ..., n) -> o), (o -> p), ..., (x -> y), (y -> z)) -> ((a, b, ..., n) -> z)
     * @param {...Function} functions
     * @return {Function}
     * @see R.compose
     * @example
     *
     *      var f = R.pipe(Math.pow, R.negate, R.inc);
     *
     *      f(3, 4); // -(3^4) + 1
     */
    var pipe = function pipe() {
        if (arguments.length === 0) {
            throw new Error('pipe requires at least one argument');
        }
        return _arity(arguments[0].length, reduce(_pipe, arguments[0], tail(arguments)));
    };

    /**
     * Performs left-to-right composition of one or more Promise-returning
     * functions. The leftmost function may have any arity; the remaining functions
     * must be unary.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category Function
     * @sig ((a -> Promise b), (b -> Promise c), ..., (y -> Promise z)) -> (a -> Promise z)
     * @param {...Function} functions
     * @return {Function}
     * @see R.composeP
     * @example
     *
     *      //  followersForUser :: String -> Promise [User]
     *      var followersForUser = R.pipeP(db.getUserById, db.getFollowers);
     */
    var pipeP = function pipeP() {
        if (arguments.length === 0) {
            throw new Error('pipeP requires at least one argument');
        }
        return _arity(arguments[0].length, reduce(_pipeP, arguments[0], tail(arguments)));
    };

    /**
     * Multiplies together all the elements of a list.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Math
     * @sig [Number] -> Number
     * @param {Array} list An array of numbers
     * @return {Number} The product of all the numbers in the list.
     * @see R.reduce
     * @example
     *
     *      R.product([2,4,6,8,100,1]); //=> 38400
     */
    var product = reduce(multiply, 1);

    /**
     * Transforms a [Traversable](https://github.com/fantasyland/fantasy-land#traversable)
     * of [Applicative](https://github.com/fantasyland/fantasy-land#applicative) into an
     * Applicative of Traversable.
     *
     * Dispatches to the `sequence` method of the second argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig (Applicative f, Traversable t) => (a -> f a) -> t (f a) -> f (t a)
     * @param {Function} of
     * @param {*} traversable
     * @return {*}
     * @see R.traverse
     * @example
     *
     *      R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])
     *      R.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()
     *
     *      R.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]
     *      R.sequence(R.of, Nothing());       //=> [Nothing()]
     */
    var sequence = _curry2(function sequence(of, traversable) {
        return typeof traversable.sequence === 'function' ? traversable.sequence(of) : reduceRight(function (acc, x) {
            return ap(map(prepend, x), acc);
        }, of([]), traversable);
    });

    /**
     * Maps an [Applicative](https://github.com/fantasyland/fantasy-land#applicative)-returning
     * function over a [Traversable](https://github.com/fantasyland/fantasy-land#traversable),
     * then uses [`sequence`](#sequence) to transform the resulting Traversable of Applicative
     * into an Applicative of Traversable.
     *
     * Dispatches to the `sequence` method of the third argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig (Applicative f, Traversable t) => (a -> f a) -> (a -> f b) -> t a -> f (t b)
     * @param {Function} of
     * @param {Function} f
     * @param {*} traversable
     * @return {*}
     * @see R.sequence
     * @example
     *
     *      // Returns `Nothing` if the given divisor is `0`
     *      safeDiv = n => d => d === 0 ? Nothing() : Just(n / d)
     *
     *      R.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Just([5, 2.5, 2])
     *      R.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Nothing
     */
    var traverse = _curry3(function traverse(of, f, traversable) {
        return sequence(of, map(f, traversable));
    });

    /**
     * Shorthand for `R.chain(R.identity)`, which removes one level of nesting from
     * any [Chain](https://github.com/fantasyland/fantasy-land#chain).
     *
     * @func
     * @memberOf R
     * @since v0.3.0
     * @category List
     * @sig Chain c => c (c a) -> c a
     * @param {*} list
     * @return {*}
     * @see R.flatten, R.chain
     * @example
     *
     *      R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]
     *      R.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]
     */
    var unnest = chain(_identity);

    var _contains = function _contains(a, list) {
        return _indexOf(list, a, 0) >= 0;
    };

    //  mapPairs :: (Object, [String]) -> [String]
    var _toString = function _toString(x, seen) {
        var recur = function recur(y) {
            var xs = seen.concat([x]);
            return _contains(y, xs) ? '<Circular>' : _toString(y, xs);
        };
        //  mapPairs :: (Object, [String]) -> [String]
        var mapPairs = function (obj, keys) {
            return _map(function (k) {
                return _quote(k) + ': ' + recur(obj[k]);
            }, keys.slice().sort());
        };
        switch (Object.prototype.toString.call(x)) {
        case '[object Arguments]':
            return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
        case '[object Array]':
            return '[' + _map(recur, x).concat(mapPairs(x, reject(function (k) {
                return /^\d+$/.test(k);
            }, keys(x)))).join(', ') + ']';
        case '[object Boolean]':
            return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
        case '[object Date]':
            return 'new Date(' + (isNaN(x.valueOf()) ? recur(NaN) : _quote(_toISOString(x))) + ')';
        case '[object Null]':
            return 'null';
        case '[object Number]':
            return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
        case '[object String]':
            return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
        case '[object Undefined]':
            return 'undefined';
        default:
            if (typeof x.toString === 'function') {
                var repr = x.toString();
                if (repr !== '[object Object]') {
                    return repr;
                }
            }
            return '{' + mapPairs(x, keys(x)).join(', ') + '}';
        }
    };

    /**
     * Performs right-to-left function composition. The rightmost function may have
     * any arity; the remaining functions must be unary.
     *
     * **Note:** The result of compose is not automatically curried.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig ((y -> z), (x -> y), ..., (o -> p), ((a, b, ..., n) -> o)) -> ((a, b, ..., n) -> z)
     * @param {...Function} functions
     * @return {Function}
     * @see R.pipe
     * @example
     *
     *      var f = R.compose(R.inc, R.negate, Math.pow);
     *
     *      f(3, 4); // -(3^4) + 1
     */
    var compose = function compose() {
        if (arguments.length === 0) {
            throw new Error('compose requires at least one argument');
        }
        return pipe.apply(this, reverse(arguments));
    };

    /**
     * Returns the right-to-left Kleisli composition of the provided functions,
     * each of which must return a value of a type supported by [`chain`](#chain).
     *
     * `R.composeK(h, g, f)` is equivalent to `R.compose(R.chain(h), R.chain(g), R.chain(f))`.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Function
     * @sig Chain m => ((y -> m z), (x -> m y), ..., (a -> m b)) -> (m a -> m z)
     * @param {...Function}
     * @return {Function}
     * @see R.pipeK
     * @example
     *
     *      //  parseJson :: String -> Maybe *
     *      //  get :: String -> Object -> Maybe *
     *
     *      //  getStateCode :: Maybe String -> Maybe String
     *      var getStateCode = R.composeK(
     *        R.compose(Maybe.of, R.toUpper),
     *        get('state'),
     *        get('address'),
     *        get('user'),
     *        parseJson
     *      );
     *
     *      getStateCode(Maybe.of('{"user":{"address":{"state":"ny"}}}'));
     *      //=> Just('NY')
     *      getStateCode(Maybe.of('[Invalid JSON]'));
     *      //=> Nothing()
     */
    var composeK = function composeK() {
        return compose.apply(this, prepend(identity, map(chain, arguments)));
    };

    /**
     * Performs right-to-left composition of one or more Promise-returning
     * functions. The rightmost function may have any arity; the remaining
     * functions must be unary.
     *
     * @func
     * @memberOf R
     * @since v0.10.0
     * @category Function
     * @sig ((y -> Promise z), (x -> Promise y), ..., (a -> Promise b)) -> (a -> Promise z)
     * @param {...Function} functions
     * @return {Function}
     * @see R.pipeP
     * @example
     *
     *      //  followersForUser :: String -> Promise [User]
     *      var followersForUser = R.composeP(db.getFollowers, db.getUserById);
     */
    var composeP = function composeP() {
        if (arguments.length === 0) {
            throw new Error('composeP requires at least one argument');
        }
        return pipeP.apply(this, reverse(arguments));
    };

    /**
     * Wraps a constructor function inside a curried function that can be called
     * with the same arguments and returns the same type.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (* -> {*}) -> (* -> {*})
     * @param {Function} Fn The constructor function to wrap.
     * @return {Function} A wrapped, curried constructor function.
     * @example
     *
     *      // Constructor function
     *      var Widget = config => {
     *        // ...
     *      };
     *      Widget.prototype = {
     *        // ...
     *      };
     *      var allConfigs = [
     *        // ...
     *      ];
     *      R.map(R.construct(Widget), allConfigs); // a list of Widgets
     */
    var construct = _curry1(function construct(Fn) {
        return constructN(Fn.length, Fn);
    });

    /**
     * Returns `true` if the specified value is equal, in `R.equals` terms, to at
     * least one element of the given list; `false` otherwise.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig a -> [a] -> Boolean
     * @param {Object} a The item to compare against.
     * @param {Array} list The array to consider.
     * @return {Boolean} `true` if the item is in the list, `false` otherwise.
     * @see R.any
     * @example
     *
     *      R.contains(3, [1, 2, 3]); //=> true
     *      R.contains(4, [1, 2, 3]); //=> false
     *      R.contains([42], [[42]]); //=> true
     */
    var contains = _curry2(_contains);

    /**
     * Finds the set (i.e. no duplicates) of all elements in the first list not
     * contained in the second list.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig [*] -> [*] -> [*]
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The elements in `list1` that are not in `list2`.
     * @see R.differenceWith, R.symmetricDifference, R.symmetricDifferenceWith
     * @example
     *
     *      R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]
     *      R.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]
     */
    var difference = _curry2(function difference(first, second) {
        var out = [];
        var idx = 0;
        var firstLen = first.length;
        while (idx < firstLen) {
            if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
                out[out.length] = first[idx];
            }
            idx += 1;
        }
        return out;
    });

    /**
     * Returns a new list without any consecutively repeating elements. `R.equals`
     * is used to determine equality.
     *
     * Dispatches to the `dropRepeats` method of the first argument, if present.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The array to consider.
     * @return {Array} `list` without repeating elements.
     * @see R.transduce
     * @example
     *
     *     R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]
     */
    var dropRepeats = _curry1(_dispatchable('dropRepeats', _xdropRepeatsWith(equals), dropRepeatsWith(equals)));

    /**
     * "lifts" a function of arity > 1 so that it may "map over" a list, Function or other
     * object that satisfies the [FantasyLand Apply spec](https://github.com/fantasyland/fantasy-land#apply).
     *
     * @func
     * @memberOf R
     * @since v0.7.0
     * @category Function
     * @sig (*... -> *) -> ([*]... -> [*])
     * @param {Function} fn The function to lift into higher context
     * @return {Function} The lifted function.
     * @see R.liftN
     * @example
     *
     *      var madd3 = R.lift(R.curry((a, b, c) => a + b + c));
     *
     *      madd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]
     *
     *      var madd5 = R.lift(R.curry((a, b, c, d, e) => a + b + c + d + e));
     *
     *      madd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]
     */
    var lift = _curry1(function lift(fn) {
        return liftN(fn.length, fn);
    });

    /**
     * Returns a partial copy of an object omitting the keys specified.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Object
     * @sig [String] -> {String: *} -> {String: *}
     * @param {Array} names an array of String property names to omit from the new object
     * @param {Object} obj The object to copy from
     * @return {Object} A new object with properties from `names` not on it.
     * @see R.pick
     * @example
     *
     *      R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}
     */
    var omit = _curry2(function omit(names, obj) {
        var result = {};
        for (var prop in obj) {
            if (!_contains(prop, names)) {
                result[prop] = obj[prop];
            }
        }
        return result;
    });

    /**
     * Returns the left-to-right Kleisli composition of the provided functions,
     * each of which must return a value of a type supported by [`chain`](#chain).
     *
     * `R.pipeK(f, g, h)` is equivalent to `R.pipe(R.chain(f), R.chain(g), R.chain(h))`.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category Function
     * @sig Chain m => ((a -> m b), (b -> m c), ..., (y -> m z)) -> (m a -> m z)
     * @param {...Function}
     * @return {Function}
     * @see R.composeK
     * @example
     *
     *      //  parseJson :: String -> Maybe *
     *      //  get :: String -> Object -> Maybe *
     *
     *      //  getStateCode :: Maybe String -> Maybe String
     *      var getStateCode = R.pipeK(
     *        parseJson,
     *        get('user'),
     *        get('address'),
     *        get('state'),
     *        R.compose(Maybe.of, R.toUpper)
     *      );
     *
     *      getStateCode(Maybe.of('{"user":{"address":{"state":"ny"}}}'));
     *      //=> Just('NY')
     *      getStateCode(Maybe.of('[Invalid JSON]'));
     *      //=> Nothing()
     */
    var pipeK = function pipeK() {
        return composeK.apply(this, reverse(arguments));
    };

    /**
     * Returns the string representation of the given value. `eval`'ing the output
     * should result in a value equivalent to the input value. Many of the built-in
     * `toString` methods do not satisfy this requirement.
     *
     * If the given value is an `[object Object]` with a `toString` method other
     * than `Object.prototype.toString`, this method is invoked with no arguments
     * to produce the return value. This means user-defined constructor functions
     * can provide a suitable `toString` method. For example:
     *
     *     function Point(x, y) {
     *       this.x = x;
     *       this.y = y;
     *     }
     *
     *     Point.prototype.toString = function() {
     *       return 'new Point(' + this.x + ', ' + this.y + ')';
     *     };
     *
     *     R.toString(new Point(1, 2)); //=> 'new Point(1, 2)'
     *
     * @func
     * @memberOf R
     * @since v0.14.0
     * @category String
     * @sig * -> String
     * @param {*} val
     * @return {String}
     * @example
     *
     *      R.toString(42); //=> '42'
     *      R.toString('abc'); //=> '"abc"'
     *      R.toString([1, 2, 3]); //=> '[1, 2, 3]'
     *      R.toString({foo: 1, bar: 2, baz: 3}); //=> '{"bar": 2, "baz": 3, "foo": 1}'
     *      R.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date("2001-02-03T04:05:06.000Z")'
     */
    var toString = _curry1(function toString(val) {
        return _toString(val, []);
    });

    /**
     * Returns a new list without values in the first argument.
     * `R.equals` is used to determine equality.
     *
     * Acts as a transducer if a transformer is given in list position.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category List
     * @sig [a] -> [a] -> [a]
     * @param {Array} list1 The values to be removed from `list2`.
     * @param {Array} list2 The array to remove values from.
     * @return {Array} The new array without values in `list1`.
     * @see R.transduce
     * @example
     *
     *      R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]
     */
    var without = _curry2(function (xs, list) {
        return reject(flip(_contains)(xs), list);
    });

    // A simple Set type that honours R.equals semantics
    /* globals Set */
    // until we figure out why jsdoc chokes on this
    // @param item The item to add to the Set
    // @returns {boolean} true if the item did not exist prior, otherwise false
    //
    //
    // @param item The item to check for existence in the Set
    // @returns {boolean} true if the item exists in the Set, otherwise false
    //
    //
    // Combines the logic for checking whether an item is a member of the set and
    // for adding a new item to the set.
    //
    // @param item       The item to check or add to the Set instance.
    // @param shouldAdd  If true, the item will be added to the set if it doesn't
    //                   already exist.
    // @param set        The set instance to check or add to.
    // @return {boolean} true if the item already existed, otherwise false.
    //
    // distinguish between +0 and -0
    // these types can all utilise the native Set
    // set._items['boolean'] holds a two element array
    // representing [ falseExists, trueExists ]
    // compare functions for reference equality
    /* falls through */
    // reduce the search size of heterogeneous sets by creating buckets
    // for each type.
    // scan through all previously applied items
    var _Set = function () {
        function _Set() {
            /* globals Set */
            this._nativeSet = typeof Set === 'function' ? new Set() : null;
            this._items = {};
        }
        // until we figure out why jsdoc chokes on this
        // @param item The item to add to the Set
        // @returns {boolean} true if the item did not exist prior, otherwise false
        //
        _Set.prototype.add = function (item) {
            return !hasOrAdd(item, true, this);
        };
        //
        // @param item The item to check for existence in the Set
        // @returns {boolean} true if the item exists in the Set, otherwise false
        //
        _Set.prototype.has = function (item) {
            return hasOrAdd(item, false, this);
        };
        //
        // Combines the logic for checking whether an item is a member of the set and
        // for adding a new item to the set.
        //
        // @param item       The item to check or add to the Set instance.
        // @param shouldAdd  If true, the item will be added to the set if it doesn't
        //                   already exist.
        // @param set        The set instance to check or add to.
        // @return {boolean} true if the item already existed, otherwise false.
        //
        function hasOrAdd(item, shouldAdd, set) {
            var type = typeof item;
            var prevSize, newSize;
            switch (type) {
            case 'string':
            case 'number':
                // distinguish between +0 and -0
                if (item === 0 && 1 / item === -Infinity) {
                    if (set._items['-0']) {
                        return true;
                    } else {
                        if (shouldAdd) {
                            set._items['-0'] = true;
                        }
                        return false;
                    }
                }
                // these types can all utilise the native Set
                if (set._nativeSet !== null) {
                    if (shouldAdd) {
                        prevSize = set._nativeSet.size;
                        set._nativeSet.add(item);
                        newSize = set._nativeSet.size;
                        return newSize === prevSize;
                    } else {
                        return set._nativeSet.has(item);
                    }
                } else {
                    if (!(type in set._items)) {
                        if (shouldAdd) {
                            set._items[type] = {};
                            set._items[type][item] = true;
                        }
                        return false;
                    } else if (item in set._items[type]) {
                        return true;
                    } else {
                        if (shouldAdd) {
                            set._items[type][item] = true;
                        }
                        return false;
                    }
                }
            case 'boolean':
                // set._items['boolean'] holds a two element array
                // representing [ falseExists, trueExists ]
                if (type in set._items) {
                    var bIdx = item ? 1 : 0;
                    if (set._items[type][bIdx]) {
                        return true;
                    } else {
                        if (shouldAdd) {
                            set._items[type][bIdx] = true;
                        }
                        return false;
                    }
                } else {
                    if (shouldAdd) {
                        set._items[type] = item ? [
                            false,
                            true
                        ] : [
                            true,
                            false
                        ];
                    }
                    return false;
                }
            case 'function':
                // compare functions for reference equality
                if (set._nativeSet !== null) {
                    if (shouldAdd) {
                        prevSize = set._nativeSet.size;
                        set._nativeSet.add(item);
                        newSize = set._nativeSet.size;
                        return newSize > prevSize;
                    } else {
                        return set._nativeSet.has(item);
                    }
                } else {
                    if (!(type in set._items)) {
                        if (shouldAdd) {
                            set._items[type] = [item];
                        }
                        return false;
                    }
                    if (!_contains(item, set._items[type])) {
                        if (shouldAdd) {
                            set._items[type].push(item);
                        }
                        return false;
                    }
                    return true;
                }
            case 'undefined':
                if (set._items[type]) {
                    return true;
                } else {
                    if (shouldAdd) {
                        set._items[type] = true;
                    }
                    return false;
                }
            case 'object':
                if (item === null) {
                    if (!set._items['null']) {
                        if (shouldAdd) {
                            set._items['null'] = true;
                        }
                        return false;
                    }
                    return true;
                }
            /* falls through */
            default:
                // reduce the search size of heterogeneous sets by creating buckets
                // for each type.
                type = Object.prototype.toString.call(item);
                if (!(type in set._items)) {
                    if (shouldAdd) {
                        set._items[type] = [item];
                    }
                    return false;
                }
                // scan through all previously applied items
                if (!_contains(item, set._items[type])) {
                    if (shouldAdd) {
                        set._items[type].push(item);
                    }
                    return false;
                }
                return true;
            }
        }
        return _Set;
    }();

    /**
     * A function wrapping calls to the two functions in an `&&` operation,
     * returning the result of the first function if it is false-y and the result
     * of the second function otherwise. Note that this is short-circuited,
     * meaning that the second function will not be invoked if the first returns a
     * false-y value.
     *
     * In addition to functions, `R.both` also accepts any fantasy-land compatible
     * applicative functor.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category Logic
     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
     * @param {Function} f a predicate
     * @param {Function} g another predicate
     * @return {Function} a function that applies its arguments to `f` and `g` and `&&`s their outputs together.
     * @see R.and
     * @example
     *
     *      var gt10 = x => x > 10;
     *      var even = x => x % 2 === 0;
     *      var f = R.both(gt10, even);
     *      f(100); //=> true
     *      f(101); //=> false
     */
    var both = _curry2(function both(f, g) {
        return _isFunction(f) ? function _both() {
            return f.apply(this, arguments) && g.apply(this, arguments);
        } : lift(and)(f, g);
    });

    /**
     * Takes a function `f` and returns a function `g` such that:
     *
     *   - applying `g` to zero or more arguments will give __true__ if applying
     *     the same arguments to `f` gives a logical __false__ value; and
     *
     *   - applying `g` to zero or more arguments will give __false__ if applying
     *     the same arguments to `f` gives a logical __true__ value.
     *
     * `R.complement` will work on all other functors as well.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category Logic
     * @sig (*... -> *) -> (*... -> Boolean)
     * @param {Function} f
     * @return {Function}
     * @see R.not
     * @example
     *
     *      var isEven = n => n % 2 === 0;
     *      var isOdd = R.complement(isEven);
     *      isOdd(21); //=> true
     *      isOdd(42); //=> false
     */
    var complement = lift(not);

    /**
     * Returns the result of concatenating the given lists or strings.
     *
     * Note: `R.concat` expects both arguments to be of the same type,
     * unlike the native `Array.prototype.concat` method. It will throw
     * an error if you `concat` an Array with a non-Array value.
     *
     * Dispatches to the `concat` method of the first argument, if present.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a] -> [a]
     * @sig String -> String -> String
     * @param {Array|String} a
     * @param {Array|String} b
     * @return {Array|String}
     *
     * @example
     *
     *      R.concat([], []); //=> []
     *      R.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
     *      R.concat('ABC', 'DEF'); // 'ABCDEF'
     */
    var concat = _curry2(function concat(a, b) {
        if (a == null || !_isFunction(a.concat)) {
            throw new TypeError(toString(a) + ' does not have a method named "concat"');
        }
        if (_isArray(a) && !_isArray(b)) {
            throw new TypeError(toString(b) + ' is not an array');
        }
        return a.concat(b);
    });

    /**
     * A function wrapping calls to the two functions in an `||` operation,
     * returning the result of the first function if it is truth-y and the result
     * of the second function otherwise. Note that this is short-circuited,
     * meaning that the second function will not be invoked if the first returns a
     * truth-y value.
     *
     * In addition to functions, `R.either` also accepts any fantasy-land compatible
     * applicative functor.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category Logic
     * @sig (*... -> Boolean) -> (*... -> Boolean) -> (*... -> Boolean)
     * @param {Function} f a predicate
     * @param {Function} g another predicate
     * @return {Function} a function that applies its arguments to `f` and `g` and `||`s their outputs together.
     * @see R.or
     * @example
     *
     *      var gt10 = x => x > 10;
     *      var even = x => x % 2 === 0;
     *      var f = R.either(gt10, even);
     *      f(101); //=> true
     *      f(8); //=> true
     */
    var either = _curry2(function either(f, g) {
        return _isFunction(f) ? function _either() {
            return f.apply(this, arguments) || g.apply(this, arguments);
        } : lift(or)(f, g);
    });

    /**
     * Turns a named method with a specified arity into a function that can be
     * called directly supplied with arguments and a target object.
     *
     * The returned function is curried and accepts `arity + 1` parameters where
     * the final parameter is the target object.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig Number -> String -> (a -> b -> ... -> n -> Object -> *)
     * @param {Number} arity Number of arguments the returned function should take
     *        before the target object.
     * @param {String} method Name of the method to call.
     * @return {Function} A new curried function.
     * @example
     *
     *      var sliceFrom = R.invoker(1, 'slice');
     *      sliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'
     *      var sliceFrom6 = R.invoker(2, 'slice')(6);
     *      sliceFrom6(8, 'abcdefghijklm'); //=> 'gh'
     */
    var invoker = _curry2(function invoker(arity, method) {
        return curryN(arity + 1, function () {
            var target = arguments[arity];
            if (target != null && _isFunction(target[method])) {
                return target[method].apply(target, _slice(arguments, 0, arity));
            }
            throw new TypeError(toString(target) + ' does not have a method named "' + method + '"');
        });
    });

    /**
     * Returns a string made by inserting the `separator` between each element and
     * concatenating all the elements into a single string.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig String -> [a] -> String
     * @param {Number|String} separator The string used to separate the elements.
     * @param {Array} xs The elements to join into a string.
     * @return {String} str The string made by concatenating `xs` with `separator`.
     * @see R.split
     * @example
     *
     *      var spacer = R.join(' ');
     *      spacer(['a', 2, 3.4]);   //=> 'a 2 3.4'
     *      R.join('|', [1, 2, 3]);    //=> '1|2|3'
     */
    var join = invoker(1, 'join');

    /**
     * Creates a new function that, when invoked, caches the result of calling `fn`
     * for a given argument set and returns the result. Subsequent calls to the
     * memoized `fn` with the same argument set will not result in an additional
     * call to `fn`; instead, the cached result for that set of arguments will be
     * returned.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Function
     * @sig (*... -> a) -> (*... -> a)
     * @param {Function} fn The function to memoize.
     * @return {Function} Memoized version of `fn`.
     * @example
     *
     *      var count = 0;
     *      var factorial = R.memoize(n => {
     *        count += 1;
     *        return R.product(R.range(1, n + 1));
     *      });
     *      factorial(5); //=> 120
     *      factorial(5); //=> 120
     *      factorial(5); //=> 120
     *      count; //=> 1
     */
    var memoize = _curry1(function memoize(fn) {
        var cache = {};
        return _arity(fn.length, function () {
            var key = toString(arguments);
            if (!_has(key, cache)) {
                cache[key] = fn.apply(this, arguments);
            }
            return cache[key];
        });
    });

    /**
     * Splits a string into an array of strings based on the given
     * separator.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category String
     * @sig (String | RegExp) -> String -> [String]
     * @param {String|RegExp} sep The pattern.
     * @param {String} str The string to separate into an array.
     * @return {Array} The array of strings from `str` separated by `str`.
     * @see R.join
     * @example
     *
     *      var pathComponents = R.split('/');
     *      R.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']
     *
     *      R.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']
     */
    var split = invoker(1, 'split');

    /**
     * Finds the set (i.e. no duplicates) of all elements contained in the first or
     * second list, but not both.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Relation
     * @sig [*] -> [*] -> [*]
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The elements in `list1` or `list2`, but not both.
     * @see R.symmetricDifferenceWith, R.difference, R.differenceWith
     * @example
     *
     *      R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]
     *      R.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]
     */
    var symmetricDifference = _curry2(function symmetricDifference(list1, list2) {
        return concat(difference(list1, list2), difference(list2, list1));
    });

    /**
     * Finds the set (i.e. no duplicates) of all elements contained in the first or
     * second list, but not both. Duplication is determined according to the value
     * returned by applying the supplied predicate to two list elements.
     *
     * @func
     * @memberOf R
     * @since v0.19.0
     * @category Relation
     * @sig (a -> a -> Boolean) -> [a] -> [a] -> [a]
     * @param {Function} pred A predicate used to test whether two items are equal.
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The elements in `list1` or `list2`, but not both.
     * @see R.symmetricDifference, R.difference, R.differenceWith
     * @example
     *
     *      var eqA = R.eqBy(R.prop('a'));
     *      var l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];
     *      var l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];
     *      R.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]
     */
    var symmetricDifferenceWith = _curry3(function symmetricDifferenceWith(pred, list1, list2) {
        return concat(differenceWith(pred, list1, list2), differenceWith(pred, list2, list1));
    });

    /**
     * Determines whether a given string matches a given regular expression.
     *
     * @func
     * @memberOf R
     * @since v0.12.0
     * @category String
     * @sig RegExp -> String -> Boolean
     * @param {RegExp} pattern
     * @param {String} str
     * @return {Boolean}
     * @see R.match
     * @example
     *
     *      R.test(/^x/, 'xyz'); //=> true
     *      R.test(/^y/, 'xyz'); //=> false
     */
    var test = _curry2(function test(pattern, str) {
        if (!_isRegExp(pattern)) {
            throw new TypeError('\u2018test\u2019 requires a value of type RegExp as its first argument; received ' + toString(pattern));
        }
        return _cloneRegExp(pattern).test(str);
    });

    /**
     * The lower case version of a string.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category String
     * @sig String -> String
     * @param {String} str The string to lower case.
     * @return {String} The lower case version of `str`.
     * @see R.toUpper
     * @example
     *
     *      R.toLower('XYZ'); //=> 'xyz'
     */
    var toLower = invoker(0, 'toLowerCase');

    /**
     * The upper case version of a string.
     *
     * @func
     * @memberOf R
     * @since v0.9.0
     * @category String
     * @sig String -> String
     * @param {String} str The string to upper case.
     * @return {String} The upper case version of `str`.
     * @see R.toLower
     * @example
     *
     *      R.toUpper('abc'); //=> 'ABC'
     */
    var toUpper = invoker(0, 'toUpperCase');

    /**
     * Returns a new list containing only one copy of each element in the original
     * list, based upon the value returned by applying the supplied function to
     * each list element. Prefers the first item if the supplied function produces
     * the same value on two items. `R.equals` is used for comparison.
     *
     * @func
     * @memberOf R
     * @since v0.16.0
     * @category List
     * @sig (a -> b) -> [a] -> [a]
     * @param {Function} fn A function used to produce a value to use during comparisons.
     * @param {Array} list The array to consider.
     * @return {Array} The list of unique items.
     * @example
     *
     *      R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]
     */
    var uniqBy = _curry2(function uniqBy(fn, list) {
        var set = new _Set();
        var result = [];
        var idx = 0;
        var appliedItem, item;
        while (idx < list.length) {
            item = list[idx];
            appliedItem = fn(item);
            if (set.add(appliedItem)) {
                result.push(item);
            }
            idx += 1;
        }
        return result;
    });

    /**
     * Returns a new list containing only one copy of each element in the original
     * list. `R.equals` is used to determine equality.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category List
     * @sig [a] -> [a]
     * @param {Array} list The array to consider.
     * @return {Array} The list of unique items.
     * @example
     *
     *      R.uniq([1, 1, 2, 1]); //=> [1, 2]
     *      R.uniq([1, '1']);     //=> [1, '1']
     *      R.uniq([[42], [42]]); //=> [[42]]
     */
    var uniq = uniqBy(identity);

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of those
     * elements common to both lists.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig [*] -> [*] -> [*]
     * @param {Array} list1 The first list.
     * @param {Array} list2 The second list.
     * @return {Array} The list of elements found in both `list1` and `list2`.
     * @see R.intersectionWith
     * @example
     *
     *      R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]
     */
    var intersection = _curry2(function intersection(list1, list2) {
        var lookupList, filteredList;
        if (list1.length > list2.length) {
            lookupList = list1;
            filteredList = list2;
        } else {
            lookupList = list2;
            filteredList = list1;
        }
        return uniq(_filter(flip(_contains)(lookupList), filteredList));
    });

    /**
     * Combines two lists into a set (i.e. no duplicates) composed of the elements
     * of each list.
     *
     * @func
     * @memberOf R
     * @since v0.1.0
     * @category Relation
     * @sig [*] -> [*] -> [*]
     * @param {Array} as The first list.
     * @param {Array} bs The second list.
     * @return {Array} The first and second lists concatenated, with
     *         duplicates removed.
     * @example
     *
     *      R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]
     */
    var union = _curry2(compose(uniq, _concat));

    var R = {
        F: F,
        T: T,
        __: __,
        add: add,
        addIndex: addIndex,
        adjust: adjust,
        all: all,
        allPass: allPass,
        always: always,
        and: and,
        any: any,
        anyPass: anyPass,
        ap: ap,
        aperture: aperture,
        append: append,
        apply: apply,
        applySpec: applySpec,
        assoc: assoc,
        assocPath: assocPath,
        binary: binary,
        bind: bind,
        both: both,
        call: call,
        chain: chain,
        clamp: clamp,
        clone: clone,
        comparator: comparator,
        complement: complement,
        compose: compose,
        composeK: composeK,
        composeP: composeP,
        concat: concat,
        cond: cond,
        construct: construct,
        constructN: constructN,
        contains: contains,
        converge: converge,
        countBy: countBy,
        curry: curry,
        curryN: curryN,
        dec: dec,
        defaultTo: defaultTo,
        difference: difference,
        differenceWith: differenceWith,
        dissoc: dissoc,
        dissocPath: dissocPath,
        divide: divide,
        drop: drop,
        dropLast: dropLast,
        dropLastWhile: dropLastWhile,
        dropRepeats: dropRepeats,
        dropRepeatsWith: dropRepeatsWith,
        dropWhile: dropWhile,
        either: either,
        empty: empty,
        eqBy: eqBy,
        eqProps: eqProps,
        equals: equals,
        evolve: evolve,
        filter: filter,
        find: find,
        findIndex: findIndex,
        findLast: findLast,
        findLastIndex: findLastIndex,
        flatten: flatten,
        flip: flip,
        forEach: forEach,
        fromPairs: fromPairs,
        groupBy: groupBy,
        groupWith: groupWith,
        gt: gt,
        gte: gte,
        has: has,
        hasIn: hasIn,
        head: head,
        identical: identical,
        identity: identity,
        ifElse: ifElse,
        inc: inc,
        indexBy: indexBy,
        indexOf: indexOf,
        init: init,
        insert: insert,
        insertAll: insertAll,
        intersection: intersection,
        intersectionWith: intersectionWith,
        intersperse: intersperse,
        into: into,
        invert: invert,
        invertObj: invertObj,
        invoker: invoker,
        is: is,
        isArrayLike: isArrayLike,
        isEmpty: isEmpty,
        isNil: isNil,
        join: join,
        juxt: juxt,
        keys: keys,
        keysIn: keysIn,
        last: last,
        lastIndexOf: lastIndexOf,
        length: length,
        lens: lens,
        lensIndex: lensIndex,
        lensPath: lensPath,
        lensProp: lensProp,
        lift: lift,
        liftN: liftN,
        lt: lt,
        lte: lte,
        map: map,
        mapAccum: mapAccum,
        mapAccumRight: mapAccumRight,
        mapObjIndexed: mapObjIndexed,
        match: match,
        mathMod: mathMod,
        max: max,
        maxBy: maxBy,
        mean: mean,
        median: median,
        memoize: memoize,
        merge: merge,
        mergeAll: mergeAll,
        mergeWith: mergeWith,
        mergeWithKey: mergeWithKey,
        min: min,
        minBy: minBy,
        modulo: modulo,
        multiply: multiply,
        nAry: nAry,
        negate: negate,
        none: none,
        not: not,
        nth: nth,
        nthArg: nthArg,
        objOf: objOf,
        of: of,
        omit: omit,
        once: once,
        or: or,
        over: over,
        pair: pair,
        partial: partial,
        partialRight: partialRight,
        partition: partition,
        path: path,
        pathEq: pathEq,
        pathOr: pathOr,
        pathSatisfies: pathSatisfies,
        pick: pick,
        pickAll: pickAll,
        pickBy: pickBy,
        pipe: pipe,
        pipeK: pipeK,
        pipeP: pipeP,
        pluck: pluck,
        prepend: prepend,
        product: product,
        project: project,
        prop: prop,
        propEq: propEq,
        propIs: propIs,
        propOr: propOr,
        propSatisfies: propSatisfies,
        props: props,
        range: range,
        reduce: reduce,
        reduceBy: reduceBy,
        reduceRight: reduceRight,
        reduceWhile: reduceWhile,
        reduced: reduced,
        reject: reject,
        remove: remove,
        repeat: repeat,
        replace: replace,
        reverse: reverse,
        scan: scan,
        sequence: sequence,
        set: set,
        slice: slice,
        sort: sort,
        sortBy: sortBy,
        split: split,
        splitAt: splitAt,
        splitEvery: splitEvery,
        splitWhen: splitWhen,
        subtract: subtract,
        sum: sum,
        symmetricDifference: symmetricDifference,
        symmetricDifferenceWith: symmetricDifferenceWith,
        tail: tail,
        take: take,
        takeLast: takeLast,
        takeLastWhile: takeLastWhile,
        takeWhile: takeWhile,
        tap: tap,
        test: test,
        times: times,
        toLower: toLower,
        toPairs: toPairs,
        toPairsIn: toPairsIn,
        toString: toString,
        toUpper: toUpper,
        transduce: transduce,
        transpose: transpose,
        traverse: traverse,
        trim: trim,
        tryCatch: tryCatch,
        type: type,
        unapply: unapply,
        unary: unary,
        uncurryN: uncurryN,
        unfold: unfold,
        union: union,
        unionWith: unionWith,
        uniq: uniq,
        uniqBy: uniqBy,
        uniqWith: uniqWith,
        unless: unless,
        unnest: unnest,
        until: until,
        update: update,
        useWith: useWith,
        values: values,
        valuesIn: valuesIn,
        view: view,
        when: when,
        where: where,
        whereEq: whereEq,
        without: without,
        wrap: wrap,
        xprod: xprod,
        zip: zip,
        zipObj: zipObj,
        zipWith: zipWith
    };
  /* eslint-env amd */

  /* TEST_ENTRY_POINT */

  if (true) {
    module.exports = R;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return R; });
  } else {
    this.R = R;
  }

}.call(this));


/***/ },
/* 11 */
/***/ function(module, exports) {

var g;

// This works in non-strict mode
g = (function() { return this; })();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = __webpack_require__(158);
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fusion_Map__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sink_Pipe__ = __webpack_require__(2);
/* harmony export (immutable) */ exports["b"] = map;
/* harmony export (immutable) */ exports["c"] = constant;
/* harmony export (immutable) */ exports["a"] = tap;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @param {Stream} stream stream to map
 * @returns {Stream} stream containing items transformed by f
 */
function map (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](__WEBPACK_IMPORTED_MODULE_1__fusion_Map__["a" /* default */].create(f, stream.source))
}

/**
* Replace each value in the stream with x
* @param {*} x
* @param {Stream} stream
* @returns {Stream} stream containing items replaced with x
*/
function constant (x, stream) {
  return map(function () {
    return x
  }, stream)
}

/**
* Perform a side effect for each item in the stream
* @param {function(x:*):*} f side effect to execute for each item. The
*  return value will be discarded.
* @param {Stream} stream stream to tap
* @returns {Stream} new stream containing the same items as this stream
*/
function tap (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Tap(f, stream.source))
}

function Tap (f, source) {
  this.source = source
  this.f = f
}

Tap.prototype.run = function (sink, scheduler) {
  return this.source.run(new TapSink(this.f, sink), scheduler)
}

function TapSink (f, sink) {
  this.sink = sink
  this.f = f
}

TapSink.prototype.end = __WEBPACK_IMPORTED_MODULE_2__sink_Pipe__["a" /* default */].prototype.end
TapSink.prototype.error = __WEBPACK_IMPORTED_MODULE_2__sink_Pipe__["a" /* default */].prototype.error

TapSink.prototype.event = function (t, x) {
  var f = this.f
  f(x)
  this.sink.event(t, x)
}


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
// hyperscript
__export(__webpack_require__(8));
__export(__webpack_require__(57));
__export(__webpack_require__(58));
__export(__webpack_require__(32));
var DOMSource_1 = __webpack_require__(29);
exports.DOMSource = DOMSource_1.DOMSource;
var makeDOMDriver_1 = __webpack_require__(60);
exports.makeDOMDriver = makeDOMDriver_1.makeDOMDriver;
var HTMLSource_1 = __webpack_require__(30);
exports.HTMLSource = HTMLSource_1.HTMLSource;
var makeHTMLDriver_1 = __webpack_require__(61);
exports.makeHTMLDriver = makeHTMLDriver_1.makeHTMLDriver;
var mockDOMSource_1 = __webpack_require__(62);
exports.mockDOMSource = mockDOMSource_1.mockDOMSource;
//# sourceMappingURL=index.js.map

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.group || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
console.groupEnd = console.groupEnd || console.log;
// Component typings
/**
 * @typedef {Object.<string, Observable>} Sources
 */
/**
 * @typedef {Object.<string, Observable>} Sinks
 * NOTE : this type def is not perfect as we allow sometimes null values
 */
/**
 * @typedef {?Object.<string, ?Object>} Settings
 */
/**
 * @typedef {Object} DetailedComponentDef
 * @property {?function(Sources, Settings)} makeLocalSources
 * @property {?function(Settings)} makeLocalSettings
 * @property {?function(Sources, Settings)} makeOwnSinks
 * @property {function(Sinks, Array<Sinks>, Settings)} mergeSinks
 * @property {function(Sinks):Boolean} sinksContract
 * @property {function(Sources):Boolean} sourcesContract
 */
/**
 * @typedef {Object} ShortComponentDef
 * @property {?function(Sources, Settings)} makeLocalSources
 * @property {?function(Settings)} makeLocalSettings
 * @property {function(Sources, Settings, Array<Component>)} makeAllSinks
 * @property {function(Sinks):Boolean} sinksContract
 * @property {function(Sources):Boolean} sourcesContract
 */
/**
 * @typedef {function(Sources, Settings):Sinks} Component
 */
var checks_1 = __webpack_require__(9);
var ramda_1 = __webpack_require__(10);
var $ = __webpack_require__(4);
var dom_1 = __webpack_require__(14);
var deepMerge = function deepMerge(a, b) {
    return (ramda_1.is(Object, a) && ramda_1.is(Object, b)) ? ramda_1.mergeWith(deepMerge, a, b) : b;
};
// Configuration
var defaultMergeSinkConfig = {
    DOM: computeDOMSinkDefault,
    _default: computeSinkDefault
};
//////
// Helpers
/**
 * Merges the DOM nodes produced by a parent component with the DOM nodes
 * produced by children components, such that the parent DOM nodes
 * wrap around the children DOM nodes
 * For instance:
 * - parent -> div(..., [h2(...)])
 * - children -> [div(...), button(...)]
 * - result : div(..., [h2(...), div(...), button(...)])
 * @param {Sink} parentDOMSinkOrNull
 * @param {Array<Sink>} childrenSink
 * @param {Settings} settings
 * @returns {Observable<VNode>|Null}
 */
function computeDOMSinkDefault(parentDOMSinkOrNull, childrenSink, settings) {
    // We want `combineLatest` to still emit the parent DOM sink, even when
    // one of its children sinks is empty, so we modify the children sinks
    // to emits ONE `Null` value if it is empty
    // Note : in default function, settings parameter is not used
    var childrenDOMSinkOrNull = ramda_1.map(checks_1.emitNullIfEmpty, childrenSink);
    var allSinks = ramda_1.flatten([parentDOMSinkOrNull, childrenDOMSinkOrNull]);
    var allDOMSinks = checks_1.removeNullsFromArray(allSinks);
    // Edge case : none of the sinks have a DOM sink
    // That should not be possible as we come here only
    // when we detect a DOM sink
    if (allDOMSinks.length === 0) {
        throw "mergeDOMSinkDefault: internal error!";
    }
    return $.combineArray(function () {
        return arguments;
    }, allDOMSinks)
        .tap(console.log.bind(console, 'mergeDOMSinkDefault: allDOMSinks'))
        .map(mergeChildrenIntoParentDOM(parentDOMSinkOrNull));
}
function computeSinkDefault(parentDOMSinkOrNull, childrenSink, settings) {
    var allSinks = ramda_1.concat([parentDOMSinkOrNull], childrenSink);
    // Nulls have to be removed as a given sink name will not be in all children
    // sinks. It is however guaranteed by the caller that the given sink
    // name will be in at least one of the children. Hence the merged array
    // is never empty
    return $.mergeArray(checks_1.removeNullsFromArray(allSinks));
}
function mergeChildrenIntoParentDOM(parentDOMSink) {
    return function mergeChildrenIntoParentDOM(arrayVNode) {
        // We remove null elements from the array of vNode
        // We can have a null vNode emitted by a sink if that sink is empty
        var _arrayVNode = checks_1.removeEmptyVNodes(checks_1.removeNullsFromArray(arrayVNode));
        checks_1.assertContract(checks_1.isArrayOf(checks_1.isVNode), [_arrayVNode], 'DOM sources must' +
            ' stream VNode objects! Got ' + _arrayVNode);
        if (parentDOMSink) {
            // Case : the parent sinks have a DOM sink
            // We want to put the children's DOM **inside** the parent's DOM
            // Two cases here :
            // - The parent's vNode has a `text` property :
            //   we move that text to a text vNode at first position in the children
            //   then we add the children's DOM in last position of the
            // existing parent's children
            // - The parent's vNode does not have a `text` property :
            //   we just add the children's DOM in last position of the exisitng
            //   parent's children
            // Note that this is specific to the snabbdom vNode data structure
            // Note that we defensively clone vNodes so the original vNode remains
            // inmuted
            var parentVNode = ramda_1.clone(_arrayVNode.shift());
            var childrenVNode = _arrayVNode;
            parentVNode.children = ramda_1.clone(parentVNode.children) || [];
            // childrenVNode could be null if all children sinks are empty
            // observables, in which case we just return the parentVNode
            if (childrenVNode) {
                if (parentVNode.text) {
                    parentVNode.children.splice(0, 0, {
                        children: [],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": undefined,
                        "text": parentVNode.text
                    });
                    parentVNode.text = undefined;
                }
                Array.prototype.push.apply(parentVNode.children, childrenVNode);
            }
            return parentVNode;
        }
        else {
            // Case : the parent sinks does not have a DOM sink
            // To avoid putting an extra `div` when there is only one vNode
            // we put the extra `div` only when there are several vNodes
            switch (_arrayVNode.length) {
                case 0:
                    return null;
                case 1:
                    return _arrayVNode[0];
                default:
                    return dom_1.div(_arrayVNode);
            }
        }
    };
}
///////
// Helpers
function computeReducedSink(ownSinks, childrenSinks, localSettings, mergeSinks) {
    return function computeReducedSink(accReducedSinks, sinkName) {
        var mergeSinkFn = mergeSinks[sinkName]
            || defaultMergeSinkConfig[sinkName]
            || defaultMergeSinkConfig['_default'];
        checks_1.assertContract(checks_1.isMergeSinkFn, [mergeSinkFn], 'm : mergeSinkFn' +
            ' for sink ${sinkName} must be a function : check' +
            ' parameter or default merge function!');
        if (mergeSinkFn) {
            accReducedSinks[sinkName] = mergeSinkFn(ownSinks ? ownSinks[sinkName] : null, checks_1.projectSinksOn(sinkName, childrenSinks), localSettings);
        }
        return accReducedSinks;
    };
}
/**
 * Returns a component specified by :
 * - a component definition object (nullable)
 * - settings (nullable)
 * - children components
 * Component definition properties :
 * - mergeSinks : computes resulting sinks or a specific sinks according to
 * configuration. See type information
 * - computeSinks : computes resulting sinks by executing the
 * children component and parent and merging the result
 * - sourcesContract : default to checking all sinks are observables or `null`
 * - sinksContract : default to checking all sinks are observables or `null`
 * - settingsContract : default to do noting
 * - makeLocalSources : default -> null
 * - makeLocalSettings : default -> null
 * - makeOwnSinks : -> default null
 *
 * The factored algorithm which derives sinks from sources is as follows :
 * - merging current sources with extra sources if any
 * - creating some sinks by itself
 * - computing children sinks by executing the children components on the
 * merged sources
 * - merging its own computed sinks with the children computed sinks
 * There are two versions of definition, according to the level of
 * granularity desired : the short spec and the detailed spec :
 * - short spec :
 *   one function `computeSinks` which outputs the sinks from the sources,
 *   settings and children components
 * - detailed spec :
 *   several properties as detailed above
 * @param {?(DetailedComponentDef|ShortComponentDef)} componentDef
 * @param {?Object} _settings
 * @param {Array<Component>} children
 * @returns {Component}
 * @throws when type- and user-specified contracts are not satisfied
 *
 * Contracts function allows to perform contract checking before computing
 * the component, for instance :
 * - check that sources have the expected type
 * - check that sources include the mandatory source property for
 * computing the component
 * - check that the sinks have the expected type/exists
 *
 * Source contracts are checked before extending the sources
 * Settings contracts are checked before merging
 *
 */
// m :: Opt Component_Def -> Opt Settings -> [Component] -> Component
function m(componentDef, _settings, children) {
    console.groupCollapsed('Utils > m');
    console.log('componentDef, _settings, children', componentDef, _settings, children);
    // check signature
    var mSignature = [
        { componentDef: checks_1.isNullableComponentDef },
        { settings: checks_1.isNullableObject },
        { children: checks_1.isArrayOf(checks_1.isComponent) },
    ];
    checks_1.assertSignature('m', arguments, mSignature);
    var makeLocalSources = componentDef.makeLocalSources, makeLocalSettings = componentDef.makeLocalSettings, makeOwnSinks = componentDef.makeOwnSinks, mergeSinks = componentDef.mergeSinks, computeSinks = componentDef.computeSinks, sinksContract = componentDef.sinksContract, sourcesContract = componentDef.sourcesContract, settingsContract = componentDef.settingsContract;
    // Set default values
    _settings = _settings || {};
    makeLocalSources = checks_1.defaultsTo(makeLocalSources, ramda_1.always(null));
    makeLocalSettings = checks_1.defaultsTo(makeLocalSettings, ramda_1.always({}));
    makeOwnSinks = checks_1.defaultsTo(makeOwnSinks, ramda_1.always(null));
    mergeSinks = checks_1.defaultsTo(mergeSinks, {});
    sinksContract = checks_1.defaultsTo(sinksContract, ramda_1.always(true));
    sourcesContract = checks_1.defaultsTo(sourcesContract, ramda_1.always(true));
    settingsContract = checks_1.defaultsTo(settingsContract, ramda_1.always(true));
    console.groupEnd();
    return function m(sources, innerSettings) {
        console.groupCollapsed('m\'ed component > Entry');
        console.log('sources, innerSettings', sources, innerSettings);
        checks_1.assertSettingsContracts(innerSettings, settingsContract);
        innerSettings = innerSettings || {};
        var mergedSettings = deepMerge(innerSettings, _settings);
        checks_1.assertSourcesContracts(sources, sourcesContract);
        // Computes and MERGES the extra sources which will be passed
        // to the children and this component
        // Extra sources are derived from the `sources`
        // received as input, which remain untouched
        var extendedSources = ramda_1.merge(sources, makeLocalSources(sources, mergedSettings));
        // Note that per `merge` ramda spec. the second object's values
        // replace those from the first in case of key conflict
        var localSettings = deepMerge(makeLocalSettings(mergedSettings), mergedSettings);
        var reducedSinks;
        // Case : computeSinks is defined
        if (computeSinks) {
            reducedSinks = computeSinks(makeOwnSinks, children, extendedSources, localSettings);
        }
        else {
            console.groupCollapsed('m\'ed component > makeOwnSinks');
            console.log('extendedSources, localSettings', extendedSources, localSettings);
            var ownSinks = makeOwnSinks(extendedSources, localSettings);
            console.groupEnd();
            console.group('m\'ed component > computing children sinks');
            var childrenSinks = ramda_1.map(function (childComponent) { return childComponent(extendedSources, localSettings); }, children);
            console.groupEnd();
            checks_1.assertContract(checks_1.isOptSinks, [ownSinks], 'ownSinks must be a hash of observable sink');
            checks_1.assertContract(checks_1.isArrayOptSinks, [childrenSinks], 'childrenSinks must' +
                ' be an array of sinks');
            // Merge the sinks from children and one-s own...
            // Case : mergeSinks is defined through a function
            if (checks_1.isFunction(mergeSinks)) {
                console.groupCollapsed('m\'ed component > (fn) mergeSinks');
                console.log('ownSinks, childrenSinks, localSettings', ownSinks, childrenSinks, localSettings);
                reducedSinks = mergeSinks(ownSinks, childrenSinks, localSettings);
                console.groupEnd();
            }
            else {
                var allSinks = ramda_1.flatten(checks_1.removeNullsFromArray([ownSinks, childrenSinks]));
                var sinkNames = checks_1.getSinkNamesFromSinksArray(allSinks);
                console.groupCollapsed('m\'ed component > (obj) mergeSinks');
                console.log('ownSinks, childrenSinks, localSettings,' +
                    ' (fn) mergeSinks', ownSinks, childrenSinks, localSettings, mergeSinks);
                reducedSinks = ramda_1.reduce(computeReducedSink(ownSinks, childrenSinks, localSettings, mergeSinks), {}, sinkNames);
                console.groupEnd();
            }
        }
        checks_1.assertSinksContracts(reducedSinks, sinksContract);
        var tracedSinks = checks_1.trace(reducedSinks, mergedSettings);
        // ... and add tracing information(sinkPath, timestamp, sinkValue/sinkError) after each sink
        // TODO : specify trace/debug/error generation information
        // This would ensure that errors are automatically and systematically
        //       caught in the component where they occur, and not
        //       interrupting the application implementation-wise, it might be
        //       necessary to add a `currentPath` parameter somewhere which
        //       carries the current path down the tree
        console.groupEnd();
        return tracedSinks;
    };
}
exports.m = m;


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

var ramda_1 = __webpack_require__(10);
var U = __webpack_require__(9);
var $ = __webpack_require__(4);
var most_last_1 = __webpack_require__(83);
var most_subject_1 = __webpack_require__(39);
var mapIndexed = ramda_1.addIndex(ramda_1.map);
// TODO : find a solution to use it in the browser
//console.log = function(){}
//console.warn=function(){} // used by mocha, cannot stub
console.groupEnd = console.groupEnd || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
/**
 * @typedef {function(*):boolean} Predicate
 */
/**
 * @typedef {Object} Input
 */
/**
 * @typedef {Object} Output
 */
/**
 * @typedef {{diagram: string, values: Object.<string, Input>}} Sequence
 */
/**
 * @typedef {Object} ExpectedRecord
 * @property {?function (outputs:Array<Output>)} transformFn
 * @property {Array<Output>} outputs
 * @property {?String} successMessage
 * @property {!function (Array<Output>, Array<Output>), String} analyzeTestResults
 */
/**
 * @typedef {!Object.<string, ExpectedRecord>} TestResults
 */
var rxlog = function rxlog(label) {
    return console.warn.bind(console, label);
};
var isOptSinks = U.isOptSinks;
var removeNullsFromArray = U.removeNullsFromArray;
var assertSignature = U.assertSignature;
var assertContract = U.assertContract;
var tickDurationDefault = 5;
//////
// Contract and signature checking helpers
function isSourceInput(obj) {
    return obj && ramda_1.keys(obj).length === 1
        && U.isString(ramda_1.values(obj)[0].diagram);
}
function isExpectedStruct(record) {
    return (!record.transformFn || U.isFunction(record.transformFn)) &&
        record.outputs && U.isArray(record.outputs) &&
        record.analyzeTestResults && U.isFunction(record.analyzeTestResults) &&
        (!record.successMessage || U.isString(record.successMessage));
}
function isExpectedRecord(obj) {
    return ramda_1.all(isExpectedStruct, ramda_1.values(obj));
}
function hasTestCaseForEachSink(testCase, sinkNames) {
    var _sinkNames = ramda_1.drop(1, sinkNames);
    return ramda_1.all(function (sinkName) { return testCase[sinkName]; }, _sinkNames);
}
//////
// test execution helpers
function analyzeTestResultsCurried(analyzeTestResultsFn, expectedResults, successMessage) {
    return function (actual) {
        return analyzeTestResultsFn(actual, expectedResults, successMessage);
    };
}
function analyzeTestResults(testExpectedOutputs) {
    return function analyzeTestResults(sinkResults$, sinkName) {
        var expected = testExpectedOutputs[sinkName];
        // Case the component returns a sink with no expected value
        // That is a legit possibility, we might not want to test for all
        // the sinks returned by a component
        if (ramda_1.isNil(expected))
            return null;
        var expectedResults = expected.outputs;
        var successMessage = expected.successMessage;
        var analyzeTestResultsFn = expected.analyzeTestResults;
        return sinkResults$
            .tap(analyzeTestResultsCurried(analyzeTestResultsFn, expectedResults, successMessage));
    };
}
function getTestResults(testInputs$, expected, settings) {
    var defaultWaitForFinishDelay = 50;
    var waitForFinishDelay = settings.waitForFinishDelay
        || defaultWaitForFinishDelay;
    return function getTestResults(sink$, sinkName) {
        if (U.isUndefined(sink$)) {
            console.warn('getTestResults: received an undefined sink ' + sinkName);
            return $.of([]);
        }
        return sink$
            .scan(function buildResults(accumulatedResults, sinkValue) {
            var transformFn = expected[sinkName].transformFn || ramda_1.identity;
            var transformedResult = transformFn(sinkValue);
            accumulatedResults.push(transformedResult);
            return accumulatedResults;
        }, [])
            .sampleWith(most_last_1.last(testInputs$).delay(waitForFinishDelay))
            .take(1);
    };
}
/**
 * @typedef {{diagram: string, values:*}} Input
 * only one key,value pair though
 */
/**
 * @typedef {Object.<string, Input>} SourceInput
 * only one key,value pair though
 */
/**
 *
 * @param {Number} tickNum
 * @param {Array<SourceInput>} inputs
 * @returns {Array<SourceInput>} a similar array of input but with a
 * diagram with only one character taken from the input diagram at
 * position tickNum
 */
function projectAtIndex(tickNum, inputs) {
    return ramda_1.map(function mapInputs(sourceInput) {
        return ramda_1.map(function projectDiagramAtIndex(input) {
            return {
                diagram: input.diagram[tickNum],
                values: input.values
            };
        }, sourceInput);
    }, inputs);
}
//////
// Main functions
/**
 * Tests a function against sources' test input values and the expected
 * values defined in a test case object.
 * The function to test is executed, and its sinks collected. When there are
 * no more inputs to send through the sources, output from each sink are
 * collected in an array, then passed through a transform function.
 * That transform function can be used to remove fields, which are irrelevant
 * or non-reproducible (for instance timestamps), before comparison.
 * Actual outputs for each sink are compared against expected outputs,
 * by means of a `analyzeTestResults` function.
 * That function can throw in case of failed assertion.
 *
 * @param {Array<SourceInput>} inputs
 * @param {TestResults} expected Object which contains all the relevant data
 * relevant to the test case : expected outputs, test message,
 * comparison function, output transformation, etc.
 * @param {function(Sources):Sinks} testFn Function to test
 * @param {{timeUnit: Number, waitForFinishDelay: Number}} settings
 * @throws
 */
function runTestScenario(inputs, expected, testFn, settings) {
    assertSignature('runTestScenario', arguments, [
        { inputs: U.isArrayOf(isSourceInput) },
        { testCase: isExpectedRecord },
        { testFn: U.isFunction },
        { settings: U.isNullableObject },
    ]);
    // Set default values if any
    settings = settings || {};
    var tickDuration = settings.tickDuration ?
        settings.tickDuration :
        tickDurationDefault;
    /** @type {Object.<string, observable>} */
    // Create the subjects which will receive the input data
    // There is a standard subject for each source declared in `inputs`
    var sourcesSubjects = ramda_1.reduce(function makeSubjects(accSubjects, input) {
        accSubjects[ramda_1.keys(input)[0]] = most_subject_1.subject();
        return accSubjects;
    }, {}, inputs);
    // Maximum length of input diagram strings
    // Ex:
    // a : '--x-x--'
    // b : '-x-x-'
    // -> maxLen = 7
    var maxLen = Math.max.apply(null, ramda_1.map(function (sourceInput) { return ramda_1.values(sourceInput)[0].diagram.length; }, inputs));
    /** @type {Array<Number>} */
    // Make an index array [0..maxLen] for iteration purposes
    var indexRange = mapIndexed(function (input, index) { return index; }, new Array(maxLen));
    /** @type Observable<Null>*/
    // Make a single chained observable which :
    // - waits some delay before starting to emit
    // - then for n in [0..maxLen]
    //   - emits the m values in position n in the input diagram, in `inputs`
    // array order, `m` being the number of input sources
    // wait for that emission to finish before nexting (`concat`)
    // That way we ENSURE that :
    // -a--
    // -b--     if a and b are in the same vertical (emission time), they
    // will always be emitted in the same order in every execution of the
    // test scenario
    // -a-
    // b--      values that are chronologically further in the diagram will
    // always be emitted later
    // This allows to have predictable and consistent data when analyzing
    // test results. That was not the case when using the `setTimeOut`
    // scheduler to handle delays.
    var testInputs$ = ramda_1.reduce(function makeInputs$(accEmitInputs$, tickNo) {
        return accEmitInputs$
            .delay(tickDuration)
            .concat($.from(projectAtIndex(tickNo, inputs))
            .tap(function emitInputs(sourceInput) {
            // input :: {sourceName : {{diagram : char, values: Array<*>}}
            var sourceName = ramda_1.keys(sourceInput)[0];
            var input = sourceInput[sourceName];
            var c = input.diagram;
            var values = input.values || {};
            var sourceSubject = sourcesSubjects[sourceName];
            var errorVal = (values && values['#']) || '#';
            if (c) {
                // case when the diagram for that particular source is
                // finished but other sources might still go on
                // In any case, there is nothing to emit
                switch (c) {
                    case '-':
                        //                      console.log('- doing nothing')
                        break;
                    case '#':
                        sourceSubject.error({ data: errorVal });
                        break;
                    case '|':
                        sourceSubject.complete();
                        break;
                    default:
                        var val = values.hasOwnProperty(c) ? values[c] : c;
                        console.log('emitting for source ' + sourceName + ' ' + val);
                        sourceSubject.next(val);
                        break;
                }
            }
        }));
    }, $.empty(), indexRange)
        .multicast();
    // Execute the function to be tested (for example a cycle component)
    // with the source subjects
    console.groupCollapsed('runTestScenario: executing test function');
    var testSinks = testFn(sourcesSubjects);
    console.groupEnd();
    if (!isOptSinks(testSinks)) {
        throw 'encountered a sink which is not an observable!';
    }
    /** @type {Object.<string, Observable<Array<Output>>>} */
    // Gather the results in an array for easier processing
    var sinksResults = ramda_1.mapObjIndexed(getTestResults(testInputs$, expected, settings), testSinks);
    assertContract(hasTestCaseForEachSink, [expected, ramda_1.keys(sinksResults)], 'runTestScenario : in testCase, could not find test inputs for all sinks!');
    // Side-effect : execute `analyzeTestResults` function which
    // makes use of `assert` and can lead to program interruption
    /** @type {Object.<string, Observable<Array<Output>>>} */
    var resultAnalysis = ramda_1.mapObjIndexed(analyzeTestResults(expected), sinksResults);
    // This takes care of actually starting the producers
    // which generate the execution of the test assertions
    $.mergeArray(removeNullsFromArray(ramda_1.values(resultAnalysis)))
        .subscribe({
        next: rxlog('Test completed for sink:'),
        error: rxlog('An error occurred while executing test!'),
        complete: rxlog('Tests completed!')
    });
    testInputs$.subscribe({
        next: function () {
        },
        error: rxlog('An error occurred while emitting test inputs'),
        complete: rxlog('test inputs emitted')
    });
}
exports.runTestScenario = runTestScenario;


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used to determine if values are of the language type `Object`. */
var objectTypes = {
  'function': true,
  'object': true
};

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
  ? exports
  : undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
  ? module
  : undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
 * Used as a reference to the global object.
 *
 * The `this` value is used if it's the global object to avoid Greasemonkey's
 * restricted `window` object, otherwise the `window` object is used.
 */
var root = freeGlobal ||
  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
    freeSelf || thisGlobal || Function('return this')();

/**
 * Checks if `value` is a global object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
 */
function checkGlobal(value) {
  return (value && value.Object === Object) ? value : null;
}

module.exports = root;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(159)(module), __webpack_require__(11)))

/***/ },
/* 18 */
/***/ function(module, exports) {

"use strict";
'use strict';

var proto = Element.prototype;
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var SubjectDisposable_1 = __webpack_require__(85);
var util_1 = __webpack_require__(40);
var defaultScheduler = __webpack_require__(90);
var BasicSubjectSource = (function () {
    function BasicSubjectSource() {
        this.scheduler = defaultScheduler;
        this.sinks = [];
        this.active = false;
    }
    BasicSubjectSource.prototype.run = function (sink, scheduler) {
        var n = this.add(sink);
        if (n === 1) {
            this.scheduler = scheduler;
            this.active = true;
        }
        return new SubjectDisposable_1.SubjectDisposable(this, sink);
    };
    BasicSubjectSource.prototype.add = function (sink) {
        this.sinks = util_1.append(sink, this.sinks);
        return this.sinks.length;
    };
    BasicSubjectSource.prototype.remove = function (sink) {
        var i = util_1.findIndex(sink, this.sinks);
        if (i >= 0) {
            this.sinks = util_1.remove(i, this.sinks);
        }
        return this.sinks.length;
    };
    BasicSubjectSource.prototype._dispose = function () {
        this.active = false;
    };
    BasicSubjectSource.prototype.next = function (value) {
        if (!this.active || this.scheduler === void 0)
            return;
        this._next(this.scheduler.now(), value);
    };
    BasicSubjectSource.prototype.error = function (err) {
        if (!this.active || this.scheduler === void 0)
            return;
        this._dispose();
        this._error(this.scheduler.now(), err);
    };
    BasicSubjectSource.prototype.complete = function (value) {
        if (!this.active || this.scheduler === void 0)
            return;
        this._dispose();
        this._complete(this.scheduler.now(), value);
    };
    BasicSubjectSource.prototype._next = function (time, value) {
        var s = this.sinks;
        if (s.length === 1) {
            return s[0].event(time, value);
        }
        for (var i = 0; i < s.length; ++i) {
            util_1.tryEvent(time, value, s[i]);
        }
    };
    BasicSubjectSource.prototype._complete = function (time, value) {
        var s = this.sinks;
        for (var i = 0; i < s.length; ++i) {
            util_1.tryEnd(time, value, s[i]);
        }
    };
    BasicSubjectSource.prototype._error = function (time, err) {
        var s = this.sinks;
        for (var i = 0; i < s.length; ++i) {
            s[i].error(time, err);
        }
    };
    return BasicSubjectSource;
}());
exports.BasicSubjectSource = BasicSubjectSource;
//# sourceMappingURL=SubjectSource.js.map

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__LinkedList__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__most_prelude__);
/* harmony export (immutable) */ exports["b"] = mergeConcurrently;
/* harmony export (immutable) */ exports["a"] = mergeMapConcurrently;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






function mergeConcurrently (concurrency, stream) {
  return mergeMapConcurrently(__WEBPACK_IMPORTED_MODULE_3__most_prelude__["id"], concurrency, stream)
}

function mergeMapConcurrently (f, concurrency, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new MergeConcurrently(f, concurrency, stream.source))
}

function MergeConcurrently (f, concurrency, source) {
  this.f = f
  this.concurrency = concurrency
  this.source = source
}

MergeConcurrently.prototype.run = function (sink, scheduler) {
  return new Outer(this.f, this.concurrency, this.source, sink, scheduler)
}

function Outer (f, concurrency, source, sink, scheduler) {
  this.f = f
  this.concurrency = concurrency
  this.sink = sink
  this.scheduler = scheduler
  this.pending = []
  this.current = new __WEBPACK_IMPORTED_MODULE_2__LinkedList__["a" /* default */]()
  this.disposable = __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["e" /* once */](source.run(this, scheduler))
  this.active = true
}

Outer.prototype.event = function (t, x) {
  this._addInner(t, x)
}

Outer.prototype._addInner = function (t, x) {
  if (this.current.length < this.concurrency) {
    this._startInner(t, x)
  } else {
    this.pending.push(x)
  }
}

Outer.prototype._startInner = function (t, x) {
  try {
    this._initInner(t, x)
  } catch (e) {
    this.error(t, e)
  }
}

Outer.prototype._initInner = function (t, x) {
  var innerSink = new Inner(t, this, this.sink)
  innerSink.disposable = mapAndRun(this.f, x, innerSink, this.scheduler)
  this.current.add(innerSink)
}

function mapAndRun (f, x, sink, scheduler) {
  return f(x).source.run(sink, scheduler)
}

Outer.prototype.end = function (t, x) {
  this.active = false
  __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* tryDispose */](t, this.disposable, this.sink)
  this._checkEnd(t, x)
}

Outer.prototype.error = function (t, e) {
  this.active = false
  this.sink.error(t, e)
}

Outer.prototype.dispose = function () {
  this.active = false
  this.pending.length = 0
  return Promise.all([this.disposable.dispose(), this.current.dispose()])
}

Outer.prototype._endInner = function (t, x, inner) {
  this.current.remove(inner)
  __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* tryDispose */](t, inner, this)

  if (this.pending.length === 0) {
    this._checkEnd(t, x)
  } else {
    this._startInner(t, this.pending.shift())
  }
}

Outer.prototype._checkEnd = function (t, x) {
  if (!this.active && this.current.isEmpty()) {
    this.sink.end(t, x)
  }
}

function Inner (time, outer, sink) {
  this.prev = this.next = null
  this.time = time
  this.outer = outer
  this.sink = sink
  this.disposable = void 0
}

Inner.prototype.event = function (t, x) {
  this.sink.event(Math.max(t, this.time), x)
}

Inner.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.time), x, this)
}

Inner.prototype.error = function (t, e) {
  this.outer.error(Math.max(t, this.time), e)
}

Inner.prototype.dispose = function () {
  return this.disposable.dispose()
}


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = fatalError;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fatalError (e) {
  setTimeout(function () {
    throw e
  }, 0)
}


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Filter__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__FilterMap__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__most_prelude__);
/* harmony export (immutable) */ exports["a"] = Map;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






function Map (f, source) {
  this.f = f
  this.source = source
}

/**
 * Create a mapped source, fusing adjacent map.map, filter.map,
 * and filter.map.map if possible
 * @param {function(*):*} f mapping function
 * @param {{run:function}} source source to map
 * @returns {Map|FilterMap} mapped source, possibly fused
 */
Map.create = function createMap (f, source) {
  if (source instanceof Map) {
    return new Map(__WEBPACK_IMPORTED_MODULE_3__most_prelude__["compose"](f, source.f), source.source)
  }

  if (source instanceof __WEBPACK_IMPORTED_MODULE_1__Filter__["a" /* default */]) {
    return new __WEBPACK_IMPORTED_MODULE_2__FilterMap__["a" /* default */](source.p, f, source.source)
  }

  return new Map(f, source)
}

Map.prototype.run = function (sink, scheduler) { // eslint-disable-line no-extend-native
  return this.source.run(new MapSink(this.f, sink), scheduler)
}

function MapSink (f, sink) {
  this.f = f
  this.sink = sink
}

MapSink.prototype.end = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.end
MapSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.error

MapSink.prototype.event = function (t, x) {
  var f = this.f
  this.sink.event(t, f(x))
}


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = invoke;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function invoke (f, args) {
	/*eslint complexity: [2,7]*/
  switch (args.length) {
    case 0: return f()
    case 1: return f(args[0])
    case 2: return f(args[0], args[1])
    case 3: return f(args[0], args[1], args[2])
    case 4: return f(args[0], args[1], args[2], args[3])
    case 5: return f(args[0], args[1], args[2], args[3], args[4])
    default:
      return f.apply(void 0, args)
  }
}


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Pipe__ = __webpack_require__(2);
/* harmony export (immutable) */ exports["a"] = IndexSink;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function IndexSink (i, sink) {
  this.sink = sink
  this.index = i
  this.active = true
  this.value = void 0
}

IndexSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.value = x
  this.sink.event(t, this)
}

IndexSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.active = false
  this.sink.end(t, { index: this.index, value: x })
}

IndexSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__Pipe__["a" /* default */].prototype.error


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = tryEvent;
/* harmony export (immutable) */ exports["b"] = tryEnd;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["b"] = defer;
/* harmony export (immutable) */ exports["a"] = runTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function defer (task) {
  return Promise.resolve(task).then(runTask)
}

function runTask (task) {
  try {
    return task.run()
  } catch (e) {
    return task.error(e)
  }
}


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(28)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('@most/multicast'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.multicast);
    global.mostHold = mod.exports;
  }
})(this, function (exports, _multicast) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  // hold :: Stream a -> Stream a
  var index = function index(stream) {
    return new stream.constructor(new _multicast.MulticastSource(new Hold(stream.source)));
  };

  var Hold = function () {
    function Hold(source) {
      _classCallCheck(this, Hold);

      this.source = source;
      this.time = -Infinity;
      this.value = void 0;
    }

    _createClass(Hold, [{
      key: 'run',
      value: function run(sink, scheduler) {
        /* istanbul ignore else */
        if (sink._hold !== this) {
          sink._hold = this;
          sink._holdAdd = sink.add;
          sink.add = holdAdd;

          sink._holdEvent = sink.event;
          sink.event = holdEvent;
        }

        return this.source.run(sink, scheduler);
      }
    }]);

    return Hold;
  }();

  function holdAdd(sink) {
    var len = this._holdAdd(sink);
    /* istanbul ignore else */
    if (this._hold.time >= 0) {
      sink.event(this._hold.time, this._hold.value);
    }
    return len;
  }

  function holdEvent(t, x) {
    /* istanbul ignore else */
    if (t >= this._hold.time) {
      this._hold.time = t;
      this._hold.value = x;
    }
    return this._holdEvent(t, x);
  }

  exports.default = index;
});


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports, __webpack_require__(3)) :
  typeof define === 'function' && define.amd ? define(['exports', '@most/prelude'], factory) :
  (factory((global.mostMulticast = global.mostMulticast || {}),global.mostPrelude));
}(this, (function (exports,_most_prelude) { 'use strict';

var MulticastDisposable = function MulticastDisposable (source, sink) {
  this.source = source
  this.sink = sink
  this.disposed = false
};

MulticastDisposable.prototype.dispose = function dispose () {
  if (this.disposed) {
    return
  }
  this.disposed = true
  var remaining = this.source.remove(this.sink)
  return remaining === 0 && this.source._dispose()
};

function tryEvent (t, x, sink) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

function tryEnd (t, x, sink) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

var dispose = function (disposable) { return disposable.dispose(); }

var emptyDisposable = {
  dispose: function dispose$1 () {}
}

var MulticastSource = function MulticastSource (source) {
  this.source = source
  this.sinks = []
  this._disposable = emptyDisposable
};

MulticastSource.prototype.run = function run (sink, scheduler) {
  var n = this.add(sink)
  if (n === 1) {
    this._disposable = this.source.run(this, scheduler)
  }
  return new MulticastDisposable(this, sink)
};

MulticastSource.prototype._dispose = function _dispose () {
  var disposable = this._disposable
  this._disposable = emptyDisposable
  return Promise.resolve(disposable).then(dispose)
};

MulticastSource.prototype.add = function add (sink) {
  this.sinks = _most_prelude.append(sink, this.sinks)
  return this.sinks.length
};

MulticastSource.prototype.remove = function remove$1 (sink) {
  var i = _most_prelude.findIndex(sink, this.sinks)
  // istanbul ignore next
  if (i >= 0) {
    this.sinks = _most_prelude.remove(i, this.sinks)
  }

  return this.sinks.length
};

MulticastSource.prototype.event = function event (time, value) {
  var s = this.sinks
  if (s.length === 1) {
    return s[0].event(time, value)
  }
  for (var i = 0; i < s.length; ++i) {
    tryEvent(time, value, s[i])
  }
};

MulticastSource.prototype.end = function end (time, value) {
  var s = this.sinks
  for (var i = 0; i < s.length; ++i) {
    tryEnd(time, value, s[i])
  }
};

MulticastSource.prototype.error = function error (time, err) {
  var s = this.sinks
  for (var i = 0; i < s.length; ++i) {
    s[i].error(time, err)
  }
};

function multicast (stream) {
  var source = stream.source
  return source instanceof MulticastSource
    ? stream
    : new stream.constructor(new MulticastSource(source))
}

exports['default'] = multicast;
exports.MulticastSource = MulticastSource;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=multicast.js.map


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var most_subject_1 = __webpack_require__(39);
var SubjectSource_1 = __webpack_require__(19);
var hold_1 = __webpack_require__(27);
var domEvent = __webpack_require__(52).domEvent;
var ElementFinder_1 = __webpack_require__(54);
var isolate_1 = __webpack_require__(59);
var EventDelegator_1 = __webpack_require__(55);
var util_1 = __webpack_require__(7);
var matchesSelector;
try {
    matchesSelector = __webpack_require__(18);
}
catch (e) {
    matchesSelector = function () { return true; };
}
var eventTypesThatDontBubble = [
    "blur",
    "canplay",
    "canplaythrough",
    "change",
    "durationchange",
    "emptied",
    "ended",
    "focus",
    "load",
    "loadeddata",
    "loadedmetadata",
    "mouseenter",
    "mouseleave",
    "pause",
    "play",
    "playing",
    "ratechange",
    "reset",
    "scroll",
    "seeked",
    "seeking",
    "stalled",
    "submit",
    "suspend",
    "timeupdate",
    "unload",
    "volumechange",
    "waiting",
];
var EventSubjectSource = (function (_super) {
    __extends(EventSubjectSource, _super);
    function EventSubjectSource(_disposeFn) {
        _super.call(this);
        this._disposeFn = _disposeFn;
    }
    EventSubjectSource.prototype._dispose = function () {
        _super.prototype._dispose.call(this);
        if ('requestIdleCallback' in window) {
            requestIdleCallback(this._disposeFn);
        }
        else {
            this._disposeFn();
        }
    };
    return EventSubjectSource;
}(SubjectSource_1.BasicSubjectSource));
function determineUseCapture(eventType, options) {
    var result = false;
    if (!options) {
        options = {};
    }
    if (typeof options.useCapture === "boolean") {
        result = options.useCapture;
    }
    if (eventTypesThatDontBubble.indexOf(eventType) !== -1) {
        result = true;
    }
    return result;
}
var DOMSource = (function () {
    function DOMSource(_rootElement$, _namespace, _isolateModule, _delegators) {
        if (_namespace === void 0) { _namespace = []; }
        this._rootElement$ = _rootElement$;
        this._namespace = _namespace;
        this._isolateModule = _isolateModule;
        this._delegators = _delegators;
        this.isolateSource = isolate_1.isolateSource;
        this.isolateSink = isolate_1.isolateSink;
    }
    DOMSource.prototype.elements = function () {
        if (this._namespace.length === 0) {
            return hold_1.default(this._rootElement$.map(function (element) { return element; }));
        }
        var elementFinder = new ElementFinder_1.ElementFinder(this._namespace, this._isolateModule);
        return hold_1.default(this._rootElement$.map(function (element) { return elementFinder.call(element); }));
    };
    Object.defineProperty(DOMSource.prototype, "namespace", {
        get: function () {
            return this._namespace;
        },
        enumerable: true,
        configurable: true
    });
    DOMSource.prototype.select = function (selector) {
        if (typeof selector !== 'string') {
            throw new Error("DOM driver's select() expects the argument to be a " +
                "string as a CSS selector");
        }
        var trimmedSelector = selector.trim();
        var childNamespace = trimmedSelector === ":root"
            ? this._namespace
            : this._namespace.concat(trimmedSelector);
        return new DOMSource(this._rootElement$, childNamespace, this._isolateModule, this._delegators);
    };
    DOMSource.prototype.events = function (eventType, options) {
        if (typeof eventType !== "string") {
            throw new Error("DOM driver's events() expects argument to be a " +
                "string representing the event type to listen for.");
        }
        var useCapture = determineUseCapture(eventType, options);
        var namespace = this._namespace;
        var scope = util_1.getScope(namespace);
        var keyParts = [eventType, useCapture];
        if (scope) {
            keyParts.push(scope);
        }
        var key = keyParts.join('~');
        var domSource = this;
        var rootElement$;
        if (scope) {
            var hadIsolated_mutable_1 = false;
            rootElement$ = this._rootElement$
                .filter(function () {
                var hasIsolated = !!domSource._isolateModule.getIsolatedElement(scope);
                var shouldPass = hasIsolated && !hadIsolated_mutable_1;
                hadIsolated_mutable_1 = hasIsolated;
                return shouldPass;
            })
                .multicast();
        }
        else {
            rootElement$ = this._rootElement$.take(2).multicast();
        }
        return rootElement$
            .map(function setupEventDelegatorOnTopElement(rootElement) {
            // Event listener just for the root element
            if (!namespace || namespace.length === 0) {
                return domEvent(eventType, rootElement, useCapture);
            }
            // Event listener on the top element as an EventDelegator
            var delegators = domSource._delegators;
            var top = scope
                ? domSource._isolateModule.getIsolatedElement(scope)
                : rootElement;
            var delegator;
            if (delegators.has(key)) {
                delegator = delegators.get(key);
                delegator.updateTopElement(top);
            }
            else {
                delegator = new EventDelegator_1.EventDelegator(top, eventType, useCapture, domSource._isolateModule);
                delegators.set(key, delegator);
            }
            if (scope) {
                domSource._isolateModule.addEventDelegator(scope, delegator);
            }
            var destinationId = delegator.createDestinationId();
            var eventSubject = new most_subject_1.Subject(new EventSubjectSource(function () {
                delegator.removeDestinationId(destinationId);
            }));
            delegator.addDestination(eventSubject, namespace, destinationId);
            return eventSubject;
        })
            .switch()
            .multicast();
    };
    DOMSource.prototype.dispose = function () {
        this._isolateModule.reset();
    };
    return DOMSource;
}());
exports.DOMSource = DOMSource;
//# sourceMappingURL=DOMSource.js.map

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var most_1 = __webpack_require__(4);
var HTMLSource = (function () {
    function HTMLSource(html$) {
        this._html$ = html$;
        this._empty$ = most_1.empty();
    }
    HTMLSource.prototype.elements = function () {
        return this._html$;
    };
    HTMLSource.prototype.select = function (selector) {
        // to avoid errors about not using selector
        var html$ = void selector ? most_1.empty() : most_1.empty();
        return new HTMLSource(html$);
    };
    HTMLSource.prototype.events = function (eventType, options) {
        var x = void eventType ? void 0 : void 0;
        var y = void options ? void 0 : void 0;
        return x || y ? this._empty$ : this._empty$;
    };
    return HTMLSource;
}());
exports.HTMLSource = HTMLSource;
//# sourceMappingURL=HTMLSource.js.map

/***/ },
/* 31 */
/***/ function(module, exports) {

"use strict";
"use strict";
var ScopeChecker = (function () {
    function ScopeChecker(scope, isolateModule) {
        this.scope = scope;
        this.isolateModule = isolateModule;
    }
    ScopeChecker.prototype.isStrictlyInRootScope = function (leaf) {
        for (var el = leaf; el; el = el.parentElement) {
            var scope = this.isolateModule.isIsolatedElement(el);
            if (scope && scope !== this.scope) {
                return false;
            }
            if (scope) {
                return true;
            }
        }
        return true;
    };
    return ScopeChecker;
}());
exports.ScopeChecker = ScopeChecker;
//# sourceMappingURL=ScopeChecker.js.map

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ClassModule = __webpack_require__(146);
exports.ClassModule = ClassModule;
var PropsModule = __webpack_require__(150);
exports.PropsModule = PropsModule;
var AttrsModule = __webpack_require__(145);
exports.AttrsModule = AttrsModule;
var EventsModule = __webpack_require__(148);
exports.EventsModule = EventsModule;
var StyleModule = __webpack_require__(151);
exports.StyleModule = StyleModule;
var HeroModule = __webpack_require__(149);
exports.HeroModule = HeroModule;
var DataSetModule = __webpack_require__(147);
exports.DataSetModule = DataSetModule;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = [StyleModule, ClassModule, PropsModule, AttrsModule];
//# sourceMappingURL=index.js.map

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var most_1 = __webpack_require__(4);
var hyperscript_1 = __webpack_require__(8);
function createVTree(vnode, children) {
    return hyperscript_1.MotorcycleVNode.create(vnode.sel, vnode.data, children, vnode.text, vnode.elm, vnode.key);
}
var notAStream = {};
function transposeVNode(vnode) {
    if (!vnode) {
        return notAStream;
    }
    else if (vnode && typeof vnode.data === "object" && vnode.data.static) {
        return most_1.just(vnode);
    }
    else if (vnode instanceof most_1.Stream) {
        return vnode.map(transposeVNode).switch();
    }
    else if (typeof vnode === "object") {
        if (!vnode.children || vnode.children.length === 0) {
            return most_1.just(vnode);
        }
        var vnodeChildren = vnode.children
            .map(transposeVNode)
            .filter(function (x) { return x !== notAStream; });
        if (vnodeChildren.length === 0) {
            return most_1.just(createVTree(vnode, []));
        }
        else {
            return most_1.combineArray(function () {
                var children = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    children[_i - 0] = arguments[_i];
                }
                return createVTree(vnode, children.slice());
            }, vnodeChildren);
        }
    }
    else {
        throw new Error("Unhandled vTree Value");
    }
}
exports.transposeVNode = transposeVNode;
//# sourceMappingURL=transposition.js.map

/***/ },
/* 34 */
/***/ function(module, exports) {

/**
 * lodash 3.9.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = getNative;


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var root = __webpack_require__(17);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
function escapeHtmlChar(chr) {
  return htmlEscapes[chr];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = Symbol ? symbolProto.toString : undefined;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (value == null) {
    return '';
  }
  if (isSymbol(value)) {
    return Symbol ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value.
 * See [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in IE < 9, they can break out of
 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
 * [#133](https://html5sec.org/#133) of the [HTML5 Security Cheatsheet](https://html5sec.org/)
 * for more details.
 *
 * When working with HTML you should always [quote attribute values](http://wonko.com/post/html-escaping)
 * to reduce XSS vectors.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFor = __webpack_require__(71),
    bindCallback = __webpack_require__(74),
    keys = __webpack_require__(79);

/**
 * The base implementation of `_.forOwn` without support for callback
 * shorthands and `this` binding.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return baseFor(object, iteratee, keys);
}

/**
 * Creates a function for `_.forOwn` or `_.forOwnRight`.
 *
 * @private
 * @param {Function} objectFunc The function to iterate over an object.
 * @returns {Function} Returns the new each function.
 */
function createForOwn(objectFunc) {
  return function(object, iteratee, thisArg) {
    if (typeof iteratee != 'function' || thisArg !== undefined) {
      iteratee = bindCallback(iteratee, thisArg, 3);
    }
    return objectFunc(object, iteratee);
  };
}

/**
 * Iterates over own enumerable properties of an object invoking `iteratee`
 * for each property. The `iteratee` is bound to `thisArg` and invoked with
 * three arguments: (value, key, object). Iteratee functions may exit iteration
 * early by explicitly returning `false`.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [thisArg] The `this` binding of `iteratee`.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.forOwn(new Foo, function(value, key) {
 *   console.log(key);
 * });
 * // => logs 'a' and 'b' (iteration order is not guaranteed)
 */
var forOwn = createForOwn(baseForOwn);

module.exports = forOwn;


/***/ },
/* 37 */
/***/ function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isArguments;


/***/ },
/* 38 */
/***/ function(module, exports) {

/**
 * lodash 3.0.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** `Object#toString` result references. */
var arrayTag = '[object Array]',
    funcTag = '[object Function]';

/** Used to detect host constructors (Safari > 5). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var fnToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  fnToString.call(hasOwnProperty).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/* Native method references for those with the same name as other `lodash` methods. */
var nativeIsArray = getNative(Array, 'isArray');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = object == null ? undefined : object[key];
  return isNative(value) ? value : undefined;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(function() { return arguments; }());
 * // => false
 */
var isArray = nativeIsArray || function(value) {
  return isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag;
};

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in older versions of Chrome and Safari which return 'function' for regexes
  // and Safari 8 equivalents which return 'object' for typed array constructors.
  return isObject(value) && objToString.call(value) == funcTag;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is a native function.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
 * @example
 *
 * _.isNative(Array.prototype.push);
 * // => true
 *
 * _.isNative(_);
 * // => false
 */
function isNative(value) {
  if (value == null) {
    return false;
  }
  if (isFunction(value)) {
    return reIsNative.test(fnToString.call(value));
  }
  return isObjectLike(value) && reIsHostCtor.test(value);
}

module.exports = isArray;


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var most_1 = __webpack_require__(4);
var SubjectSource_1 = __webpack_require__(19);
exports.BasicSubjectSource = SubjectSource_1.BasicSubjectSource;
var HoldSubjectSource_1 = __webpack_require__(84);
exports.HoldSubjectSource = HoldSubjectSource_1.HoldSubjectSource;
function subject() {
    return new Subject(new SubjectSource_1.BasicSubjectSource());
}
exports.subject = subject;
function holdSubject(bufferSize) {
    if (bufferSize === void 0) { bufferSize = 1; }
    if (bufferSize <= 0) {
        throw new Error('bufferSize must be an integer 1 or greater');
    }
    return new Subject(new HoldSubjectSource_1.HoldSubjectSource(bufferSize));
}
exports.holdSubject = holdSubject;
var Subject = (function (_super) {
    __extends(Subject, _super);
    function Subject(source) {
        _super.call(this, source);
    }
    Subject.prototype.next = function (value) {
        this.source.next(value);
    };
    Subject.prototype.error = function (err) {
        this.source.error(err);
    };
    Subject.prototype.complete = function (value) {
        this.source.complete(value);
    };
    return Subject;
}(most_1.Stream));
exports.Subject = Subject;
//# sourceMappingURL=index.js.map

/***/ },
/* 40 */
/***/ function(module, exports) {

"use strict";
"use strict";
function tryEvent(t, x, sink) {
    try {
        sink.event(t, x);
    }
    catch (e) {
        sink.error(t, e);
    }
}
exports.tryEvent = tryEvent;
function tryEnd(t, x, sink) {
    try {
        sink.end(t, x);
    }
    catch (e) {
        sink.error(t, e);
    }
}
exports.tryEnd = tryEnd;
function pushEvents(buffer, sink) {
    for (var i = 0; i < buffer.length; ++i) {
        var _a = buffer[i], time = _a.time, value = _a.value;
        sink.event(time, value);
    }
}
exports.pushEvents = pushEvents;
function dropAndAppend(event, buffer, bufferSize) {
    if (buffer.length === bufferSize) {
        return append(event, drop(1, buffer));
    }
    return append(event, buffer);
}
exports.dropAndAppend = dropAndAppend;
function append(x, a) {
    var l = a.length;
    var b = new Array(l + 1);
    for (var i = 0; i < l; ++i) {
        b[i] = a[i];
    }
    b[l] = x;
    return b;
}
exports.append = append;
function drop(n, a) {
    if (n < 0) {
        throw new TypeError('n must be >= 0');
    }
    var l = a.length;
    if (n === 0 || l === 0) {
        return a;
    }
    if (n >= l) {
        return [];
    }
    return unsafeDrop(n, a, l - n);
}
// unsafeDrop :: Int -> [a] -> Int -> [a]
// Internal helper for drop
function unsafeDrop(n, a, l) {
    var b = new Array(l);
    for (var i = 0; i < l; ++i) {
        b[i] = a[n + i];
    }
    return b;
}
function remove(i, a) {
    if (i < 0) {
        throw new TypeError('i must be >= 0');
    }
    var l = a.length;
    if (l === 0 || i >= l) {
        return a;
    }
    if (l === 1) {
        return [];
    }
    return unsafeRemove(i, a, l - 1);
}
exports.remove = remove;
// unsafeRemove :: Int -> [a] -> Int -> [a]
// Internal helper to remove element at index
function unsafeRemove(i, a, l) {
    var b = new Array(l);
    var j;
    for (j = 0; j < i; ++j) {
        b[j] = a[j];
    }
    for (j = i; j < l; ++j) {
        b[j] = a[j + 1];
    }
    return b;
}
function findIndex(x, a) {
    for (var i = 0, l = a.length; i < l; ++i) {
        if (x === a[i]) {
            return i;
        }
    }
    return -1;
}
exports.findIndex = findIndex;
//# sourceMappingURL=util.js.map

/***/ },
/* 41 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defer = defer;
exports.runTask = runTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function defer(task) {
  return Promise.resolve(task).then(runTask);
}

function runTask(task) {
  try {
    return task.run();
  } catch (e) {
    return task.error(e);
  }
}

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__most_prelude__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__invoke__ = __webpack_require__(23);
/* harmony export (immutable) */ exports["a"] = combine;
/* harmony export (immutable) */ exports["b"] = combineArray;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */










var map = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["map"]
var tail = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["tail"]

/**
 * Combine latest events from all input streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
function combine (f /*, ...streams */) {
  return combineArray(f, tail(arguments))
}

/**
* Combine latest events from all input streams
* @param {function(...events):*} f function to combine most recent events
* @param {[Stream]} streams most recent events
* @returns {Stream} stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
function combineArray (f, streams) {
  var l = streams.length
  return l === 0 ? __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]()
  : l === 1 ? __WEBPACK_IMPORTED_MODULE_1__transform__["b" /* map */](f, streams[0])
  : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](combineSources(f, streams))
}

function combineSources (f, streams) {
  return new Combine(f, map(getSource, streams))
}

function getSource (stream) {
  return stream.source
}

function Combine (f, sources) {
  this.f = f
  this.sources = sources
}

Combine.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l)
  var sinks = new Array(l)

  var mergeSink = new CombineSink(disposables, sinks, sink, this.f)

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__["a" /* default */](i, mergeSink)
    disposables[i] = this.sources[i].run(indexSink, scheduler)
  }

  return __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__["d" /* all */](disposables)
}

function CombineSink (disposables, sinks, sink, f) {
  this.sink = sink
  this.disposables = disposables
  this.sinks = sinks
  this.f = f

  var l = sinks.length
  this.awaiting = l
  this.values = new Array(l)
  this.hasValue = new Array(l)
  for (var i = 0; i < l; ++i) {
    this.hasValue[i] = false
  }

  this.activeCount = sinks.length
}

CombineSink.prototype.error = __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__["a" /* default */].prototype.error

CombineSink.prototype.event = function (t, indexedValue) {
  var i = indexedValue.index
  var awaiting = this._updateReady(i)

  this.values[i] = indexedValue.value
  if (awaiting === 0) {
    this.sink.event(t, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__invoke__["a" /* default */])(this.f, this.values))
  }
}

CombineSink.prototype._updateReady = function (index) {
  if (this.awaiting > 0) {
    if (!this.hasValue[index]) {
      this.hasValue[index] = true
      this.awaiting -= 1
    }
  }
  return this.awaiting
}

CombineSink.prototype.end = function (t, indexedValue) {
  __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__["f" /* tryDispose */](t, this.disposables[indexedValue.index], this.sink)
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value)
  }
}


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["a"] = continueWith;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function continueWith (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ContinueWith(f, stream.source))
}

function ContinueWith (f, source) {
  this.f = f
  this.source = source
}

ContinueWith.prototype.run = function (sink, scheduler) {
  return new ContinueWithSink(this.f, this.source, sink, scheduler)
}

function ContinueWithSink (f, source, sink, scheduler) {
  this.f = f
  this.sink = sink
  this.scheduler = scheduler
  this.active = true
  this.disposable = __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["e" /* once */](source.run(this, scheduler))
}

ContinueWithSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

ContinueWithSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.sink.event(t, x)
}

ContinueWithSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }

  __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["f" /* tryDispose */](t, this.disposable, this.sink)
  this._startNext(t, x, this.sink)
}

ContinueWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink)
  } catch (e) {
    sink.error(t, e)
  }
}

ContinueWithSink.prototype._continue = function (f, x, sink) {
  return f(x).source.run(sink, this.scheduler)
}

ContinueWithSink.prototype.dispose = function () {
  this.active = false
  return this.disposable.dispose()
}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__ = __webpack_require__(20);
/* harmony export (immutable) */ exports["a"] = flatMap;
/* harmony export (immutable) */ exports["b"] = join;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function flatMap (f, stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__["a" /* mergeMapConcurrently */])(f, Infinity, stream)
}

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @param {Stream<Stream<X>>} stream stream of streams
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
function join (stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__["b" /* mergeConcurrently */])(Infinity, stream)
}


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__ = __webpack_require__(2);
/* harmony export (immutable) */ exports["a"] = Filter;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function Filter (p, source) {
  this.p = p
  this.source = source
}

/**
 * Create a filtered source, fusing adjacent filter.filter if possible
 * @param {function(x:*):boolean} p filtering predicate
 * @param {{run:function}} source source to filter
 * @returns {Filter} filtered source
 */
Filter.create = function createFilter (p, source) {
  if (source instanceof Filter) {
    return new Filter(and(source.p, p), source.source)
  }

  return new Filter(p, source)
}

Filter.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterSink(this.p, sink), scheduler)
}

function FilterSink (p, sink) {
  this.p = p
  this.sink = sink
}

FilterSink.prototype.end = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.end
FilterSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.error

FilterSink.prototype.event = function (t, x) {
  var p = this.p
  p(x) && this.sink.event(t, x)
}

function and (p, q) {
  return function (x) {
    return p(x) && q(x)
  }
}


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["b"] = isIterable;
/* harmony export (immutable) */ exports["a"] = getIterator;
/* unused harmony export makeIterable */
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/*global Set, Symbol*/
var iteratorSymbol
// Firefox ships a partial implementation using the name @@iterator.
// https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
if (typeof Set === 'function' && typeof new Set()['@@iterator'] === 'function') {
  iteratorSymbol = '@@iterator'
} else {
  iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator ||
  '_es6shim_iterator_'
}

function isIterable (o) {
  return typeof o[iteratorSymbol] === 'function'
}

function getIterator (o) {
  return o[iteratorSymbol]()
}

function makeIterable (f, o) {
  o[iteratorSymbol] = f
  return o
}


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_defaultScheduler__ = __webpack_require__(48);
/* harmony export (immutable) */ exports["a"] = withDefaultScheduler;
/* unused harmony export withScheduler */
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function withDefaultScheduler (source) {
  return withScheduler(source, __WEBPACK_IMPORTED_MODULE_1__scheduler_defaultScheduler__["a" /* default */])
}

function withScheduler (source, scheduler) {
  return new Promise(function (resolve, reject) {
    runSource(source, scheduler, resolve, reject)
  })
}

function runSource (source, scheduler, resolve, reject) {
  var disposable = __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__["c" /* settable */]()
  var observer = new Drain(resolve, reject, disposable)

  disposable.setDisposable(source.run(observer, scheduler))
}

function Drain (end, error, disposable) {
  this._end = end
  this._error = error
  this._disposable = disposable
  this.active = true
}

Drain.prototype.event = function (t, x) {}

Drain.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.active = false
  disposeThen(this._end, this._error, this._disposable, x)
}

Drain.prototype.error = function (t, e) {
  this.active = false
  disposeThen(this._error, this._error, this._disposable, e)
}

function disposeThen (end, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    end(x)
  }, error)
}


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Scheduler__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ClockTimer__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Timeline__ = __webpack_require__(123);
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





var defaultScheduler = new __WEBPACK_IMPORTED_MODULE_0__Scheduler__["a" /* default */](new __WEBPACK_IMPORTED_MODULE_1__ClockTimer__["a" /* default */](), new __WEBPACK_IMPORTED_MODULE_2__Timeline__["a" /* default */]())

/* harmony default export */ exports["a"] = defaultScheduler;


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {


// https://github.com/Matt-Esch/virtual-dom/blob/master/virtual-hyperscript/parse-tag.js

var split = __webpack_require__(69);

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = function parseSelector(selector, upper) {
  selector = selector || '';
  var tagName;
  var id = '';
  var classes = [];

  var tagParts = split(selector, classIdSplit);

  if (notClassId.test(tagParts[1]) || selector === '') {
    tagName = 'div';
  }

  var part, type, i;

  for (i = 0; i < tagParts.length; i++) {
    part = tagParts[i];

    if (!part) {
      continue;
    }

    type = part.charAt(0);

    if (!tagName) {
      tagName = part;
    } else if (type === '.') {
      classes.push(part.substring(1, part.length));
    } else if (type === '#') {
      id = part.substring(1, part.length);
    }
  }

  return {
    tagName: upper === true ? tagName.toUpperCase() : tagName,
    id: id,
    className: classes.join(' ')
  };
};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(154);


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(66);
__webpack_require__(67);
__webpack_require__(68);
// import './util/specs/Router-spec';
__webpack_require__(65);


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

(function (global, factory) {
   true ? factory(exports, __webpack_require__(4)) :
  typeof define === 'function' && define.amd ? define(['exports', 'most'], factory) :
  (factory((global.mostDomEvent = global.mostDomEvent || {}),global.most));
}(this, (function (exports,most) { 'use strict';

  // domEvent :: (EventTarget t, Event e) => String -> t -> boolean=false -> Stream e
  var domEvent = function (event, node, capture) {
      if ( capture === void 0 ) capture = false;

      return new most.Stream(new DomEvent(event, node, capture));
  }

  var blur = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('blur', node, capture);
  }
  var focus = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('focus', node, capture);
  }
  var focusin = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('focusin', node, capture);
  }
  var focusout = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('focusout', node, capture);
  }
  var click = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('click', node, capture);
  }
  var dblclick = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('dblclick', node, capture);
  }
  var mousedown = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mousedown', node, capture);
  }
  var mouseup = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mouseup', node, capture);
  }
  var mousemove = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mousemove', node, capture);
  }
  var mouseover = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mouseover', node, capture);
  }
  var mouseenter = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mouseenter', node, capture);
  }
  var mouseout = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mouseout', node, capture);
  }
  var mouseleave = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('mouseleave', node, capture);
  }
  var change = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('change', node, capture);
  }
  var select = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('select', node, capture);
  }
  var submit = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('submit', node, capture);
  }
  var keydown = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('keydown', node, capture);
  }
  var keypress = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('keypress', node, capture);
  }
  var keyup = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('keyup', node, capture);
  }
  var input = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('input', node, capture);
  }
  var contextmenu = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('contextmenu', node, capture);
  }
  var resize = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('resize', node, capture);
  }
  var scroll = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('scroll', node, capture);
  }
  var error = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('error', node, capture);
  }

  var hashchange = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('hashchange', node, capture);
  }
  var popstate = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('popstate', node, capture);
  }
  var load = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('load', node, capture);
  }
  var unload = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('unload', node, capture);
  }

  var pointerdown = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointerdown', node, capture);
  }
  var pointerup = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointerup', node, capture);
  }
  var pointermove = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointermove', node, capture);
  }
  var pointerover = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointerover', node, capture);
  }
  var pointerenter = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointerenter', node, capture);
  }
  var pointerout = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointerout', node, capture);
  }
  var pointerleave = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('pointerleave', node, capture);
  }

  var touchstart = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('touchstart', node, capture);
  }
  var touchend = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('touchend', node, capture);
  }
  var touchmove = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('touchmove', node, capture);
  }
  var touchcancel = function (node, capture) {
    if ( capture === void 0 ) capture = false;

    return domEvent('touchcancel', node, capture);
  }

  var DomEvent = function DomEvent (event, node, capture) {
    this.event = event
    this.node = node
    this.capture = capture
  };

  DomEvent.prototype.run = function run (sink, scheduler) {
      var this$1 = this;

    var send = function (e) { return tryEvent(scheduler.now(), e, sink); }
    var dispose = function () { return this$1.node.removeEventListener(this$1.event, send, this$1.capture); }

    this.node.addEventListener(this.event, send, this.capture)

    return { dispose: dispose }
  };

  function tryEvent (t, x, sink) {
    try {
      sink.event(t, x)
    } catch (e) {
      sink.error(t, e)
    }
  }

  exports.domEvent = domEvent;
  exports.blur = blur;
  exports.focus = focus;
  exports.focusin = focusin;
  exports.focusout = focusout;
  exports.click = click;
  exports.dblclick = dblclick;
  exports.mousedown = mousedown;
  exports.mouseup = mouseup;
  exports.mousemove = mousemove;
  exports.mouseover = mouseover;
  exports.mouseenter = mouseenter;
  exports.mouseout = mouseout;
  exports.mouseleave = mouseleave;
  exports.change = change;
  exports.select = select;
  exports.submit = submit;
  exports.keydown = keydown;
  exports.keypress = keypress;
  exports.keyup = keyup;
  exports.input = input;
  exports.contextmenu = contextmenu;
  exports.resize = resize;
  exports.scroll = scroll;
  exports.error = error;
  exports.hashchange = hashchange;
  exports.popstate = popstate;
  exports.load = load;
  exports.unload = unload;
  exports.pointerdown = pointerdown;
  exports.pointerup = pointerup;
  exports.pointermove = pointermove;
  exports.pointerover = pointerover;
  exports.pointerenter = pointerenter;
  exports.pointerout = pointerout;
  exports.pointerleave = pointerleave;
  exports.touchstart = touchstart;
  exports.touchend = touchend;
  exports.touchmove = touchmove;
  exports.touchcancel = touchcancel;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=mostDomEvent.js.map


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (global, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports, __webpack_require__(4), __webpack_require__(3)], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports !== "undefined") {
    factory(exports, require('most'), require('@most/prelude'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.most, global.prelude);
    global.mostSample = mod.exports;
  }
})(this, function (exports, _most, _prelude) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.sampleArray = exports.sample = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var SampleHold = function () {
    function SampleHold(sink) {
      _classCallCheck(this, SampleHold);

      this.sink = sink;
      this.hasValue = false;
    }

    _createClass(SampleHold, [{
      key: 'event',
      value: function event(time, value) {
        this.value = value;
        this.hasValue = true;
      }
    }, {
      key: 'end',
      value: function end() {}
    }, {
      key: 'error',
      value: function error(time, err) {
        this.sink.error(time, err);
      }
    }]);

    return SampleHold;
  }();

  var SampleSink = function () {
    function SampleSink(f, source, sink) {
      _classCallCheck(this, SampleSink);

      this.sink = sink;
      this.source = source;
      this.f = f;
      this.hold = new SampleHold(this);
    }

    _createClass(SampleSink, [{
      key: 'event',
      value: function event(time, value) {
        if (this.hold.hasValue) {
          var f = this.f;
          this.sink.event(time, f(value, this.hold.value));
        }
      }
    }, {
      key: 'error',
      value: function error(time, err) {
        return this.sink.error(time, err);
      }
    }, {
      key: 'end',
      value: function end(time, value) {
        return this.sink.end(time, value);
      }
    }]);

    return SampleSink;
  }();

  var SampleDisposable = function () {
    function SampleDisposable(samplerDisposable, sourceDisposable) {
      _classCallCheck(this, SampleDisposable);

      this.samplerDisposable = samplerDisposable;
      this.sourceDisposable = sourceDisposable;
    }

    _createClass(SampleDisposable, [{
      key: 'dispose',
      value: function dispose() {
        return Promise.all([this.samplerDisposable.dispose(), this.sourceDisposable.dispose()]);
      }
    }]);

    return SampleDisposable;
  }();

  var SampleSource = function () {
    function SampleSource(f, sampler, stream) {
      _classCallCheck(this, SampleSource);

      this.source = stream.source;
      this.sampler = sampler.source;
      this.f = f;
    }

    _createClass(SampleSource, [{
      key: 'run',
      value: function run(sink, scheduler) {
        var sampleSink = new SampleSink(this.f, this.source, sink);
        var samplerDisposable = this.sampler.run(sampleSink, scheduler);
        var sourceDisposable = this.source.run(sampleSink.hold, scheduler);

        return new SampleDisposable(samplerDisposable, sourceDisposable);
      }
    }]);

    return SampleSource;
  }();

  var sample = (0, _prelude.curry3)(function (f, sampler, stream) {
    return new _most.Stream(new SampleSource(f, sampler, stream));
  });

  var arrayId = function arrayId() {
    for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
      values[_key] = arguments[_key];
    }

    return values;
  };

  var sampleArray = (0, _prelude.curry3)(function (f, sampler, arrayOfStreams) {
    return sample(f, sampler, (0, _most.combineArray)(arrayId, arrayOfStreams));
  });

  exports.sample = sample;
  exports.sampleArray = sampleArray;
});


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ScopeChecker_1 = __webpack_require__(31);
var util_1 = __webpack_require__(7);
var matchesSelector;
try {
    matchesSelector = __webpack_require__(18);
}
catch (e) {
    matchesSelector = Function.prototype;
}
function toElArray(input) {
    return Array.prototype.slice.call(input);
}
var ElementFinder = (function () {
    function ElementFinder(namespace, isolateModule) {
        this.namespace = namespace;
        this.isolateModule = isolateModule;
    }
    ElementFinder.prototype.call = function (rootElement) {
        var namespace = this.namespace;
        if (namespace.join("") === "") {
            return rootElement;
        }
        var scope = util_1.getScope(namespace);
        var scopeChecker = new ScopeChecker_1.ScopeChecker(scope, this.isolateModule);
        var selector = util_1.getSelectors(namespace);
        var topNode = rootElement;
        var topNodeMatches = [];
        if (scope.length > 0) {
            topNode = this.isolateModule.getIsolatedElement(scope) || rootElement;
            if (selector && matchesSelector(topNode, selector)) {
                topNodeMatches.push(topNode);
            }
        }
        return toElArray(topNode.querySelectorAll(selector))
            .filter(scopeChecker.isStrictlyInRootScope, scopeChecker)
            .concat(topNodeMatches);
    };
    return ElementFinder;
}());
exports.ElementFinder = ElementFinder;
//# sourceMappingURL=ElementFinder.js.map

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var ScopeChecker_1 = __webpack_require__(31);
var util_1 = __webpack_require__(7);
var matchesSelector;
try {
    matchesSelector = __webpack_require__(18);
}
catch (e) {
    matchesSelector = Function.prototype;
}
var gDestinationId = 0;
function findDestinationId(arr, searchId) {
    var minIndex = 0;
    var maxIndex = arr.length - 1;
    var currentIndex;
    var currentElement;
    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = arr[currentIndex];
        var currentId = currentElement.destinationId;
        if (currentId < searchId) {
            minIndex = currentIndex + 1;
        }
        else if (currentId > searchId) {
            maxIndex = currentIndex - 1;
        }
        else {
            return currentIndex;
        }
    }
    return -1;
}
/**
 * Attaches an actual event listener to the DOM root element,
 * handles "destinations" (interested DOMSource output subjects), and bubbling.
 */
var EventDelegator = (function () {
    function EventDelegator(topElement, eventType, useCapture, isolateModule) {
        var _this = this;
        this.topElement = topElement;
        this.eventType = eventType;
        this.useCapture = useCapture;
        this.isolateModule = isolateModule;
        this.destinations = [];
        this.roof = topElement.parentElement;
        if (useCapture) {
            this.domListener = function (ev) { return _this.capture(ev); };
        }
        else {
            this.domListener = function (ev) { return _this.bubble(ev); };
        }
        topElement.addEventListener(eventType, this.domListener, useCapture);
    }
    EventDelegator.prototype.bubble = function (rawEvent) {
        if (!document.body.contains(rawEvent.currentTarget)) {
            return;
        }
        var ev = this.patchEvent(rawEvent);
        for (var el = ev.target; el && el !== this.roof; el = el.parentElement) {
            if (!document.body.contains(el)) {
                ev.stopPropagation();
            }
            if (ev.propagationHasBeenStopped) {
                return;
            }
            this.matchEventAgainstDestinations(el, ev);
        }
    };
    EventDelegator.prototype.matchEventAgainstDestinations = function (el, ev) {
        for (var i = 0, n = this.destinations.length; i < n; i++) {
            var dest = this.destinations[i];
            if (!dest.scopeChecker.isStrictlyInRootScope(el)) {
                continue;
            }
            if (matchesSelector(el, dest.selector)) {
                this.mutateEventCurrentTarget(ev, el);
                dest.subject.next(ev);
            }
        }
    };
    EventDelegator.prototype.capture = function (ev) {
        for (var i = 0, n = this.destinations.length; i < n; i++) {
            var dest = this.destinations[i];
            if (matchesSelector(ev.target, dest.selector)) {
                dest.subject.next(ev);
            }
        }
    };
    EventDelegator.prototype.addDestination = function (subject, namespace, destinationId) {
        var scope = util_1.getScope(namespace);
        var selector = util_1.getSelectors(namespace);
        var scopeChecker = new ScopeChecker_1.ScopeChecker(scope, this.isolateModule);
        this.destinations.push({ subject: subject, scopeChecker: scopeChecker, selector: selector, destinationId: destinationId });
    };
    EventDelegator.prototype.createDestinationId = function () {
        return gDestinationId++;
    };
    EventDelegator.prototype.removeDestinationId = function (destinationId) {
        var i = findDestinationId(this.destinations, destinationId);
        if (i >= 0) {
            this.destinations.splice(i, 1);
        }
    };
    EventDelegator.prototype.patchEvent = function (event) {
        var pEvent = event;
        pEvent.propagationHasBeenStopped = false;
        var oldStopPropagation = pEvent.stopPropagation;
        pEvent.stopPropagation = function stopPropagation() {
            oldStopPropagation.call(this);
            this.propagationHasBeenStopped = true;
        };
        return pEvent;
    };
    EventDelegator.prototype.mutateEventCurrentTarget = function (event, currentTargetElement) {
        try {
            Object.defineProperty(event, "currentTarget", {
                value: currentTargetElement,
                configurable: true,
            });
        }
        catch (err) {
            console.log("please use event.ownerTarget");
        }
        event.ownerTarget = currentTargetElement;
    };
    EventDelegator.prototype.updateTopElement = function (newTopElement) {
        this.topElement.removeEventListener(this.eventType, this.domListener, this.useCapture);
        newTopElement.addEventListener(this.eventType, this.domListener, this.useCapture);
        this.topElement = newTopElement;
    };
    return EventDelegator;
}());
exports.EventDelegator = EventDelegator;
//# sourceMappingURL=EventDelegator.js.map

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var hyperscript_1 = __webpack_require__(8);
var util_1 = __webpack_require__(7);
var VNodeWrapper = (function () {
    function VNodeWrapper(rootElement) {
        this.rootElement = rootElement;
    }
    VNodeWrapper.prototype.call = function (vnode) {
        var _a = util_1.selectorParser(vnode.sel), selectorTagName = _a.tagName, selectorId = _a.id;
        var vNodeClassName = util_1.classNameFromVNode(vnode);
        var vNodeData = vnode.data || {};
        var vNodeDataProps = vNodeData.props || {};
        var _b = vNodeDataProps.id, vNodeId = _b === void 0 ? selectorId : _b;
        var isVNodeAndRootElementIdentical = vNodeId.toUpperCase() === this.rootElement.id.toUpperCase() &&
            selectorTagName.toUpperCase() === this.rootElement.tagName.toUpperCase() &&
            vNodeClassName.toUpperCase() === this.rootElement.className.toUpperCase();
        if (isVNodeAndRootElementIdentical) {
            return vnode;
        }
        var _c = this.rootElement, tagName = _c.tagName, id = _c.id, className = _c.className;
        var elementId = id ? "#" + id : "";
        var elementClassName = className ?
            "." + className.split(" ").join(".") : "";
        return hyperscript_1.h("" + tagName + elementId + elementClassName, {}, [vnode]);
    };
    return VNodeWrapper;
}());
exports.VNodeWrapper = VNodeWrapper;
//# sourceMappingURL=VNodeWrapper.js.map

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var hyperscript_1 = __webpack_require__(8);
function isValidString(param) {
    return typeof param === 'string' && param.length > 0;
}
function isSelector(param) {
    return isValidString(param) && (param[0] === '.' || param[0] === '#');
}
function hh(tagName) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        var first = args[0], b = args[1], c = args[2];
        if (isSelector(first)) {
            if (b !== void 0 && c !== void 0) {
                return hyperscript_1.h(tagName + first, b, c);
            }
            else if (b !== void 0) {
                return hyperscript_1.h(tagName + first, b);
            }
            else {
                return hyperscript_1.h(tagName + first, {});
            }
        }
        else if (!!b) {
            return hyperscript_1.h(tagName, first, b);
        }
        else if (!!first) {
            return hyperscript_1.h(tagName, first);
        }
        else {
            return hyperscript_1.h(tagName, {});
        }
    };
}
exports.hh = hh;
exports.a = hh('a');
exports.abbr = hh('abbr');
exports.acronym = hh('acronym');
exports.address = hh('address');
exports.applet = hh('applet');
exports.area = hh('area');
exports.article = hh('article');
exports.aside = hh('aside');
exports.audio = hh('audio');
exports.b = hh('b');
exports.base = hh('base');
exports.basefont = hh('basefont');
exports.bdi = hh('bdi');
exports.bdo = hh('bdo');
exports.bgsound = hh('bgsound');
exports.big = hh('big');
exports.blink = hh('blink');
exports.blockquote = hh('blockquote');
exports.body = hh('body');
exports.br = hh('br');
exports.button = hh('button');
exports.canvas = hh('canvas');
exports.caption = hh('caption');
exports.center = hh('center');
exports.cite = hh('cite');
exports.code = hh('code');
exports.col = hh('col');
exports.colgroup = hh('colgroup');
exports.command = hh('command');
exports.content = hh('content');
exports.data = hh('data');
exports.datalist = hh('datalist');
exports.dd = hh('dd');
exports.del = hh('del');
exports.details = hh('details');
exports.dfn = hh('dfn');
exports.dialog = hh('dialog');
exports.dir = hh('dir');
exports.div = hh('div');
exports.dl = hh('dl');
exports.dt = hh('dt');
exports.element = hh('element');
exports.em = hh('em');
exports.embed = hh('embed');
exports.fieldset = hh('fieldset');
exports.figcaption = hh('figcaption');
exports.figure = hh('figure');
exports.font = hh('font');
exports.footer = hh('footer');
exports.form = hh('form');
exports.frame = hh('frame');
exports.frameset = hh('frameset');
exports.h1 = hh('h1');
exports.h2 = hh('h2');
exports.h3 = hh('h3');
exports.h4 = hh('h4');
exports.h5 = hh('h5');
exports.h6 = hh('h6');
exports.head = hh('head');
exports.header = hh('header');
exports.hgroup = hh('hgroup');
exports.hr = hh('hr');
exports.html = hh('html');
exports.i = hh('i');
exports.iframe = hh('iframe');
exports.image = hh('image');
exports.img = hh('img');
exports.input = hh('input');
exports.ins = hh('ins');
exports.isindex = hh('isindex');
exports.kbd = hh('kbd');
exports.keygen = hh('keygen');
exports.label = hh('label');
exports.legend = hh('legend');
exports.li = hh('li');
exports.link = hh('link');
exports.listing = hh('listing');
exports.main = hh('main');
exports.map = hh('map');
exports.mark = hh('mark');
exports.marquee = hh('marquee');
exports.math = hh('math');
exports.menu = hh('menu');
exports.menuitem = hh('menuitem');
exports.meta = hh('meta');
exports.meter = hh('meter');
exports.multicol = hh('multicol');
exports.nav = hh('nav');
exports.nextid = hh('nextid');
exports.nobr = hh('nobr');
exports.noembed = hh('noembed');
exports.noframes = hh('noframes');
exports.noscript = hh('noscript');
exports.object = hh('object');
exports.ol = hh('ol');
exports.optgroup = hh('optgroup');
exports.option = hh('option');
exports.output = hh('output');
exports.p = hh('p');
exports.param = hh('param');
exports.picture = hh('picture');
exports.plaintext = hh('plaintext');
exports.pre = hh('pre');
exports.progress = hh('progress');
exports.q = hh('q');
exports.rb = hh('rb');
exports.rbc = hh('rbc');
exports.rp = hh('rp');
exports.rt = hh('rt');
exports.rtc = hh('rtc');
exports.ruby = hh('ruby');
exports.s = hh('s');
exports.samp = hh('samp');
exports.script = hh('script');
exports.section = hh('section');
exports.select = hh('select');
exports.shadow = hh('shadow');
exports.small = hh('small');
exports.source = hh('source');
exports.spacer = hh('spacer');
exports.span = hh('span');
exports.strike = hh('strike');
exports.strong = hh('strong');
exports.style = hh('style');
exports.sub = hh('sub');
exports.summary = hh('summary');
exports.sup = hh('sup');
exports.table = hh('table');
exports.tbody = hh('tbody');
exports.td = hh('td');
exports.template = hh('template');
exports.textarea = hh('textarea');
exports.tfoot = hh('tfoot');
exports.th = hh('th');
exports.thead = hh('thead');
exports.time = hh('time');
exports.title = hh('title');
exports.tr = hh('tr');
exports.track = hh('track');
exports.tt = hh('tt');
exports.u = hh('u');
exports.ul = hh('ul');
exports.video = hh('video');
exports.wbr = hh('wbr');
exports.xmp = hh('xmp');
function createSVGHelper() {
    var svg = hh('svg');
    svg.a = hh('a');
    svg.altGlyph = hh('altGlyph');
    svg.altGlyphDef = hh('altGlyphDef');
    svg.altGlyphItem = hh('altGlyphItem');
    svg.animate = hh('animate');
    svg.animateColor = hh('animateColor');
    svg.animateMotion = hh('animateMotion');
    svg.animateTransform = hh('animateTransform');
    svg.circle = hh('circle');
    svg.clipPath = hh('clipPath');
    svg.colorProfile = hh('colorProfile');
    svg.cursor = hh('cursor');
    svg.defs = hh('defs');
    svg.desc = hh('desc');
    svg.ellipse = hh('ellipse');
    svg.feBlend = hh('feBlend');
    svg.feColorMatrix = hh('feColorMatrix');
    svg.feComponentTransfer = hh('feComponentTransfer');
    svg.feComposite = hh('feComposite');
    svg.feConvolveMatrix = hh('feConvolveMatrix');
    svg.feDiffuseLighting = hh('feDiffuseLighting');
    svg.feDisplacementMap = hh('feDisplacementMap');
    svg.feDistantLight = hh('feDistantLight');
    svg.feFlood = hh('feFlood');
    svg.feFuncA = hh('feFuncA');
    svg.feFuncB = hh('feFuncB');
    svg.feFuncG = hh('feFuncG');
    svg.feFuncR = hh('feFuncR');
    svg.feGaussianBlur = hh('feGaussianBlur');
    svg.feImage = hh('feImage');
    svg.feMerge = hh('feMerge');
    svg.feMergeNode = hh('feMergeNode');
    svg.feMorphology = hh('feMorphology');
    svg.feOffset = hh('feOffset');
    svg.fePointLight = hh('fePointLight');
    svg.feSpecularLighting = hh('feSpecularLighting');
    svg.feSpotlight = hh('feSpotlight');
    svg.feTile = hh('feTile');
    svg.feTurbulence = hh('feTurbulence');
    svg.filter = hh('filter');
    svg.font = hh('font');
    svg.fontFace = hh('fontFace');
    svg.fontFaceFormat = hh('fontFaceFormat');
    svg.fontFaceName = hh('fontFaceName');
    svg.fontFaceSrc = hh('fontFaceSrc');
    svg.fontFaceUri = hh('fontFaceUri');
    svg.foreignObject = hh('foreignObject');
    svg.g = hh('g');
    svg.glyph = hh('glyph');
    svg.glyphRef = hh('glyphRef');
    svg.hkern = hh('hkern');
    svg.image = hh('image');
    svg.linearGradient = hh('linearGradient');
    svg.marker = hh('marker');
    svg.mask = hh('mask');
    svg.metadata = hh('metadata');
    svg.missingGlyph = hh('missingGlyph');
    svg.mpath = hh('mpath');
    svg.path = hh('path');
    svg.pattern = hh('pattern');
    svg.polygon = hh('polygon');
    svg.polyline = hh('polyline');
    svg.radialGradient = hh('radialGradient');
    svg.rect = hh('rect');
    svg.script = hh('script');
    svg.set = hh('set');
    svg.stop = hh('stop');
    svg.style = hh('style');
    svg.switch = hh('switch');
    svg.symbol = hh('symbol');
    svg.text = hh('text');
    svg.textPath = hh('textPath');
    svg.title = hh('title');
    svg.tref = hh('tref');
    svg.tspan = hh('tspan');
    svg.use = hh('use');
    svg.view = hh('view');
    svg.vkern = hh('vkern');
    return svg;
}
exports.svg = createSVGHelper();
//# sourceMappingURL=helpers.js.map

/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var hyperscript_1 = __webpack_require__(8);
/* tslint:enable:max-line-length */
function copyToThunk(vNode, thunk) {
    thunk.elm = vNode.elm;
    if (!vNode.data) {
        vNode.data = {};
    }
    vNode.data.fn = thunk.data.fn;
    vNode.data.args = thunk.data.args;
    thunk.data = vNode.data;
    thunk.children = vNode.children;
    thunk.text = vNode.text;
    thunk.elm = vNode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vNode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vNode, thunk);
}
function prepatch(oldVnode, thunk) {
    var old = oldVnode.data;
    var cur = thunk.data;
    var oldArgs = old ? old.args : [];
    var args = cur.args;
    if (old && old.fn !== cur.fn || oldArgs && oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
    }
    for (var i = 0; i < args.length; ++i) {
        if (oldArgs && oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}
exports.thunk = function thunk(selector, key, render) {
    var state = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        state[_i - 3] = arguments[_i];
    }
    return hyperscript_1.h(selector, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: render,
        args: state
    });
};
//# sourceMappingURL=thunk.js.map

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var util_1 = __webpack_require__(7);
function isolateSource(source, scope) {
    return source.select(util_1.SCOPE_PREFIX + scope);
}
exports.isolateSource = isolateSource;
function isolateSink(sink, scope) {
    return sink.map(function (vTree) {
        if (vTree.data.isolate) {
            var existingScope = parseInt(vTree.data.isolate.split(util_1.SCOPE_PREFIX + 'cycle')[1]);
            var _scope = parseInt(scope.split('cycle')[1]);
            if (isNaN(existingScope) || isNaN(_scope) || existingScope > _scope) {
                return vTree;
            }
        }
        vTree.data.isolate = util_1.SCOPE_PREFIX + scope;
        if (typeof vTree.key === 'undefined') {
            vTree.key = util_1.SCOPE_PREFIX + scope;
        }
        return vTree;
    });
}
exports.isolateSink = isolateSink;
//# sourceMappingURL=isolate.js.map

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var init = __webpack_require__(152).init;
var most_1 = __webpack_require__(4);
var hold_1 = __webpack_require__(27);
var DOMSource_1 = __webpack_require__(29);
var VNodeWrapper_1 = __webpack_require__(56);
var util_1 = __webpack_require__(7);
var modules_1 = __webpack_require__(32);
var isolate_1 = __webpack_require__(63);
var transposition_1 = __webpack_require__(33);
function makeDOMDriverInputGuard(modules) {
    if (!Array.isArray(modules)) {
        throw new Error("Optional modules option must be " +
            "an array for snabbdom modules");
    }
}
function domDriverInputGuard(view$) {
    if (view$ instanceof most_1.Stream === false) {
        throw new Error("The DOM driver function expects as input a Stream of " +
            "virtual DOM elements");
    }
}
function mapVNodeToElement(vNode) {
    return vNode.elm ? vNode.elm : vNode;
}
function makeDOMDriver(container, options) {
    if (!options) {
        options = {};
    }
    var transposition = options.transposition || false;
    var modules = options.modules || modules_1.default;
    var isolateModule = new isolate_1.IsolateModule((new Map()));
    var patch = init([isolateModule.createModule()].concat(modules));
    var rootElement = util_1.getElement(container);
    var vnodeWrapper = new VNodeWrapper_1.VNodeWrapper(rootElement);
    var delegators = new Map();
    makeDOMDriverInputGuard(modules);
    return function DOMDriver(vnode$) {
        domDriverInputGuard(vnode$);
        var preprocessedVNode$ = transposition
            ? vnode$.map(transposition_1.transposeVNode).switch()
            : vnode$;
        var rootElement$ = preprocessedVNode$
            .map(function (vnode) { return vnodeWrapper.call(vnode); })
            .scan(patch, rootElement)
            .map(mapVNodeToElement)
            .thru(hold_1.default);
        rootElement$.drain()
            .catch(function (err) { return console.error(err); })
            .then(function () { return 'DOM Driver vnode$ has terminated'; });
        return new DOMSource_1.DOMSource(rootElement$, [], isolateModule, delegators);
    };
}
exports.makeDOMDriver = makeDOMDriver;
//# sourceMappingURL=makeDOMDriver.js.map

/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var transposition_1 = __webpack_require__(33);
var HTMLSource_1 = __webpack_require__(30);
var toHTML = __webpack_require__(138);
/* tslint:disable:no-empty */
var noop = function () { };
/* tslint:enable:no-empty */
function makeHTMLDriver(effect, options) {
    if (!options) {
        options = {};
    }
    var transposition = options.transposition || false;
    return function htmlDriver(vnode$) {
        var preprocessedVNode$ = (transposition ? vnode$.map(transposition_1.transposeVNode).switch() : vnode$);
        var html$ = preprocessedVNode$.map(toHTML);
        html$.subscribe({
            next: effect || noop,
            error: noop,
            complete: noop,
        });
        return new HTMLSource_1.HTMLSource(html$);
    };
}
exports.makeHTMLDriver = makeHTMLDriver;
//# sourceMappingURL=makeHTMLDriver.js.map

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var most_1 = __webpack_require__(4);
var SCOPE_PREFIX = '___';
var MockedDOMSource = (function () {
    function MockedDOMSource(_mockConfig) {
        this._mockConfig = _mockConfig;
        if (_mockConfig.elements) {
            this._elements = _mockConfig.elements;
        }
        else {
            this._elements = most_1.empty();
        }
    }
    MockedDOMSource.prototype.elements = function () {
        return this._elements;
    };
    MockedDOMSource.prototype.events = function (eventType, options) {
        var mockConfig = void options ? this._mockConfig : this._mockConfig;
        var keys = Object.keys(mockConfig);
        var keysLen = keys.length;
        for (var i = 0; i < keysLen; i++) {
            var key = keys[i];
            if (key === eventType) {
                return mockConfig[key];
            }
        }
        return most_1.empty();
    };
    MockedDOMSource.prototype.select = function (selector) {
        var mockConfig = this._mockConfig;
        var keys = Object.keys(mockConfig);
        var keysLen = keys.length;
        for (var i = 0; i < keysLen; i++) {
            var key = keys[i];
            if (key === selector) {
                return new MockedDOMSource(mockConfig[key]);
            }
        }
        return new MockedDOMSource({});
    };
    MockedDOMSource.prototype.isolateSource = function (source, scope) {
        return source.select('.' + SCOPE_PREFIX + scope);
    };
    MockedDOMSource.prototype.isolateSink = function (sink, scope) {
        return sink.map(function (vnode) {
            if (vnode.sel.indexOf(SCOPE_PREFIX + scope) !== -1) {
                return vnode;
            }
            else {
                vnode.sel += "." + SCOPE_PREFIX + scope;
                return vnode;
            }
        });
    };
    return MockedDOMSource;
}());
exports.MockedDOMSource = MockedDOMSource;
function mockDOMSource(mockConfig) {
    return new MockedDOMSource(mockConfig);
}
exports.mockDOMSource = mockDOMSource;
//# sourceMappingURL=mockDOMSource.js.map

/***/ },
/* 63 */
/***/ function(module, exports) {

"use strict";
"use strict";
var IsolateModule = (function () {
    function IsolateModule(isolatedElements) {
        this.isolatedElements = isolatedElements;
        this.eventDelegators = new Map();
    }
    IsolateModule.prototype.setScope = function (elm, scope) {
        this.isolatedElements.set(scope, elm);
    };
    IsolateModule.prototype.removeScope = function (scope) {
        this.isolatedElements.delete(scope);
    };
    IsolateModule.prototype.getIsolatedElement = function (scope) {
        return this.isolatedElements.get(scope);
    };
    IsolateModule.prototype.isIsolatedElement = function (elm) {
        var iterator = this.isolatedElements.entries();
        var hasNext = true;
        while (hasNext) {
            try {
                var result = iterator.next();
                var _a = result.value, scope = _a[0], element = _a[1];
                if (elm === element) {
                    return scope;
                }
            }
            catch (err) {
                hasNext = false;
            }
        }
        return false;
    };
    IsolateModule.prototype.addEventDelegator = function (scope, eventDelegator) {
        var delegators = this.eventDelegators.get(scope);
        if (!delegators) {
            delegators = [];
            this.eventDelegators.set(scope, delegators);
        }
        delegators[delegators.length] = eventDelegator;
    };
    IsolateModule.prototype.reset = function () {
        this.isolatedElements.clear();
    };
    IsolateModule.prototype.createModule = function () {
        var self = this;
        return {
            create: function (oldVNode, vNode) {
                var _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
                var oldScope = oldData.isolate || "";
                var scope = data.isolate || "";
                if (scope) {
                    if (oldScope) {
                        self.removeScope(oldScope);
                    }
                    self.setScope(elm, scope);
                    var delegators = self.eventDelegators.get(scope);
                    if (delegators) {
                        for (var i = 0, len = delegators.length; i < len; ++i) {
                            delegators[i].updateTopElement(elm);
                        }
                    }
                    else if (delegators === void 0) {
                        self.eventDelegators.set(scope, []);
                    }
                }
                if (oldScope && !scope) {
                    self.removeScope(scope);
                }
            },
            update: function (oldVNode, vNode) {
                var _a = oldVNode.data, oldData = _a === void 0 ? {} : _a;
                var elm = vNode.elm, _b = vNode.data, data = _b === void 0 ? {} : _b;
                var oldScope = oldData.isolate || "";
                var scope = data.isolate || "";
                if (scope && scope !== oldScope) {
                    if (oldScope) {
                        self.removeScope(oldScope);
                    }
                    self.setScope(elm, scope);
                }
                if (oldScope && !scope) {
                    self.removeScope(scope);
                }
            },
            remove: function (_a, cb) {
                var data = _a.data;
                data = data || {};
                var scope = data.isolate;
                if (scope) {
                    self.removeScope(scope);
                    if (self.eventDelegators.get(scope)) {
                        self.eventDelegators.set(scope, []);
                    }
                }
                cb();
            },
            destroy: function (_a) {
                var data = _a.data;
                data = data || {};
                var scope = data.isolate;
                if (scope) {
                    self.removeScope(scope);
                    if (self.eventDelegators.get(scope)) {
                        self.eventDelegators.set(scope, []);
                    }
                }
            }
        };
    };
    return IsolateModule;
}());
exports.IsolateModule = IsolateModule;
//# sourceMappingURL=isolate.js.map

/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.group = console.group || console.log;
console.groupCollapsed = console.groupCollapsed || console.log;
console.debug = console.debug || console.log;
// Type checking typings
/**
 * @typedef {function(Sources,Settings):Source} SwitchOnCondition
 */
/**
 * @typedef {SourceName} SwitchOnSource
 */
/**
 * @typedef {Object} SwitchCaseSettings
 * @property {SwitchOnCondition | SwitchOnSource} on
 * @property {Array<SinkName>} sinkNames
 * @property {?function(*,*): Boolean} eqFn
 */
var checks_1 = __webpack_require__(9);
var m_1 = __webpack_require__(15);
var ramda_1 = __webpack_require__(10);
var $ = __webpack_require__(4);
var sample_1 = __webpack_require__(53);
// CONFIG
var DEFAULT_SWITCH_COMPONENT_SOURCE_NAME = 'switch$'; // NOT USED
var defaultEqFn = function swichCptDefaultEqFn(a, b) {
    return a === b;
};
var cfg = {
    defaultSwitchComponentSourceName: DEFAULT_SWITCH_COMPONENT_SOURCE_NAME,
    defaultEqFn: defaultEqFn
};
//////
// Helper functions
function isSwitchSettings(settings) {
    var signature = {
        eqFn: ramda_1.either(ramda_1.isNil, checks_1.isFunction),
        caseWhen: ramda_1.complement(ramda_1.isNil),
        sinkNames: checks_1.isArrayOf(checks_1.isString),
        on: ramda_1.either(checks_1.isString, checks_1.isFunction)
    };
    var signatureErrorMessages = {
        eqFn: 'eqFn property, when not undefined, must be a function.',
        caseWhen: 'caseWhen property is mandatory.',
        sinkNames: 'sinkNames property must be an array of strings',
        on: '`on` property is mandatory and must be a string or a function.'
    };
    return checks_1.checkSignature(settings, signature, signatureErrorMessages, false);
}
function hasAtLeastOneChildComponent(childrenComponents) {
    return childrenComponents &&
        checks_1.isArray(childrenComponents) &&
        childrenComponents.length >= 1 ? true : '';
}
function computeSinks(makeOwnSinks, childrenComponents, sources, settings) {
    // TODO (later): Be careful that the inheritance of settings down the
    // chain can pollute children... So I need to check the presence of the
    // passed settings before merge to check that mandatory properties are
    // passed and not inherited unexpectedly from an ancestor.
    // This will have to be done via settingsContracts at SwitchCase level
    // debug info
    console.groupCollapsed('Switch component > computeSinks');
    console.debug('sources, settings, childrenComponents', sources, settings, childrenComponents);
    checks_1.assertContract(isSwitchSettings, [settings], 'Invalid switch' +
        ' component settings!');
    checks_1.assertContract(hasAtLeastOneChildComponent, [childrenComponents], 'switch combinator must at least have one child component to switch to!');
    var eqFn = settings.eqFn, caseWhen = settings.caseWhen, sinkNames = settings.sinkNames, on = settings.on;
    var overload = checks_1.unfoldObjOverload(on, [
        { 'guard$': checks_1.isFunction },
        { 'sourceName': checks_1.isString }
    ]);
    var _a = overload, guard$ = _a.guard$, sourceName = _a.sourceName, _index = _a._index;
    var switchSource;
    if (_index === 1) {
        // Case : overload `settings.on :: SourceName`
        switchSource = sources[sourceName];
        checks_1.assertContract(checks_1.isSource, [switchSource], "An observable with name " + sourceName + " could not be found in sources");
    }
    if (_index === 0) {
        // Case : overload `settings.on :: SourceName`
        switchSource = guard$(sources, settings);
        checks_1.assertContract(checks_1.isSource, [switchSource], "The function used for conditional switching did not return an observable!");
    }
    // set default values for optional properties
    eqFn = checks_1.defaultsTo(eqFn, cfg.defaultEqFn);
    var shouldSwitch$ = switchSource
        .map(function (x) { return eqFn(caseWhen, x); });
    var cachedSinks$ = shouldSwitch$
        .filter(function (x) { return x; })
        .map(function (_) {
        var mergedChildrenComponentsSinks = m_1.m({}, { matched: caseWhen }, childrenComponents);
        return mergedChildrenComponentsSinks(sources, settings);
    })
        .multicast(); // multicasted to all sinks
    function makeSwitchedSinkFromCache(sinkName) {
        return function makeSwitchedSinkFromCache(isMatchingCase, cachedSinks) {
            var cached$, preCached$, prefix$;
            if (isMatchingCase) {
                // Case : the switch source emits a value corresponding to the
                // configured case in the component
                // Case : matches configured value
                if (cachedSinks[sinkName] != null) {
                    // Case : the component produces a sink with that name
                    // This is an important case, as parent can have children
                    // nested at arbitrary levels, with either :
                    // 1. sinks which will not be retained (not in `sinkNames`
                    // settings)
                    // 2. or no sinks matching a particular `sinkNames`
                    // Casuistic 1. is taken care of automatically as we only
                    // construct the sinks in `sinkNames`
                    // Casuistic 2. is taken care of thereafter
                    prefix$ = sinkName === 'DOM' ?
                        // Case : DOM sink
                        // actually any sink which is merged with a `combineLatest`
                        // but here by default only DOM sinks are merged that way
                        // Because the `combineLatest` blocks till all its sources
                        // have started, and that behaviour interacts badly with
                        // route changes desired behavior, we forcibly emits a `null`
                        // value at the beginning of every sink.
                        // !! Don't start with null in case of switching IN, only
                        // when switching OUT
                        $.empty() :
                        // Case : Non-DOM sink
                        // Non-DOM sinks are merged with a simple `merge`, there
                        // is no conflict here, so we just return nothing
                        $.empty();
                    preCached$ = cachedSinks[sinkName]
                        .tap(console.log.bind(console, 'sink ' + sinkName + ':'));
                    // TODO BRC : add the finally operator
                    //            .finally(_ => {
                    //              console.log(`sink ${sinkName} terminating due to route change`)
                    //            })
                    cached$ = $.concat(prefix$, preCached$);
                }
                else {
                    // Case : the component does not have any sinks with the
                    // corresponding sinkName
                    cached$ = $.empty();
                }
            }
            else {
                // Case : the switch source emits a value NOT corresponding to the
                // configured case in the component
                console.log('isMatchingCase is null!!! no match for this component on' +
                    ' this route!');
                cached$ = sinkName === 'DOM' ? $.of(null) : $.empty();
            }
            return cached$;
        };
    }
    function makeSwitchedSink(sinkName) {
        return (_a = {},
            _a[sinkName] = sample_1.sample(makeSwitchedSinkFromCache(sinkName), shouldSwitch$, cachedSinks$)
                .tap(function () { console.warn("switching: " + sinkName); })
                .switch(),
            _a
        );
        var _a;
    }
    console.groupEnd();
    return ramda_1.mergeAll(ramda_1.map(makeSwitchedSink, sinkNames));
}
/**
 * Usage : m(SwitchCase, ::SwitchCaseSettings, ::Array<CaseComponent>)
 * Example : cf. specs
 *   > const mComponent = m(SwitchCase, {
   *   >    on: (sources,settings) => sources.sweatch$,
   *   >    sinkNames: ['DOM', 'a', 'b']
   *   >  }, [
 *   > m(Case, {caseWhen: true}, [childComponent1, childComponent2]),
 *   > m(Case, {caseWhen: false}, [childComponent3])
 *   > ])
 *
 * The switch combinator activates a component conditionally depending on
 * whether a condition on a 'switched' source stream is satisfied. Note
 * that the condition is evaluated every time there is an incoming value
 * on the relevant sources.
 * If it is necessary to implement a logic by which, the component activation
 * should only trigger on **changes** of the incoming value, that logic
 * could be implemented with a `distinctUntilChanged`.
 * When the condition is no longer satisfied, the previously activated
 * component is deactivated automatically :
 * - DOM sink emits null and terminates
 * - Non-DOM sinks are empty
 * DOM sinks are treated differently because the DOM is a behaviour
 * (continuous value), not an event, so we need to update to null its value
 * when there is no longer a match. i.e. match => DOM, no match => Null
 *
 * Signature 1: SwitchOnCondition -> [Component] -> Component
 * - settings.on :: Sources -> Settings -> Source
 * The function passed as parameter is returning a source observable whose
 * values will be used for the conditional switching.
 * - settings.sinkNames :: [SinkName]
 * This is an array with the names of the sinks to be constructed. This is
 * mandatory as we can't know in advance which sinks to produce
 * - settings.eqFn :: * -> * -> Boolean
 * A predicate which returns true if both parameters are considered equal.
 * This parameter defaults to `===`
 *
 * Signature 2: SwitchOnSource -> [Component] -> Component
 * - settings.on :: SourceName
 * A string which is the source name whose values will be used for the
 * conditional activation of the component. The sources used will be
 * sources[sourceName]
 * - Cf. Signature 1 for the meaning of the rest of parameters
 *
 * Contracts :
 * - SwitchCase combinator must have at least one child component
 * - Case combinator must have at least one child component
 * - Conditions should be defined such that there is for any given value
 * of the 'switched' stream only one matching component
 *   - If that is not the case, the last matching component will be the one
 *   prevailing. It is however how to predict which of the components will
 *   be the last in a given configuration
 * - on, sinkNames, caseWhen are mandatory
 *
 * Case component
 * - settings.caseWhen :: *
 * An object which will activate the switched-to component whenever the source
 * observable returned by the `on` parameter emits that object
 *
 * Contracts :
 * - caseWhen is mandatory
 *
 */
var SwitchCase = {
    mergeSinks: {
        DOM: function mergeDomSwitchedSinks(ownSink, childrenDOMSink, settings) {
            var allSinks = ramda_1.flatten([ownSink, childrenDOMSink]);
            var allDOMSinks = checks_1.removeNullsFromArray(allSinks);
            // debugger
            return $.mergeArray(allDOMSinks)
                .tap(console.warn.bind(console, 'Switch.specs' +
                ' > mergeDomSwitchedSinks > merge'))
                .filter(Boolean);
            // Most values will be null
            // All non-null values correspond to a match
            // In the degenerated case, all values will be null (no match
            // at all)
        }
    }
};
exports.SwitchCase = SwitchCase;
var Case = { computeSinks: computeSinks };
exports.Case = Case;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/index.d.ts" />
/**
 * Test plan
 *
 * A. Testing strategy
 * Main case tests must cover HaveParent x Signature x Children
 * That makes for 2 x 3 potential tests:
 * - Signature : whether Signature 1 or 2
 * - Children : whether the component has no children, 1 child, or several
 * children (We assume here that if the tests pass for two children, they will
 * pass for any number of children > 2)
 *
 * We will reduce the number of tests to perform to: 3 x (3 > 2 ?1 :2) by:
 * - assuming that the behaviour linked to the signature is
 * independent of the behaviour linked to the other arguments. Hence that
 * behaviour can be tested 'for free' on the way to testing expected
 * behaviour under the rest of the arguments.
 *
 * We hence remain with 3 tests to perform:
 * - (0,1,2) children
 * which will include along the way:
 * - default for optional properties (eqFn)
 * - signature 1 and 2
 *
 * B. Test scenarii
 */
var assert = __webpack_require__(12);
var $ = __webpack_require__(4);
var Switch_1 = __webpack_require__(64);
var m_1 = __webpack_require__(15);
var dom_1 = __webpack_require__(14);
var runTestScenario_1 = __webpack_require__(16);
function plan(n) {
    return function _done(done) {
        if (--n === 0) {
            done();
        }
    };
}
describe('Testing Switch component', function () {
    it('edge cases - no children - switch on source', function (done) {
        var mComponent = m_1.m(Switch_1.SwitchCase, {
            on: 'switch$',
            sinkNames: ['DOM', 'a', 'b']
        }, [m_1.m(Switch_1.Case, { caseWhen: true }, [])]);
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-abb-c-d' } },];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: [],
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            b: {
                outputs: [],
                successMessage: 'sink b produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            done();
        }
        var testFn = mComponent;
        assert.throws(function () {
            runTestScenario_1.runTestScenario(inputs, expected, testFn, {
                tickDuration: 5,
                waitForFinishDelay: 30
            });
        }, /contract/, 'Throws if the switch combinator is called with no' +
            ' child component to switch to');
    });
    it('main cases - 1 child - switch on source', function (done) {
        var assertAsync = plan(3);
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM1.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 1: '))
                    .map(function (x) { return dom_1.h('span', {}, "Component 1 : " + x); })
                    .concat($.never()),
                a: sources.userAction$.map(function (x) { return ("Component1 - user action : " + x); })
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM2.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 2: '))
                    .map(function (x) { return dom_1.h('span', {}, "Component 2 : " + x); })
                    .concat($.never()),
                b: sources.userAction$.map(function (x) { return ("Component2 - user action : " + x); })
            };
        };
        var mComponent = m_1.m(Switch_1.SwitchCase, {
            on: 'switch$',
            sinkNames: ['DOM', 'a', 'b'],
            eqFn: function (a, b) { return a === b; }
        }, [
            m_1.m(Switch_1.Case, { caseWhen: true }, [childComponent1, childComponent2])
        ]);
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-abb-c-d' } },
            {
                userAction$: {
                    diagram: 'abc-b-ac--ab---c',
                    values: { a: 'click', b: 'select', c: 'hover', }
                }
            },
            {
                switch$: {
                    //diagr: '-a--b--c--d--e--f--a',
                    //diagr: '-a-b-c-d-e-f-abb-c-d',
                    //userA: 'abc-b-ac--ab---c',
                    diagram: '-t-f-tttttff-t', values: {
                        t: true,
                        f: false,
                    }
                }
            }
        ];
        function makeVNode(x, y) {
            return dom_1.div([
                dom_1.h('span', {}, "Component 1 : " + x),
                dom_1.h('span', {}, "Component 2 : " + y),
            ]);
        }
        var vNodes = [
            makeVNode('c', 'd'),
            //      makeVNode('c','e'), // won't happen because combineLatest
            // (a,b) needs a first value for both a and b to emits its first value
            //      makeVNode('d','e'),
            makeVNode('f', 'b'),
            makeVNode('f', 'c'),
            makeVNode('a', 'c'),
            makeVNode('a', 'd'),
        ];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    'Component1 - user action : hover',
                    'Component1 - user action : click',
                    'Component1 - user action : hover',
                    'Component1 - user action : click',
                    'Component1 - user action : hover',
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            b: {
                outputs: [
                    'Component2 - user action : hover',
                    'Component2 - user action : click',
                    'Component2 - user action : hover',
                    'Component2 - user action : click',
                    'Component2 - user action : hover',
                ],
                successMessage: 'sink b produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 5,
            waitForFinishDelay: 30
        });
    });
    it.only('main cases - 2 children - switch on condition', function (done) {
        var assertAsync = plan(3);
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM1.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 1: '))
                    .map(function (x) { return dom_1.h('span', {}, "Component 1 : " + x); })
                    .concat($.never()),
                a: sources.userAction$.map(function (x) { return ("Component1 - user action : " + x); })
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM2.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 2: '))
                    .map(function (x) { return dom_1.h('span', {}, "Component 2 : " + x); })
                    .concat($.never()),
                b: sources.userAction$.map(function (x) { return ("Component2 - user action : " + x); })
            };
        };
        var childComponent3 = function childComponent1(sources, settings) {
            return {
                DOM: sources.DOM2.take(4)
                    .tap(console.warn.bind(console, 'DOM : component 3: '))
                    .map(function (x) { return dom_1.h('span', {}, "Component 3 : " + x); })
                    .concat($.never()),
                b: sources.userAction$.map(function (x) { return ("Component3 - user action : " + x); })
            };
        };
        var mComponent = m_1.m(Switch_1.SwitchCase, {
            on: function (sources, settings) { return sources.sweatch$; },
            sinkNames: ['DOM', 'a', 'b']
        }, [
            m_1.m(Switch_1.Case, { caseWhen: true }, [childComponent1, childComponent2]),
            m_1.m(Switch_1.Case, { caseWhen: false }, [childComponent3])
        ]);
        var inputs = [
            { DOM1: { diagram: '-a--b--c--d--e--f--a' } },
            { DOM2: { diagram: '-a-b-c-d-e-f-abb-c-d' } },
            {
                userAction$: {
                    diagram: 'abc-b-ac--ab---c',
                    values: { a: 'click', b: 'select', c: 'hover', }
                }
            },
            {
                'sweatch$': {
                    //diagr: '-a--b--c--d--e--f--a',
                    //diagr: '-a-b-c-d-e-f-abb-c-d',
                    //userA: 'abc-b-ac--ab---c',
                    diagram: '-t-f-tttttff-t', values: {
                        t: true,
                        f: false,
                    }
                }
            }
        ];
        function makeVNode(x, y, z) {
            return !z ?
                dom_1.div([
                    dom_1.h('span', {}, "Component 1 : " + x),
                    dom_1.h('span', {}, "Component 2 : " + y),
                ]) :
                dom_1.h('span', {}, "Component 3 : " + z);
        }
        var vNodes = [
            makeVNode('', '', 'c'),
            makeVNode('c', 'd', undefined),
            //      makeVNode('c','e'), // won't happen because combineLatest
            // (a,b) needs a first value for both a and b to emits its first value
            //      makeVNode('d','e'),
            makeVNode('', '', 'f'),
            makeVNode('', '', 'a'),
            makeVNode('f', 'b', undefined),
            makeVNode('f', 'c', undefined),
            makeVNode('a', 'c', undefined),
            makeVNode('a', 'd', undefined),
        ];
        /** @type TestResults */
        var expected = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    'Component1 - user action : hover',
                    'Component1 - user action : click',
                    'Component1 - user action : hover',
                    'Component1 - user action : click',
                    'Component1 - user action : hover',
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            b: {
                outputs: [
                    // basically all userAction after first value of switch$ is emitted
                    "Component2 - user action : hover",
                    "Component3 - user action : select",
                    "Component2 - user action : click",
                    "Component2 - user action : hover",
                    "Component2 - user action : click",
                    "Component3 - user action : select",
                    "Component2 - user action : hover"
                ],
                successMessage: 'sink b produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        function analyzeTestResults(actual, expected, message) {
            debugger;
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 3,
            waitForFinishDelay: 30
        });
    });
});


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/index.d.ts" />
var assert = __webpack_require__(12);
var checks_1 = __webpack_require__(9);
describe('Testing utils functions', function () {
    it('assertSignature(fnName, _arguments, vRules', function () {
        var fnName = 'test';
        var _arguments = [2, false];
        var _argInvalid = [false, 2];
        var vRules = [
            { arg1: function isNumber(x) { return typeof x === 'number'; } },
            { arg2: function isBoolean(x) { return typeof x === 'boolean'; } },
        ];
        assert.equal(checks_1.assertSignature(fnName, _arguments, vRules), true, 'assertSignature validates the arguments of a function according to a list' +
            'of validation rules. When those validation rules are observed, ' +
            'it should return true.');
        assert.throws(function () { checks_1.assertSignature(fnName, _argInvalid, vRules); }, /fails/, 'Each failing validation rule generates an error message; error messages' +
            'are gathered and thrown in an exception.');
    });
});


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

/// <reference path="../../../typings/index.d.ts" />
var assert = __webpack_require__(12);
var ramda_1 = __webpack_require__(10);
var dom_1 = __webpack_require__(14);
var $ = __webpack_require__(4);
var runTestScenario_1 = __webpack_require__(16);
var m_1 = __webpack_require__(15);
var checks_1 = __webpack_require__(9);
// TODO BRC: remove if we cant run in the browser, or add a switch with env. variable
console.groupCollapsed = console.groupCollapsed || console.log;
// Fixtures
var PROVIDERS = {
    google: 'google',
    facebook: 'facebook',
};
function plan(n) {
    return function _done(done) {
        if (--n === 0) {
            done();
        }
    };
}
describe('Testing m(component_def, settings, children)', function () {
    it('edge cases - no arguments', function () {
        // NOTE
        // skipping more edge cases where arguments are of the wrong type
        // there are too many of them and they do not add so much value
        // As much as possible, the helper is written so it fails early with a
        // reasonably descriptive error message when it detects invalid arguments
        assert.throws(function () {
            m_1.m();
        }, /fails/, 'it throws an exception if it is called with an invalid ' +
            'combination of arguments');
    });
    it('main cases - only children components', function (done) {
        // NOTE
        // skipping also a number of main cases corresponding to combination of inputs
        // which are deem to be tested
        // Inputs : component_def x settings x children
        // - component_def: 7 classes of values for properties
        // - settings: two classes of values (null, {...})
        // - children: three classes of values ([], [component], [component, component])
        // That makes for 7x2x3 = 42 tests
        // We assume that those inputs are 'independent', so the number of cases
        // gets down to 7 + 2 + 3 = 12
        // We assume that case children : [component, component] takes care of [component]
        // and we test several conditions in the same test case
        // which brings down the number of tests to 4
        var assertAsync = plan(4);
        // Test case 2
        // 2 children: [component (sink DOM, a, c), component(sink DOM, a, d)], settings : {...}, no component_def, no local sources
        //   + sources : DOM, a, b, c, d, e
        //   + output.sinks = children component sinks merged with default values of the component_def
        //   + i.e. sinkNames = [DOM, auth, route, queue], DOM is merged with default,
        //     auth is merged with both, queue, route merged with 1
        //   + settings are taken into account (have all of the sinks depend on settings differently)
        var testSettings = { main: 'parent settings' };
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (user) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, settings.main),
                ]); }, sources.a),
                a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                c: sources.c.map(function (x) { return 'child1-c-' + x; }),
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (user) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, settings.local),
                ]); }, sources.a),
                a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                d: sources.e.map(function (x) { return 'child2-e-' + x; }),
            };
        };
        var mComponent = m_1.m({
            makeLocalSettings: function (settings) { return ({ local: 'local setting' }); },
        }, testSettings, [childComponent1, childComponent2]);
        var inputs = [
            { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
            { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
            { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
            { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
            { e: { diagram: 'a|', values: { a: 'e-0' } } }
        ];
        var vNodes = [
            // 1
            dom_1.div([
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                ]),
            ]),
            // 2
            dom_1.div([
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                ]),
            ]),
            dom_1.div([
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                ]),
            ]),
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "child1-a-b-0",
                    "child2-a-d-0",
                    "child1-a-b-1",
                    "child1-a-b-2",
                    "child2-a-d-2"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            c: {
                outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                successMessage: 'sink c produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            d: {
                outputs: ["child2-e-e-0"],
                successMessage: 'sink d produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
        it('main cases - only children components', function (done) {
            // NOTE
            // skipping also a number of main cases corresponding to combination of inputs
            // which are deem to be tested
            // Inputs : component_def x settings x children
            // - component_def: 7 classes of values for properties
            // - settings: two classes of values (null, {...})
            // - children: three classes of values ([], [component], [component, component])
            // That makes for 7x2x3 = 42 tests
            // We assume that those inputs are 'independent', so the number of cases
            // gets down to 7 + 2 + 3 = 12
            // We assume that case children : [component, component] takes care of [component]
            // and we test several conditions in the same test case
            // which brings down the number of tests to 4
            var assertAsync = plan(4);
            // Test case 2
            // 2 children: [component (sink DOM, a, c), component(sink DOM, a, d)], settings : {...}, no component_def, no local sources
            //   + sources : DOM, a, b, c, d, e
            //   + output.sinks = children component sinks merged with default values of the component_def
            //   + i.e. sinkNames = [DOM, auth, route, queue], DOM is merged with default,
            //     auth is merged with both, queue, route merged with 1
            //   + settings are taken into account (have all of the sinks depend on settings differently)
            var testSettings = { main: 'parent settings' };
            var childComponent1 = function childComponent1(sources, settings) {
                return {
                    DOM: $.empty(),
                    a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                    c: sources.c.map(function (x) { return 'child1-c-' + x; }),
                };
            };
            var childComponent2 = function childComponent1(sources, settings) {
                return {
                    DOM: $.map(function (user) { return dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, settings.local),
                    ]); }, sources.a),
                    a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                    d: sources.e.map(function (x) { return 'child2-e-' + x; }),
                };
            };
            var mComponent = m_1.m({
                makeLocalSettings: function (settings) { return ({ local: 'local setting' }); },
            }, testSettings, [childComponent1, childComponent2]);
            var inputs = [
                { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
                { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
                { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
                { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
                { e: { diagram: 'a|', values: { a: 'e-0' } } }
            ];
            var vNodes = [
                // 1
                dom_1.div([
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                    ]),
                ]),
                // 2
                dom_1.div([
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                    ]),
                ]),
                dom_1.div([
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, testSettings.main),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'local setting'),
                    ]),
                ]),
            ];
            function analyzeTestResults(actual, expected, message) {
                assert.deepEqual(actual, expected, message);
                assertAsync(done);
            }
            /** @type TestResults */
            var testResults = {
                DOM: {
                    outputs: vNodes,
                    successMessage: 'sink DOM produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                    transformFn: undefined,
                },
                a: {
                    outputs: [
                        "child1-a-b-0",
                        "child2-a-d-0",
                        "child1-a-b-1",
                        "child1-a-b-2",
                        "child2-a-d-2"
                    ],
                    successMessage: 'sink a produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                },
                c: {
                    outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                    successMessage: 'sink c produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                    transformFn: undefined,
                },
                d: {
                    outputs: ["child2-e-e-0"],
                    successMessage: 'sink d produces the expected values',
                    analyzeTestResults: analyzeTestResults,
                    transformFn: undefined,
                },
            };
            var testFn = mComponent;
            runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
                timeUnit: 50,
                waitForFinishDelay: 100
            });
        });
    });
    it("main cases - no children", function (done) {
        var assertAsync = plan(5);
        // Test input 4
        // No children, settings : ?, full component def(sink DOM, auth,
        //   queue, extra source user$) using the extra sources created
        var vNode = {
            "children": [
                {
                    "children": undefined,
                    "data": {
                        "style": {
                            "fontWeight": "bold"
                        }
                    },
                    "elm": undefined,
                    "key": undefined,
                    "sel": "span",
                    "text": "parent settings"
                },
                {
                    "children": undefined,
                    "data": undefined,
                    "elm": undefined,
                    "key": undefined,
                    "sel": undefined,
                    "text": " and this is local settings"
                },
                {
                    "children": undefined,
                    "data": {
                        "style": {
                            "fontWeight": "italic"
                        }
                    },
                    "elm": undefined,
                    "key": undefined,
                    "sel": "span",
                    "text": "local setting"
                }
            ],
            "data": {},
            "elm": undefined,
            "key": undefined,
            "sel": "div#container.two.classes",
            "text": undefined
        };
        var testSettings = { key: 'parent settings' };
        var mComponent = m_1.m({
            makeLocalSources: function (sources, settings) {
                return {
                    user$: $.of(settings),
                };
            },
            makeLocalSettings: function (settings) { return ({ localSetting: 'local setting' }); },
            makeOwnSinks: function (sources, settings) { return ({
                DOM: $.map(function (user) { return dom_1.h('div#container.two.classes', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, user.key),
                    ' and this is local settings',
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, settings.localSetting),
                ]); }, sources.user$),
                auth$: sources.auth$.startWith(PROVIDERS.google),
            }); },
            mergeSinks: function (parentSinks, childrenSinks, settings) { return ({
                DOM: parentSinks.DOM,
                auth$: parentSinks.auth$,
                user$: parentSinks.user$,
                childrenSinks$: $.of(childrenSinks),
                settings$: $.of(settings),
            }); },
            sinksContract: function checkMSinksContracts() {
                return true;
            }
        }, null, []);
        var inputs = [
            { auth$: { diagram: '-a|', values: { a: PROVIDERS.facebook } } },
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: [vNode],
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            auth$: {
                outputs: ['google', 'facebook'],
                successMessage: 'sink auth produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            user$: {
                outputs: [],
                successMessage: 'sink user produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            childrenSinks$: {
                outputs: [[]],
                successMessage: 'sink childrenSinks produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            settings$: {
                outputs: [{
                        "key": "parent settings",
                        "localSetting": "local setting"
                    }],
                successMessage: 'sink settings produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = function mComponentTestFn(settings) {
            return function _mComponentTestFn(sources) {
                return mComponent(sources, settings);
            };
        };
        runTestScenario_1.runTestScenario(inputs, testResults, testFn(testSettings), {
            timeUnit: 10,
            waitForFinishDelay: 30
        });
    });
    it('main cases - children components and parent component - default merge', function (done) {
        var assertAsync = plan(5);
        // Test case 4
        // 4 children: [component, component], settings : {...}, full component def (DOM, queue, auth, action)
        var testSettings = null;
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-' + a),
                ]); }, sources.a),
                a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                c: sources.c.map(function (x) { return 'child1-c-' + x; }),
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-' + a),
                ]); }, sources.a),
                a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                d: sources.e.map(function (x) { return 'child2-e-' + x; }),
            };
        };
        var mComponent = m_1.m({
            makeLocalSources: function (sources, settings) {
                return {
                    user$: $.of(settings),
                };
            },
            makeOwnSinks: function (sources, settings) { return ({
                DOM: $.of(dom_1.div('.parent')),
                auth$: sources.auth$.startWith(PROVIDERS.google),
            }); },
            sinksContract: function checkMSinksContracts() {
                return true;
            }
        }, testSettings, [childComponent1, childComponent2]);
        var vNodes = [
            dom_1.div('.parent', [
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-0'),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-0'),
                ]),
            ]),
            dom_1.div('.parent', [
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-1'),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-0'),
                ]),
            ]),
            dom_1.div('.parent', [
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-1'),
                ]),
                dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-1'),
                ]),
            ]),
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var inputs = [
            { auth$: { diagram: 'a|', values: { a: 'auth-0' } } },
            { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
            { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
            { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
            { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
            { e: { diagram: 'a|', values: { a: 'e-0' } } },
        ];
        /** @type TestResults */
        var TestResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            auth$: {
                outputs: ["google", "auth-0"],
                successMessage: 'sink auth$ produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "child1-a-b-0",
                    "child2-a-d-0",
                    "child1-a-b-1",
                    "child1-a-b-2",
                    "child2-a-d-2"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            c: {
                outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                successMessage: 'sink c produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            d: {
                outputs: ["child2-e-e-0"],
                successMessage: 'sink d produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, TestResults, testFn, {
            timeUnit: 5,
            waitForFinishDelay: 20
        });
    });
    it('main cases - children components and parent component - customized merge', function (done) {
        var assertAsync = plan(5);
        var testSettings = null;
        var childComponent1 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-' + a),
                ]); }, sources.a),
                a: sources.b.map(function (x) { return 'child1-a-' + x; }),
                c: sources.c.map(function (x) { return 'child1-c-' + x; }),
            };
        };
        var childComponent2 = function childComponent1(sources, settings) {
            return {
                DOM: $.map(function (a) { return dom_1.h('div', {}, [
                    dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-' + a),
                ]); }, sources.a),
                a: sources.d.map(function (x) { return 'child2-a-' + x; }),
                d: sources.e.map(function (x) { return 'child2-e-' + x; }),
            };
        };
        var mComponent = m_1.m({
            makeLocalSources: function (sources, settings) {
                return {
                    user$: $.of(settings),
                };
            },
            makeOwnSinks: function (sources, settings) { return ({
                DOM: $.of(dom_1.div('.parent')),
                auth$: sources.auth$.startWith(PROVIDERS.google),
            }); },
            mergeSinks: function (parentSinks, childrenSinks, settings) { return ({
                DOM: parentSinks.DOM,
                auth$: parentSinks.auth$,
                user$: parentSinks.user$,
                childrenSinks$: $.mergeArray(checks_1.projectSinksOn('DOM', childrenSinks)),
                settings$: $.of(settings),
            }); },
            sinksContract: function checkMSinksContracts() {
                return true;
            }
        }, testSettings, [childComponent1, childComponent2]);
        var inputs = [
            { auth$: { diagram: 'a|', values: { a: 'auth-0' } } },
            { a: { diagram: 'ab|', values: { a: 'a-0', b: 'a-1' } } },
            { b: { diagram: 'abc|', values: { a: 'b-0', b: 'b-1', c: 'b-2' } } },
            { c: { diagram: 'abc|', values: { a: 'c-0', b: 'c-1', c: 'c-2' } } },
            { d: { diagram: 'a-b|', values: { a: 'd-0', b: 'd-2' } } },
            { e: { diagram: 'a|', values: { a: 'e-0' } } }
        ];
        var vNodes = [
            {
                "children": undefined,
                "data": {},
                "elm": undefined,
                "key": undefined,
                "sel": "div.parent",
                "text": undefined
            }
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            user$: {
                outputs: [],
                successMessage: 'sink user produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            childrenSinks$: {
                outputs: [
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-0'),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-0'),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'bold' } }, 'child1-a-1'),
                    ]),
                    dom_1.h('div', {}, [
                        dom_1.h('span', { style: { fontWeight: 'italic' } }, 'child2-a-1'),
                    ]),
                ],
                successMessage: 'sink childrenSinks produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            settings$: {
                outputs: [{}],
                successMessage: 'sink settings produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            auth$: {
                outputs: ["google", "auth-0"],
                successMessage: 'sink auth$ produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            a: {
                outputs: [
                    "child1-a-b-0",
                    "child2-a-d-0",
                    "child1-a-b-1",
                    "child1-a-b-2",
                    "child2-a-d-2"
                ],
                successMessage: 'sink a produces the expected values',
                analyzeTestResults: analyzeTestResults,
            },
            c: {
                outputs: ["child1-c-c-0", "child1-c-c-1", "child1-c-c-2"],
                successMessage: 'sink c produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            d: {
                outputs: ["child2-e-e-0"],
                successMessage: 'sink d produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = mComponent;
        runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
    });
    it('main cases - great children components - default merge - settings', function (done) {
        var assertAsync = plan(4);
        var child = {
            makeOwnSinks: function childMakeOwnSinks(sources, settings) {
                return {
                    DOM: sources.DOM1.map(checks_1.makeDivVNode),
                    childSettings$: sources.DOM1.map(ramda_1.always(settings))
                };
            },
            makeLocalSettings: function makeLocalSettings(settings) {
                return {
                    childKey1: '.settingInMOverloaded'
                };
            }
        };
        var greatChild = {
            makeOwnSinks: function greatCMakeOwnSinks(sources, settings) {
                return {
                    DOM: sources.DOM2.map(checks_1.makeDivVNode),
                    gCSettings$: sources.DOM2.map(ramda_1.always(settings))
                };
            }
        };
        var parent = {
            makeOwnSinks: function parentMakeOwnSinks(sources, settings) {
                return {
                    DOM: sources.DOMp.map(checks_1.makeDivVNode),
                    parentSettings$: sources.DOMp.map(ramda_1.always(settings))
                };
            }
        };
        var component = m_1.m(parent, {
            parentKey1: 'MOverloaded',
            parentKey2: 'settingInM',
            parentKey3: { parent: 1 }
        }, [
            m_1.m(child, {
                childKey1: '.settingInM',
                parentKey2: 'parentSettingOverloadByChild',
                parentKey3: { child: 2 }
            }, [
                m_1.m(greatChild, {
                    greatChildKey: '..settingInM',
                    parentKey3: { greatChild: 3 }
                }, [])
            ])
        ]);
        var inputs = [
            { DOMp: { diagram: '-a---b--' } },
            { DOM1: { diagram: '-a--b--c--' } },
            { DOM2: { diagram: '-a-b-c-d-e-' } },
        ];
        function makeTestVNode(p, c, gc) {
            // p: parent, c: child, gc: greatchild
            return {
                "children": [
                    {
                        "children": [],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": undefined,
                        "text": p
                    },
                    {
                        "children": [
                            {
                                "children": [],
                                "data": {},
                                "elm": undefined,
                                "key": undefined,
                                "sel": undefined,
                                "text": c
                            },
                            {
                                "children": [
                                    {
                                        "children": [],
                                        "data": {},
                                        "elm": undefined,
                                        "key": undefined,
                                        "sel": undefined,
                                        "text": gc
                                    },
                                ],
                                "data": {},
                                "elm": undefined,
                                "key": undefined,
                                "sel": "div",
                                "text": undefined
                            }
                        ],
                        "data": {},
                        "elm": undefined,
                        "key": undefined,
                        "sel": "div",
                        "text": undefined
                    }
                ],
                "data": {},
                "elm": undefined,
                "key": undefined,
                "sel": "div",
                "text": undefined
            };
        }
        var vNodes = [
            makeTestVNode('a', 'a', 'a'),
            makeTestVNode('a', 'a', 'b'),
            makeTestVNode('a', 'b', 'b'),
            makeTestVNode('b', 'b', 'b'),
            makeTestVNode('b', 'b', 'c'),
            makeTestVNode('b', 'c', 'c'),
            makeTestVNode('b', 'c', 'd'),
            makeTestVNode('b', 'c', 'e'),
        ];
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        /** @type TestResults */
        var testResults = {
            DOM: {
                outputs: vNodes,
                successMessage: 'sink DOM produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            parentSettings$: {
                outputs: [
                    {
                        "parentKey1": "MOverloaded",
                        "parentKey2": "settingInM",
                        "parentKey3": {
                            "parent": 1
                        }
                    },
                    {
                        "parentKey1": "MOverloaded",
                        "parentKey2": "settingInM",
                        "parentKey3": {
                            "parent": 1
                        }
                    }
                ],
                successMessage: 'Component settings are the resulting merge of :\n' +
                    '1. settings passed through `m` helper, \n' +
                    '2. settings passed when calling the component which is a result of the `m` helper,\n' +
                    '3. settings resulting from `makeLocalSettings`\n' +
                    'in decreasing precedency order.',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            childSettings$: {
                outputs: [
                    {
                        "childKey1": ".settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "parent": 1
                        }
                    }
                ],
                successMessage: 'Children settings are computed like any component ' +
                    'settings, but also merge with the settings from the parent.\n' +
                    ' In case of conflict with the parent, the children settings ' +
                    'have higher precedency.',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            gCSettings$: {
                outputs: [
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    },
                    {
                        "childKey1": ".settingInM",
                        "greatChildKey": "..settingInM",
                        "parentKey1": "MOverloaded",
                        "parentKey2": "parentSettingOverloadByChild",
                        "parentKey3": {
                            "child": 2,
                            "greatChild": 3,
                            "parent": 1
                        }
                    }
                ],
                successMessage: 'Each child has its own setting object, ' +
                    'i.e settings are passed down the component tree by value, ' +
                    'not by reference',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
        };
        var testFn = function (sources, settings) {
            return component(sources, { parentKey1: 'settingOut' });
        };
        runTestScenario_1.runTestScenario(inputs, testResults, testFn, {
            timeUnit: 50,
            waitForFinishDelay: 100
        });
    });
});


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

var assert = __webpack_require__(12);
var runTestScenario_1 = __webpack_require__(16);
var $ = __webpack_require__(4);
function plan(n) {
    return function _done(done) {
        if (--n === 0) {
            done();
        }
    };
}
describe("Testings runTestScenario helper", function () {
    it('runTestScenario(testSources, testCase, testFn, settings) :', function (done) {
        var assertAsync = plan(3);
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var inputs = [
            { a: { diagram: 'xy|', values: { x: 'a-0', y: 'a-1' } } },
            { b: { diagram: 'xyz|', values: { x: 'b-0', y: 'b-1', z: 'b-2' } } }
        ];
        /** @type TestResults */
        var testCase = {
            m: {
                outputs: ['m-a-0', 'm-b-0', 'm-a-1', 'm-b-1', 'm-b-2'],
                successMessage: 'sink m produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            n: {
                outputs: ['t-n-a-0', 't-n-a-1'],
                successMessage: 'sink n produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: function (x) { return 't-' + x; },
            },
            o: {
                outputs: ['o-b-0', 'o-b-1', 'o-b-2'],
                successMessage: 'sink o produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            }
        };
        var testFn = function (sources) { return ({
            m: $.merge(sources.a, sources.b).map((function (x) { return 'm-' + x; })),
            n: sources.a.map(function (x) { return 'n-' + x; }),
            o: sources.b.delay(3).map(function (x) { return 'o-' + x; })
        }); };
        runTestScenario_1.runTestScenario(inputs, testCase, testFn, {
            timeUnit: 10,
            waitForFinishDelay: 30
        });
    });
    it('runTestScenario(inputs, testCase, testFn, settings) : Main case', function (done) {
        var assertAsync = plan(3);
        function analyzeTestResults(actual, expected, message) {
            assert.deepEqual(actual, expected, message);
            assertAsync(done);
        }
        var inputs = [
            { a: { diagram: 'xy|', values: { x: 'a-0', y: 'a-1' } } },
            { b: { diagram: 'xyz|', values: { x: 'b-0', y: 'b-1', z: 'b-2' } } },
        ];
        /** @type TestResults */
        var expected = {
            m: {
                outputs: ['m-a-0', 'm-b-0', 'm-a-1', 'm-b-1', 'm-b-2'],
                successMessage: 'sink m produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            },
            n: {
                outputs: ['t-n-a-0', 't-n-a-1'],
                successMessage: 'sink n produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: function (x) { return 't-' + x; },
            },
            o: {
                outputs: ['o-b-0', 'o-b-1', 'o-b-2'],
                successMessage: 'sink o produces the expected values',
                analyzeTestResults: analyzeTestResults,
                transformFn: undefined,
            }
        };
        var testFn = function (sources) { return ({
            m: $.merge(sources.a, sources.b).map((function (x) { return 'm-' + x; })),
            n: sources.a.map(function (x) { return 'n-' + x; }),
            o: sources.b.delay(3).map(function (x) { return 'o-' + x; })
        }); };
        runTestScenario_1.runTestScenario(inputs, expected, testFn, {
            tickDuration: 10,
            waitForFinishDelay: 30
        });
    });
});


/***/ },
/* 69 */
/***/ function(module, exports) {

/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.1.4 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var isArguments = __webpack_require__(37),
    isArray = __webpack_require__(38);

/**
 * Checks if `value` is object-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * The base implementation of `_.flatten` with added support for restricting
 * flattening and specifying the start index.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {boolean} [isDeep] Specify a deep flatten.
 * @param {boolean} [isStrict] Restrict flattening to arrays-like objects.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, isDeep, isStrict, result) {
  result || (result = []);

  var index = -1,
      length = array.length;

  while (++index < length) {
    var value = array[index];
    if (isObjectLike(value) && isArrayLike(value) &&
        (isStrict || isArray(value) || isArguments(value))) {
      if (isDeep) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, isDeep, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = baseFlatten;


/***/ },
/* 71 */
/***/ function(module, exports) {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `baseForIn` and `baseForOwn` which iterates
 * over `object` properties returned by `keysFunc` invoking `iteratee` for
 * each property. Iteratee functions may exit iteration early by explicitly
 * returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

/**
 * Creates a base function for methods like `_.forIn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = baseFor;


/***/ },
/* 72 */
/***/ function(module, exports) {

/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * The base implementation of `_.indexOf` without support for binary searches.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return indexOfNaN(array, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * Gets the index at which the first occurrence of `NaN` is found in `array`.
 * If `fromRight` is provided elements of `array` are iterated from right to left.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched `NaN`, else `-1`.
 */
function indexOfNaN(array, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 0 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    var other = array[index];
    if (other !== other) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.0.3 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseIndexOf = __webpack_require__(72),
    cacheIndexOf = __webpack_require__(75),
    createCache = __webpack_require__(76);

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniq` without support for callback shorthands
 * and `this` binding.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The function invoked per iteration.
 * @returns {Array} Returns the new duplicate-value-free array.
 */
function baseUniq(array, iteratee) {
  var index = -1,
      indexOf = baseIndexOf,
      length = array.length,
      isCommon = true,
      isLarge = isCommon && length >= LARGE_ARRAY_SIZE,
      seen = isLarge ? createCache() : null,
      result = [];

  if (seen) {
    indexOf = cacheIndexOf;
    isCommon = false;
  } else {
    isLarge = false;
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value, index, array) : value;

    if (isCommon && value === value) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (indexOf(seen, computed, 0) < 0) {
      if (iteratee || isLarge) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;


/***/ },
/* 74 */
/***/ function(module, exports) {

/**
 * lodash 3.0.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * A specialized version of `baseCallback` which only supports `this` binding
 * and specifying the number of arguments to provide to `func`.
 *
 * @private
 * @param {Function} func The function to bind.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {number} [argCount] The number of arguments to provide to `func`.
 * @returns {Function} Returns the callback.
 */
function bindCallback(func, thisArg, argCount) {
  if (typeof func != 'function') {
    return identity;
  }
  if (thisArg === undefined) {
    return func;
  }
  switch (argCount) {
    case 1: return function(value) {
      return func.call(thisArg, value);
    };
    case 3: return function(value, index, collection) {
      return func.call(thisArg, value, index, collection);
    };
    case 4: return function(accumulator, value, index, collection) {
      return func.call(thisArg, accumulator, value, index, collection);
    };
    case 5: return function(value, other, key, object, source) {
      return func.call(thisArg, value, other, key, object, source);
    };
  }
  return function() {
    return func.apply(thisArg, arguments);
  };
}

/**
 * This method returns the first argument provided to it.
 *
 * @static
 * @memberOf _
 * @category Utility
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'user': 'fred' };
 *
 * _.identity(object) === object;
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = bindCallback;


/***/ },
/* 75 */
/***/ function(module, exports) {

/**
 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Checks if `value` is in `cache` mimicking the return signature of
 * `_.indexOf` by returning `0` if the value is found, else `-1`.
 *
 * @private
 * @param {Object} cache The cache to search.
 * @param {*} value The value to search for.
 * @returns {number} Returns `0` if `value` is found, else `-1`.
 */
function cacheIndexOf(cache, value) {
  var data = cache.data,
      result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

  return result ? 0 : -1;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = cacheIndexOf;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = __webpack_require__(34);

/** Native method references. */
var Set = getNative(global, 'Set');

/* Native method references for those with the same name as other `lodash` methods. */
var nativeCreate = getNative(Object, 'create');

/**
 *
 * Creates a cache object to store unique values.
 *
 * @private
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var length = values ? values.length : 0;

  this.data = { 'hash': nativeCreate(null), 'set': new Set };
  while (length--) {
    this.push(values[length]);
  }
}

/**
 * Adds `value` to the cache.
 *
 * @private
 * @name push
 * @memberOf SetCache
 * @param {*} value The value to cache.
 */
function cachePush(value) {
  var data = this.data;
  if (typeof value == 'string' || isObject(value)) {
    data.set.add(value);
  } else {
    data.hash[value] = true;
  }
}

/**
 * Creates a `Set` cache object to optimize linear searches of large arrays.
 *
 * @private
 * @param {Array} [values] The values to cache.
 * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
 */
function createCache(values) {
  return (nativeCreate && Set) ? new SetCache(values) : null;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

// Add functions to the `Set` cache.
SetCache.prototype.push = cachePush;

module.exports = createCache;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var root = __webpack_require__(17);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match latin-1 supplementary letters (excluding mathematical operators). */
var reLatin1 = /[\xc0-\xd6\xd8-\xde\xdf-\xf6\xf8-\xff]/g;

/** Used to compose unicode character classes. */
var rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0';

/** Used to compose unicode capture groups. */
var rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']';

/**
 * Used to match [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) and
 * [combining diacritical marks for symbols](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks_for_Symbols).
 */
var reComboMark = RegExp(rsCombo, 'g');

/** Used to map latin-1 supplementary letters to basic latin letters. */
var deburredLetters = {
  '\xc0': 'A',  '\xc1': 'A', '\xc2': 'A', '\xc3': 'A', '\xc4': 'A', '\xc5': 'A',
  '\xe0': 'a',  '\xe1': 'a', '\xe2': 'a', '\xe3': 'a', '\xe4': 'a', '\xe5': 'a',
  '\xc7': 'C',  '\xe7': 'c',
  '\xd0': 'D',  '\xf0': 'd',
  '\xc8': 'E',  '\xc9': 'E', '\xca': 'E', '\xcb': 'E',
  '\xe8': 'e',  '\xe9': 'e', '\xea': 'e', '\xeb': 'e',
  '\xcC': 'I',  '\xcd': 'I', '\xce': 'I', '\xcf': 'I',
  '\xeC': 'i',  '\xed': 'i', '\xee': 'i', '\xef': 'i',
  '\xd1': 'N',  '\xf1': 'n',
  '\xd2': 'O',  '\xd3': 'O', '\xd4': 'O', '\xd5': 'O', '\xd6': 'O', '\xd8': 'O',
  '\xf2': 'o',  '\xf3': 'o', '\xf4': 'o', '\xf5': 'o', '\xf6': 'o', '\xf8': 'o',
  '\xd9': 'U',  '\xda': 'U', '\xdb': 'U', '\xdc': 'U',
  '\xf9': 'u',  '\xfa': 'u', '\xfb': 'u', '\xfc': 'u',
  '\xdd': 'Y',  '\xfd': 'y', '\xff': 'y',
  '\xc6': 'Ae', '\xe6': 'ae',
  '\xde': 'Th', '\xfe': 'th',
  '\xdf': 'ss'
};

/**
 * Used by `_.deburr` to convert latin-1 supplementary letters to basic latin letters.
 *
 * @private
 * @param {string} letter The matched letter to deburr.
 * @returns {string} Returns the deburred letter.
 */
function deburrLetter(letter) {
  return deburredLetters[letter];
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = Symbol ? symbolProto.toString : undefined;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (value == null) {
    return '';
  }
  if (isSymbol(value)) {
    return Symbol ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Deburrs `string` by converting [latin-1 supplementary letters](https://en.wikipedia.org/wiki/Latin-1_Supplement_(Unicode_block)#Character_table)
 * to basic latin letters and removing [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks).
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to deburr.
 * @returns {string} Returns the deburred string.
 * @example
 *
 * _.deburr('déjà vu');
 * // => 'deja vu'
 */
function deburr(string) {
  string = toString(string);
  return string && string.replace(reLatin1, deburrLetter).replace(reComboMark, '');
}

module.exports = deburr;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.1.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var deburr = __webpack_require__(77),
    words = __webpack_require__(82);

/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array.length;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

/**
 * Creates a function like `_.camelCase`.
 *
 * @private
 * @param {Function} callback The function to combine each word.
 * @returns {Function} Returns the new compounder function.
 */
function createCompounder(callback) {
  return function(string) {
    return arrayReduce(words(deburr(string)), callback, '');
  };
}

/**
 * Converts `string` to [kebab case](https://en.wikipedia.org/wiki/Letter_case#Special_case_styles).
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the kebab cased string.
 * @example
 *
 * _.kebabCase('Foo Bar');
 * // => 'foo-bar'
 *
 * _.kebabCase('fooBar');
 * // => 'foo-bar'
 *
 * _.kebabCase('__foo_bar__');
 * // => 'foo-bar'
 */
var kebabCase = createCompounder(function(result, word, index) {
  return result + (index ? '-' : '') + word.toLowerCase();
});

module.exports = kebabCase;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.1.2 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var getNative = __webpack_require__(34),
    isArguments = __webpack_require__(37),
    isArray = __webpack_require__(38);

/** Used to detect unsigned integer values. */
var reIsUint = /^\d+$/;

/** Used for native method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/* Native method references for those with the same name as other `lodash` methods. */
var nativeKeys = getNative(Object, 'keys');

/**
 * Used as the [maximum length](http://ecma-international.org/ecma-262/6.0/#sec-number.max_safe_integer)
 * of an array-like value.
 */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792)
 * that affects Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

/**
 * Checks if `value` is array-like.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  value = (typeof value == 'number' || reIsUint.test(value)) ? +value : -1;
  length = length == null ? MAX_SAFE_INTEGER : length;
  return value > -1 && value % 1 == 0 && value < length;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is based on [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 */
function isLength(value) {
  return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * A fallback implementation of `Object.keys` which creates an array of the
 * own enumerable property names of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function shimKeys(object) {
  var props = keysIn(object),
      propsLength = props.length,
      length = propsLength && object.length;

  var allowIndexes = !!length && isLength(length) &&
    (isArray(object) || isArguments(object));

  var index = -1,
      result = [];

  while (++index < propsLength) {
    var key = props[index];
    if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(1);
 * // => false
 */
function isObject(value) {
  // Avoid a V8 JIT bug in Chrome 19-20.
  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
var keys = !nativeKeys ? shimKeys : function(object) {
  var Ctor = object == null ? undefined : object.constructor;
  if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
      (typeof object != 'function' && isArrayLike(object))) {
    return shimKeys(object);
  }
  return isObject(object) ? nativeKeys(object) : [];
};

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  if (object == null) {
    return [];
  }
  if (!isObject(object)) {
    object = Object(object);
  }
  var length = object.length;
  length = (length && isLength(length) &&
    (isArray(object) || isArguments(object)) && length) || 0;

  var Ctor = object.constructor,
      index = -1,
      isProto = typeof Ctor == 'function' && Ctor.prototype === object,
      result = Array(length),
      skipIndexes = length > 0;

  while (++index < length) {
    result[index] = (index + '');
  }
  for (var key in object) {
    if (!(skipIndexes && isIndex(key, length)) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;


/***/ },
/* 80 */
/***/ function(module, exports) {

/**
 * lodash 3.6.1 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Native method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Creates a function that invokes `func` with the `this` binding of the
 * created function and arguments from `start` and beyond provided as an array.
 *
 * **Note:** This method is based on the [rest parameter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters).
 *
 * @static
 * @memberOf _
 * @category Function
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 * @example
 *
 * var say = _.restParam(function(what, names) {
 *   return what + ' ' + _.initial(names).join(', ') +
 *     (_.size(names) > 1 ? ', & ' : '') + _.last(names);
 * });
 *
 * say('hello', 'fred', 'barney', 'pebbles');
 * // => 'hello fred, barney, & pebbles'
 */
function restParam(func, start) {
  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  start = nativeMax(start === undefined ? (func.length - 1) : (+start || 0), 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        rest = Array(length);

    while (++index < length) {
      rest[index] = args[start + index];
    }
    switch (start) {
      case 0: return func.call(this, rest);
      case 1: return func.call(this, args[0], rest);
      case 2: return func.call(this, args[0], args[1], rest);
    }
    var otherArgs = Array(start + 1);
    index = -1;
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = rest;
    return func.apply(this, otherArgs);
  };
}

module.exports = restParam;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.1.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modern modularize exports="npm" -o ./`
 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var baseFlatten = __webpack_require__(70),
    baseUniq = __webpack_require__(73),
    restParam = __webpack_require__(80);

/**
 * Creates an array of unique values, in order, of the provided arrays using
 * `SameValueZero` for equality comparisons.
 *
 * **Note:** [`SameValueZero`](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
 * comparisons are like strict equality comparisons, e.g. `===`, except that
 * `NaN` matches `NaN`.
 *
 * @static
 * @memberOf _
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @example
 *
 * _.union([1, 2], [4, 2], [2, 1]);
 * // => [1, 2, 4]
 */
var union = restParam(function(arrays) {
  return baseUniq(baseFlatten(arrays, false, true));
});

module.exports = union;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

/**
 * lodash 3.2.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */
var root = __webpack_require__(17);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f\\ufe20-\\ufe23',
    rsComboSymbolsRange = '\\u20d0-\\u20f0',
    rsDingbatRange = '\\u2700-\\u27bf',
    rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff',
    rsMathOpRange = '\\xac\\xb1\\xd7\\xf7',
    rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf',
    rsQuoteRange = '\\u2018\\u2019\\u201c\\u201d',
    rsSpaceRange = ' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000',
    rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde',
    rsVarRange = '\\ufe0e\\ufe0f',
    rsBreakRange = rsMathOpRange + rsNonCharRange + rsQuoteRange + rsSpaceRange;

/** Used to compose unicode capture groups. */
var rsBreak = '[' + rsBreakRange + ']',
    rsCombo = '[' + rsComboMarksRange + rsComboSymbolsRange + ']',
    rsDigits = '\\d+',
    rsDingbat = '[' + rsDingbatRange + ']',
    rsLower = '[' + rsLowerRange + ']',
    rsMisc = '[^' + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsUpper = '[' + rsUpperRange + ']',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var rsLowerMisc = '(?:' + rsLower + '|' + rsMisc + ')',
    rsUpperMisc = '(?:' + rsUpper + '|' + rsMisc + ')',
    reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

/** Used to match non-compound words composed of alphanumeric characters. */
var reBasicWord = /[a-zA-Z0-9]+/g;

/** Used to match complex or compound words. */
var reComplexWord = RegExp([
  rsUpper + '?' + rsLower + '+(?=' + [rsBreak, rsUpper, '$'].join('|') + ')',
  rsUpperMisc + '+(?=' + [rsBreak, rsUpper + rsLowerMisc, '$'].join('|') + ')',
  rsUpper + '?' + rsLowerMisc + '+',
  rsUpper + '+',
  rsDigits,
  rsEmoji
].join('|'), 'g');

/** Used to detect strings that need a more robust regexp to match words. */
var reHasComplexWord = /[a-z][A-Z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = Symbol ? symbolProto.toString : undefined;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string if it's not one. An empty string is returned
 * for `null` and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (value == null) {
    return '';
  }
  if (isSymbol(value)) {
    return Symbol ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Splits `string` into an array of its words.
 *
 * @static
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {RegExp|string} [pattern] The pattern to match words.
 * @param- {Object} [guard] Enables use as an iteratee for functions like `_.map`.
 * @returns {Array} Returns the words of `string`.
 * @example
 *
 * _.words('fred, barney, & pebbles');
 * // => ['fred', 'barney', 'pebbles']
 *
 * _.words('fred, barney, & pebbles', /[^, ]+/g);
 * // => ['fred', 'barney', '&', 'pebbles']
 */
function words(string, pattern, guard) {
  string = toString(string);
  pattern = guard ? undefined : pattern;

  if (pattern === undefined) {
    pattern = reHasComplexWord.test(string) ? reComplexWord : reBasicWord;
  }
  return string.match(pattern) || [];
}

module.exports = words;


/***/ },
/* 83 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var last = exports.last = function (stream) { return new stream.constructor(new Last(stream.source)); };

var Last = function Last(source) {
  this.source = source;
};

Last.prototype.run = function run (sink, scheduler) {
  return this.source.run(new LastSink(sink), scheduler);
};

var LastSink = function LastSink(sink) {
  this.sink = sink;
  this.has = false;
  this.value = void 0;
};

LastSink.prototype.event = function event (t, x) {
  this.has = true;
  this.value = x;
};

LastSink.prototype.error = function error (t, e) {
  this.sink.error(t, e);
};

LastSink.prototype.end = function end (t, x) {
  if (this.has) {
    this.sink.event(t, this.value);
  }
  this.sink.end(t, x);
};

/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SubjectSource_1 = __webpack_require__(19);
var util_1 = __webpack_require__(40);
var HoldSubjectSource = (function (_super) {
    __extends(HoldSubjectSource, _super);
    function HoldSubjectSource(bufferSize) {
        _super.call(this);
        this.buffer = [];
        this.bufferSize = bufferSize;
    }
    HoldSubjectSource.prototype.add = function (sink) {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            util_1.pushEvents(buffer, sink);
        }
        return _super.prototype.add.call(this, sink);
    };
    HoldSubjectSource.prototype.next = function (value) {
        if (this.scheduler === void 0) {
            return;
        }
        var time = this.scheduler.now();
        this.buffer = util_1.dropAndAppend({ time: time, value: value }, this.buffer, this.bufferSize);
        if (this.active) {
            this._next(time, value);
        }
    };
    return HoldSubjectSource;
}(SubjectSource_1.BasicSubjectSource));
exports.HoldSubjectSource = HoldSubjectSource;
//# sourceMappingURL=HoldSubjectSource.js.map

/***/ },
/* 85 */
/***/ function(module, exports) {

"use strict";
"use strict";
var SubjectDisposable = (function () {
    function SubjectDisposable(source, sink) {
        this.source = source;
        this.sink = sink;
        this.disposed = false;
    }
    SubjectDisposable.prototype.dispose = function () {
        if (this.disposed)
            return;
        this.disposed = true;
        var remaining = this.source.remove(this.sink);
        return remaining === 0 && this.source._dispose();
    };
    return SubjectDisposable;
}());
exports.SubjectDisposable = SubjectDisposable;
//# sourceMappingURL=SubjectDisposable.js.map

/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ClockTimer;

var _task = __webpack_require__(41);

/*global setTimeout, clearTimeout*/

function ClockTimer() {} /** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

ClockTimer.prototype.now = Date.now;

ClockTimer.prototype.setTimer = function (f, dt) {
  return dt <= 0 ? runAsap(f) : setTimeout(f, dt);
};

ClockTimer.prototype.clearTimer = function (t) {
  return t instanceof Asap ? t.cancel() : clearTimeout(t);
};

function Asap(f) {
  this.f = f;
  this.active = true;
}

Asap.prototype.run = function () {
  return this.active && this.f();
};

Asap.prototype.error = function (e) {
  throw e;
};

Asap.prototype.cancel = function () {
  this.active = false;
};

function runAsap(f) {
  var task = new Asap(f);
  (0, _task.defer)(task);
  return task;
}

/***/ },
/* 87 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ScheduledTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function ScheduledTask(delay, period, task, scheduler) {
  this.time = delay;
  this.period = period;
  this.task = task;
  this.scheduler = scheduler;
  this.active = true;
}

ScheduledTask.prototype.run = function () {
  return this.task.run(this.time);
};

ScheduledTask.prototype.error = function (e) {
  return this.task.error(this.time, e);
};

ScheduledTask.prototype.dispose = function () {
  this.scheduler.cancel(this);
  return this.task.dispose();
};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Scheduler;

var _ScheduledTask = __webpack_require__(87);

var _ScheduledTask2 = _interopRequireDefault(_ScheduledTask);

var _task = __webpack_require__(41);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function Scheduler(timer, timeline) {
  this.timer = timer;
  this.timeline = timeline;

  this._timer = null;
  this._nextArrival = Infinity;

  var self = this;
  this._runReadyTasksBound = function () {
    self._runReadyTasks(self.now());
  };
}

Scheduler.prototype.now = function () {
  return this.timer.now();
};

Scheduler.prototype.asap = function (task) {
  return this.schedule(0, -1, task);
};

Scheduler.prototype.delay = function (delay, task) {
  return this.schedule(delay, -1, task);
};

Scheduler.prototype.periodic = function (period, task) {
  return this.schedule(0, period, task);
};

Scheduler.prototype.schedule = function (delay, period, task) {
  var now = this.now();
  var st = new _ScheduledTask2.default(now + Math.max(0, delay), period, task, this);

  this.timeline.add(st);
  this._scheduleNextRun(now);
  return st;
};

Scheduler.prototype.cancel = function (task) {
  task.active = false;
  if (this.timeline.remove(task)) {
    this._reschedule();
  }
};

Scheduler.prototype.cancelAll = function (f) {
  this.timeline.removeAll(f);
  this._reschedule();
};

Scheduler.prototype._reschedule = function () {
  if (this.timeline.isEmpty()) {
    this._unschedule();
  } else {
    this._scheduleNextRun(this.now());
  }
};

Scheduler.prototype._unschedule = function () {
  this.timer.clearTimer(this._timer);
  this._timer = null;
};

Scheduler.prototype._scheduleNextRun = function (now) {
  // eslint-disable-line complexity
  if (this.timeline.isEmpty()) {
    return;
  }

  var nextArrival = this.timeline.nextArrival();

  if (this._timer === null) {
    this._scheduleNextArrival(nextArrival, now);
  } else if (nextArrival < this._nextArrival) {
    this._unschedule();
    this._scheduleNextArrival(nextArrival, now);
  }
};

Scheduler.prototype._scheduleNextArrival = function (nextArrival, now) {
  this._nextArrival = nextArrival;
  var delay = Math.max(0, nextArrival - now);
  this._timer = this.timer.setTimer(this._runReadyTasksBound, delay);
};

Scheduler.prototype._runReadyTasks = function (now) {
  this._timer = null;
  this.timeline.runTasks(now, _task.runTask);
  this._scheduleNextRun(this.now());
};

/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Timeline;

var _prelude = __webpack_require__(3);

var base = _interopRequireWildcard(_prelude);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function Timeline() {
  this.tasks = [];
} /** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

Timeline.prototype.nextArrival = function () {
  return this.isEmpty() ? Infinity : this.tasks[0].time;
};

Timeline.prototype.isEmpty = function () {
  return this.tasks.length === 0;
};

Timeline.prototype.add = function (st) {
  insertByTime(st, this.tasks);
};

Timeline.prototype.remove = function (st) {
  var i = binarySearch(st.time, this.tasks);

  if (i >= 0 && i < this.tasks.length) {
    var at = base.findIndex(st, this.tasks[i].events);
    if (at >= 0) {
      this.tasks[i].events.splice(at, 1);
      return true;
    }
  }

  return false;
};

Timeline.prototype.removeAll = function (f) {
  var this$1 = this;

  for (var i = 0, l = this.tasks.length; i < l; ++i) {
    removeAllFrom(f, this$1.tasks[i]);
  }
};

Timeline.prototype.runTasks = function (t, runTask) {
  var this$1 = this;

  var tasks = this.tasks;
  var l = tasks.length;
  var i = 0;

  while (i < l && tasks[i].time <= t) {
    ++i;
  }

  this.tasks = tasks.slice(i);

  // Run all ready tasks
  for (var j = 0; j < i; ++j) {
    this$1.tasks = runTasks(runTask, tasks[j], this$1.tasks);
  }
};

function runTasks(runTask, timeslot, tasks) {
  // eslint-disable-line complexity
  var events = timeslot.events;
  for (var i = 0; i < events.length; ++i) {
    var task = events[i];

    if (task.active) {
      runTask(task);

      // Reschedule periodic repeating tasks
      // Check active again, since a task may have canceled itself
      if (task.period >= 0 && task.active) {
        task.time = task.time + task.period;
        insertByTime(task, tasks);
      }
    }
  }

  return tasks;
}

function insertByTime(task, timeslots) {
  // eslint-disable-line complexity
  var l = timeslots.length;

  if (l === 0) {
    timeslots.push(newTimeslot(task.time, [task]));
    return;
  }

  var i = binarySearch(task.time, timeslots);

  if (i >= l) {
    timeslots.push(newTimeslot(task.time, [task]));
  } else if (task.time === timeslots[i].time) {
    timeslots[i].events.push(task);
  } else {
    timeslots.splice(i, 0, newTimeslot(task.time, [task]));
  }
}

function removeAllFrom(f, timeslot) {
  timeslot.events = base.removeAll(f, timeslot.events);
}

function binarySearch(t, sortedArray) {
  // eslint-disable-line complexity
  var lo = 0;
  var hi = sortedArray.length;
  var mid, y;

  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2);
    y = sortedArray[mid];

    if (t === y.time) {
      return mid;
    } else if (t < y.time) {
      hi = mid;
    } else {
      lo = mid + 1;
    }
  }
  return hi;
}

function newTimeslot(t, events) {
  return { time: t, events: events };
}

/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Scheduler = __webpack_require__(88);

var _Scheduler2 = _interopRequireDefault(_Scheduler);

var _ClockTimer = __webpack_require__(86);

var _ClockTimer2 = _interopRequireDefault(_ClockTimer);

var _Timeline = __webpack_require__(89);

var _Timeline2 = _interopRequireDefault(_Timeline);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultScheduler = new _Scheduler2.default(new _ClockTimer2.default(), new _Timeline2.default()); /** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

exports.default = defaultScheduler;

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = LinkedList;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Doubly linked list
 * @constructor
 */
function LinkedList () {
  this.head = null
  this.length = 0
}

/**
 * Add a node to the end of the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to add
 */
LinkedList.prototype.add = function (x) {
  if (this.head !== null) {
    this.head.prev = x
    x.next = this.head
  }
  this.head = x;
  ++this.length
}

/**
 * Remove the provided node from the list
 * @param {{prev:Object|null, next:Object|null, dispose:function}} x node to remove
 */
LinkedList.prototype.remove = function (x) { // eslint-disable-line  complexity
  --this.length
  if (x === this.head) {
    this.head = this.head.next
  }
  if (x.next !== null) {
    x.next.prev = x.prev
    x.next = null
  }
  if (x.prev !== null) {
    x.prev.next = x.next
    x.prev = null
  }
}

/**
 * @returns {boolean} true iff there are no nodes in the list
 */
LinkedList.prototype.isEmpty = function () {
  return this.length === 0
}

/**
 * Dispose all nodes
 * @returns {Promise} promise that fulfills when all nodes have been disposed,
 *  or rejects if an error occurs while disposing
 */
LinkedList.prototype.dispose = function () {
  if (this.isEmpty()) {
    return Promise.resolve()
  }

  var promises = []
  var x = this.head
  this.head = null
  this.length = 0

  while (x !== null) {
    promises.push(x.dispose())
    x = x.next
  }

  return Promise.all(promises)
}


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = isPromise;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function isPromise (p) {
  return p !== null && typeof p === 'object' && typeof p.then === 'function'
}


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = Queue;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

// Based on https://github.com/petkaantonov/deque

function Queue (capPow2) {
  this._capacity = capPow2 || 32
  this._length = 0
  this._head = 0
}

Queue.prototype.push = function (x) {
  var len = this._length
  this._checkCapacity(len + 1)

  var i = (this._head + len) & (this._capacity - 1)
  this[i] = x
  this._length = len + 1
}

Queue.prototype.shift = function () {
  var head = this._head
  var x = this[head]

  this[head] = void 0
  this._head = (head + 1) & (this._capacity - 1)
  this._length--
  return x
}

Queue.prototype.isEmpty = function () {
  return this._length === 0
}

Queue.prototype.length = function () {
  return this._length
}

Queue.prototype._checkCapacity = function (size) {
  if (this._capacity < size) {
    this._ensureCapacity(this._capacity << 1)
  }
}

Queue.prototype._ensureCapacity = function (capacity) {
  var oldCapacity = this._capacity
  this._capacity = capacity

  var last = this._head + this._length

  if (last > oldCapacity) {
    copy(this, 0, this, oldCapacity, last & (oldCapacity - 1))
  }
}

function copy (src, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src[j + srcIndex]
    src[j + srcIndex] = void 0
  }
}


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__runSource__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = scan;
/* harmony export (immutable) */ exports["b"] = reduce;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @param {Stream} stream stream to scan
 * @returns {Stream} new stream containing successive reduce results
 */
function scan (f, initial, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Scan(f, initial, stream.source))
}

function Scan (f, z, source) {
  this.source = source
  this.f = f
  this.value = z
}

Scan.prototype.run = function (sink, scheduler) {
  var d1 = scheduler.asap(__WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__["a" /* default */].event(this.value, sink))
  var d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler)
  return __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__["d" /* all */]([d1, d2])
}

function ScanSink (f, z, sink) {
  this.f = f
  this.value = z
  this.sink = sink
}

ScanSink.prototype.event = function (t, x) {
  var f = this.f
  this.value = f(this.value, x)
  this.sink.event(t, this.value)
}

ScanSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error
ScanSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end

/**
* Reduce a stream to produce a single result.  Note that reducing an infinite
* stream will return a Promise that never fulfills, but that may reject if an error
* occurs.
* @param {function(result:*, x:*):*} f reducer function
* @param {*} initial initial value
* @param {Stream} stream to reduce
* @returns {Promise} promise for the file result of the reduce
*/
function reduce (f, initial, stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__runSource__["a" /* withDefaultScheduler */])(new Reduce(f, initial, stream.source))
}

function Reduce (f, z, source) {
  this.source = source
  this.f = f
  this.value = z
}

Reduce.prototype.run = function (sink, scheduler) {
  return this.source.run(new ReduceSink(this.f, this.value, sink), scheduler)
}

function ReduceSink (f, z, sink) {
  this.f = f
  this.value = z
  this.sink = sink
}

ReduceSink.prototype.event = function (t, x) {
  var f = this.f
  this.value = f(this.value, x)
  this.sink.event(t, this.value)
}

ReduceSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

ReduceSink.prototype.end = function (t) {
  this.sink.end(t, this.value)
}


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__combine__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__most_prelude__);
/* harmony export (immutable) */ exports["a"] = ap;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Assume fs is a stream containing functions, and apply the latest function
 * in fs to the latest value in xs.
 * fs:         --f---------g--------h------>
 * xs:         -a-------b-------c-------d-->
 * ap(fs, xs): --fa-----fb-gb---gc--hc--hd->
 * @param {Stream} fs stream of functions to apply to the latest x
 * @param {Stream} xs stream of values to which to apply all the latest f
 * @returns {Stream} stream containing all the applications of fs to xs
 */
function ap (fs, xs) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__combine__["a" /* combine */])(__WEBPACK_IMPORTED_MODULE_1__most_prelude__["apply"], fs, xs)
}


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__source_core__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__continueWith__ = __webpack_require__(43);
/* harmony export (immutable) */ exports["b"] = cons;
/* harmony export (immutable) */ exports["a"] = concat;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * @param {*} x value to prepend
 * @param {Stream} stream
 * @returns {Stream} new stream with x prepended
 */
function cons (x, stream) {
  return concat(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__source_core__["a" /* of */])(x), stream)
}

/**
* @param {Stream} left
* @param {Stream} right
* @returns {Stream} new stream containing all events in left followed by all
*  events in right.  This *timeshifts* right to the end of left.
*/
function concat (left, right) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__continueWith__["a" /* continueWith */])(function () {
    return right
  }, left)
}


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__ = __webpack_require__(20);
/* harmony export (immutable) */ exports["a"] = concatMap;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Map each value in stream to a new stream, and concatenate them all
 * stream:              -a---b---cX
 * f(a):                 1-1-1-1X
 * f(b):                        -2-2-2-2X
 * f(c):                                -3-3-3-3X
 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
 * @param {function(x:*):Stream} f function to map each value to a stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
function concatMap (f, stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__mergeConcurrently__["a" /* mergeMapConcurrently */])(f, 1, stream)
}


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = delay;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






/**
 * @param {Number} delayTime milliseconds to delay each item
 * @param {Stream} stream
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
function delay (delayTime, stream) {
  return delayTime <= 0 ? stream
    : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Delay(delayTime, stream.source))
}

function Delay (dt, source) {
  this.dt = dt
  this.source = source
}

Delay.prototype.run = function (sink, scheduler) {
  var delaySink = new DelaySink(this.dt, sink, scheduler)
  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["d" /* all */]([delaySink, this.source.run(delaySink, scheduler)])
}

function DelaySink (dt, sink, scheduler) {
  this.dt = dt
  this.sink = sink
  this.scheduler = scheduler
}

DelaySink.prototype.dispose = function () {
  var self = this
  this.scheduler.cancelAll(function (task) {
    return task.sink === self.sink
  })
}

DelaySink.prototype.event = function (t, x) {
  this.scheduler.delay(this.dt, __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__["a" /* default */].event(x, this.sink))
}

DelaySink.prototype.end = function (t, x) {
  this.scheduler.delay(this.dt, __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__["a" /* default */].end(x, this.sink))
}

DelaySink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_SafeSink__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__source_tryEvent__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = recoverWith;
/* harmony export (binding) */ __webpack_require__.d(exports, "b", function() { return flatMapError; });
/* harmony export (immutable) */ exports["c"] = throwError;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
function recoverWith (f, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new RecoverWith(f, stream.source))
}

var flatMapError = recoverWith

/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */
function throwError (e) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ErrorSource(e))
}

function ErrorSource (e) {
  this.value = e
}

ErrorSource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_4__scheduler_PropagateTask__["a" /* default */](runError, this.value, sink))
}

function runError (t, e, sink) {
  sink.error(t, e)
}

function RecoverWith (f, source) {
  this.f = f
  this.source = source
}

RecoverWith.prototype.run = function (sink, scheduler) {
  return new RecoverWithSink(this.f, this.source, sink, scheduler)
}

function RecoverWithSink (f, source, sink, scheduler) {
  this.f = f
  this.sink = new __WEBPACK_IMPORTED_MODULE_1__sink_SafeSink__["a" /* default */](sink)
  this.scheduler = scheduler
  this.disposable = source.run(this, scheduler)
}

RecoverWithSink.prototype.event = function (t, x) {
  __WEBPACK_IMPORTED_MODULE_3__source_tryEvent__["a" /* tryEvent */](t, x, this.sink)
}

RecoverWithSink.prototype.end = function (t, x) {
  __WEBPACK_IMPORTED_MODULE_3__source_tryEvent__["b" /* tryEnd */](t, x, this.sink)
}

RecoverWithSink.prototype.error = function (t, e) {
  var nextSink = this.sink.disable()

  __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["f" /* tryDispose */](t, this.disposable, this.sink)
  this._startNext(t, e, nextSink)
}

RecoverWithSink.prototype._startNext = function (t, x, sink) {
  try {
    this.disposable = this._continue(this.f, x, sink)
  } catch (e) {
    sink.error(t, e)
  }
}

RecoverWithSink.prototype._continue = function (f, x, sink) {
  var stream = f(x)
  return stream.source.run(sink, this.scheduler)
}

RecoverWithSink.prototype.dispose = function () {
  return this.disposable.dispose()
}


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fusion_Filter__ = __webpack_require__(45);
/* harmony export (immutable) */ exports["b"] = filter;
/* harmony export (immutable) */ exports["a"] = skipRepeats;
/* harmony export (immutable) */ exports["c"] = skipRepeatsWith;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Retain only items matching a predicate
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @param {Stream} stream stream to filter
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
function filter (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](__WEBPACK_IMPORTED_MODULE_2__fusion_Filter__["a" /* default */].create(p, stream.source))
}

/**
 * Skip repeated events, using === to detect duplicates
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeats (stream) {
  return skipRepeatsWith(same, stream)
}

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param {function(a:*, b:*):boolean} equals optional function to compare items
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
function skipRepeatsWith (equals, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new SkipRepeats(equals, stream.source))
}

function SkipRepeats (equals, source) {
  this.equals = equals
  this.source = source
}

SkipRepeats.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler)
}

function SkipRepeatsSink (equals, sink) {
  this.equals = equals
  this.sink = sink
  this.value = void 0
  this.init = true
}

SkipRepeatsSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SkipRepeatsSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

SkipRepeatsSink.prototype.event = function (t, x) {
  if (this.init) {
    this.init = false
    this.value = x
    this.sink.event(t, x)
  } else if (!this.equals(this.value, x)) {
    this.value = x
    this.sink.event(t, x)
  }
}

function same (a, b) {
  return a === b
}


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fusion_Map__ = __webpack_require__(22);
/* harmony export (immutable) */ exports["b"] = throttle;
/* harmony export (immutable) */ exports["a"] = debounce;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
function throttle (period, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](throttleSource(period, stream.source))
}

function throttleSource (period, source) {
  return source instanceof __WEBPACK_IMPORTED_MODULE_4__fusion_Map__["a" /* default */] ? commuteMapThrottle(period, source)
    : source instanceof Throttle ? fuseThrottle(period, source)
    : new Throttle(period, source)
}

function commuteMapThrottle (period, source) {
  return __WEBPACK_IMPORTED_MODULE_4__fusion_Map__["a" /* default */].create(source.f, throttleSource(period, source.source))
}

function fuseThrottle (period, source) {
  return new Throttle(Math.max(period, source.period), source.source)
}

function Throttle (period, source) {
  this.period = period
  this.source = source
}

Throttle.prototype.run = function (sink, scheduler) {
  return this.source.run(new ThrottleSink(this.period, sink), scheduler)
}

function ThrottleSink (period, sink) {
  this.time = 0
  this.period = period
  this.sink = sink
}

ThrottleSink.prototype.event = function (t, x) {
  if (t >= this.time) {
    this.time = t + this.period
    this.sink.event(t, x)
  }
}

ThrottleSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end

ThrottleSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param {Number} period events occuring more frequently than this
 *  will be suppressed
 * @param {Stream} stream stream to debounce
 * @returns {Stream} new debounced stream
 */
function debounce (period, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Debounce(period, stream.source))
}

function Debounce (dt, source) {
  this.dt = dt
  this.source = source
}

Debounce.prototype.run = function (sink, scheduler) {
  return new DebounceSink(this.dt, this.source, sink, scheduler)
}

function DebounceSink (dt, source, sink, scheduler) {
  this.dt = dt
  this.sink = sink
  this.scheduler = scheduler
  this.value = void 0
  this.timer = null

  var sourceDisposable = source.run(this, scheduler)
  this.disposable = __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["d" /* all */]([this, sourceDisposable])
}

DebounceSink.prototype.event = function (t, x) {
  this._clearTimer()
  this.value = x
  this.timer = this.scheduler.delay(this.dt, __WEBPACK_IMPORTED_MODULE_3__scheduler_PropagateTask__["a" /* default */].event(x, this.sink))
}

DebounceSink.prototype.end = function (t, x) {
  if (this._clearTimer()) {
    this.sink.event(t, this.value)
    this.value = void 0
  }
  this.sink.end(t, x)
}

DebounceSink.prototype.error = function (t, x) {
  this._clearTimer()
  this.sink.error(t, x)
}

DebounceSink.prototype.dispose = function () {
  this._clearTimer()
}

DebounceSink.prototype._clearTimer = function () {
  if (this.timer === null) {
    return false
  }
  this.timer.dispose()
  this.timer = null
  return true
}


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony export (immutable) */ exports["a"] = loop;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @param {Stream} stream event stream
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
function loop (stepper, seed, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Loop(stepper, seed, stream.source))
}

function Loop (stepper, seed, source) {
  this.step = stepper
  this.seed = seed
  this.source = source
}

Loop.prototype.run = function (sink, scheduler) {
  return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler)
}

function LoopSink (stepper, seed, sink) {
  this.step = stepper
  this.seed = seed
  this.sink = sink
}

LoopSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

LoopSink.prototype.event = function (t, x) {
  var result = this.step(this.seed, x)
  this.seed = result.seed
  this.sink.event(t, result.value)
}

LoopSink.prototype.end = function (t) {
  this.sink.end(t, this.seed)
}


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sink_IndexSink__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__source_core__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__most_prelude__);
/* harmony export (immutable) */ exports["b"] = merge;
/* harmony export (immutable) */ exports["a"] = mergeArray;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */








var copy = __WEBPACK_IMPORTED_MODULE_5__most_prelude__["copy"]
var reduce = __WEBPACK_IMPORTED_MODULE_5__most_prelude__["reduce"]

/**
 * @returns {Stream} stream containing events from all streams in the argument
 * list in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function merge (/* ...streams*/) {
  return mergeArray(copy(arguments))
}

/**
 * @param {Array} streams array of stream to merge
 * @returns {Stream} stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
function mergeArray (streams) {
  var l = streams.length
  return l === 0 ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__source_core__["b" /* empty */])()
    : l === 1 ? streams[0]
    : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](mergeSources(streams))
}

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
function mergeSources (streams) {
  return new Merge(reduce(appendSources, [], streams))
}

function appendSources (sources, stream) {
  var source = stream.source
  return source instanceof Merge
    ? sources.concat(source.sources)
    : sources.concat(source)
}

function Merge (sources) {
  this.sources = sources
}

Merge.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l)
  var sinks = new Array(l)

  var mergeSink = new MergeSink(disposables, sinks, sink)

  for (var indexSink, i = 0; i < l; ++i) {
    indexSink = sinks[i] = new __WEBPACK_IMPORTED_MODULE_2__sink_IndexSink__["a" /* default */](i, mergeSink)
    disposables[i] = this.sources[i].run(indexSink, scheduler)
  }

  return __WEBPACK_IMPORTED_MODULE_4__disposable_dispose__["d" /* all */](disposables)
}

function MergeSink (disposables, sinks, sink) {
  this.sink = sink
  this.disposables = disposables
  this.activeCount = sinks.length
}

MergeSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

MergeSink.prototype.event = function (t, indexValue) {
  this.sink.event(t, indexValue.value)
}

MergeSink.prototype.end = function (t, indexedValue) {
  __WEBPACK_IMPORTED_MODULE_4__disposable_dispose__["f" /* tryDispose */](t, this.disposables[indexedValue.index], this.sink)
  if (--this.activeCount === 0) {
    this.sink.end(t, indexedValue.value)
  }
}


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__runSource__ = __webpack_require__(47);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__(13);
/* harmony export (immutable) */ exports["b"] = observe;
/* harmony export (immutable) */ exports["a"] = drain;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Observe all the event values in the stream in time order. The
 * provided function `f` will be called for each event value
 * @param {function(x:T):*} f function to call with each event value
 * @param {Stream<T>} stream stream to observe
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function observe (f, stream) {
  return drain(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__transform__["a" /* tap */])(f, stream))
}

/**
 * "Run" a stream by creating demand and consuming all events
 * @param {Stream<T>} stream stream to drain
 * @return {Promise} promise that fulfills after the stream ends without
 *  an error, or rejects if the stream ends with an error.
 */
function drain (stream) {
  return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__runSource__["a" /* withDefaultScheduler */])(stream.source)
}


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fatalError__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(6);
/* harmony export (immutable) */ exports["a"] = fromPromise;
/* harmony export (immutable) */ exports["b"] = awaitPromises;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param {Promise<T>} p promise
 * @return {Stream<T>} stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */
function fromPromise (p) {
  return awaitPromises(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__source_core__["a" /* of */])(p))
}

/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved.
 * @param {Stream<Promise<T>>} stream
 * @return {Stream<T>} stream of fulfillment values.  The stream will
 * error if any promise rejects.
 */
function awaitPromises (stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Await(stream.source))
}

function Await (source) {
  this.source = source
}

Await.prototype.run = function (sink, scheduler) {
  return this.source.run(new AwaitSink(sink, scheduler), scheduler)
}

function AwaitSink (sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
  this.queue = Promise.resolve()
  var self = this

	// Pre-create closures, to avoid creating them per event
  this._eventBound = function (x) {
    self.sink.event(self.scheduler.now(), x)
  }

  this._endBound = function (x) {
    self.sink.end(self.scheduler.now(), x)
  }

  this._errorBound = function (e) {
    self.sink.error(self.scheduler.now(), e)
  }
}

AwaitSink.prototype.event = function (t, promise) {
  var self = this
  this.queue = this.queue.then(function () {
    return self._event(promise)
  }).catch(this._errorBound)
}

AwaitSink.prototype.end = function (t, x) {
  var self = this
  this.queue = this.queue.then(function () {
    return self._end(x)
  }).catch(this._errorBound)
}

AwaitSink.prototype.error = function (t, e) {
  var self = this
  // Don't resolve error values, propagate directly
  this.queue = this.queue.then(function () {
    return self._errorBound(e)
  }).catch(__WEBPACK_IMPORTED_MODULE_1__fatalError__["a" /* default */])
}

AwaitSink.prototype._event = function (promise) {
  return promise.then(this._eventBound)
}

AwaitSink.prototype._end = function (x) {
  return Promise.resolve(x).then(this._endBound)
}


/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__most_prelude__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__invoke__ = __webpack_require__(23);
/* harmony export (immutable) */ exports["c"] = sample;
/* harmony export (immutable) */ exports["a"] = sampleWith;
/* harmony export (immutable) */ exports["b"] = sampleArray;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * When an event arrives on sampler, emit the result of calling f with the latest
 * values of all streams being sampled
 * @param {function(...values):*} f function to apply to each set of sampled values
 * @param {Stream} sampler streams will be sampled whenever an event arrives
 *  on sampler
 * @returns {Stream} stream of sampled and transformed values
 */
function sample (f, sampler /*, ...streams */) {
  return sampleArray(f, sampler, __WEBPACK_IMPORTED_MODULE_3__most_prelude__["drop"](2, arguments))
}

/**
 * When an event arrives on sampler, emit the latest event value from stream.
 * @param {Stream} sampler stream of events at whose arrival time
 *  stream's latest value will be propagated
 * @param {Stream} stream stream of values
 * @returns {Stream} sampled stream of values
 */
function sampleWith (sampler, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Sampler(__WEBPACK_IMPORTED_MODULE_3__most_prelude__["id"], sampler.source, [stream.source]))
}

function sampleArray (f, sampler, streams) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Sampler(f, sampler.source, __WEBPACK_IMPORTED_MODULE_3__most_prelude__["map"](getSource, streams)))
}

function getSource (stream) {
  return stream.source
}

function Sampler (f, sampler, sources) {
  this.f = f
  this.sampler = sampler
  this.sources = sources
}

Sampler.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l + 1)
  var sinks = new Array(l)

  var sampleSink = new SampleSink(this.f, sinks, sink)

  for (var hold, i = 0; i < l; ++i) {
    hold = sinks[i] = new Hold(sampleSink)
    disposables[i] = this.sources[i].run(hold, scheduler)
  }

  disposables[i] = this.sampler.run(sampleSink, scheduler)

  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["d" /* all */](disposables)
}

function Hold (sink) {
  this.sink = sink
  this.hasValue = false
}

Hold.prototype.event = function (t, x) {
  this.value = x
  this.hasValue = true
  this.sink._notify(this)
}

Hold.prototype.end = function () {}
Hold.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

function SampleSink (f, sinks, sink) {
  this.f = f
  this.sinks = sinks
  this.sink = sink
  this.active = false
}

SampleSink.prototype._notify = function () {
  if (!this.active) {
    this.active = this.sinks.every(hasValue)
  }
}

SampleSink.prototype.event = function (t) {
  if (this.active) {
    this.sink.event(t, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__invoke__["a" /* default */])(this.f, __WEBPACK_IMPORTED_MODULE_3__most_prelude__["map"](getValue, this.sinks)))
  }
}

SampleSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SampleSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

function hasValue (hold) {
  return hold.hasValue
}

function getValue (hold) {
  return hold.value
}


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__fusion_Map__ = __webpack_require__(22);
/* harmony export (immutable) */ exports["c"] = take;
/* harmony export (immutable) */ exports["b"] = skip;
/* harmony export (immutable) */ exports["a"] = slice;
/* harmony export (immutable) */ exports["e"] = takeWhile;
/* harmony export (immutable) */ exports["d"] = skipWhile;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */







/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream containing only up to the first n items from stream
 */
function take (n, stream) {
  return slice(0, n, stream)
}

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream with the first n items removed
 */
function skip (n, stream) {
  return slice(n, Infinity, stream)
}

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param {number} start
 * @param {number} end
 * @param {Stream} stream
 * @returns {Stream} stream containing items where start <= index < end
 */
function slice (start, end, stream) {
  return end <= start ? __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]()
    : new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](sliceSource(start, end, stream.source))
}

function sliceSource (start, end, source) {
  return source instanceof __WEBPACK_IMPORTED_MODULE_4__fusion_Map__["a" /* default */] ? commuteMapSlice(start, end, source)
    : source instanceof Slice ? fuseSlice(start, end, source)
    : new Slice(start, end, source)
}

function commuteMapSlice (start, end, source) {
  return __WEBPACK_IMPORTED_MODULE_4__fusion_Map__["a" /* default */].create(source.f, sliceSource(start, end, source.source))
}

function fuseSlice (start, end, source) {
  start += source.min
  end = Math.min(end + source.min, source.max)
  return new Slice(start, end, source.source)
}

function Slice (min, max, source) {
  this.source = source
  this.min = min
  this.max = max
}

Slice.prototype.run = function (sink, scheduler) {
  return new SliceSink(this.min, this.max - this.min, this.source, sink, scheduler)
}

function SliceSink (skip, take, source, sink, scheduler) {
  this.sink = sink
  this.skip = skip
  this.take = take
  this.disposable = __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__["e" /* once */](source.run(this, scheduler))
}

SliceSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SliceSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

SliceSink.prototype.event = function (t, x) { // eslint-disable-line complexity
  if (this.skip > 0) {
    this.skip -= 1
    return
  }

  if (this.take === 0) {
    return
  }

  this.take -= 1
  this.sink.event(t, x)
  if (this.take === 0) {
    this.dispose()
    this.sink.end(t, x)
  }
}

SliceSink.prototype.dispose = function () {
  return this.disposable.dispose()
}

function takeWhile (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new TakeWhile(p, stream.source))
}

function TakeWhile (p, source) {
  this.p = p
  this.source = source
}

TakeWhile.prototype.run = function (sink, scheduler) {
  return new TakeWhileSink(this.p, this.source, sink, scheduler)
}

function TakeWhileSink (p, source, sink, scheduler) {
  this.p = p
  this.sink = sink
  this.active = true
  this.disposable = __WEBPACK_IMPORTED_MODULE_3__disposable_dispose__["e" /* once */](source.run(this, scheduler))
}

TakeWhileSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
TakeWhileSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

TakeWhileSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }

  var p = this.p
  this.active = p(x)
  if (this.active) {
    this.sink.event(t, x)
  } else {
    this.dispose()
    this.sink.end(t, x)
  }
}

TakeWhileSink.prototype.dispose = function () {
  return this.disposable.dispose()
}

function skipWhile (p, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new SkipWhile(p, stream.source))
}

function SkipWhile (p, source) {
  this.p = p
  this.source = source
}

SkipWhile.prototype.run = function (sink, scheduler) {
  return this.source.run(new SkipWhileSink(this.p, sink), scheduler)
}

function SkipWhileSink (p, sink) {
  this.p = p
  this.sink = sink
  this.skipping = true
}

SkipWhileSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
SkipWhileSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

SkipWhileSink.prototype.event = function (t, x) {
  if (this.skipping) {
    var p = this.p
    this.skipping = p(x)
    if (this.skipping) {
      return
    }
  }

  this.sink.event(t, x)
}


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["a"] = switchLatest;
/* unused harmony export switch */
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
function switchLatest (stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Switch(stream.source))
}



function Switch (source) {
  this.source = source
}

Switch.prototype.run = function (sink, scheduler) {
  var switchSink = new SwitchSink(sink, scheduler)
  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["d" /* all */]([switchSink, this.source.run(switchSink, scheduler)])
}

function SwitchSink (sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
  this.current = null
  this.ended = false
}

SwitchSink.prototype.event = function (t, stream) {
  this._disposeCurrent(t) // TODO: capture the result of this dispose
  this.current = new Segment(t, Infinity, this, this.sink)
  this.current.disposable = stream.source.run(this.current, this.scheduler)
}

SwitchSink.prototype.end = function (t, x) {
  this.ended = true
  this._checkEnd(t, x)
}

SwitchSink.prototype.error = function (t, e) {
  this.ended = true
  this.sink.error(t, e)
}

SwitchSink.prototype.dispose = function () {
  return this._disposeCurrent(this.scheduler.now())
}

SwitchSink.prototype._disposeCurrent = function (t) {
  if (this.current !== null) {
    return this.current._dispose(t)
  }
}

SwitchSink.prototype._disposeInner = function (t, inner) {
  inner._dispose(t) // TODO: capture the result of this dispose
  if (inner === this.current) {
    this.current = null
  }
}

SwitchSink.prototype._checkEnd = function (t, x) {
  if (this.ended && this.current === null) {
    this.sink.end(t, x)
  }
}

SwitchSink.prototype._endInner = function (t, x, inner) {
  this._disposeInner(t, inner)
  this._checkEnd(t, x)
}

SwitchSink.prototype._errorInner = function (t, e, inner) {
  this._disposeInner(t, inner)
  this.sink.error(t, e)
}

function Segment (min, max, outer, sink) {
  this.min = min
  this.max = max
  this.outer = outer
  this.sink = sink
  this.disposable = __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["b" /* empty */]()
}

Segment.prototype.event = function (t, x) {
  if (t < this.max) {
    this.sink.event(Math.max(t, this.min), x)
  }
}

Segment.prototype.end = function (t, x) {
  this.outer._endInner(Math.max(t, this.min), x, this)
}

Segment.prototype.error = function (t, e) {
  this.outer._errorInner(Math.max(t, this.min), e, this)
}

Segment.prototype._dispose = function (t) {
  this.max = t
  __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["f" /* tryDispose */](t, this.disposable, this.sink)
}


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = thru;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function thru (f, stream) {
  return f(stream)
}


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__combinator_flatMap__ = __webpack_require__(44);
/* harmony export (immutable) */ exports["a"] = takeUntil;
/* harmony export (immutable) */ exports["b"] = skipUntil;
/* harmony export (immutable) */ exports["c"] = during;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */






function takeUntil (signal, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Until(signal.source, stream.source))
}

function skipUntil (signal, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Since(signal.source, stream.source))
}

function during (timeWindow, stream) {
  return takeUntil(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__combinator_flatMap__["b" /* join */])(timeWindow), skipUntil(timeWindow, stream))
}

function Until (maxSignal, source) {
  this.maxSignal = maxSignal
  this.source = source
}

Until.prototype.run = function (sink, scheduler) {
  var min = new Bound(-Infinity, sink)
  var max = new UpperBound(this.maxSignal, sink, scheduler)
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler)

  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["d" /* all */]([min, max, disposable])
}

function Since (minSignal, source) {
  this.minSignal = minSignal
  this.source = source
}

Since.prototype.run = function (sink, scheduler) {
  var min = new LowerBound(this.minSignal, sink, scheduler)
  var max = new Bound(Infinity, sink)
  var disposable = this.source.run(new TimeWindowSink(min, max, sink), scheduler)

  return __WEBPACK_IMPORTED_MODULE_2__disposable_dispose__["d" /* all */]([min, max, disposable])
}

function Bound (value, sink) {
  this.value = value
  this.sink = sink
}

Bound.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error
Bound.prototype.event = noop
Bound.prototype.end = noop
Bound.prototype.dispose = noop

function TimeWindowSink (min, max, sink) {
  this.min = min
  this.max = max
  this.sink = sink
}

TimeWindowSink.prototype.event = function (t, x) {
  if (t >= this.min.value && t < this.max.value) {
    this.sink.event(t, x)
  }
}

TimeWindowSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error
TimeWindowSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end

function LowerBound (signal, sink, scheduler) {
  this.value = Infinity
  this.sink = sink
  this.disposable = signal.run(this, scheduler)
}

LowerBound.prototype.event = function (t /*, x */) {
  if (t < this.value) {
    this.value = t
  }
}

LowerBound.prototype.end = noop
LowerBound.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

LowerBound.prototype.dispose = function () {
  return this.disposable.dispose()
}

function UpperBound (signal, sink, scheduler) {
  this.value = Infinity
  this.sink = sink
  this.disposable = signal.run(this, scheduler)
}

UpperBound.prototype.event = function (t, x) {
  if (t < this.value) {
    this.value = t
    this.sink.end(t, x)
  }
}

UpperBound.prototype.end = noop
UpperBound.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

UpperBound.prototype.dispose = function () {
  return this.disposable.dispose()
}

function noop () {}


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__ = __webpack_require__(2);
/* harmony export (immutable) */ exports["a"] = timestamp;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function timestamp (stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Timestamp(stream.source))
}

function Timestamp (source) {
  this.source = source
}

Timestamp.prototype.run = function (sink, scheduler) {
  return this.source.run(new TimestampSink(sink), scheduler)
}

function TimestampSink (sink) {
  this.sink = sink
}

TimestampSink.prototype.end = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.end
TimestampSink.prototype.error = __WEBPACK_IMPORTED_MODULE_1__sink_Pipe__["a" /* default */].prototype.error

TimestampSink.prototype.event = function (t, x) {
  this.sink.event(t, { time: t, value: x })
}


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["a"] = transduce;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Transform a stream by passing its events through a transducer.
 * @param  {function} transducer transducer function
 * @param  {Stream} stream stream whose events will be passed through the
 *  transducer
 * @return {Stream} stream of events transformed by the transducer
 */
function transduce (transducer, stream) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Transduce(transducer, stream.source))
}

function Transduce (transducer, source) {
  this.transducer = transducer
  this.source = source
}

Transduce.prototype.run = function (sink, scheduler) {
  var xf = this.transducer(new Transformer(sink))
  return this.source.run(new TransduceSink(getTxHandler(xf), sink), scheduler)
}

function TransduceSink (adapter, sink) {
  this.xf = adapter
  this.sink = sink
}

TransduceSink.prototype.event = function (t, x) {
  var next = this.xf.step(t, x)

  return this.xf.isReduced(next)
    ? this.sink.end(t, this.xf.getResult(next))
    : next
}

TransduceSink.prototype.end = function (t, x) {
  return this.xf.result(x)
}

TransduceSink.prototype.error = function (t, e) {
  return this.sink.error(t, e)
}

function Transformer (sink) {
  this.time = -Infinity
  this.sink = sink
}

Transformer.prototype['@@transducer/init'] = Transformer.prototype.init = function () {}

Transformer.prototype['@@transducer/step'] = Transformer.prototype.step = function (t, x) {
  if (!isNaN(t)) {
    this.time = Math.max(t, this.time)
  }
  return this.sink.event(this.time, x)
}

Transformer.prototype['@@transducer/result'] = Transformer.prototype.result = function (x) {
  return this.sink.end(this.time, x)
}

/**
* Given an object supporting the new or legacy transducer protocol,
* create an adapter for it.
* @param {object} tx transform
* @returns {TxAdapter|LegacyTxAdapter}
*/
function getTxHandler (tx) {
  return typeof tx['@@transducer/step'] === 'function'
    ? new TxAdapter(tx)
    : new LegacyTxAdapter(tx)
}

/**
* Adapter for new official transducer protocol
* @param {object} tx transform
* @constructor
*/
function TxAdapter (tx) {
  this.tx = tx
}

TxAdapter.prototype.step = function (t, x) {
  return this.tx['@@transducer/step'](t, x)
}
TxAdapter.prototype.result = function (x) {
  return this.tx['@@transducer/result'](x)
}
TxAdapter.prototype.isReduced = function (x) {
  return x != null && x['@@transducer/reduced']
}
TxAdapter.prototype.getResult = function (x) {
  return x['@@transducer/value']
}

/**
* Adapter for older transducer protocol
* @param {object} tx transform
* @constructor
*/
function LegacyTxAdapter (tx) {
  this.tx = tx
}

LegacyTxAdapter.prototype.step = function (t, x) {
  return this.tx.step(t, x)
}
LegacyTxAdapter.prototype.result = function (x) {
  return this.tx.result(x)
}
LegacyTxAdapter.prototype.isReduced = function (x) {
  return x != null && x.__transducers_reduced__
}
LegacyTxAdapter.prototype.getResult = function (x) {
  return x.value
}


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__transform__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__source_core__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__most_prelude__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__invoke__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Queue__ = __webpack_require__(93);
/* harmony export (immutable) */ exports["a"] = zip;
/* harmony export (immutable) */ exports["b"] = zipArray;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */











var map = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["map"]
var tail = __WEBPACK_IMPORTED_MODULE_6__most_prelude__["tail"]

/**
 * Combine streams pairwise (or tuple-wise) by index by applying f to values
 * at corresponding indices.  The returned stream ends when any of the input
 * streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */
function zip (f /*, ...streams */) {
  return zipArray(f, tail(arguments))
}

/**
* Combine streams pairwise (or tuple-wise) by index by applying f to values
* at corresponding indices.  The returned stream ends when any of the input
* streams ends.
* @param {function} f function to combine values
* @param {[Stream]} streams streams to zip using f
* @returns {Stream} new stream with items at corresponding indices combined
*  using f
*/
function zipArray (f, streams) {
  return streams.length === 0 ? __WEBPACK_IMPORTED_MODULE_2__source_core__["b" /* empty */]()
: streams.length === 1 ? __WEBPACK_IMPORTED_MODULE_1__transform__["b" /* map */](f, streams[0])
: new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Zip(f, map(getSource, streams)))
}

function getSource (stream) {
  return stream.source
}

function Zip (f, sources) {
  this.f = f
  this.sources = sources
}

Zip.prototype.run = function (sink, scheduler) {
  var l = this.sources.length
  var disposables = new Array(l)
  var sinks = new Array(l)
  var buffers = new Array(l)

  var zipSink = new ZipSink(this.f, buffers, sinks, sink)

  for (var indexSink, i = 0; i < l; ++i) {
    buffers[i] = new __WEBPACK_IMPORTED_MODULE_8__Queue__["a" /* default */]()
    indexSink = sinks[i] = new __WEBPACK_IMPORTED_MODULE_4__sink_IndexSink__["a" /* default */](i, zipSink)
    disposables[i] = this.sources[i].run(indexSink, scheduler)
  }

  return __WEBPACK_IMPORTED_MODULE_5__disposable_dispose__["d" /* all */](disposables)
}

function ZipSink (f, buffers, sinks, sink) {
  this.f = f
  this.sinks = sinks
  this.sink = sink
  this.buffers = buffers
}

ZipSink.prototype.event = function (t, indexedValue) { // eslint-disable-line complexity
  var buffers = this.buffers
  var buffer = buffers[indexedValue.index]

  buffer.push(indexedValue.value)

  if (buffer.length() === 1) {
    if (!ready(this.buffers)) {
      return
    }

    emitZipped(this.f, t, buffers, this.sink)

    if (ended(this.buffers, this.sinks)) {
      this.sink.end(t, void 0)
    }
  }
}

ZipSink.prototype.end = function (t, indexedValue) {
  var buffer = this.buffers[indexedValue.index]
  if (buffer.isEmpty()) {
    this.sink.end(t, indexedValue.value)
  }
}

ZipSink.prototype.error = __WEBPACK_IMPORTED_MODULE_3__sink_Pipe__["a" /* default */].prototype.error

function emitZipped (f, t, buffers, sink) {
  sink.event(t, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_7__invoke__["a" /* default */])(f, map(head, buffers)))
}

function head (buffer) {
  return buffer.shift()
}

function ended (buffers, sinks) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true
    }
  }
  return false
}

function ready (buffers) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false
    }
  }
  return true
}


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = Disposable;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a new Disposable which will dispose its underlying resource.
 * @param {function} dispose function
 * @param {*?} data any data to be passed to disposer function
 * @constructor
 */
function Disposable (dispose, data) {
  this._dispose = dispose
  this._data = data
}

Disposable.prototype.dispose = function () {
  return this._dispose(this._data)
}


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = SettableDisposable;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SettableDisposable () {
  this.disposable = void 0
  this.disposed = false
  this._resolve = void 0

  var self = this
  this.result = new Promise(function (resolve) {
    self._resolve = resolve
  })
}

SettableDisposable.prototype.setDisposable = function (disposable) {
  if (this.disposable !== void 0) {
    throw new Error('setDisposable called more than once')
  }

  this.disposable = disposable

  if (this.disposed) {
    this._resolve(disposable.dispose())
  }
}

SettableDisposable.prototype.dispose = function () {
  if (this.disposed) {
    return this.result
  }

  this.disposed = true

  if (this.disposable !== void 0) {
    this.result = this.disposable.dispose()
  }

  return this.result
}


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__ = __webpack_require__(2);
/* harmony export (immutable) */ exports["a"] = FilterMap;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function FilterMap (p, f, source) {
  this.p = p
  this.f = f
  this.source = source
}

FilterMap.prototype.run = function (sink, scheduler) {
  return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler)
}

function FilterMapSink (p, f, sink) {
  this.p = p
  this.f = f
  this.sink = sink
}

FilterMapSink.prototype.event = function (t, x) {
  var f = this.f
  var p = this.p
  p(x) && this.sink.event(t, f(x))
}

FilterMapSink.prototype.end = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.end
FilterMapSink.prototype.error = __WEBPACK_IMPORTED_MODULE_0__sink_Pipe__["a" /* default */].prototype.error


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony export (immutable) */ exports["a"] = fromObservable;
/* unused harmony export ObservableSource */
/* unused harmony export SubscriberSink */
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function fromObservable (observable) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ObservableSource(observable))
}

function ObservableSource (observable) {
  this.observable = observable
}

ObservableSource.prototype.run = function (sink, scheduler) {
  var sub = this.observable.subscribe(new SubscriberSink(sink, scheduler))
  if (typeof sub === 'function') {
    return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* create */](sub)
  } else if (sub && typeof sub.unsubscribe === 'function') {
    return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* create */](unsubscribe, sub)
  }

  throw new TypeError('Observable returned invalid subscription ' + String(sub))
}

function SubscriberSink (sink, scheduler) {
  this.sink = sink
  this.scheduler = scheduler
}

SubscriberSink.prototype.next = function (x) {
  this.sink.event(this.scheduler.now(), x)
}

SubscriberSink.prototype.complete = function (x) {
  this.sink.end(this.scheduler.now(), x)
}

SubscriberSink.prototype.error = function (e) {
  this.sink.error(this.scheduler.now(), e)
}

function unsubscribe (subscription) {
  return subscription.unsubscribe()
}


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_symbol_observable__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_symbol_observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_symbol_observable__);
/* harmony export (immutable) */ exports["a"] = getObservable;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function getObservable (o) { // eslint-disable-line complexity
  var obs = null
  if (o) {
  // Access foreign method only once
    var method = o[__WEBPACK_IMPORTED_MODULE_0_symbol_observable___default.a]
    if (typeof method === 'function') {
      obs = method.call(o)
      if (!(obs && typeof obs.subscribe === 'function')) {
        throw new TypeError('invalid observable ' + obs)
      }
    }
  }

  return obs
}


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scheduler_defaultScheduler__ = __webpack_require__(48);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fatalError__ = __webpack_require__(21);
/* harmony export (immutable) */ exports["a"] = subscribe;
/* unused harmony export SubscribeObserver */
/* unused harmony export Subscription */
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function subscribe (subscriber, stream) {
  if (subscriber == null || typeof subscriber !== 'object') {
    throw new TypeError('subscriber must be an object')
  }

  var disposable = __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["c" /* settable */]()
  var observer = new SubscribeObserver(__WEBPACK_IMPORTED_MODULE_2__fatalError__["a" /* default */], subscriber, disposable)

  disposable.setDisposable(stream.source.run(observer, __WEBPACK_IMPORTED_MODULE_0__scheduler_defaultScheduler__["a" /* default */]))

  return new Subscription(disposable)
}

function SubscribeObserver (fatalError, subscriber, disposable) {
  this.fatalError = fatalError
  this.subscriber = subscriber
  this.disposable = disposable
}

SubscribeObserver.prototype.event = function (t, x) {
  if (typeof this.subscriber.next === 'function') {
    this.subscriber.next(x)
  }
}

SubscribeObserver.prototype.end = function (t, x) {
  var s = this.subscriber
  doDispose(this.fatalError, s, s.complete, s.error, this.disposable, x)
}

SubscribeObserver.prototype.error = function (t, e) {
  var s = this.subscriber
  doDispose(this.fatalError, s, s.error, s.error, this.disposable, e)
}

function Subscription (disposable) {
  this.disposable = disposable
}

Subscription.prototype.unsubscribe = function () {
  this.disposable.dispose()
}

function doDispose (fatal, subscriber, complete, error, disposable, x) {
  Promise.resolve(disposable.dispose()).then(function () {
    if (typeof complete === 'function') {
      complete.call(subscriber, x)
    }
  }).catch(function (e) {
    if (typeof error === 'function') {
      error.call(subscriber, e)
    }
  }).catch(fatal)
}


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task__ = __webpack_require__(26);
/* harmony export (immutable) */ exports["a"] = ClockTimer;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/*global setTimeout, clearTimeout*/

function ClockTimer () {}

ClockTimer.prototype.now = Date.now

ClockTimer.prototype.setTimer = function (f, dt) {
  return dt <= 0 ? runAsap(f) : setTimeout(f, dt)
}

ClockTimer.prototype.clearTimer = function (t) {
  return t instanceof Asap ? t.cancel() : clearTimeout(t)
}

function Asap (f) {
  this.f = f
  this.active = true
}

Asap.prototype.run = function () {
  return this.active && this.f()
}

Asap.prototype.error = function (e) {
  throw e
}

Asap.prototype.cancel = function () {
  this.active = false
}

function runAsap (f) {
  var task = new Asap(f)
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__task__["b" /* defer */])(task)
  return task
}


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = ScheduledTask;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function ScheduledTask (delay, period, task, scheduler) {
  this.time = delay
  this.period = period
  this.task = task
  this.scheduler = scheduler
  this.active = true
}

ScheduledTask.prototype.run = function () {
  return this.task.run(this.time)
}

ScheduledTask.prototype.error = function (e) {
  return this.task.error(this.time, e)
}

ScheduledTask.prototype.dispose = function () {
  this.scheduler.cancel(this)
  return this.task.dispose()
}


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__ScheduledTask__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__task__ = __webpack_require__(26);
/* harmony export (immutable) */ exports["a"] = Scheduler;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function Scheduler (timer, timeline) {
  this.timer = timer
  this.timeline = timeline

  this._timer = null
  this._nextArrival = Infinity

  var self = this
  this._runReadyTasksBound = function () {
    self._runReadyTasks(self.now())
  }
}

Scheduler.prototype.now = function () {
  return this.timer.now()
}

Scheduler.prototype.asap = function (task) {
  return this.schedule(0, -1, task)
}

Scheduler.prototype.delay = function (delay, task) {
  return this.schedule(delay, -1, task)
}

Scheduler.prototype.periodic = function (period, task) {
  return this.schedule(0, period, task)
}

Scheduler.prototype.schedule = function (delay, period, task) {
  var now = this.now()
  var st = new __WEBPACK_IMPORTED_MODULE_0__ScheduledTask__["a" /* default */](now + Math.max(0, delay), period, task, this)

  this.timeline.add(st)
  this._scheduleNextRun(now)
  return st
}

Scheduler.prototype.cancel = function (task) {
  task.active = false
  if (this.timeline.remove(task)) {
    this._reschedule()
  }
}

Scheduler.prototype.cancelAll = function (f) {
  this.timeline.removeAll(f)
  this._reschedule()
}

Scheduler.prototype._reschedule = function () {
  if (this.timeline.isEmpty()) {
    this._unschedule()
  } else {
    this._scheduleNextRun(this.now())
  }
}

Scheduler.prototype._unschedule = function () {
  this.timer.clearTimer(this._timer)
  this._timer = null
}

Scheduler.prototype._scheduleNextRun = function (now) { // eslint-disable-line complexity
  if (this.timeline.isEmpty()) {
    return
  }

  var nextArrival = this.timeline.nextArrival()

  if (this._timer === null) {
    this._scheduleNextArrival(nextArrival, now)
  } else if (nextArrival < this._nextArrival) {
    this._unschedule()
    this._scheduleNextArrival(nextArrival, now)
  }
}

Scheduler.prototype._scheduleNextArrival = function (nextArrival, now) {
  this._nextArrival = nextArrival
  var delay = Math.max(0, nextArrival - now)
  this._timer = this.timer.setTimer(this._runReadyTasksBound, delay)
}

Scheduler.prototype._runReadyTasks = function (now) {
  this._timer = null
  this.timeline.runTasks(now, __WEBPACK_IMPORTED_MODULE_1__task__["a" /* runTask */])
  this._scheduleNextRun(this.now())
}


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__most_prelude__);
/* harmony export (immutable) */ exports["a"] = Timeline;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function Timeline () {
  this.tasks = []
}

Timeline.prototype.nextArrival = function () {
  return this.isEmpty() ? Infinity : this.tasks[0].time
}

Timeline.prototype.isEmpty = function () {
  return this.tasks.length === 0
}

Timeline.prototype.add = function (st) {
  insertByTime(st, this.tasks)
}

Timeline.prototype.remove = function (st) {
  var i = binarySearch(st.time, this.tasks)

  if (i >= 0 && i < this.tasks.length) {
    var at = __WEBPACK_IMPORTED_MODULE_0__most_prelude__["findIndex"](st, this.tasks[i].events)
    if (at >= 0) {
      this.tasks[i].events.splice(at, 1)
      return true
    }
  }

  return false
}

Timeline.prototype.removeAll = function (f) {
  for (var i = 0, l = this.tasks.length; i < l; ++i) {
    removeAllFrom(f, this.tasks[i])
  }
}

Timeline.prototype.runTasks = function (t, runTask) {
  var tasks = this.tasks
  var l = tasks.length
  var i = 0

  while (i < l && tasks[i].time <= t) {
    ++i
  }

  this.tasks = tasks.slice(i)

  // Run all ready tasks
  for (var j = 0; j < i; ++j) {
    this.tasks = runTasks(runTask, tasks[j], this.tasks)
  }
}

function runTasks (runTask, timeslot, tasks) { // eslint-disable-line complexity
  var events = timeslot.events
  for (var i = 0; i < events.length; ++i) {
    var task = events[i]

    if (task.active) {
      runTask(task)

      // Reschedule periodic repeating tasks
      // Check active again, since a task may have canceled itself
      if (task.period >= 0 && task.active) {
        task.time = task.time + task.period
        insertByTime(task, tasks)
      }
    }
  }

  return tasks
}

function insertByTime (task, timeslots) { // eslint-disable-line complexity
  var l = timeslots.length

  if (l === 0) {
    timeslots.push(newTimeslot(task.time, [task]))
    return
  }

  var i = binarySearch(task.time, timeslots)

  if (i >= l) {
    timeslots.push(newTimeslot(task.time, [task]))
  } else if (task.time === timeslots[i].time) {
    timeslots[i].events.push(task)
  } else {
    timeslots.splice(i, 0, newTimeslot(task.time, [task]))
  }
}

function removeAllFrom (f, timeslot) {
  timeslot.events = __WEBPACK_IMPORTED_MODULE_0__most_prelude__["removeAll"](f, timeslot.events)
}

function binarySearch (t, sortedArray) { // eslint-disable-line complexity
  var lo = 0
  var hi = sortedArray.length
  var mid, y

  while (lo < hi) {
    mid = Math.floor((lo + hi) / 2)
    y = sortedArray[mid]

    if (t === y.time) {
      return mid
    } else if (t < y.time) {
      hi = mid
    } else {
      lo = mid + 1
    }
  }
  return hi
}

function newTimeslot (t, events) {
  return { time: t, events: events }
}


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__task__ = __webpack_require__(26);
/* harmony export (immutable) */ exports["a"] = DeferredSink;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



function DeferredSink (sink) {
  this.sink = sink
  this.events = []
  this.active = true
}

DeferredSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }

  if (this.events.length === 0) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__task__["b" /* defer */])(new PropagateAllTask(this.sink, t, this.events))
  }

  this.events.push({ time: t, value: x })
}

DeferredSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }

  this._end(new EndTask(t, x, this.sink))
}

DeferredSink.prototype.error = function (t, e) {
  this._end(new ErrorTask(t, e, this.sink))
}

DeferredSink.prototype._end = function (task) {
  this.active = false
  __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__task__["b" /* defer */])(task)
}

function PropagateAllTask (sink, time, events) {
  this.sink = sink
  this.events = events
  this.time = time
}

PropagateAllTask.prototype.run = function () {
  var events = this.events
  var sink = this.sink
  var event

  for (var i = 0, l = events.length; i < l; ++i) {
    event = events[i]
    this.time = event.time
    sink.event(event.time, event.value)
  }

  events.length = 0
}

PropagateAllTask.prototype.error = function (e) {
  this.sink.error(this.time, e)
}

function EndTask (t, x, sink) {
  this.time = t
  this.value = x
  this.sink = sink
}

EndTask.prototype.run = function () {
  this.sink.end(this.time, this.value)
}

EndTask.prototype.error = function (e) {
  this.sink.error(this.time, e)
}

function ErrorTask (t, e, sink) {
  this.time = t
  this.value = e
  this.sink = sink
}

ErrorTask.prototype.run = function () {
  this.sink.error(this.time, this.value)
}

ErrorTask.prototype.error = function (e) {
  throw e
}


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ exports["a"] = SafeSink;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function SafeSink (sink) {
  this.sink = sink
  this.active = true
}

SafeSink.prototype.event = function (t, x) {
  if (!this.active) {
    return
  }
  this.sink.event(t, x)
}

SafeSink.prototype.end = function (t, x) {
  if (!this.active) {
    return
  }
  this.disable()
  this.sink.end(t, x)
}

SafeSink.prototype.error = function (t, e) {
  this.disable()
  this.sink.error(t, e)
}

SafeSink.prototype.disable = function () {
  this.active = false
  return this.sink
}


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__sink_DeferredSink__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__tryEvent__ = __webpack_require__(25);
/* harmony export (immutable) */ exports["a"] = EventEmitterSource;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function EventEmitterSource (event, source) {
  this.event = event
  this.source = source
}

EventEmitterSource.prototype.run = function (sink, scheduler) {
  // NOTE: Because EventEmitter allows events in the same call stack as
  // a listener is added, use a DeferredSink to buffer events
  // until the stack clears, then propagate.  This maintains most.js's
  // invariant that no event will be delivered in the same call stack
  // as an observer begins observing.
  var dsink = new __WEBPACK_IMPORTED_MODULE_0__sink_DeferredSink__["a" /* default */](sink)

  function addEventVariadic (a) {
    var l = arguments.length
    if (l > 1) {
      var arr = new Array(l)
      for (var i = 0; i < l; ++i) {
        arr[i] = arguments[i]
      }
      __WEBPACK_IMPORTED_MODULE_2__tryEvent__["a" /* tryEvent */](scheduler.now(), arr, dsink)
    } else {
      __WEBPACK_IMPORTED_MODULE_2__tryEvent__["a" /* tryEvent */](scheduler.now(), a, dsink)
    }
  }

  this.source.addListener(this.event, addEventVariadic)

  return __WEBPACK_IMPORTED_MODULE_1__disposable_dispose__["a" /* create */](disposeEventEmitter, { target: this, addEvent: addEventVariadic })
}

function disposeEventEmitter (info) {
  var target = info.target
  target.source.removeListener(target.event, info.addEvent)
}


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__tryEvent__ = __webpack_require__(25);
/* harmony export (immutable) */ exports["a"] = EventTargetSource;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function EventTargetSource (event, source, capture) {
  this.event = event
  this.source = source
  this.capture = capture
}

EventTargetSource.prototype.run = function (sink, scheduler) {
  function addEvent (e) {
    __WEBPACK_IMPORTED_MODULE_1__tryEvent__["a" /* tryEvent */](scheduler.now(), e, sink)
  }

  this.source.addEventListener(this.event, addEvent, this.capture)

  return __WEBPACK_IMPORTED_MODULE_0__disposable_dispose__["a" /* create */](disposeEventTarget,
    { target: this, addEvent: addEvent })
}

function disposeEventTarget (info) {
  var target = info.target
  target.source.removeEventListener(target.event, info.addEvent, target.capture)
}


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fromArray__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__iterable__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__fromIterable__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__observable_getObservable__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__observable_fromObservable__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__most_prelude__);
/* harmony export (immutable) */ exports["a"] = from;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */









function from (a) { // eslint-disable-line complexity
  if (a instanceof __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */]) {
    return a
  }

  var observable = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__observable_getObservable__["a" /* default */])(a)
  if (observable != null) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__observable_fromObservable__["a" /* fromObservable */])(observable)
  }

  if (Array.isArray(a) || __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__most_prelude__["isArrayLike"])(a)) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__fromArray__["a" /* fromArray */])(a)
  }

  if (__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2__iterable__["b" /* isIterable */])(a)) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__fromIterable__["a" /* fromIterable */])(a)
  }

  throw new TypeError('from(x) must be observable, iterable, or array-like: ' + a)
}


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = fromArray;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




function fromArray (a) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new ArraySource(a))
}

function ArraySource (a) {
  this.array = a
}

ArraySource.prototype.run = function (sink, scheduler) {
  return scheduler.asap(new __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__["a" /* default */](runProducer, this.array, sink))
}

function runProducer (t, array, sink) {
  for (var i = 0, l = array.length; i < l && this.active; ++i) {
    sink.event(t, array[i])
  }

  this.active && end(t)

  function end (t) {
    sink.end(t)
  }
}


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__EventTargetSource__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__EventEmitterSource__ = __webpack_require__(126);
/* harmony export (immutable) */ exports["a"] = fromEvent;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





/**
 * Create a stream from an EventTarget, such as a DOM Node, or EventEmitter.
 * @param {String} event event type name, e.g. 'click'
 * @param {EventTarget|EventEmitter} source EventTarget or EventEmitter
 * @param {*?} capture for DOM events, whether to use
 *  capturing--passed as 3rd parameter to addEventListener.
 * @returns {Stream} stream containing all events of the specified type
 * from the source.
 */
function fromEvent (event, source, capture) { // eslint-disable-line complexity
  var s

  if (typeof source.addEventListener === 'function' && typeof source.removeEventListener === 'function') {
    if (arguments.length < 3) {
      capture = false
    }

    s = new __WEBPACK_IMPORTED_MODULE_1__EventTargetSource__["a" /* default */](event, source, capture)
  } else if (typeof source.addListener === 'function' && typeof source.removeListener === 'function') {
    s = new __WEBPACK_IMPORTED_MODULE_2__EventEmitterSource__["a" /* default */](event, source)
  } else {
    throw new Error('source must support addEventListener/removeEventListener or addListener/removeListener')
  }

  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](s)
}


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__iterable__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = fromIterable;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */





function fromIterable (iterable) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new IterableSource(iterable))
}

function IterableSource (iterable) {
  this.iterable = iterable
}

IterableSource.prototype.run = function (sink, scheduler) {
  return new IteratorProducer(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__iterable__["a" /* getIterator */])(this.iterable), sink, scheduler)
}

function IteratorProducer (iterator, sink, scheduler) {
  this.scheduler = scheduler
  this.iterator = iterator
  this.task = new __WEBPACK_IMPORTED_MODULE_2__scheduler_PropagateTask__["a" /* default */](runProducer, this, sink)
  scheduler.asap(this.task)
}

IteratorProducer.prototype.dispose = function () {
  return this.task.dispose()
}

function runProducer (t, producer, sink) {
  var x = producer.iterator.next()
  if (x.done) {
    sink.end(t, x.value)
  } else {
    sink.event(t, x.value)
  }

  producer.scheduler.asap(producer.task)
}


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__most_prelude___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__most_prelude__);
/* harmony export (immutable) */ exports["a"] = generate;
/** @license MIT License (c) copyright 2010-2014 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Compute a stream using an *async* generator, which yields promises
 * to control event times.
 * @param f
 * @returns {Stream}
 */
function generate (f /*, ...args */) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new GenerateSource(f, __WEBPACK_IMPORTED_MODULE_1__most_prelude__["tail"](arguments)))
}

function GenerateSource (f, args) {
  this.f = f
  this.args = args
}

GenerateSource.prototype.run = function (sink, scheduler) {
  return new Generate(this.f.apply(void 0, this.args), sink, scheduler)
}

function Generate (iterator, sink, scheduler) {
  this.iterator = iterator
  this.sink = sink
  this.scheduler = scheduler
  this.active = true

  var self = this
  function err (e) {
    self.sink.error(self.scheduler.now(), e)
  }

  Promise.resolve(this).then(next).catch(err)
}

function next (generate, x) {
  return generate.active ? handle(generate, generate.iterator.next(x)) : x
}

function handle (generate, result) {
  if (result.done) {
    return generate.sink.end(generate.scheduler.now(), result.value)
  }

  return Promise.resolve(result.value).then(function (x) {
    return emit(generate, x)
  }, function (e) {
    return error(generate, e)
  })
}

function emit (generate, x) {
  generate.sink.event(generate.scheduler.now(), x)
  return next(generate, x)
}

function error (generate, e) {
  return handle(generate, generate.iterator.throw(e))
}

Generate.prototype.dispose = function () {
  this.active = false
}


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["a"] = iterate;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Compute a stream by iteratively calling f to produce values
 * Event times may be controlled by returning a Promise from f
 * @param {function(x:*):*|Promise<*>} f
 * @param {*} x initial value
 * @returns {Stream}
 */
function iterate (f, x) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new IterateSource(f, x))
}

function IterateSource (f, x) {
  this.f = f
  this.value = x
}

IterateSource.prototype.run = function (sink, scheduler) {
  return new Iterate(this.f, this.value, sink, scheduler)
}

function Iterate (f, initial, sink, scheduler) {
  this.f = f
  this.sink = sink
  this.scheduler = scheduler
  this.active = true

  var x = initial

  var self = this
  function err (e) {
    self.sink.error(self.scheduler.now(), e)
  }

  function start (iterate) {
    return stepIterate(iterate, x)
  }

  Promise.resolve(this).then(start).catch(err)
}

Iterate.prototype.dispose = function () {
  this.active = false
}

function stepIterate (iterate, x) {
  iterate.sink.event(iterate.scheduler.now(), x)

  if (!iterate.active) {
    return x
  }

  var f = iterate.f
  return Promise.resolve(f(x)).then(function (y) {
    return continueIterate(iterate, y)
  })
}

function continueIterate (iterate, x) {
  return !iterate.active ? iterate.value : stepIterate(iterate, x)
}


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__ = __webpack_require__(5);
/* harmony export (immutable) */ exports["a"] = periodic;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */




/**
 * Create a stream that emits the current time periodically
 * @param {Number} period periodicity of events in millis
 * @param {*} value value to emit each period
 * @returns {Stream} new stream that emits the current time every period
 */
function periodic (period, value) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new Periodic(period, value))
}

function Periodic (period, value) {
  this.period = period
  this.value = value
}

Periodic.prototype.run = function (sink, scheduler) {
  return scheduler.periodic(this.period, __WEBPACK_IMPORTED_MODULE_1__scheduler_PropagateTask__["a" /* default */].event(this.value, sink))
}


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Stream__ = __webpack_require__(0);
/* harmony export (immutable) */ exports["a"] = unfold;
/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */



/**
 * Compute a stream by unfolding tuples of future values from a seed value
 * Event times may be controlled by returning a Promise from f
 * @param {function(seed:*):{value:*, seed:*, done:boolean}|Promise<{value:*, seed:*, done:boolean}>} f unfolding function accepts
 *  a seed and returns a new tuple with a value, new seed, and boolean done flag.
 *  If tuple.done is true, the stream will end.
 * @param {*} seed seed value
 * @returns {Stream} stream containing all value of all tuples produced by the
 *  unfolding function.
 */
function unfold (f, seed) {
  return new __WEBPACK_IMPORTED_MODULE_0__Stream__["a" /* default */](new UnfoldSource(f, seed))
}

function UnfoldSource (f, seed) {
  this.f = f
  this.value = seed
}

UnfoldSource.prototype.run = function (sink, scheduler) {
  return new Unfold(this.f, this.value, sink, scheduler)
}

function Unfold (f, x, sink, scheduler) {
  this.f = f
  this.sink = sink
  this.scheduler = scheduler
  this.active = true

  var self = this
  function err (e) {
    self.sink.error(self.scheduler.now(), e)
  }

  function start (unfold) {
    return stepUnfold(unfold, x)
  }

  Promise.resolve(this).then(start).catch(err)
}

Unfold.prototype.dispose = function () {
  this.active = false
}

function stepUnfold (unfold, x) {
  var f = unfold.f
  return Promise.resolve(f(x)).then(function (tuple) {
    return continueUnfold(unfold, tuple)
  })
}

function continueUnfold (unfold, tuple) {
  if (tuple.done) {
    unfold.sink.end(unfold.scheduler.now(), tuple.value)
    return tuple.value
  }

  unfold.sink.event(unfold.scheduler.now(), tuple.value)

  if (!unfold.active) {
    return tuple.value
  }
  return stepUnfold(unfold, tuple.seed)
}


/***/ },
/* 136 */
/***/ function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ },
/* 137 */
/***/ function(module, exports) {


// All SVG children elements, not in this list, should self-close

module.exports = {
  // http://www.w3.org/TR/SVG/intro.html#TermContainerElement
  'a': true,
  'defs': true,
  'glyph': true,
  'g': true,
  'marker': true,
  'mask': true,
  'missing-glyph': true,
  'pattern': true,
  'svg': true,
  'switch': true,
  'symbol': true,

  // http://www.w3.org/TR/SVG/intro.html#TermDescriptiveElement
  'desc': true,
  'metadata': true,
  'title': true
};

/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {


var init = __webpack_require__(139);

module.exports = init([__webpack_require__(140), __webpack_require__(141)]);

/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {


var parseSelector = __webpack_require__(49);
var VOID_ELEMENTS = __webpack_require__(142);
var CONTAINER_ELEMENTS = __webpack_require__(137);

module.exports = function init(modules) {
  function parse(data) {
    return modules.reduce(function (arr, fn) {
      arr.push(fn(data));
      return arr;
    }, []).filter(function (result) {
      return result !== '';
    });
  }

  return function renderToString(vnode) {
    if (!vnode.sel && vnode.text) {
      return vnode.text;
    }

    vnode.data = vnode.data || {};

    // Support thunks
    if (typeof vnode.sel === 'string' && vnode.sel.slice(0, 5) === 'thunk') {
      vnode = vnode.data.fn.apply(null, vnode.data.args);
    }

    var tagName = parseSelector(vnode.sel).tagName;
    var attributes = parse(vnode);
    var svg = vnode.data.ns === 'http://www.w3.org/2000/svg';
    var tag = [];

    // Open tag
    tag.push('<' + tagName);
    if (attributes.length) {
      tag.push(' ' + attributes.join(' '));
    }
    if (svg && CONTAINER_ELEMENTS[tagName] !== true) {
      tag.push(' /');
    }
    tag.push('>');

    // Close tag, if needed
    if (VOID_ELEMENTS[tagName] !== true && !svg || svg && CONTAINER_ELEMENTS[tagName] === true) {
      if (vnode.data.props && vnode.data.props.innerHTML) {
        tag.push(vnode.data.props.innerHTML);
      } else if (vnode.text) {
        tag.push(vnode.text);
      } else if (vnode.children) {
        vnode.children.forEach(function (child) {
          tag.push(renderToString(child));
        });
      }
      tag.push('</' + tagName + '>');
    }

    return tag.join('');
  };
};

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {


var forOwn = __webpack_require__(36);
var escape = __webpack_require__(35);
var union = __webpack_require__(81);

var parseSelector = __webpack_require__(49);

// data.attrs, data.props, data.class

module.exports = function attributes(vnode) {
  var selector = parseSelector(vnode.sel);
  var parsedClasses = selector.className.split(' ');

  var attributes = [];
  var classes = [];
  var values = {};

  if (selector.id) {
    values.id = selector.id;
  }

  setAttributes(vnode.data.props, values);
  setAttributes(vnode.data.attrs, values); // `attrs` override `props`, not sure if this is good so

  if (vnode.data.class) {
    // Omit `className` attribute if `class` is set on vnode
    values.class = undefined;
  }
  forOwn(vnode.data.class, function (value, key) {
    if (value === true) {
      classes.push(key);
    }
  });
  classes = union(classes, values.class, parsedClasses).filter(function (x) {
    return x !== '';
  });

  if (classes.length) {
    values.class = classes.join(' ');
  }

  forOwn(values, function (value, key) {
    attributes.push(value === true ? key : key + '="' + escape(value) + '"');
  });

  return attributes.length ? attributes.join(' ') : '';
};

function setAttributes(values, target) {
  forOwn(values, function (value, key) {
    if (key === 'htmlFor') {
      target['for'] = value;
      return;
    }
    if (key === 'className') {
      target['class'] = value.split(' ');
      return;
    }
    if (key === 'innerHTML') {
      return;
    }
    target[key] = value;
  });
}

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var forOwn = __webpack_require__(36);
var escape = __webpack_require__(35);
var kebabCase = __webpack_require__(78);

// data.style

module.exports = function style(vnode) {
  var styles = [];
  var style = vnode.data.style || {};

  // merge in `delayed` properties
  if (style.delayed) {
    _extends(style, style.delayed);
  }

  forOwn(style, function (value, key) {
    // omit hook objects
    if (typeof value === 'string') {
      styles.push(kebabCase(key) + ': ' + escape(value));
    }
  });

  return styles.length ? 'style="' + styles.join('; ') + '"' : '';
};

/***/ },
/* 142 */
/***/ function(module, exports) {


// http://www.w3.org/html/wg/drafts/html/master/syntax.html#void-elements

module.exports = {
  area: true,
  base: true,
  br: true,
  col: true,
  embed: true,
  hr: true,
  img: true,
  input: true,
  keygen: true,
  link: true,
  meta: true,
  param: true,
  source: true,
  track: true,
  wbr: true
};

/***/ },
/* 143 */
/***/ function(module, exports) {

function createElement(tagName){
  return document.createElement(tagName);
}

function createElementNS(namespaceURI, qualifiedName){
  return document.createElementNS(namespaceURI, qualifiedName);
}

function createTextNode(text){
  return document.createTextNode(text);
}


function insertBefore(parentNode, newNode, referenceNode){
  parentNode.insertBefore(newNode, referenceNode);
}


function removeChild(node, child){
  node.removeChild(child);
}

function appendChild(node, child){
  node.appendChild(child);
}

function parentNode(node){
  return node.parentElement;
}

function nextSibling(node){
  return node.nextSibling;
}

function tagName(node){
  return node.tagName;
}

function setTextContent(node, text){
  node.textContent = text;
}

module.exports = {
  createElement: createElement,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  appendChild: appendChild,
  removeChild: removeChild,
  insertBefore: insertBefore,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent
};


/***/ },
/* 144 */
/***/ function(module, exports) {

module.exports = {
  array: Array.isArray,
  primitive: function(s) { return typeof s === 'string' || typeof s === 'number'; },
};


/***/ },
/* 145 */
/***/ function(module, exports) {

var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
                "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
                "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
                "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
                "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
                "truespeed", "typemustmatch", "visible"];

var booleanAttrsDict = {};
for(var i=0, len = booleanAttrs.length; i < len; i++) {
  booleanAttrsDict[booleanAttrs[i]] = true;
}

function updateAttrs(oldVnode, vnode) {
  var key, cur, old, elm = vnode.elm,
      oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;

  if (!oldAttrs && !attrs) return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};

  // update modified attributes, add new attributes
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      // TODO: add support to namespaced attributes (setAttributeNS)
      if(!cur && booleanAttrsDict[key])
        elm.removeAttribute(key);
      else
        elm.setAttribute(key, cur);
    }
  }
  //remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}

module.exports = {create: updateAttrs, update: updateAttrs};


/***/ },
/* 146 */
/***/ function(module, exports) {

function updateClass(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldClass = oldVnode.data.class,
      klass = vnode.data.class;

  if (!oldClass && !klass) return;
  oldClass = oldClass || {};
  klass = klass || {};

  for (name in oldClass) {
    if (!klass[name]) {
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}

module.exports = {create: updateClass, update: updateClass};


/***/ },
/* 147 */
/***/ function(module, exports) {

function updateDataset(oldVnode, vnode) {
  var elm = vnode.elm,
    oldDataset = oldVnode.data.dataset,
    dataset = vnode.data.dataset,
    key

  if (!oldDataset && !dataset) return;
  oldDataset = oldDataset || {};
  dataset = dataset || {};

  for (key in oldDataset) {
    if (!dataset[key]) {
      delete elm.dataset[key];
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      elm.dataset[key] = dataset[key];
    }
  }
}

module.exports = {create: updateDataset, update: updateDataset}


/***/ },
/* 148 */
/***/ function(module, exports) {

function invokeHandler(handler, vnode, event) {
  if (typeof handler === "function") {
    // call function handler
    handler.call(vnode, event, vnode);
  } else if (typeof handler === "object") {
    // call handler with arguments
    if (typeof handler[0] === "function") {
      // special case for single argument for performance
      if (handler.length === 2) {
        handler[0].call(vnode, handler[1], event, vnode);
      } else {
        var args = handler.slice(1);
        args.push(event);
        args.push(vnode);
        handler[0].apply(vnode, args);
      }
    } else {
      // call multiple handlers
      for (var i = 0; i < handler.length; i++) {
        invokeHandler(handler[i]);
      }
    }
  }
}

function handleEvent(event, vnode) {
  var name = event.type,
      on = vnode.data.on;

  // call event handler(s) if exists
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}

function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode);
  }
}

function updateEventListeners(oldVnode, vnode) {
  var oldOn = oldVnode.data.on,
      oldListener = oldVnode.listener,
      oldElm = oldVnode.elm,
      on = vnode && vnode.data.on,
      elm = vnode && vnode.elm,
      name;

  // optimization for reused immutable handlers
  if (oldOn === on) {
    return;
  }

  // remove existing listeners which no longer used
  if (oldOn && oldListener) {
    // if element changed or deleted we remove all existing listeners unconditionally
    if (!on) {
      for (name in oldOn) {
        // remove listener if element was changed or existing listeners removed
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      for (name in oldOn) {
        // remove listener if existing listener removed
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }

  // add new listeners which has not already attached
  if (on) {
    // reuse existing listener or create new
    var listener = vnode.listener = oldVnode.listener || createListener();
    // update vnode for listener
    listener.vnode = vnode;

    // if element changed or added we add all needed listeners unconditionally
    if (!oldOn) {
      for (name in on) {
        // add listener if element was changed or new listeners added
        elm.addEventListener(name, listener, false);
      }
    } else {
      for (name in on) {
        // add listener if new listener added
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}

module.exports = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners
};


/***/ },
/* 149 */
/***/ function(module, exports) {

var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function(fn) { raf(function() { raf(fn); }); };

function setNextFrame(obj, prop, val) {
  nextFrame(function() { obj[prop] = val; });
}

function getTextNodeRect(textNode) {
  var rect;
  if (document.createRange) {
    var range = document.createRange();
    range.selectNodeContents(textNode);
    if (range.getBoundingClientRect) {
        rect = range.getBoundingClientRect();
    }
  }
  return rect;
}

function calcTransformOrigin(isTextNode, textRect, boundingRect) {
  if (isTextNode) {
    if (textRect) {
      //calculate pixels to center of text from left edge of bounding box
      var relativeCenterX = textRect.left + textRect.width/2 - boundingRect.left;
      var relativeCenterY = textRect.top + textRect.height/2 - boundingRect.top;
      return relativeCenterX + 'px ' + relativeCenterY + 'px';
    }
  }
  return '0 0'; //top left
}

function getTextDx(oldTextRect, newTextRect) {
  if (oldTextRect && newTextRect) {
    return ((oldTextRect.left + oldTextRect.width/2) - (newTextRect.left + newTextRect.width/2));
  }
  return 0;
}
function getTextDy(oldTextRect, newTextRect) {
  if (oldTextRect && newTextRect) {
    return ((oldTextRect.top + oldTextRect.height/2) - (newTextRect.top + newTextRect.height/2));
  }
  return 0;
}

function isTextElement(elm) {
  return elm.childNodes.length === 1 && elm.childNodes[0].nodeType === 3;
}

var removed, created;

function pre(oldVnode, vnode) {
  removed = {};
  created = [];
}

function create(oldVnode, vnode) {
  var hero = vnode.data.hero;
  if (hero && hero.id) {
    created.push(hero.id);
    created.push(vnode);
  }
}

function destroy(vnode) {
  var hero = vnode.data.hero;
  if (hero && hero.id) {
    var elm = vnode.elm;
    vnode.isTextNode = isTextElement(elm); //is this a text node?
    vnode.boundingRect = elm.getBoundingClientRect(); //save the bounding rectangle to a new property on the vnode
    vnode.textRect = vnode.isTextNode ? getTextNodeRect(elm.childNodes[0]) : null; //save bounding rect of inner text node
    var computedStyle = window.getComputedStyle(elm, null); //get current styles (includes inherited properties)
    vnode.savedStyle = JSON.parse(JSON.stringify(computedStyle)); //save a copy of computed style values
    removed[hero.id] = vnode;
  }
}

function post() {
  var i, id, newElm, oldVnode, oldElm, hRatio, wRatio,
      oldRect, newRect, dx, dy, origTransform, origTransition,
      newStyle, oldStyle, newComputedStyle, isTextNode,
      newTextRect, oldTextRect;
  for (i = 0; i < created.length; i += 2) {
    id = created[i];
    newElm = created[i+1].elm;
    oldVnode = removed[id];
    if (oldVnode) {
      isTextNode = oldVnode.isTextNode && isTextElement(newElm); //Are old & new both text?
      newStyle = newElm.style;
      newComputedStyle = window.getComputedStyle(newElm, null); //get full computed style for new element
      oldElm = oldVnode.elm;
      oldStyle = oldElm.style;
      //Overall element bounding boxes
      newRect = newElm.getBoundingClientRect();
      oldRect = oldVnode.boundingRect; //previously saved bounding rect
      //Text node bounding boxes & distances
      if (isTextNode) {
        newTextRect = getTextNodeRect(newElm.childNodes[0]);
        oldTextRect = oldVnode.textRect;
        dx = getTextDx(oldTextRect, newTextRect);
        dy = getTextDy(oldTextRect, newTextRect);
      } else {
        //Calculate distances between old & new positions
        dx = oldRect.left - newRect.left;
        dy = oldRect.top - newRect.top;
      }
      hRatio = newRect.height / (Math.max(oldRect.height, 1));
      wRatio = isTextNode ? hRatio : newRect.width / (Math.max(oldRect.width, 1)); //text scales based on hRatio
      // Animate new element
      origTransform = newStyle.transform;
      origTransition = newStyle.transition;
      if (newComputedStyle.display === 'inline') //inline elements cannot be transformed
        newStyle.display = 'inline-block';        //this does not appear to have any negative side effects
      newStyle.transition = origTransition + 'transform 0s';
      newStyle.transformOrigin = calcTransformOrigin(isTextNode, newTextRect, newRect);
      newStyle.opacity = '0';
      newStyle.transform = origTransform + 'translate('+dx+'px, '+dy+'px) ' +
                               'scale('+1/wRatio+', '+1/hRatio+')';
      setNextFrame(newStyle, 'transition', origTransition);
      setNextFrame(newStyle, 'transform', origTransform);
      setNextFrame(newStyle, 'opacity', '1');
      // Animate old element
      for (var key in oldVnode.savedStyle) { //re-apply saved inherited properties
        if (parseInt(key) != key) {
          var ms = key.substring(0,2) === 'ms';
          var moz = key.substring(0,3) === 'moz';
          var webkit = key.substring(0,6) === 'webkit';
      	  if (!ms && !moz && !webkit) //ignore prefixed style properties
        	  oldStyle[key] = oldVnode.savedStyle[key];
        }
      }
      oldStyle.position = 'absolute';
      oldStyle.top = oldRect.top + 'px'; //start at existing position
      oldStyle.left = oldRect.left + 'px';
      oldStyle.width = oldRect.width + 'px'; //Needed for elements who were sized relative to their parents
      oldStyle.height = oldRect.height + 'px'; //Needed for elements who were sized relative to their parents
      oldStyle.margin = 0; //Margin on hero element leads to incorrect positioning
      oldStyle.transformOrigin = calcTransformOrigin(isTextNode, oldTextRect, oldRect);
      oldStyle.transform = '';
      oldStyle.opacity = '1';
      document.body.appendChild(oldElm);
      setNextFrame(oldStyle, 'transform', 'translate('+ -dx +'px, '+ -dy +'px) scale('+wRatio+', '+hRatio+')'); //scale must be on far right for translate to be correct
      setNextFrame(oldStyle, 'opacity', '0');
      oldElm.addEventListener('transitionend', function(ev) {
        if (ev.propertyName === 'transform')
          document.body.removeChild(ev.target);
      });
    }
  }
  removed = created = undefined;
}

module.exports = {pre: pre, create: create, destroy: destroy, post: post};


/***/ },
/* 150 */
/***/ function(module, exports) {

function updateProps(oldVnode, vnode) {
  var key, cur, old, elm = vnode.elm,
      oldProps = oldVnode.data.props, props = vnode.data.props;

  if (!oldProps && !props) return;
  oldProps = oldProps || {};
  props = props || {};

  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

module.exports = {create: updateProps, update: updateProps};


/***/ },
/* 151 */
/***/ function(module, exports) {

var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function(fn) { raf(function() { raf(fn); }); };

function setNextFrame(obj, prop, val) {
  nextFrame(function() { obj[prop] = val; });
}

function updateStyle(oldVnode, vnode) {
  var cur, name, elm = vnode.elm,
      oldStyle = oldVnode.data.style,
      style = vnode.data.style;

  if (!oldStyle && !style) return;
  oldStyle = oldStyle || {};
  style = style || {};
  var oldHasDel = 'delayed' in oldStyle;

  for (name in oldStyle) {
    if (!style[name]) {
      elm.style[name] = '';
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === 'delayed') {
      for (name in style.delayed) {
        cur = style.delayed[name];
        if (!oldHasDel || cur !== oldStyle.delayed[name]) {
          setNextFrame(elm.style, name, cur);
        }
      }
    } else if (name !== 'remove' && cur !== oldStyle[name]) {
      elm.style[name] = cur;
    }
  }
}

function applyDestroyStyle(vnode) {
  var style, name, elm = vnode.elm, s = vnode.data.style;
  if (!s || !(style = s.destroy)) return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}

function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  var name, elm = vnode.elm, idx, i = 0, maxDur = 0,
      compStyle, style = s.remove, amount = 0, applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if(applied.indexOf(props[i]) !== -1) amount++;
  }
  elm.addEventListener('transitionend', function(ev) {
    if (ev.target === elm) --amount;
    if (amount === 0) rm();
  });
}

module.exports = {create: updateStyle, update: updateStyle, destroy: applyDestroyStyle, remove: applyRemoveStyle};


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
// jshint newcap: false
/* global require, module, document, Node */
'use strict';

var VNode = __webpack_require__(153);
var is = __webpack_require__(144);
var domApi = __webpack_require__(143);

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }

var emptyNode = VNode('', {}, [], undefined, undefined);

function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}

function createKeyToOldIdx(children, beginIdx, endIdx) {
  var i, map = {}, key;
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

function init(modules, api) {
  var i, j, cbs = {};

  if (isUndef(api)) api = domApi;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (modules[j][hooks[i]] !== undefined) cbs[hooks[i]].push(modules[j][hooks[i]]);
    }
  }

  function emptyNodeAt(elm) {
    var id = elm.id ? '#' + elm.id : '';
    var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
    return VNode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
  }

  function createRmCb(childElm, listeners) {
    return function() {
      if (--listeners === 0) {
        var parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode, insertedVnodeQueue) {
    var i, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) {
        i(vnode);
        data = vnode.data;
      }
    }
    var elm, children = vnode.children, sel = vnode.sel;
    if (isDef(sel)) {
      // Parse selector
      var hashIdx = sel.indexOf('#');
      var dotIdx = sel.indexOf('.', hashIdx);
      var hash = hashIdx > 0 ? hashIdx : sel.length;
      var dot = dotIdx > 0 ? dotIdx : sel.length;
      var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                                                          : api.createElement(tag);
      if (hash < dot) elm.id = sel.slice(hash + 1, dot);
      if (dotIdx > 0) elm.className = sel.slice(dot + 1).replace(/\./g, ' ');
      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          api.appendChild(elm, createElm(children[i], insertedVnodeQueue));
        }
      } else if (is.primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text));
      }
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyNode, vnode);
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) i.create(emptyNode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      elm = vnode.elm = api.createTextNode(vnode.text);
    }
    return vnode.elm;
  }

  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      api.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
    }
  }

  function invokeDestroyHook(vnode) {
    var i, j, data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }
  }

  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var i, listeners, rm, ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }

  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    var oldStartIdx = 0, newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, elmToMove, before;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) { // New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = undefined;
          api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx+1]) ? null : newCh[newEndIdx+1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var i, hook;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    var elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;
    if (oldVnode === vnode) return;
    if (!sameVnode(oldVnode, vnode)) {
      var parentElm = api.parentNode(oldVnode.elm);
      elm = createElm(vnode, insertedVnodeQueue);
      api.insertBefore(parentElm, elm, oldVnode.elm);
      removeVnodes(parentElm, [oldVnode], 0, 0);
      return;
    }
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = vnode.data.hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      api.setTextContent(elm, vnode.text);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  return function(oldVnode, vnode) {
    var i, elm, parent;
    var insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isUndef(oldVnode.sel)) {
      oldVnode = emptyNodeAt(oldVnode);
    }

    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);

      createElm(vnode, insertedVnodeQueue);

      if (parent !== null) {
        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }

    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vnode;
  };
}

module.exports = {init: init};


/***/ },
/* 153 */
/***/ function(module, exports) {

module.exports = function(sel, data, children, text, elm) {
  var key = data === undefined ? undefined : data.key;
  return {sel: sel, data: data, children: children,
          text: text, elm: elm, key: key};
};


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ponyfill = __webpack_require__(155);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root = undefined; /* global window */

if (typeof global !== 'undefined') {
	root = global;
} else if (typeof window !== 'undefined') {
	root = window;
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ },
/* 155 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ },
/* 156 */
/***/ function(module, exports) {

if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}


/***/ },
/* 157 */
/***/ function(module, exports) {

module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}

/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = __webpack_require__(157);

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = __webpack_require__(156);

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(136)))

/***/ },
/* 159 */
/***/ function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			configurable: false,
			get: function() { return module.l; }
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			configurable: false,
			get: function() { return module.i; }
		});
		module.webpackPolyfill = 1;
	}
	return module;
}


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(51);


/***/ }
/******/ ]);
//# sourceMappingURL=test-bundle.js.map