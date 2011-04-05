/*global hte2, window, document, goog */

goog.require('goog.events');
goog.require('goog.dom.DomHelper');

/**
 * Class is responsible for interaction with mouse.
 * @constructor
 * @param {hte2.pubsub} pubsub
 */
hte2.MouseHandler = function (pubsub) {
    this.wb = hte2.Workbench.getWorkbench();
    this.tracker = null;
    var down = false, start, range = null, st, et, sp, ep, sy, ey, selection;

    goog.events.listen(this.wb, goog.events.EventType.MOUSEDOWN, function (ev) {
        if (selection) {
            selection.destroy();
            selection = null;
        }
        start = this.tracker.getOffset();
        st = ev.target;
        sp = ev.offsetX;
        sy = ev.screenY;
        down = true;
    }, false, this);

    goog.events.listen(this.wb, goog.events.EventType.MOUSEUP, function (ev) {
        var tmp;
        this.setCursor(ev);
        down = false;
        if (range !== null) {
            et = ev.target;
            ep = ev.offsetX;
            ey = ev.screenY;
            if (ey < sy) {
                tmp = st;
                st = et;
                et = tmp;
                tmp = sp;
                sp = ep;
                ep = sp;
            }
            selection = new hte2.selectionUI(st, et, sp, ep);
            this.pubsub.publish('select', range);
            range = null;
        }
    }, false, this);

    goog.events.listen(this.wb, goog.events.EventType.MOUSEMOVE,
        function (ev) {
            if (down) {
                this.setCursor(ev);
                range = new hte2.Range(start, this.tracker.getOffset());
            }
        }, false, this);

    this.tracker = null;
    this.pubsub = pubsub;
};

/**
 * Sets an instance of <code>hte2.Tracker</code> for the handler.
 * @param {hte2.Tracker} tracker
 */
hte2.MouseHandler.prototype.setTracker = function (tracker) {
        this.tracker = tracker;
    };

/**
 * Sets the cursor according to the coordinates provided in the click event.
 * @param {goog.events.Event} ev
 */
hte2.MouseHandler.prototype.setCursor = function (ev) {
        var targ, posX, posY, substr, curPos, i;
        targ = ev.target;
        posX = ev.clientX;
        posY = ev.clientY;
        posX -= hte2.Workbench.getWorkbench().offsetLeft;
        if (targ.nodeName.toLowerCase() === 'span') {
            posX -= parseInt(targ.parentNode.style.paddingLeft, 10);
            this.tracker.setLine(targ.parentNode, (posX - 8));
        }
    };
