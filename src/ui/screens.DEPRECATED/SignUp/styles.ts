import { style, extend } from 'typestyle';
import * as theme from '../../style/theme';
import { resetFontCss, resetBoxModelCss } from '../../style/helpers/';

// internal variables
const globalNavigationBackgroundColor: string = `rgba(42, 18, 45, 0.8)`
const globalNavigationHeaderHeight: number = 44;

const heroBackgroundColor: string = theme.heroBackgroundColor;
const heroBackgroundImage = require('assets/images/login-background.jpg');
const heroHeadingColor: string = theme.heroHeadingColor;
const heroHeight: number = 66;
const heroTotalHeight: number = globalNavigationHeaderHeight + heroHeight;

export const uniqueRoot: string = `sn-flow`;

export const globalNavigation: string =
  style(
    resetBoxModelCss(),
    {
      background: globalNavigationBackgroundColor,
      position: `absolute`,
      top: 0,
      right: 0,
      left: 0,
      zIndex: 1,
      height: `${globalNavigationHeaderHeight}px`,
    }
  );

export const logo: string =
  style(
    resetFontCss(),
    resetBoxModelCss(),
    {
      color: `#f6eef4`,
      fontSize: `18px`,
      fontWeight: 600,
      height: `100%`,
      paddingTop: `8px`,
      textAlign: `center`
    }
  );

export const logoTld: string =
  style(
    {
      color: `#cd95c0`
    }
  );

export const hero: string =
  style(
    resetBoxModelCss(),
    {
      position: `relative`,
      height: `${heroTotalHeight}px`,
      overflow: `hidden`,
    }
  );

export const heroBackground = {
  selector: `.${uniqueRoot} .${hero}::before`,
  object: extend(
    resetBoxModelCss(),
    {
      content: `''`,
      position: `absolute`,
      width: `100%`,
      height: `${heroTotalHeight}px`,
      zIndex: -1,
      border: `10px solid`,
      background: `${heroBackgroundColor} url(${heroBackgroundImage}) no-repeat`,
      backgroundSize: `150% auto`,
      backgroundPosition: `0 30%`,
      filter: `blur(5px)`,
      transform: `scale(1.2)`
    }
  )
}

export const heroHeading: string =
  style(
    resetFontCss(),
    {
      color: heroHeadingColor,
      fontSize: `28px`,
      fontWeight: 300,
      lineHeight: 1,
      textAlign: `center`,
      padding: `${heroHeight - 6}px 16px 0`,
      letterSpacing: `-0.04em`,
      textShadow: `0 0 32px rgba(0, 0, 0, 0.5)`
    }
  );

export const flowBody: string =
  style(
    {
      background: `transparent`,
      padding: `0 16px`,
    }
  );

export const centered: string =
  style(
    {
      margin: `auto`
    }
  );

export const flowBodyIntro: string =
  style(
    resetFontCss(),
    {
      textAlign: `center`,
      fontSize: `14px`,
      lineHeight: `24px`,
      paddingTop: `32px`
    }
  );
