import { assoc } from 'ramda';
const styleguide = require('../styleguide.scss');

class CSSClasses {
  private styles;

  constructor(styles: any) {
    this.styles = Object.assign({}, styleguide, styles);
  }

  /**
   * returns a string array of modulized classes
   * @param classes
   * @returns {string[]}
   */
  list(...classes: string[]) {
    return classes.map(style => this.styles[style] || style);
  }

  /**
   * Returns a string with the classes in selector form, i.e.
   * `sel('one', 'two')` becomes `.one.two`
   * @param classes
   */
  sel(...classes: string[]) {
    return this.list.apply(this, classes)
      .map(className => '.' + className)
      .join('');
  }

  /**
   * Returns a map of the classes suitable to pass into snabbdom. i.e.
   * `map('one', 'two')` becomes `{one: true, two: true}`
   * @param classes
   */
  map(...classes: string[]) {
    return this.list.apply(this, classes)
      .reduce((acc, className) =>
        assoc(className, true, acc),
      {});
  }
}

/**
 * Utility functions for class names. Pass in a classes object as returned by
 * require('styles.css') and then use the functions on the returned object for
 * modulized class names in various formats:
 *
 *   const classes = cssClasses(require('styles.scss'))
 *   div(classes.sel('one', 'two')) => <div class="one two"></div>
 *
 * @param styles
 * @returns {CSSClasses}
 */
export function cssClasses(styles: any) {
  return new CSSClasses(styles);
}
