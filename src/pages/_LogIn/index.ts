import isolate from '@cycle/isolate';
import LogInView from './LogInView';
import {
  LogInIntents, LogInWithGoogleIntent, LogInWithFacebookIntent,
  LogInWithEmailIntent, CancelIntent, ForgotPasswordIntent
} from './LogInIntents';
import {
  LogInActions, computeAuthenticationSources, computeAuthenticationSinks
} from './LogInActions';

export const LogInComponent = LogInActions({
  // compute the extra sources for downstream components
  fetch: computeAuthenticationSources,
  // merge children components sinks representing actions :
  // - route redirection
  // - DOM updates
  merge: computeAuthenticationSinks
}, [
  LogInIntents({
    'google@click': LogInWithGoogleIntent('google$'),
    'facebook@click': LogInWithFacebookIntent('facebook$'),
    'form@submit': LogInWithEmailIntent('emailAndPasswordAuthenticationInput$'),
    'cancel@click': CancelIntent('cancel$'),
//    'a.forgot-password@click': ForgotPasswordIntent('forgotPassword$')
  }, [
    LogInView
  ])
])

export default sources => isolate(LogInComponent)(sources);
