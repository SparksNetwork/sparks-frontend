/// <reference path="../../../typings/index.d.ts" />
import * as assert from 'assert';
import firebase = require('firebase');
import {
  AuthenticationOutput,
  GET_REDIRECT_RESULT,
  AuthenticationError
} from '../../drivers/firebase-authentication';
import { just, periodic } from 'most';

//import { MockFirebase } from './MockFirebase';
//import { mockStream } from './MockStream';
import {Sources, Sinks, Source} from '../../components/types';
import {AuthenticationState} from './types'
import {
  div,
  span,
  section,
  form,
  fieldset,
  label,
  a,
  p,
  input,
  h1,
  h4,
  button,
  VNode
} from '@motorcycle/dom';
import {Stream, combine, merge as mergeM} from 'most';
import {cssClasses} from '../../utils/classes';
import {forgotPasswordView} from './ForgotPasswordView'

const classes = cssClasses({});
const backgroundImage = require('assets/images/login-background.jpg');

// TODO : find a way not to duplicate this with the actual view implementation
// Views corresponding to the miscellaneous authenticatation states
const viewNoAuthError = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel(''), {
          polyglot: {phrase: 'error.auth.none'}
        } as any)
      ]),
    ]),
  ])
]);

const viewAuthErrorInvalidEmail = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel('error'), {
          polyglot: {phrase: 'error.auth.invalid-email'}
        } as any)
      ]),
    ]),
  ])
]);

const viewAuthErrorUserNotFound = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel('error'), {
          polyglot: {phrase: 'error.auth.user-not-found'}
        } as any)
      ]),
    ]),
  ])
]);

const viewAuthErrorUserLoggedIn = section(classes.sel('photo-background'), {
  style: {
    // QUESTION: where does this url function comes from
    backgroundImage: `url(${backgroundImage})`
  }
}, [
  h1('sparks.network'),
  div([
    div(classes.sel('login', 'box'), [
      h1({polyglot: {phrase: 'forgotPassword.title'}} as any),
      div(classes.sel('login', 'form'), [
        form([
          fieldset([
            label({
              props: {for: 'email'},
              polyglot: {phrase: 'login.email'}
            } as any),
            input(classes.sel('login.email'), {
              props: {
                type: 'email',
                name: 'email'
              }
            } as any),
          ]),
          fieldset(classes.sel('actions'), [
            // add type="button" to avoid submit behavior
            button(classes.sel('cancel'), {
              polyglot: {phrase: 'forgotPassword.cancel'},
              attrs: {type: 'button'}
            } as any),
// button('cancel', {
// polyglot: {phrase: 'forgotPassword.cancel'}, attrs:
// {type:'button'}} as any),
            button(classes.sel('submit'), {
              polyglot: {phrase: 'forgotPassword.send'}
            } as any)
          ])
        ]),
        h4(classes.sel('warning'), {
          polyglot: {phrase: 'error.auth.none'}
        } as any)
      ]),
    ]),
  ])
]);

describe('On entering the forgot password screen for the first time', () => {
  it('should not display a feedback message, should display a form' +
    ' allowing to send an email, and a cancel and send button', () => {
    const authenticationState: AuthenticationState = {
      isAuthenticated : false,
      authenticationError : null as AuthenticationError
    }
    const actual = forgotPasswordView(authenticationState);
    const expected = viewNoAuthError;
    const message = [
      'should not display a feedback message',
      'should display a form allowing to send an email',
      'should display a cancel and send button'
    ].join('\n')

    assert.deepStrictEqual(actual, expected, message);
  });

});
