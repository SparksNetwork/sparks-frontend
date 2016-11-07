import {
  Stream,
  combine,
  merge as mergeM,
  mergeArray,
  empty,
  never,
  just
} from 'most';
import hold from '@most/hold';
import {
  DOMSource, div, span, section, form, fieldset, label, a, p, input, h1,
  h4, button, VNode
} from '@motorcycle/dom';
import {Sources, Sinks, Source} from '../../components/types';
import {classes} from './ResetPasswordView';

function computeIntents(sources) {
  // submit will read the passwords in both fields and pass the data up
  const domSource = sources.DOM;

  const enterPassword$ = domSource
    .select(classes.sel('resetPassword.enterPassword')).events('input')
    .map(function (ev) {
      return ev.target.value as HTMLInputElement
    })
    // `hold` used because we need this to be a behaviour not an event
    .thru(hold)
    .tap(x => console.warn('enterPassword$', x));

  const confirmPassword$ = domSource
    .select(classes.sel('resetPassword.confirmPassword')).events('input')
    .map(function (ev) {
      return ev.target.value as HTMLInputElement
    })
    // `hold` used because we need this to be a behaviour not an event
    // (fetched at a later point for logging in the user with that password)
    .thru(hold)
    .tap(x => console.warn('confirmPassword$', x));

  const submit$ = domSource.select('form').events('submit')
    .tap(ev => ev.preventDefault())
    .tap(x => console.warn('submit$', x));

  const inputPasswords$ =
          combine<string, string, any>(
            (enterPassword, confirmPassword) => ({
              enterPassword,
              confirmPassword
            }),
            enterPassword$, confirmPassword$
          );

  const resetPassword$ = inputPasswords$
        // TODO : put some serious type instead of any
          .sampleWith<any>(submit$)
          .multicast()
          .tap(x => console.warn('resetPassword$ ', x))
    ;

  return {
    resetPassword$,
    confirmPassword$
  }
}

export {
  computeIntents
}
