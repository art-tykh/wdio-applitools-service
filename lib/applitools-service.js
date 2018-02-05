const Eyes = require('eyes.selenium');

class ApplitoolService {
  constructor() {
    this.eyes = new Eyes();
  }

  onPrepare (config) {
    return new Promise((resolve, reject) => {
      eyes.setApiKey(config.applitoolsApiKey);

      return resolve()
    })
  }

  beforeSuite (suite) {
      eyes.open(driver, app_name, test_name, viewport_size);
  }

  afterSuite (suite) {

  }
}

module.exports = ApplitoolService;