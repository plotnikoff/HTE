/*global hte2, goog, setInterval, clearInterval*/

/**
 * @constructor
 * @param {Object} docId
 */

hte2.Comet = function (docId) {
    this.xhr = new goog.net.XhrIo();
    var id = docId, checkState;
    goog.events.listen(this.xhr, goog.net.EventType.READY_STATE_CHANGE, function (e) {
        var rt = e.target.getResponseText(), parts, coords;
        parts = rt.split('\n');
        data = goog.json.parse(parts[parts.length - 1]);
        cursor = hte2.Comet.cursorMap.get(data.user.id);
        if (!cursor) {
            cursor = new hte2.Cursor(data.user.id);
            hte2.Comet.cursorMap.set(data.user.id, cursor);
        }
        cursor.onTrackerChanged(data.data);
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

hte2.Comet.cursorMap = new goog.structs.Map()

hte2.Comet.prototype.isActive = function () {
    return this.xhr.isActive();
};

hte2.Comet.prototype.abort = function () {
    clearInterval(this.interval);
    this.xhr.abort();
};