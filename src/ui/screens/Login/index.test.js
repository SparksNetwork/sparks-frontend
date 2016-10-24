"use strict";
var assert = require("assert");
var dom_1 = require("@motorcycle/dom");
var most_1 = require("most");
var index_1 = require("./index");
function mockAsDomSource(mockConfig) {
    return dom_1.mockDOMSource(mockConfig);
}
var domSource = mockAsDomSource({});
var defaultSources = {
    DOM: domSource,
    isAuthenticated$: most_1.just(false),
    random: most_1.just(Math.random())
};
describe('Login', function () {
    describe('Component', function () {
        it('should be a function', function () {
            assert(typeof index_1.Login === 'function');
        });
        describe('Sinks', function () {
            it('should be an object', function () {
                var sinks = index_1.Login(defaultSources);
                assert(typeof sinks === 'object');
            });
            it('should contain property `DOM`', function () {
                assert(index_1.Login(defaultSources).hasOwnProperty('DOM'));
            });
            it('should contain property authenticationMethod$', function () {
                assert(index_1.Login(defaultSources).hasOwnProperty('authenticationMethod$'));
            });
            describe('DOM', function () {
                it('should be a stream', function () {
                    assert(typeof index_1.Login(defaultSources).DOM.observe === 'function');
                });
                it('should contain a vNode', function () {
                    return index_1.Login(defaultSources).DOM.observe(function (vNode) {
                        assert(typeof vNode === 'object');
                    });
                });
            });
            describe('authenicationMethod$', function () {
                it('should be a stream', function () {
                    assert(typeof index_1.Login(defaultSources).authenticationMethod$.observe === 'function');
                });
                it('should contain an AuthenticationMethod', function () {
                    return index_1.Login(defaultSources).authenticationMethod$
                        .observe(function (authenticationMethod) {
                        assert(typeof authenticationMethod === 'object');
                    });
                });
            });
        });
    });
});
