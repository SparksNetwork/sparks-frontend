import { Stream, just } from 'most';
import { combineObj } from '../../../helpers';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources, Sinks } from '../../../components/types';
import {
  InputSources, InputSinks, Input, InputProps, InputModel,
  ButtonSources, ButtonSinks, Button, ButtonProps, ButtonModel
}
  from '../../widgets';
import isolate from '@cycle/isolate';
import { view } from './view';

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

export type UserRegistrationSources = Sources & {
  DOM: DOMSource
};

export type UserRegistrationChildViews = {
  emailAddressInput: VNode;
  passwordInput: VNode;
  signUpButton: VNode;
}

export function UserRegistration(
  sources: UserRegistrationSources): UserRegistrationSinks {

  const emailAddressInput: InputSinks = EmailAddressInput(sources);
  const passwordInput: InputSinks = PasswordInput(sources);
  const signUpButton: ButtonSinks = SignUpButton(sources)

  const childDOMs =
    {
      emailAddressInput$: emailAddressInput.DOM,
      passwordInput$: passwordInput.DOM,
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

function EmailAddressInput(sources: InputSources): InputSinks {
  const { DOM } = sources;
  const props: InputProps =
    {
      id: `UserRegistrationEmailAddressInput`,
      type: 'email',
      placeholder: `Email address`,
      float: true
    };

  return isolate(Input)({ DOM, props$: just(props) });
}

function PasswordInput(sources: InputSources): InputSinks {
  const { DOM } = sources;
  const props: InputProps =
    {
      id: `UserRegistrationPasswordInput`,
      type: 'password',
      placeholder: `Password`,
      float: true
    };

  return isolate(Input)({ DOM, props$: just(props) });
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
