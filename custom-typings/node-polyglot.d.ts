interface Translations {
  [language: string]: {[word: string]: any}
}

declare class Polyglot {
  extend(translations: Translations): void;
  t(key: string, options: any); void;
}

export = Polyglot;
