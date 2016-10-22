import isolate from '@cycle/isolate';
import LogInView from './LogInView';
import {
  Intents, LogInWithGoogleIntent, LogInWithFacebookIntent,
  LogInWithEmailIntent, CancelIntent, ForgotPasswordIntent
} from './LogInIntents';
import {
  Authenticate, computeAuthenticationSources, computeAuthenticationSinks
} from './LogInActions';

export const LogIn = Authenticate({
  fetch: computeAuthenticationSources,
  merge: computeAuthenticationSinks
}, [
  Intents({
    'button.google@click': LogInWithGoogleIntent('google$'),
    'button.facebook@click': LogInWithFacebookIntent('facebook$'),
    'form@submit': LogInWithEmailIntent('emailAndPasswordAuthenticationMethod$'),
    'button.cancel@click': CancelIntent('cancel$'),
    'a.forgot-password@click': ForgotPasswordIntent('forgotPassword$')
  }, [
    LogInView
  ])
])

export default sources => isolate(LogIn)(sources);
