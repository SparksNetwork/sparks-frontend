export * from './types';
import {
  UserRegistrationSources, UserRegistrationSinks,
  UserRegistrationDefaultSources, UserRegistrationModel,
  UserRegistrationDefaultProps
} from './';
import { Stream, just } from 'most';
import { merge } from 'ramda';
import {
  InputSinks, Input, InputProps, InputModel,
  ButtonSources, ButtonSinks, Button, ButtonProps
} from '../../widgets';
import {
  PasswordStrengthSinks, PasswordStrength, PasswordStrengthProps
} from '../';
import { message$ } from './message$';
import { update } from './update';
import { view, Views, ViewModel } from './view';
import { combineObj } from '../../../helpers/mostjs/combineObj';
import isolate from '@cycle/isolate';

export function UserRegistration(
  sources: UserRegistrationSources): UserRegistrationSinks {

  const sourcesWithDefaults: UserRegistrationDefaultSources =
    sourcesWithAppliedDefaults(sources);

  const model$: Stream<UserRegistrationModel> =
    message$(sourcesWithDefaults)
      .map(update);

  const emailAddressInput: InputSinks =
    EmailAddressInput(sourcesWithDefaults);

  const passwordInput: InputSinks =
    PasswordInput(sourcesWithDefaults);

  const passwordStrength: PasswordStrengthSinks =
    makePasswordStrength(sourcesWithDefaults, passwordInput.model$);

  const signUpButton: ButtonSinks =
    SignUpButton(sources);

  const views$: Stream<Views> =
    combineObj<Views>({
      emailAddressInput$: emailAddressInput.DOM,
      passwordInput$: passwordInput.DOM,
      passwordStrength$: passwordStrength.DOM,
      signUpButton$: signUpButton.DOM
    });

  const viewModel$: Stream<ViewModel> =
    combineObj<ViewModel>({
      model$,
      views$
    });

  return {
    DOM: viewModel$.map(view),
    model$
  };
}

function sourcesWithAppliedDefaults(
  sources: UserRegistrationSources
): UserRegistrationDefaultSources {
  return merge(sources, { props$: propsWithDefaults$(sources) });
}

function propsWithDefaults$(
  sources: UserRegistrationSources
): Stream<UserRegistrationDefaultProps> {
  const { props$ = just({}) } = sources;
  const defaultProps: UserRegistrationDefaultProps =
    {
      emailAddressInput: { value: `` },
      passwordInput: { value: `` }
    };

  return props$.map(props => merge(defaultProps, props));
}

function EmailAddressInput(sources: UserRegistrationDefaultSources): InputSinks {
  const { DOM } = sources;
  const props$: Stream<InputProps> =
    sources.props$
      .map(props => {
        return {
          float: true,
          id: `UserRegistrationEmailAddressInput`,
          placeholder: `Email address`,
          type: 'email',
          value: props.emailAddressInput.value
        } as InputProps;
      });

  return isolate(Input)({ DOM, props$ });
}

function PasswordInput(sources: UserRegistrationDefaultSources): InputSinks {
  const { DOM } = sources;
  const props$: Stream<InputProps> =
    sources.props$
      .map(props => {
        return {
          float: true,
          id: `UserRegistrationPasswordInput`,
          placeholder: `Password`,
          type: 'password',
          value: props.passwordInput.value
        } as InputProps;
      });

  return isolate(Input)({ DOM, props$ });
}

function makePasswordStrength(
  sources: UserRegistrationDefaultSources,
  inputModel$: Stream<InputModel>): PasswordStrengthSinks {

  const props$: Stream<PasswordStrengthProps> =
    inputModel$
      .map(model => {
        return {
          password: model.value
        };
      });

  return PasswordStrength({ DOM: sources.DOM, props$ });
}

function SignUpButton(sources: ButtonSources): ButtonSinks {
  const { DOM } = sources;
  const props: ButtonProps =
    {
      children: [`Sign up`],
      id: `UserRegistrationSignUpButton`
    };

  return isolate(Button)({ DOM, props$: just(props) });
}
