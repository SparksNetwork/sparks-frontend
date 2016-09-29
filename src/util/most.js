"use strict";
var most_1 = require('most');
var ramda_1 = require('ramda');
exports.propOrNever = ramda_1.curryN(2, function mergeFlatten(sinkName, sinks) {
    var sink = ramda_1.prop(sinkName, sinks);
    return sink
        ? sink instanceof most_1.Stream ? sink : most_1.just(sink)
        : most_1.never();
}); // lets TS know for sure this matches the interface
