"use strict";
var hold_1 = require("@most/hold");
var isolate_1 = require("@cycle/isolate");
var dom_1 = require("@motorcycle/dom");
var ramda_1 = require("ramda");
var helpers_1 = require("../../helpers");
var equalPaths = ramda_1.eqProps('path');
var loading = dom_1.div('.loading', {}, 'Loading....');
function callComponent(sources) {
    return function (_a) {
        var path = _a.path, value = _a.value;
        var component = value(ramda_1.merge(sources, {
            router: sources.router.path(path)
        }));
        var DOM = component.DOM.startWith(loading);
        return ramda_1.merge(component, { DOM: DOM });
    };
}
function ComponentRouter(sources) {
    var component$ = sources.routes$
        .map(function (routes) { return sources.router.define(routes); })
        .switch()
        .skipRepeatsWith(equalPaths)
        .map(callComponent(sources))
        .thru(hold_1.default);
    return {
        DOM: component$.map(ramda_1.prop('DOM')).switch().multicast(),
        route$: component$.map(helpers_1.propOrNever('route$')).switch().multicast(),
        pluck: function (key) { return component$.map(helpers_1.propOrNever(key)).switch().multicast(); }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = function (sources) { return isolate_1.default(ComponentRouter)(sources); };
