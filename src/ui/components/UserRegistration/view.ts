import { VNode, div, form, p } from '@motorcycle/dom';
import { UserRegistrationChildViews } from './';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector';

export function view(childViews: UserRegistrationChildViews): VNode {
  const rootVNode: VNode =
    div(
      asSelector(styles.uniqueRoot),
      { attrs: { style: `text-align: center` } }, [
        form([
          p([
            childViews.emailAddressInput
          ]),
          p([
            childViews.passwordInput
          ])
        ])
      ]);

  return rootVNode;
}
