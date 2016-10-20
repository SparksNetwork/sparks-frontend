const Polyglot = require('node-polyglot')
const translations = require('../src/translations')

const polyglot = new Polyglot()
polyglot.extend(translations['en-US'])

function containsText (element, text) {
  return '//' + element + '[text()="' + polyglot.t(text) + '"]'
}

module.exports = containsText
