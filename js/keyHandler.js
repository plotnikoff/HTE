/*jslint sub : true*/

/*global hte2, goog, document, window*/

goog.require('goog.events');
goog.require('goog.events.KeyHandler');
goog.require('goog.events.KeyCodes');

/**
 * Class is responsible for interaction with keyboar. 
 * @constructor
 */
hte2.KeyHandler = function () {
    this.handler = new goog.events.KeyHandler(document);
    this.handler.tracker = null;
    goog.events.listen(this.handler, 'key', this.intercept);
};


/**
 * Sets an instance of <code>hte2.Tracker</code> for the handler.
 * @param {hte2.Tracker} tracker
 */
hte2.KeyHandler.prototype.setTracker = function (tracker) {
        this.handler.tracker = tracker;
    };

/**
 * Method is responsible for key events interception and calling appropriate 
 * methods of <code>hte2.Tracker</code> and <code>hte2.Workbench</code>.
 * @param {goog.events.KeyEvent} ev
 */ 
hte2.KeyHandler.prototype.intercept = function (ev) {
        var codes = goog.events.KeyCodes, e, curPos, offset, symb;
        if (!ev.ctrlKey) {
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
                hte2.Workbench.removeSymbol(hte2.Measurer.calculatePosition(this.tracker.getOrdinal())['offset']);
                break;
            case codes.DELETE:
                hte2.Workbench.removeSymbol(hte2.Measurer.calculatePosition(this.tracker.getOrdinal())['offset']);
                break;
            case codes.ENTER:
                hte2.Workbench.addParagraph(hte2.Measurer.calculatePosition(this.tracker.getOrdinal())['offset'] - 1);
                this.tracker.symbolRight();
                break;
            case codes.HOME:
                this.tracker.toStartOfLine();
                break;
            case codes.END:
                this.tracker.toEndOfLine();
                break;
            default:
                if (ev.charCode !== undefined && ev.charCode !== 0) {
                    curPos = hte2.Measurer.calculatePosition(this.tracker.getOrdinal())['offset'] - 1;
                    hte2.Workbench.addSymbol(ev.charCode, curPos);
                    this.tracker.symbolRight();
                }
                break;
            }
            this.tracker.reNotify();
        } else {
            switch (ev.keyCode) {
            case codes.LEFT:
                do {
                    offset = this.tracker.symbolLeft(true).offset;
                    symb = hte2.Workbench.getSymbol(offset - 1);
                } while (symb !== ' ');
                this.tracker.fireSuppressedEvent();
                break;
            case codes.RIGHT:
                do {
                    offset = this.tracker.symbolRight(true).offset;
                    symb = hte2.Workbench.getSymbol(offset);
                } while (symb !== ' ');
                this.tracker.fireSuppressedEvent();
                break;
            }
        }
    };
