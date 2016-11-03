export function resetBoxModelCss(): NestedCSSProperties {
  return {
    backgroundClip: `padding-box`,
    boxSizing: `border-box`,
  }
}
