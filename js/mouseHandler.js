/*global hte2, window, document */

goog.require('goog.events');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.Range');

/**
 * @constructor
 */
hte2.MouseHandler = function (pubsub) {
    this.wb = hte2.Workbench.getWorkbench();
    this.wb.tracker = null;
    goog.events.listen(this.wb, goog.events.EventType.CLICK, this.setCursor);
    //goog.events.listen(wb, goog.events.EventType.DBLCLICK, this.selectText);
    this.tracker = null;
    this.pubsub = pubsub;
};

hte2.MouseHandler.prototype = {
    setTracker : function (tracker) {
        this.wb.tracker = tracker;
    },
    
    setCursor : function (ev) {
        var targ, posX, posY, substr, curPos, i;
        targ = ev.target;
        posX = ev.clientX;
        posY = ev.clientY;
        posX -= hte2.Workbench.getWorkbench().offsetLeft;
        if (targ.nodeName === 'SPAN') {
            posX -= parseInt(targ.parentNode.style.paddingLeft, 10)
            this.tracker.setLine(targ.parentNode, (posX - 8));
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
        rangeStart = this.tracker.getOffset() - (this.tracker.getOrdinal() - (range.getAnchorOffset() + siblingsLength));
        rangeEnd = rangeStart + rangeLength;
        this.pubsub.publish('rangeReady', rangeStart, rangeEnd, {"fw" : "bold"});
    }
};