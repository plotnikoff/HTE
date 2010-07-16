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
        var range = '', selectedText, rangeLength, rangeStart, rangeEnd;
        if (window.getSelection) {
            range = window.getSelection();
        } else if (document.selection) {
            range = document.selection.createRange();
        }
        rangeLength = range.focusOffset - range.anchorOffset;
        rangeStart = hte2.Tracker.getOffset() - (hte2.Tracker.getOrdinal() - range.anchorOffset);
        rangeEnd = rangeStart + rangeLength;
        hte2.Styling.addStyle(rangeStart, rangeEnd, ["font-weight: bold"]);
        hte2.Workbench.render();
        /*console.log(range.anchorNode);
        console.log("range start " + rangeStart);
        console.log("range length  " + rangeLength);
        console.log("range end " + rangeEnd);*/
    }
};