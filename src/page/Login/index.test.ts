/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import { VNode } from '@motorcycle/dom';
import { Login, LoginSinks } from './index';

describe('Login', () => {
  describe('Component', () => {
    it('should be a function', () => {
      assert(typeof Login === 'function');
    });

    describe('Sinks', () => {
      it('should be an object', () => {
        const sinks: LoginSinks = Login();
        assert(typeof sinks === 'object');
      });

      it('should contain property `DOM`', () => {
        assert(Login().hasOwnProperty('DOM'));
      });
    });

    describe('DOM', () => {
      it('should be a stream', () => {
        assert(typeof Login().DOM.observe === 'function');
      });

      it('should contain a vNode', () => {
        return Login().DOM.observe((vNode: VNode) => {
          assert(typeof vNode === 'object');
        });
      });
    });
  });
});