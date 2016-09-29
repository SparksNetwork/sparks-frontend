"use strict";
var assert = require('assert');
var index_1 = require('./index');
var most = require('most');
var dom_1 = require('@motorcycle/dom');
var mockedDOMSource = dom_1.mockDOMSource({});
var component = {
    DOM: most.of(dom_1.h1({}, 'Hello World')),
    route$: most.of('/path')
};
var match = { path: '/', value: function () { return component; } };
var router = {
    path: function () { return most.empty(); },
    define: function () { return most.of(match); }
};
var routes$ = most.of({
    '/': component
});
describe('ComponentRouter', function () {
    it('should return the latest components sinks', function () {
        var DOM = index_1.default({
            DOM: mockedDOMSource,
            router: router,
            routes$: routes$
        }).DOM;
        assert(typeof DOM.observe === 'function');
        var expected = [
            { sel: 'div.loading.___cycle1', text: 'Loading....' },
            { sel: 'h1.___cycle1', text: 'Hello World' }
        ];
        return DOM.observe(function (vNode) {
            var _a = expected.shift() || { sel: '', text: '' }, sel = _a.sel, text = _a.text;
            if (!vNode) {
                assert.fail();
            }
            assert.strictEqual(vNode.sel, sel);
            assert.strictEqual(vNode.text, text);
        });
    });
});
