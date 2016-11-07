import { VNode, div, form, p } from '@motorcycle/dom';
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
  const rootVNode: VNode =
    div(
      asSelector(styles.uniqueRoot),
      [
        form([
          p([ viewModel.views.emailAddressInput ]),
          p([ viewModel.views.passwordInput ]),
          p(
            asSelector(
              !viewModel.model.showPasswordStrength &&
              styles.hidePasswordStrength),
            [ viewModel.views.passwordStrength ]
          ),
          p([ viewModel.views.signUpButton ])
        ])
      ]);

  return rootVNode;
}
