import isolate from '@cycle/isolate';
import ForgotPasswordView from './ForgotPasswordView';
import {ForgotPasswordIntents, SendEmailIntent, CancelIntent} from './ForgotPasswordIntents'
import {ForgotPasswordActions, computeForgotPasswordSinks} from './ForgotPasswordActions'

const ForgotPasswordComponent = ForgotPasswordActions({
  merge: computeForgotPasswordSinks
}, [
  ForgotPasswordIntents({
    'cancel@click': CancelIntent('cancel$'),
    'form@submit': SendEmailIntent('sendEmail$')
  }, [ForgotPasswordView])
])

export default sources => isolate(ForgotPasswordComponent)(sources);
