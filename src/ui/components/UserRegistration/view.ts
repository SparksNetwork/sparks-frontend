import { VNode, div, p } from '@motorcycle/dom';
import { UserRegistrationModel } from './';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector';

export type ViewModel = {
  model: UserRegistrationModel;
  views: Views;
};

export type Views = {
  emailAddressInput: VNode;
  passwordInput: VNode;
  passwordStrength: VNode;
  signUpButton: VNode;
};

export function view(viewModel: ViewModel): VNode {
  const { model, views } =
    viewModel;

  const { showPasswordStrength } =
    model;

  const {
    emailAddressInput,
    passwordInput,
    passwordStrength,
    signUpButton
  } =
    views;

  const rootVNode: VNode =
    div(
      asSelector(styles.uniqueRoot),
      [
        p([ emailAddressInput ]),
        p([ passwordInput ]),
        p(
          asSelector(
            !showPasswordStrength &&
            styles.hidePasswordStrength),
          [ passwordStrength ]
        ),
        p([ signUpButton ])
      ]);

  return rootVNode;
}
