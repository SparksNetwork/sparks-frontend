// TODO : change to reflect the view on enter email
// TODDO : add a phrase with polyglot instead of login.email
// QUESTION : how does polyglot works?
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
  button,
  VNode
} from '@motorcycle/dom';
import {Stream, combine, merge as mergeM} from 'most';

import {cssClasses} from '../../utils/classes';
const classes = cssClasses({});

const backgroundImage = require('assets/images/login-background.jpg');

export default function ForgotPasswordView(sources : Sources) : Sinks {
  const {authenticationState$} = sources;

  return {
    DOM: authenticationState$.map(forgotPasswordView)
  }
}


// Error Codes
//
// auth/invalid-email
// Thrown if the email address is not valid.
//   auth/user-not-found
// Thrown if there is no user corresponding to the email address.

// TODO : set the behavior for authenticationState
// - if authentication error : display error message
// - if user already authenticated : display warning message
// - if user is not autenticated : display no error/warning
function forgotPasswordView(authenticationState: AuthenticationState): VNode {
  return section(classes.sel('photo-background'), {
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
                // TODO : forgotPassword.email for some reason is not resolved??
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
              button(classes.sel('cancel'), {polyglot: {phrase: 'forgotPassword.cancel'}} as any),
              button(classes.sel('submit'), {polyglot: {phrase: 'forgotPassword.send'}} as any)
            ])
          ])
        ]),
      ]),
    ])
  ]);
}
