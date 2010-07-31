/*global hte2, window, document */

goog.require('goog.events');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.Range');

hte2.MouseHandler = function () {
    var wb = hte2.Workbench.getWorkbench();
    goog.events.listen(wb, goog.events.EventType.CLICK, this.setCursor);
    goog.events.listen(wb, goog.events.EventType.DBLCLICK, this.selectText);
};

hte2.MouseHandler.prototype = {
    setCursor : function (ev) {
        var e = ev ? ev : window.event, targ, posX, posY, substr, curPos, i;
        targ = e.target ? e.target : e.srcElement;
        if (e.pageX || e.pageY) {
            posX = e.pageX;
            posY = e.pageY;
        } else if (e.clientX || e.clientY) {
            posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        posX -= hte2.Workbench.getWorkbench().offsetLeft;
        if (targ.nodeName === 'SPAN') {
            hte2.Tracker.setLine(targ.parentNode, (posX - 8));
        }
    },
    
    selectText : function (ev) {
        var range = '', selectedText, rangeLength, rangeStart, rangeEnd, currentNode, siblingsLength = 0, dh = goog.dom.getDomHelper();
        range = goog.dom.Range.createFromWindow();
        rangeLength = range.getFocusOffset() - range.getAnchorOffset();
        currentNode = range.getContainerElement();
        while (currentNode) {
            currentNode = dh.getPreviousElementSibling(currentNode);
            if (currentNode) {
                siblingsLength += currentNode.firstChild.nodeValue.length;
            }
        }
        rangeStart = hte2.Tracker.getOffset() - (hte2.Tracker.getOrdinal() - (range.getAnchorOffset() + siblingsLength));
        rangeEnd = rangeStart + rangeLength;
        hte2.pubsub.publish('rangeReady', rangeStart, rangeEnd, {"fw" : "bold"});
    }
};