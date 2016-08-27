const URL = 'http://localhost:8080'

const {describe, it} = global

describe('Landing page', () => {
  it('should show a welcoming', (browser) => {
    browser
      .url(URL)
      .waitForElementVisible('body', 2000)
      .pause(100)
      .assert.containsText('.welcome', 'Motorcycle Diversity')
  })

  it('should route to the Login page after 3 seconds', (browser) => {
    browser.pause(4000)
      .assert.containsText('.login', 'Login page')
      .end()
  })
})
