/*jslint sub : true*/

/*global hte2, goog*/

/**
 * @param {DOMNode} wbContainer container to be scrolled
 */
hte2.Scroller = function (wbContainer) {
    var lasty, lastScroll = 0;
    return function (position) {
        var y = position.y, height, delta;
        if (y !== lasty) {
            height = parseInt(wbContainer.style.height, 10) - position.height * 2;
            delta = y - wbContainer.scrollTop;
            if (y > lasty && delta > height && lastScroll === wbContainer.scrollTop) {
                wbContainer.scrollTop = y - height;
            } else if (y < lasty && delta < 0 && lastScroll === wbContainer.scrollTop) {
                wbContainer.scrollTop = y;
            } else if (lastScroll !== wbContainer.scrollTop) {
                wbContainer.scrollTop = y;
            }
            lastScroll = wbContainer.scrollTop;
            lasty = y;
        }
    };
};
