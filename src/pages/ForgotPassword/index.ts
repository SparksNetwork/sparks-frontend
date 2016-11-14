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
// TODO : refactoring, intent does not depend on view, so could be written as
// FPA({merge, preConditions}, [FPI, FPV]
// TODO : refactor as Switch with forgotState$ if works fine with Reset
// TODO : adjust tests !
const _ForgotPasswordComponent = ForgotPasswordActions({
  merge: computeForgotPasswordSinks,
  preConditions: assertHasExpectedSources(['authentication$'])
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


// TODO : remove is authenticated
// update name of sources
