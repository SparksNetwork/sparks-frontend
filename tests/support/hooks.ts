import { setLanguageCode } from '../features/common';

export = function () {
  this.Before(function () {
    setLanguageCode(`en-US`);
  });

  this.After(function () {
    return this.end();
  });
}
