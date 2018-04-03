const assert = require('assert');

module.exports = {
    checkWindow: async function (windowName, matchTimeout) {
        const results = await browser.eyes.checkWindow(windowName, matchTimeout);
        assert(results._asExpected, `eyes.checkWindow: Difference in screenshot for ${windowName}`);
    },
    checkElement: async function (selector, matchTimeout, tag) {
        // TODO get 'by' value via wdio
        const results = await browser.eyes.checkElement(selector, matchTimeout, tag);
        assert(results._asExpected, `eyes.checkElement: Difference in screenshot for ${selector}`);
    },
    checkRegion: function (selector, windowName, matchTimeout) {

    },
    checkFrame: function (selector, matchTimeout, tag) {

    },
    checkRegionInFrame: function (selector, matchTimeout, tag, isScrollable) {

    },
}