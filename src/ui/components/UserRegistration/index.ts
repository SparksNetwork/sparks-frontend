import { Stream, just } from 'most';
import { merge } from 'ramda';
import { combineObj } from '../../../helpers';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources, Sinks } from '../../../components/types';
import {
  InputSinks, Input, InputProps, InputModel,
  ButtonSources, ButtonSinks, Button, ButtonProps, ButtonModel
} from '../../widgets';
import {
  PasswordStrengthSinks, PasswordStrength, PasswordStrengthProps
} from '../';
import { view } from './view';
import isolate from '@cycle/isolate';

export type UserRegistrationModel =
  {
    emailAddressInput: InputModel;
    passwordInput: InputModel;
    signUpButton: ButtonModel;
  };

export type UserRegistrationSinks = Sinks & {
  DOM: Stream<VNode>;
  model$: Stream<UserRegistrationModel>;
}

export type UserRegistrationProps = {
  emailAddressInput?: { value: string };
  passwordInput?: { value: string }
};

export type UserRegistrationDefaultProps = UserRegistrationProps & {
  emailAddressInput: { value: string };
  passwordInput: { value: string }
};

export type UserRegistrationSources = Sources & {
  DOM: DOMSource;
  props$?: Stream<UserRegistrationProps>;
};

export type UserRegistrationDefaultSources = UserRegistrationSources & {
  props$: Stream<UserRegistrationDefaultProps>;
}

export type UserRegistrationChildViews = {
  emailAddressInput: VNode;
  passwordInput: VNode;
  passwordStrength: VNode;
  signUpButton: VNode;
}

export function UserRegistration(
  sources: UserRegistrationSources): UserRegistrationSinks {

  const sourcesWithDefaults: UserRegistrationDefaultSources =
    sourcesWithAppliedDefaults(sources);

  const emailAddressInput: InputSinks =
    EmailAddressInput(sourcesWithDefaults);
  const passwordInput: InputSinks =
    PasswordInput(sourcesWithDefaults);
  const passwordStrength: PasswordStrengthSinks =
    makePasswordStrength(sourcesWithDefaults, passwordInput.model$);
  const signUpButton: ButtonSinks =
    SignUpButton(sourcesWithDefaults)

  const childDOMs =
    {
      emailAddressInput$: emailAddressInput.DOM,
      passwordInput$: passwordInput.DOM,
      passwordStrength$: passwordStrength.DOM,
      signUpButton$: signUpButton.DOM
    };

  const childViews$: Stream<UserRegistrationChildViews> =
    combineObj<UserRegistrationChildViews>(childDOMs);

  const model$: Stream<UserRegistrationModel> =
    combineObj<UserRegistrationModel>({
      emailAddressInput$: emailAddressInput.model$,
      passwordInput$: passwordInput.model$,
      signUpButton$: signUpButton.model$
    });

  return {
    DOM: childViews$.map(view),
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
