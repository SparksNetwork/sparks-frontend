import { filter, map } from 'ramda';

export function cssClassesAsSelector(
    ...classes: (string | undefined | boolean)[]): string {

  const truthyValues: (string | undefined | boolean)[] =
    filter(value => !!value, classes);

  const selectors: string[] =
    map(name => `.${name}`, truthyValues);

  return selectors.join(``);
}
