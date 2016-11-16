import { VNode, div, h1, span } from '@motorcycle/dom';
import * as styles from './styles';
import {
  cssClassesAsSelector as asSelector
} from '../../helpers/cssClassesAsSelector';
import { cssRule } from 'typestyle';

export type ViewModel = {
  views: Views;
};

export type Views = {
  userRegistration: VNode;
};

export function view(viewModel: ViewModel): VNode {
  cssRule(
    styles.heroBackground.selector,
    styles.heroBackground.object
  );

  const rootVNode: VNode =
    div(asSelector(styles.uniqueRoot), [
      div(asSelector(styles.globalNavigation), [
        div(asSelector(styles.logo), [
          span([
            `sparks`
          ]),
          span(asSelector(styles.logoTld), [
            `.network`
          ])
        ])
      ]),
      div(asSelector(styles.hero), [
        h1(asSelector(styles.heroHeading), [
          `Create Your Sparks ID`
        ])
      ]),
      div(asSelector(styles.flowBody), [
        div(asSelector(styles.flowBodyIntro), [
          div([
            `One Sparks ID is all you need to access all Sparks.Network services.`
          ])
        ]),
        div(asSelector(styles.centered), [
          viewModel.views.userRegistration
        ])
      ])
    ]);

  return rootVNode;
}
