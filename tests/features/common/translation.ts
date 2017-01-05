import { join } from 'path';
import { languageCodes } from './';

export function translation(language: string): any {
  const path: string =
    join(
      __dirname,
      `../../../../dist/locales/${languageCodes[language]}/translation.json`
    );

  return require(path);
}
