"use strict";
/// <reference path="../../typings/index.d.ts" />
var dom_1 = require('@motorcycle/dom');
var ramda_1 = require('ramda');
function clickable(component) {
    return function clickableComponent(sources) {
        var click$ = sources.DOM.select('.clickable').events('click');
        var sinks = component(sources);
        var DOM = sinks.DOM.map(function (view) {
            return dom_1.div('.clickable', {}, [
                view
            ]);
        });
        return ramda_1.merge(sinks, { click$: click$, DOM: DOM });
    };
}
exports.clickable = clickable;
