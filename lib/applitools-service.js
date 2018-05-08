const {Eyes, StitchMode} = require('@applitools/eyes.webdriverio');
const {ConsoleLogHandler} = require('@applitools/eyes.sdk.core');
const commands = require('./commands.js')

class ApplitoolService {
  constructor() {
    this.eyes = new Eyes();

    this.defaultSettings = {
      forceFullPageScreenshot: true,
      hideScrollbars: true,
      defaultMatchTimeout: null,
      matchLevel: null,
      stitchMode: StitchMode.CSS
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
        this.eyes.setLogHandler(new ConsoleLogHandler(true));
      } else {
        // TODO log to file
      }
    }

    const settings = { ...config.applitools, ...this.defaultSettings };

    this.eyes.setForceFullPageScreenshot(settings.forceFullPageScreenshot);
    this.eyes.setHideScrollbars(settings.hideScrollbars);

    if (settings.defaultMatchTimeout) {
      this.eyes.setDefaultMatchTimeout(settings.defaultMatchTimeout);
    }
    if (settings.matchLevel) {
      this.eyes.setMatchLevel(settings.matchLevel);
    }

    this.batchId = settings.batchId;

    this.settings = settings;
  }

  before (caps) {
    this._browser = browser;

    // store the eyes instantiation for later use
    browser.eyes = this.eyes;

    const stitchMode = this.settings.stitchMode;

    // Add commands
    Object.keys(commands).forEach(function (key) {
      browser.addCommand(key, function (...args) {
        // Set the stitch mode only if we're running the actual command
        // This prevents an issue where the CSS stitch move prevents scrolling on all tests
        this.eyes.setStitchMode(stitchMode);

        return commands[key](...args);
      });
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

    return this.eyes.open(this._browser, "app_name", testName);
  }

  beforeTest (test) {
    return this.openEyes(`${test.parent}: ${test.title}`);
  }
  beforeStep (step) {
    return this.openEyes(`${step.scenario.name}: ${step.name}`)
  }

  async afterTest (test) {
    try {
      const results = await this.eyes.close(false);

      browser.applitoolsUrl = results._url;
    } catch (err) {
      await this.eyes.abortIfNotClosed()
    }
  }
  async afterStep (step) {
    await this.afterTest(step);
  }

  // TODO log out the batch url for easier reference
}

module.exports = ApplitoolService;