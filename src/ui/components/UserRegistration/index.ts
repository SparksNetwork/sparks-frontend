import { Stream, just } from 'most';
import { combineObj } from '../../../helpers';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Sources } from '../../../components/types';
import { Input, InputAttrs } from '../../widgets';
import isolate from '@cycle/isolate';
import { view } from './view';

export type UserRegistrationSinks = {
  DOM: Stream<VNode>;
}

export type UserRegistrationSources = Sources & {
  DOM: DOMSource
};

export type UserRegistrationChildViews = {
  emailAddressInput: VNode;
  passwordInput: VNode;
}

export function UserRegistration(
    sources: UserRegistrationSources): UserRegistrationSinks {

  const childDOMs =
    {
      emailAddressInput$: emailAddressInputDOM(sources),
      passwordInput$: passwordInputDOM(sources)
    };

  const childViews$: Stream<UserRegistrationChildViews> =
    combineObj(childDOMs) as Stream<UserRegistrationChildViews>;

  return {
    DOM: childViews$.map(view)
  }
}

function emailAddressInputDOM(sources: UserRegistrationSources): Stream<VNode> {
  const { DOM } = sources;
  const attrs: InputAttrs = {
    id: `UserRegistrationEmailAddressInput`,
    type: 'email',
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
      type: 'password',
      placeholder: `Password`,
      float: true
    };

  return isolate(Input)({ DOM, attrs$: just(attrs) }).DOM;
}
