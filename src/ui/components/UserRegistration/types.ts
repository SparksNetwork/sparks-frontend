import { Sources, Sinks } from '../../../components/types';
import { VNode, DOMSource } from '@motorcycle/dom';
import { Stream } from 'most';

export type UserRegistrationSinks = Sinks & {
  DOM: Stream<VNode>;
  model$: Stream<UserRegistrationModel>;
}

export type UserRegistrationModel =
  {
    showPasswordStrength: boolean;
  };

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
