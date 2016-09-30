"use strict";
var ramda_1 = require('ramda');
var most_subject_1 = require("most-subject");
var onLens = ramda_1.lensPath(['data', 'on']);
function handler(subject, name) {
    return function (evt) {
        evt.name = name;
        subject.next(evt);
    };
}
function attachEvents(node, subject) {
    var on = ramda_1.view(onLens, node);
    if (ramda_1.not(on)) {
        return node;
    }
    var events = ramda_1.keys(on);
    var newOn = events.reduce(function (acc, event) {
        var name = on[event];
        if (typeof name === 'string') {
            return ramda_1.assoc(event, handler(subject, name), acc);
        }
        else {
            return ramda_1.assoc(event, name, acc);
        }
    }, {});
    return ramda_1.set(onLens, newOn, node);
}
function walkTree(subject, root) {
    var children = root.children
        .filter(function (child) { return typeof child === 'object'; })
        .map(function (child) { return walkTree(subject, child); });
    return ramda_1.assoc('children', children, attachEvents(root, subject));
}
function EventWrapper(vnodeStream) {
    var eventStreams = vnodeStream.map(function (vnode) {
        var events = most_subject_1.subject();
        var DOM = walkTree(events, vnode);
        return { DOM: DOM, events: events };
    });
    var DOM = eventStreams.map(ramda_1.prop('DOM'));
    var events = eventStreams.map(ramda_1.prop('events')).switch();
    return {
        DOM: DOM,
        events: events
    };
}
exports.EventWrapper = EventWrapper;
