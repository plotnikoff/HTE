/*global hte2, window, document */

hte2.MouseHandler = function () {
    this.wb = hte2.Workbench.getWorkbench();
    this.wb.onclick = (function (that) {
        return function (ev) {
            that.setCursor(ev);
        };
    }(this));
    this.wb.ondblclick = (function (that) {
        return function (ev) {
            that.selectText(ev);
        };
    }(this));
    this.wb.ondblclick = (function (that) {
        return function (ev) {
            that.selectText(ev);
        };
    }(this));
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
        if (targ.nodeName === 'SPAN') {
            hte2.Tracker.setLine(targ.parentNode, (posX - 8));
        }
    },
    
    selectText : function (ev) {
        var range = '', selectedText, rangeLength, rangeStart, rangeEnd, currentNode, siblingsLength = 0;
        if (window.getSelection) {
            range = window.getSelection();
        } else if (document.selection) {
            range = document.selection.createRange();
        }
        rangeLength = range.focusOffset - range.anchorOffset;
        currentNode = range.anchorNode.parentNode;
        while (currentNode) {
            currentNode = currentNode.previousSibling;
            if (currentNode) {
                siblingsLength += currentNode.firstChild.nodeValue.length;
            }
        }
        rangeStart = hte2.Tracker.getOffset() - (hte2.Tracker.getOrdinal() - (range.anchorOffset + siblingsLength));
        rangeEnd = rangeStart + rangeLength;
        hte2.pubsub.publish('rangeReady', rangeStart, rangeEnd, ["font-weight: bold"]);
    }
};