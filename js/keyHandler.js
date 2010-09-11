/*global hte2, goog, document, window*/

goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');

/**
 * @constructor
 */
hte2.KeyHandler = function () {
    this.handler = new goog.events.KeyHandler(document);
    this.handler.tracker = null;
    goog.events.listen(this.handler, 'key', this.intercept);
};


hte2.KeyHandler.prototype.setTracker = function (tracker) {
        this.handler.tracker = tracker;
    };
    
hte2.KeyHandler.prototype.intercept = function (ev) {
        var codes = goog.events.KeyCodes, e, curPos;
        ev.preventDefault();
        switch (ev.keyCode) {
        case codes.LEFT:
            this.tracker.symbolLeft();
            break;
        case codes.RIGHT:
            this.tracker.symbolRight();
            break;
        case codes.UP:
            this.tracker.lineUp();
            break;
        case codes.DOWN:
            this.tracker.lineDown();
            break;
        case codes.BACKSPACE:
            this.tracker.symbolLeft();
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(this.tracker.getOrdinal()).offset);
            break;
        case codes.DELETE:
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(this.tracker.getOrdinal()).offset);
            break;
        case codes.ENTER:
            hte2.Workbench.addParagraph(hte2.Measurer.calculatePosition(this.tracker.getOrdinal()).offset - 1);
            this.tracker.symbolRight();
            break;
        default:
            if (ev.charCode !== undefined && ev.charCode !== 0) {
                curPos = hte2.Measurer.calculatePosition(this.tracker.getOrdinal()).offset - 1;
                hte2.Workbench.addLetter(ev.charCode, curPos);
                this.tracker.symbolRight();
            }
            break; 
        }
        this.tracker.reNotify();
    };