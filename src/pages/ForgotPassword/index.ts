import isolate from '@cycle/isolate';
import {ForgotPasswordView} from './ForgotPasswordView';
import {
  ForgotPasswordIntents,
  SendEmailIntent,
  CancelIntent,
  classes as forgotPasswordClasses
} from './ForgotPasswordIntents'
import {
  ForgotPasswordActions,
  computeForgotPasswordSinks,
  assertHasExpectedSources
} from './ForgotPasswordActions'

// TODO add an interface that ForgotPasswordComponent satisfies

const _ForgotPasswordComponent = ForgotPasswordActions({
  merge: computeForgotPasswordSinks,
  preConditions: assertHasExpectedSources(['authenticationState$'])
}, [
  ForgotPasswordIntents({
    'cancel@click': CancelIntent('cancel$'),
    'form@submit': SendEmailIntent('sendEmail$')
  }, [ForgotPasswordView])
])

const ForgotPasswordComponent = sources => isolate(_ForgotPasswordComponent)(sources);

export {
  forgotPasswordClasses,
  ForgotPasswordComponent
}


