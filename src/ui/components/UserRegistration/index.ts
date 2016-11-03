import { Stream, just } from 'most';
import { combineObj } from '../../../helpers';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources } from '../../../components/types';
import { Input, InputAttrs, PASSWORD, EMAIL } from '../../components/Input';
import isolate from '@cycle/isolate';
import { view } from './view';

export type UserRegistrationSinks = {
  DOM: Stream<VNode>;
}

export type UserRegistrationSources = Sources & {
  DOM: DOMSource
};

export type UserRegistrationChildViews = {
  fullNameInput: VNode;
  emailAddressInput: VNode;
  passwordInput: VNode;
}

export function UserRegistration(
    sources: UserRegistrationSources): UserRegistrationSinks {

  const childDOMs =
    {
      fullNameInput$: fullNameInputDOM(sources),
      emailAddressInput$: emailAddressInputDOM(sources),
      passwordInput$: passwordInputDOM(sources)
    };

  const childViews$: Stream<UserRegistrationChildViews> =
    combineObj(childDOMs) as Stream<UserRegistrationChildViews>;

  return {
    DOM: childViews$.map(view)
  }
}

function fullNameInputDOM(sources: UserRegistrationSources): Stream<VNode> {
  const { DOM } = sources;
  const attrs: InputAttrs = {
    id: `UserRegistrationFullNameInput`,
    placeholder: `Full name`,
    float: true
  };

  return isolate(Input)({ DOM, attrs$: just(attrs) }).DOM;
}

function emailAddressInputDOM(sources: UserRegistrationSources): Stream<VNode> {
  const { DOM } = sources;
  const attrs: InputAttrs = {
    id: `UserRegistrationEmailAddressInput`,
    type: EMAIL,
    placeholder: `Email address`,
    float: true
  };

  return isolate(Input)({ DOM, attrs$: just(attrs) }).DOM;
}

function passwordInputDOM(sources: UserRegistrationSources): Stream<VNode> {
  const { DOM } = sources;
  const attrs: InputAttrs =
    {
      id: `UserRegistrationPasswordInput`,
      type: PASSWORD,
      placeholder: `Password`,
      float: true
    };

  return isolate(Input)({ DOM, attrs$: just(attrs) }).DOM;
}
