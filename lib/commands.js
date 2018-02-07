module.exports = {
    checkWindow: function (windowName, matchTimeout) {
        const result = browser.eyes.checkWindow(windowName, 1).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log('error');
            console.log(err);
        })
        return result;
    },
    checkElement: function (selector, matchTimeout, tag) {

    },
    checkRegion: function (selector, windowName, matchTimeout) {

    },
    checkFrame: function (selector, matchTimeout, tag) {

    },
    checkRegionInFrame: function (selector, matchTimeout, tag, isScrollable) {

    },
}