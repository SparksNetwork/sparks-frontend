export function cssClassesAsSelector(...classes: string[]): string {
  return classes
    .map(name => `.${name}`)
    .join(``);
}
