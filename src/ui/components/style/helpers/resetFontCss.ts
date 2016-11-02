import * as vars from '../vars';

export function resetFontCss(): NestedCSSProperties {
  return {
    fontFamily: `-apple-system, 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif`,
    '-webkit-font-smoothing': `antialiased`,
    '-moz-osx-font-smoothing': `grayscale`,
    fontSize: vars.fontSize,
    fontWeight: vars.fontWeight
  };
}
