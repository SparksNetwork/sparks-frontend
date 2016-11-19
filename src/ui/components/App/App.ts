import {
  AppSinks, AppSources, AppModelChildViews, AppModel,
  AppHeader, AppHeaderSinks, AppHeaderSources,
  AppToolbar, AppToolbarSinks, AppToolbarSources,
  AppDrawer, AppDrawerSinks, AppDrawerSources, AppDrawerProps
} from '../';
import {
  IconButton, IconButtonSinks, IconButtonSources, IconButtonProps
} from '../../widgets';
import * as appToolbarStyle from '../AppToolbar/style';
import { combineObj } from '../../../helpers';
import { Stream, combineArray, just } from 'most';
import { VNode, a, div, span } from '@motorcycle/dom';
import { view } from './view';
import * as style from './style';
import { augmentComponentWithEvents } from '../../helpers';
import { augmentComponent } from '../../helpers';
import isolate from '@cycle/isolate';

declare const require: (pkg: string) => any;

export function App(sources: AppSources): AppSinks {

  const appHeader: AppHeaderSinks & IconButtonClickSinks =
    makeAppHeader(sources);

  const appHeaderView$: Stream<VNode> =
    appHeader.dom;

  const appDrawerProps$: Stream<AppDrawerProps> =
    appHeader.menuIconButtonClick$
      .scan(previous => !previous, false)
      .map(opened => { return { opened } });

  const appDrawerSources: AppDrawerSources =
    {
      dom: sources.dom,
      props$: appDrawerProps$,
    }

  const appDrawer: AppDrawerSinks =
    AppDrawer(appDrawerSources);

  const appDrawerView$: Stream<VNode> =
    appDrawer.dom;

  const childViews$: Stream<AppModelChildViews> =
    combineObj<AppModelChildViews>({ appHeaderView$, appDrawerView$ });

  const model$: Stream<AppModel> =
    combineObj<AppModel>({ childViews$ });

  return {
    dom: model$.map(view),
  };
}

type IconButtonClickSinks =
  {
    menuIconButtonClick$: Stream<Event>
    backIconButtonClick$: Stream<Event>
    accountIconButtonClick$: Stream<Event>
  };

function makeAppHeader(
  appSources: AppSources): AppHeaderSinks & IconButtonClickSinks
{
  const { dom } = appSources;

  const appToolbar: AppToolbarSinks & IconButtonClickSinks =
    makeAppToolbar(appSources);

  const childViews: Array<Stream<VNode>> =
    [
      appToolbar.dom,
    ];

  const childViews$: Stream<Array<VNode>> =
    combineArray<VNode, Array<VNode>>(Array, childViews);

  const sources: AppHeaderSources =
    {
      dom,
      childViews$,
    };

  const {
    menuIconButtonClick$,
    backIconButtonClick$,
    accountIconButtonClick$,
  } = appToolbar;

  const appToolbarIconButtonClickSinks: IconButtonClickSinks =
    {
      menuIconButtonClick$,
      backIconButtonClick$,
      accountIconButtonClick$,
    };

  const AugmentationAppHeader =
    augmentComponent(isolate(AppHeader), appToolbarIconButtonClickSinks);

  return AugmentationAppHeader(sources);
}

type IconButtons =
  {
    menuIconButton: IconButtonSinks;
    backIconButton: IconButtonSinks;
    accountIconButton: IconButtonSinks;
  };

type IconButtonViews =
  {
    menuIconButtonView: VNode;
    backIconButtonView: VNode;
    accountIconButtonView: VNode;
  };

function makeAppToolbar(
  appSources: AppSources): AppToolbarSinks & IconButtonClickSinks {
  const { dom } = appSources;

  const mainTitle: VNode =
    div(appToolbarStyle.mainTitle + style.logo, [
      a(style.logoLink,
        {
          props: { href: `/` },
          attrs: { 'aria-label': `Sparks.Network Home` }
        }, [
          `sparks`,
          span(style.logoTld, [`.network`]),
        ])
    ]);

  const iconButtons: IconButtons =
    makeIconButtons(appSources);

  const {
    menuIconButton,
    backIconButton,
    accountIconButton
  } = iconButtons;

  const menuIconButtonView$: Stream<VNode> =
    menuIconButton.dom;

  const backIconButtonView$: Stream<VNode> =
    backIconButton.dom;

  const accountIconButtonView$: Stream<VNode> =
    accountIconButton.dom;

  const iconButtonViews$: Stream<IconButtonViews> =
    combineObj<IconButtonViews>({
      menuIconButtonView$,
      backIconButtonView$,
      accountIconButtonView$,
    });

  const childViews$: Stream<Array<VNode>> =
    iconButtonViews$
      .map(iconButtonViews => {
        const {
          menuIconButtonView,
          backIconButtonView,
          accountIconButtonView
        } = iconButtonViews;

        const childViews: Array<VNode> =
          [
            div(style.leftBarItem, [
              menuIconButtonView,
              a(style.backIconButtonLink,
                { props: { href: `/`, tabIndex: -1 } },
                [
                  backIconButtonView,
                ],
              ),
            ]),
            mainTitle,
            a({ props: { href: `/account`, tabIndex: -1 } }, [
              accountIconButtonView,
            ])
          ];

        return childViews;
      });

  const sources: AppToolbarSources =
    {
      dom,
      childViews$
    };

  const iconButtonClickSinks: IconButtonClickSinks =
    {
      menuIconButtonClick$: menuIconButton[`click$`] as Stream<Event>,
      backIconButtonClick$: backIconButton[`click$`] as Stream<Event>,
      accountIconButtonClick$: accountIconButton[`click$`] as Stream<Event>,
    };

  const AugmentationAppToolbar =
    augmentComponent(isolate(AppToolbar), iconButtonClickSinks);

  return AugmentationAppToolbar(sources);
}

function makeIconButtons(appSources: AppSources): IconButtons {
  const menuIconButtonProps: IconButtonProps =
    {
      className: style.menuIconButton,
      src: require(`assets/images/icons/menu.svg`),
    };

  const menuIconButton: IconButtonSinks =
    makeIconButton(appSources, menuIconButtonProps);

  const backIconButtonProps: IconButtonProps =
    {
      className: `.back-icon-button`,
      src: require(`assets/images/icons/arrows/left.svg`),
    };

  const backIconButton: IconButtonSinks =
    makeIconButton(appSources, backIconButtonProps);

  const accountIconButtonProps: IconButtonProps =
    {
      className: `.account-icon-button`,
      src: require(`assets/images/icons/account.svg`),
    };

  const accountIconButton: IconButtonSinks =
    makeIconButton(appSources, accountIconButtonProps);

  const iconButtons: IconButtons =
    {
      menuIconButton,
      backIconButton,
      accountIconButton,
    };

  return iconButtons;
}

function makeIconButton(
  appSources: AppSources,
  props: IconButtonProps): IconButtonSinks {
  const { dom } = appSources;

  const props$: Stream<IconButtonProps> = just(props);

  const sources: IconButtonSources =
    {
      dom,
      props$,
    };

  const EventfulIconButton =
    augmentComponentWithEvents(isolate(IconButton), [`click`]);

  return EventfulIconButton(sources);
}
