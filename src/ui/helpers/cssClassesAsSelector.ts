export function cssClassesAsSelector(...classes: (string | undefined | boolean)[]): string {
  return classes
    .filter(x => !!x)
    .map(name => `.${name}`)
    .join(``);
}
