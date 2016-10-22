import {merge as mergeR, mapObjIndexed} from 'ramda';
import {cssClasses} from '../../utils/classes';
import firebase = require('firebase');
import {
  AuthenticationInput,
  RedirectAuthenticationInput,
  EmailAndPasswordAuthenticationInput,
  REDIRECT,
  SIGN_OUT
} from '../../drivers/firebase-authentication';
import { Stream, merge, combine } from 'most';

const classes = cssClasses({});

// TODO : edge cases. null string, empty string etc.
function breakdown (selector : string) {
  const parts = selector.split('@');

  return {
    cssSelector : parts[0],
    event : parts[1]
  }
}

function Intents(intents, [childComponent]) {
  return function (sources) {
    // merge all sinks ine one object
    return mergeR( // ramda merge
      childComponent(sources),
      mapObjIndexed((curriedIntentComponent:any, selector) => {
        curriedIntentComponent(selector)(sources)
      }, intents)
    )
  }
}

function LogInWithGoogleIntent(sinkName) {
  return function LogInWithGoogleIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function LogInWithGoogleIntent(sources) {
      const domSource = sources.DOM;

      return {
        [sinkName]: domSource
          .select(classes.sel(cssSelector)).events(event)
          // <RedirectAuthenticationInput> // ? only ts2.0??
          // Get TS2347: Untyped function calls may not take type arguments
          .constant({
            method: REDIRECT,
            provider: new firebase.auth.GoogleAuthProvider()
          })
      }
    }
  }
}

function LogInWithFacebookIntent(sinkName) {
  return function LogInWithFacebookIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function LogInWithFacebookIntent(sources) {
      const domSource = sources.DOM;

      return {
        [sinkName]: domSource
          .select(classes.sel(cssSelector)).events(event)
          // <RedirectAuthenticationInput> // ? only ts2.0??
          // Get TS2347: Untyped function calls may not take type arguments
          .constant({
            method: REDIRECT,
            provider: new firebase.auth.FacebookAuthProvider()
          })
      }
    }
  }
}

function LogInWithEmailIntent(sinkName) {
  return function LogInWithEmailIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function LogInWithEmailIntent(sources) {
      const domSource = sources.DOM;

      const email$ = domSource.select(classes.sel('login.email')).events('input')
        .map(ev => (ev.target as HTMLInputElement).value);

      const password$ = domSource.select(classes.sel('login.password')).events('input')
        .map(ev => (ev.target as HTMLInputElement).value);

      const emailAndPassword$ =
        combine<string, string, EmailAndPasswordAuthenticationInput>(
          (email, password) => ({
            method: 'EMAIL_AND_PASSWORD',
            email,
            password
          }),
          email$, password$
        );

      const submit$ = domSource.select(cssSelector).events(event)
        .tap(ev => ev.preventDefault());

      const emailAndPasswordAuthenticationInput$ = emailAndPassword$
        .sampleWith<EmailAndPasswordAuthenticationInput>(submit$);

      return {
        [sinkName]: emailAndPasswordAuthenticationInput$
      }
    }
  }
}

function CancelIntent(sinkName) {
  return function CancelIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function CancelIntent(sources) {
      const domSource = sources.DOM;

      return {
        [sinkName]: domSource.select(classes.sel(cssSelector)).events(event)
      }
    }
  }
}

function ForgotPasswordIntent(sinkName) {
  return function ForgotPasswordIntent(selector) {
    const {cssSelector, event} = breakdown(selector)

    return function ForgotPasswordIntent(sources) {
      const domSource = sources.DOM;

      return {
        [sinkName]: domSource.select(classes.sel(cssSelector)).events(event)
      }
    }
  }
}

export {
  Intents,
  LogInWithGoogleIntent,
  LogInWithFacebookIntent,
  LogInWithEmailIntent,
  CancelIntent,
  ForgotPasswordIntent
}
