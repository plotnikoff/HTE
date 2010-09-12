/*global hte2, goog, setInterval*/

/**
 * @constructor
 * @param {Object} docId
 */
hte2.Comet = function (docId) {
    this.xhr = new goog.net.XhrIo();
    var id = docId, checkState;
    goog.events.listen(this.xhr, goog.net.EventType.READY_STATE_CHANGE, function (e) {
        //console.log(e.target.getResponseText());
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

hte2.Comet.prototype.isActive = function () {
    return this.xhr.isActive();
};

hte2.Comet.prototype.abort = function () {
    clearInterval(this.interval);
    this.xhr.abort();
};