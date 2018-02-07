module.exports = {
    checkWindow: function (windowName, matchTimeout) {
        return browser.eyes.checkWindow(windowName, matchTimeout);
    },
    checkElement: function (selector, matchTimeout, tag) {
        // TODO get 'by' value via wdio
        return browser.eyes.checkElement(selector, matchTimeout, tag);
    },
    checkRegion: function (selector, windowName, matchTimeout) {

    },
    checkFrame: function (selector, matchTimeout, tag) {

    },
    checkRegionInFrame: function (selector, matchTimeout, tag, isScrollable) {

    },
}