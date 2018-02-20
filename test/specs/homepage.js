describe('WebdriverIO Home page', function () {
  it('should look nice', function () {
    browser.url('./');
    browser.setViewportSize({
      width: 800,
      height: 600,
    })
    browser.checkWindow('Homepage - Default');
  })
})