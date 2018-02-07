const Eyes = require('eyes.selenium').Eyes;
const Http = require('selenium-webdriver/http');
const webdriver = require('selenium-webdriver');
const commands = require('./commands.js')

function attachDriver(serverUrl, sessionId) {

    var commandExecutor = new Http.Executor(new Http.HttpClient(serverUrl));

    return webdriver.WebDriver.attachToSession(commandExecutor, sessionId);
}

class ApplitoolService {
  constructor() {
    this.eyes = new Eyes();
  }

  beforeSession (config, caps) {
    if (!config.applitools || config.applitools.apiKey.length < 1) {
      throw new Error('Applitools API key must be set');
    }

    this.eyes.setApiKey(config.applitools.apiKey);

    // set options configs
    if (caps.os) {
      this.eyes.setOs(caps.os);
    }

    this.eyes.setLogHandler(new require('eyes.selenium').ConsoleLogHandler(true));

    this.eyes.setForceFullPageScreenshot(true);
  }

  before (caps) {
    browser.eyes = this.eyes;

    var opts = browser.options;
    const port = opts.port || '4444'
    const path = opts.path || '/wd/hub'
    var serverUrl = `${opts.protocol}://${opts.hostname}:${port}${path}`;

    this.driver = attachDriver(serverUrl, browser.sessionId);

    // Add commands
    Object.keys(commands).forEach(key => {
      browser.addCommand(key, commands[key]);
    })
  }

  beforeSuite (suite) {
    return this.eyes.setBatch(suite.title, browser.sessionId, Date.now());
  }

  beforeTest (test) {
    const viewport = browser.getViewportSize();

    return this.eyes.open(this.driver, "app_name", test.getName(), viewport);;
  }
  beforeStep (step) {
    return this.beforeTest(step);
  }

  afterTest (test) {
    if (test.getStatus() === 'passed') {
      return this.eyes.close();
    } else {
      return this.eyes.abortIfNotClosed();
    }
  }
  afterStep (step) {
    return this.afterTest(step);
  }

  // afterSuite (suite) {
  //   return this.eyes.setBatch(batchName, id, startDate);
  // }
}

module.exports = ApplitoolService;