/*global hte2, goog, document, window*/

goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');


hte2.KeyHandler = function () {
    var handler = new goog.events.KeyHandler(document);
    goog.events.listen(handler, 'key', this.intercept);

    //document.onkeypress = this.intercept;
};

hte2.KeyHandler.prototype = {
    intercept : function (ev) {
        
        var codes = goog.events.KeyCodes, e, curPos;
        if (ev.keyCode === codes.SPACE) {
            ev.preventDefault();
        }
        //e = ev ? ev : window.event;
        /*if (e.keyCode) {
            code = e.keyCode;
        } else if (e.which) {
            code = e.which;
        }*/
        switch (ev.keyCode) {
        case codes.LEFT:
            hte2.Tracker.symbolLeft();
            break;
        case codes.RIGHT:
            hte2.Tracker.symbolRight();
            break;
        case codes.UP:
            hte2.Tracker.lineUp();
            break;
        case codes.DOWN:
            hte2.Tracker.lineDown();
            break;
        case codes.BACKSPACE:
            hte2.Tracker.symbolLeft();
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset);
            break;
        case codes.DELETE:
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset);
            break;
        default:
            if (ev.charCode !== undefined) {
                //hte2.Workbench.addLetter(code, hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset - 1);
                hte2.Workbench.addLetter(ev.charCode, hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset - 1);
                hte2.Tracker.symbolRight();
            }
            break; 
        }
    }
};