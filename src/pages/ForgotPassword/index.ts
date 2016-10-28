import isolate from '@cycle/isolate';
import {ForgotPasswordView} from './ForgotPasswordView';
import {
  ForgotPasswordIntents,
  SendEmailIntent,
  CancelIntent
} from './ForgotPasswordIntents'
import {
  ForgotPasswordActions,
  computeForgotPasswordSinks,
  assertHasExpectedSources
} from './ForgotPasswordActions'

// TODO add an interface that ForgotPasswordComponent satisfies

const ForgotPasswordComponent = ForgotPasswordActions({
  merge: computeForgotPasswordSinks,
  preConditions: assertHasExpectedSources(['authenticationState$'])
}, [
  ForgotPasswordIntents({
    'cancel@click': CancelIntent('cancel$'),
    'form@submit': SendEmailIntent('sendEmail$')
  }, [ForgotPasswordView])
])

export default sources => isolate(ForgotPasswordComponent)(sources);


