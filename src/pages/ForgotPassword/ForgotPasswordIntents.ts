import {merge as mergeR, mapObjIndexed, values, reduce} from 'ramda';
import {cssClasses} from '../../utils/classes';
import firebase = require('firebase');
import {
  PasswordResetAuthenticationInput,
  AuthenticationInput,
  RedirectAuthenticationInput,
  EmailAndPasswordAuthenticationInput,
  REDIRECT,
  SIGN_OUT
} from '../../drivers/firebase-authentication';
import {Stream, merge, combine} from 'most';

const classes : any= cssClasses({});

// TODO : edge cases. null string, empty string etc.
// TODO : move to an util library
function breakdown(selector: string) {
  const parts = selector.split('@');

  return {
    cssSelector: parts[0],
    event: parts[1]
  }
}

function ForgotPasswordIntents(intents, [childComponent]) {
  return function (sources) {
    // merge all sinks ine one object
    return mergeR( // ramda merge
      childComponent(sources),
      reduce(mergeR, {}, values(mapObjIndexed((curriedIntentComponent: any, selector) =>
          curriedIntentComponent(selector)(sources)
        , intents)))
    )
  }
}

function CancelIntent(sinkName) {
  return function CancelIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function CancelIntent(sources) {
      const domSource = sources.DOM;
      console.warn('selector', selector)

      return {
        [sinkName]: domSource.select(classes.sel(cssSelector)).events(event)
          .tap(ev => ev.preventDefault())
          .map(x => '/')
      }
    }
  }
}

function SendEmailIntent(sinkName) {
  return function SendEmailIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function SendEmailIntent(sources) {
      const domSource = sources.DOM;

      const email$ = domSource.select(classes.sel('login.email')).events('input')
          .map(ev => (ev.target as HTMLInputElement).value)
          .tap(x => console.warn('email$', x))
        ;

      const authCommand$ = email$.map(email => ({
        method: 'SEND_PASSWORD_RESET_EMAIL',
        email
      }))
        .tap(x => console.warn('authCommand$ ', x)) as Stream<PasswordResetAuthenticationInput>;

      const submit$ = domSource.select(cssSelector).events(event)
          .tap(ev => ev.preventDefault())
          .tap(x => console.warn('submit$', x))
        ;

      const sendEmailAuthenticationInput$ = authCommand$
          .sampleWith<PasswordResetAuthenticationInput>(submit$)
          .tap(x => console.warn('sendEmailAuthenticationInput$ ', x))
        ;

      return {
        [sinkName]: sendEmailAuthenticationInput$
      }
    }
  }
}

export {
  ForgotPasswordIntents,
  CancelIntent,
  SendEmailIntent,
  classes
}
