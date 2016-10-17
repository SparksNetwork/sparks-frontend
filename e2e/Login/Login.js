// @TODO replace strings with node-polyglot translations
const URL = 'http://localhost:8080/login'

function containsText (element, text) {
  return '//' + element + '[text()="' + text + '"]'
}

describe('Landing page', function () {
  it('should show login form', (browser) => {
    browser
      .url(URL)
      .deleteCookies()
      .waitForElementVisible('body')
      .waitForElementVisible('form')
  })

  describe('federated login buttons', () => {
    it('should show google login button', (browser) => {
      browser
        .useXpath()
        .assert.visible(containsText('*', 'Login with Google'))
    })

    it('should show facebook login button', (browser) => {
      browser
        .useXpath()
        .assert.visible(containsText('*','Login with Facebook'))
    })
  })

  describe('Email And Password Form', function () {
    it('should show email label', (browser) => {
      browser.useXpath()
        .assert.visible(containsText('label', 'Email'))
    })

    it('should show password label', (browser) => {
      browser.useXpath()
        .assert.visible(containsText('label/*', 'Password'))
    })

    it('should show 2 inputs', function (browser) {
      browser.elements('tag name', 'input', function (result) {
        this.assert.equal(result.value.length, 2)
      })
    })

    it('should show submit button', (browser) => {
      browser.useXpath()
        .assert.visible(containsText('*', 'Submit'))
    })
  })
})
