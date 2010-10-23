/*global hte2, goog, setInterval, clearInterval*/

/**
 * @fileoverview
 * File contains comet client.
 */

/**
 * Class represents comet client that listens for the server and gets data 
 * about other users actions. Class opens channel according to the document UID.
 * @constructor
 * @param {String} docId UUID
 * @param {String} userId UUID
 */

hte2.Comet = function (docId, userId) {
    this.xhr = new goog.net.XhrIo();
    var id = docId, checkState;
    goog.events.listen(this.xhr, goog.net.EventType.READY_STATE_CHANGE, function (e) {
        var rt = e.target.getResponseText(), parts, coords, cursor, data;
        parts = rt.split('\n');
        data = goog.json.parse(parts[parts.length - 1]);
        if (data['user']['id'] !== userId) {
            cursor = hte2.Comet.cursorMap.get(data['user']['id']);
            if (!cursor) {
                cursor = new hte2.Cursor(data['user']['id']);
                hte2.Comet.cursorMap.set(data['user']['id'], cursor);
            }
            cursor.onTrackerChanged(data['data']);
        }
    });
    this.xhr.send("/channel?id=" + id + "&seed=" + Math.random());
    checkState = (function (xhr, id) {
        return function () {
            if (!xhr.isActive()) {
                xhr.send("/channel?id=" + id + "&seed=" + Math.random());
            }
        };
    }(this.xhr, id));
    this.interval = setInterval(checkState, 10000);
};

/**
 * Holds data about all foreign cursors. Structure is backed by 
 * <code>goog.structs.Map</code>
 * @static
 */
hte2.Comet.cursorMap = new goog.structs.Map();

/**
 * Checks if comet session is still active.
 * @returns {Boolean}
 */
hte2.Comet.prototype.isActive = function () {
    return this.xhr.isActive();
};

/**
 * Aborts current comet session and removes all active cursors.
 */
hte2.Comet.prototype.abort = function () {
    var iter = hte2.Comet.cursorMap.getValueIterator(), cursor;
    cursor = iter.next();
    try {
        for (; cursor; cursor = iter.next()) {
            cursor.remove();
        }
    } catch (ex) {}
    clearInterval(this.interval);
    hte2.Comet.cursorMap = new goog.structs.Map();
    this.xhr.abort();
};