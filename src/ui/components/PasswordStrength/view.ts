import { VNode, div, i, li, span, ul } from '@motorcycle/dom';
import { PasswordStrengthModel } from './';
import * as styles from './styles';
import { cssClassesAsSelector as asSelector }
  from '../../helpers/cssClassesAsSelector';

export function view(model: PasswordStrengthModel): VNode {
  const rootVNode: VNode =
    div(
      asSelector(styles.uniqueRoot, styles.root),
      [
        div(
          asSelector(styles.listHeading),
          `Your password must have:`
        ),
        ul(
          asSelector(styles.list),
          [
            li(
              asSelector(model.valid ? styles.success : styles.error),
              [
                i(`.zmdi.zmdi-check-circle`),
                span(
                  asSelector(styles.message),
                  `6 or more characters`
                )
              ]
            )
          ]
        )
      ]
    );

  return rootVNode;
}
