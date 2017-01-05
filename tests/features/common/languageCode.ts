let languageCode = 'en-US';

export function setLanguageCode(code: string) {
  languageCode = code;
}

export function getLanguageCode(): string {
  return languageCode;
}

export const languageCodes: any =
  {
    'Spanish': `es-ES`,
    'American English': `en-US`,
  };
