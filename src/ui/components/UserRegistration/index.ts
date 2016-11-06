import { Stream, just } from 'most';
import { combineObj } from '../../../helpers';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources, Sinks } from '../../../components/types';
import {
  InputSources, InputSinks, Input, InputProps, InputModel,
  ButtonSources, Button, ButtonAttrs, ButtonProps, ButtonChildren
}
  from '../../widgets';
import isolate from '@cycle/isolate';
import { view } from './view';

export type UserRegistrationModel =
  {
    emailAddressInput: InputModel;
    passwordInput: InputModel;
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

  const childDOMs =
    {
      emailAddressInput$: emailAddressInput.DOM,
      passwordInput$: passwordInput.DOM,
      signUpButton$: signUpButtonDOM(sources)
    };

  const childViews$: Stream<UserRegistrationChildViews> =
    combineObj<UserRegistrationChildViews>(childDOMs);

  const model$: Stream<UserRegistrationModel> =
    combineObj<UserRegistrationModel>({
      emailAddressInput$: emailAddressInput.model$,
      passwordInput$: passwordInput.model$
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

function signUpButtonDOM(sources: ButtonSources): Stream<VNode> {
  const { DOM } = sources;
  const attrs: ButtonAttrs =
    {
      id: `UserRegistrationSignUpButton`
    };
  const props: ButtonProps = {};
  const children: ButtonChildren = [`Sign up`];

  return isolate(Button)({
    DOM,
    attrs$: just(attrs),
    props$: just(props),
    children$: just(children)
  }).DOM;
}
