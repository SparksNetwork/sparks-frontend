import { cssRule, style, extend } from 'typestyle';
import * as theme from '../../theme';
import * as appHeaderStyle from '../AppHeader/style';
import * as appDrawerStyle from '../AppDrawer/style';
import { layoutFixedTop } from '../../style/flex-layout';

// internal variables

// const appPrimaryColor: string = `rgb(42, 18, 45)`;

export const host: string =
  `#sn-app`;

cssRule(
  host,
  {
    display: `block`,
    position: `relative`,
    paddingTop: `130px`,
    paddingBottom: `64px`,
    minHeight: `100vh`,
    '-webkit-tap-highlight-color': `rgba(0, 0, 0, 0)`,
    color: theme.primaryColor,
    backgroundColor: theme.primaryBackgroundColor,
  }
);

cssRule(
  appHeaderStyle.host,
  extend(
    layoutFixedTop,
    {
      backgroundColor: `rgba(255, 255, 255, 0.8)`,
      zIndex: 1,
    }
  )
);

export const logo: string =
  `.` +
  style(
    {
      textAlign: `center`,
    }
  );

export const logoLink: string =
  `.` +
  style(
    {
      fontSize: `16px`,
      fontWeight: 600,
      color: `rgb(42, 18, 45)`,
      textDecoration: `none`,
      /* required for IE 11, so <a> can receive pointer events */
      display: `inline-block`,
      pointerEvents: `auto`,
    }
  );

export const logoTld: string =
  `.` +
  style(
    {
      color: `#cd95c0`,
    }
  );

export const leftBarItem: string =
  `.` +
  style(
    {
      width: `40px`,
    }
  );

export const menuIconButton: string = `.menu-icon-button`;

cssRule(
  `${host}[data-route="detail"] ${menuIconButton}`,
  {
    display: `none`,
  }
);

export const backIconButtonLink: string = `.back-icon-button-link`;

cssRule(
  `${host}:not([data-route="detail"]) ${backIconButtonLink}`,
  {
    display: `none`,
  }
);

cssRule(
  appDrawerStyle.host,
  {
    zIndex: 3,
  }
);
