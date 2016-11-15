import { style, cssRule, extend } from 'typestyle';
import {
  resetFontCss, inlineBlockCss, resetBoxModelCss
} from '../../style/helpers';

// internal variables
const backgroundColor: string = `#f2f2f2`;

export const uniqueRoot: string =
  `sn-pop-over`;

export const container: string =
  style(
    resetBoxModelCss(),
    {
      position: `relative`
    }
  );

export const wrapper: string =
  style(
    resetBoxModelCss(),
    {
      position: `absolute`,
      zIndex: 1042
    }
  );

export const wrapperDirectionTopAlignCenter: string = style({
  transform: `translate(-50%, -100%)`
});

export const wrapperDirectionTopAlignLeft: string = style({
  transform: `translate(-90%, -100%)`
});

export const wrapperDirectionTopAlignRight: string = style({
  transform: `translate(-10%, -100%)`
});

export const wrapperDirectionBottomAlignCenter: string = style({
  transform: `translate(-50%, 0%)`
});

export const wrapperDirectionBottomAlignLeft: string = style({
  transform: `translate(-90%, 0%)`
});

export const wrapperDirectionBottomAlignRight: string = style({
  transform: `translate(-10%, 0%)`
});

export const directionTop: string =
  `sn-pop-over-direction-top`;

export const directionBottom: string =
  `sn-pop-over-direction-bottom`;

export const alignCenter: string =
  `sn-pop-over-align-center`;

export const alignLeft: string =
  `sn-pop-over-align-left`;

export const alignRight: string =
  `sn-pop-over-align-right`;

const beforeObject: NestedCSSProperties =
  {
    backgroundColor,
    borderLeft: `1px solid transparent`,
    borderRight: `1px solid transparent`,
    content: `''`,
    height: `16px`,
    width: `16px`,
    position: `absolute`,
    zIndex: -1,
  }

cssRule(
  `.${directionTop}::before`,
  extend(
    beforeObject,
    {
      transform: `translate(-50%, -50%) rotate(225deg)`
    }));

cssRule(
  `.${directionTop}.${alignCenter}::before`,
  {
    top: `100%`,
    left: `50%`
  });

cssRule(
  `.${directionTop}.${alignLeft}::before`,
  {
    top: `100%`,
    left: `90%`
  });

cssRule(
  `.${directionTop}.${alignRight}::before`,
  {
    top: `100%`,
    left: `10%`
  });

cssRule(
  `.${directionBottom}::before`,
  extend(
    beforeObject,
    {
      transform: `translate(-50%, -50%) rotate(45deg)`
    }));

cssRule(
  `.${directionBottom}.${alignCenter}::before`,
  {
    top: 0,
    left: `50%`
  });

cssRule(
  `.${directionBottom}.${alignLeft}::before`,
  {
    top: 0,
    left: `90%`
  });

cssRule(
  `.${directionBottom}.${alignRight}::before`,
  {
    top: 0,
    left: `10%`
  });

const popOverContentCss: NestedCSSProperties =
  extend(
    inlineBlockCss(),
    resetBoxModelCss(),
    resetFontCss()
  );

export const popOverContent: string =
  `sn-pop-over-content`

export const typeError: string =
  `sn-pop-over-type-error`;

cssRule(
  `.${typeError}`,
  extend(
    popOverContentCss,
    {
      backgroundColor: `#fae9a3`,
      borderColor: `rgba(185, 149, 1, 0.5)`,
      fontSize: `17px`,
      fontWeight: 400,
      textAlign: `center`,
    }));

cssRule(
  `.${typeError}::before`,
  {
    backgroundColor: `#fae9a3`,
    borderColor: `rgba(185, 149, 1, 0.5)`,
  });

export const typeInfo: string =
  `sn-pop-over-type-info`;

cssRule(
  `.${typeInfo}`,
  extend(
    popOverContentCss,
    {
      backgroundColor,
      borderColor: `transparent`,
      boxShadow: `none`,
      padding: `16px`,
      fontSize: `16px`,
      fontWeight: 400
    }));

cssRule(
  `.${typeInfo}::before`,
  {
    backgroundColor,
    borderColor: `transparent`,
  });

export const message: string =
  style({});
