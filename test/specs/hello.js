describe('Hello world page', function () {
  it('should look nice', function () {
    browser.url('https://applitools.com/helloworld');
    browser.setViewportSize({
      width: 800,
      height: 600,
    })
    browser.checkWindow('Main Page');
  })
})