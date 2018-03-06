const Eyes = require('eyes.selenium').Eyes;
const Http = require('selenium-webdriver/http');
const webdriver = require('selenium-webdriver');
const commands = require('./commands.js')

class ApplitoolService {
  constructor() {
    this.eyes = new Eyes();

    this.defaultSettings = {
      forceFullPageScreenshot: true,
      hideScrollbars: true,
      defaultMatchTimeout: null,
      matchLevel: null,
      stitchMode: Eyes.StitchMode.CSS
    }
  }

  beforeSession (config, caps) {
    if (!config.applitools || !config.applitools.apiKey || config.applitools.apiKey.length < 1) {
      throw new Error('Applitools API key must be set');
    }

    this.eyes.setApiKey(config.applitools.apiKey);

    // set options configs
    if (caps.os) {
      this.eyes.setOs(caps.os);
    }

    if (config.applitools.logHandler) {
      if (config.applitools.logHandler === 'console') {
        this.eyes.setLogHandler(new (require('eyes.selenium')).ConsoleLogHandler(true));
      } else {
        // log to file
      }
    }

    const settings = { ...config.applitools, ...this.defaultSettings };

    this.eyes.setForceFullPageScreenshot(settings.forceFullPageScreenshot);
    this.eyes.setStitchMode(settings.stitchMode);
    this.eyes.setHideScrollbars(settings.hideScrollbars);

    if (settings.defaultMatchTimeout) {
      this.eyes.setDefaultMatchTimeout(settings.defaultMatchTimeout);
    }
    if (settings.matchLevel) {
      this.eyes.setMatchLevel(settings.matchLevel);
    }

    this.batchId = settings.batchId;
  }

  before (caps) {
    // store the eyes instantiation for later use
    browser.eyes = this.eyes;

    // create a driver for Eyes to use
    const opts = browser.options;
    const port = opts.port || '4444'
    const path = opts.path || '/wd/hub'
    const serverUrl = `${opts.protocol}://${opts.hostname}:${port}${path}`;
    const commandExecutor = new Http.Executor(new Http.HttpClient(serverUrl));
    this.driver = webdriver.WebDriver.attachToSession(commandExecutor, browser.sessionId);

    // Add commands
    Object.keys(commands).forEach(key => {
      browser.addCommand(key, commands[key]);
    })
  }

  beforeSuite (suite) {
    return this.eyes.setBatch(suite.title, this.batchId);
  }
  beforeFeature (feature) {
    return this.eyes.setBatch(feature.name, this.batchId);
  }

  openEyes (testName) {
    const viewport = browser.getViewportSize();

    return this.eyes.open(this.driver, "app_name", testName);
  }

  beforeTest (test) {
    return this.openEyes(`${test.parent}: ${test.title}`);
  }
  beforeStep (step) {
    return this.openEyes(`${step.scenario.name}: ${step.name}`)
  }

  async afterTest (test) {
    try {
      await this.eyes.close();
    } catch (err) {
    // TODO fail the test
      // console.log(err);
      console.log('Diff in screenshot');
    } finally {
      await this.eyes.abortIfNotClosed()
    }
  }
  afterStep (step) {
    return this.afterTest(step);
  }

  // TODO log out the batch url for easier reference
}

module.exports = ApplitoolService;