/*global hte2, window, document, goog */

hte2.TrackerMap = new goog.structs.Map();

/**
 * @constructor
 */
hte2.Tracker = function (pubsub) {
    this.ordinal = 0;
    this.offset = 0;
    this.listeners = [];
    this.line = null;
    this.pubsub = pubsub;
};

hte2.Tracker.prototype = {
    
    getOrdinal : function () {
        return this.ordinal;
    },
    
    getOffset : function () {
        return this.offset;
    },
    
    setOffset : function (offset) {
        this.offset = offset;
        this.pubsub.publish('positionSet', offset);
    },
    
    addListener : function (listener, xPosition) {
        this.listeners.push(listener);
    },
    
    setLine : function (target, xPosition) {
        this.line = target;
        var position = hte2.Measurer.calculatePosition(xPosition, true);
        this.ordinal = position.ordinal;
        this.setOffset(position.offset);
        this.pubsub.publish('trackerChanged', position);
    },
    
    setLineByOrdinal : function (target, ordinal) {
        this.line = target;
        var position = hte2.Measurer.calculatePosition(ordinal);
        this.ordinal = position.ordinal;
        this.setOffset(position.offset);
        this.pubsub.publish('trackerChanged', position);
    },
    
    getLine : function () {
        return this.line;
    },
    
    lineUp : function () {
        if (this.line.previousSibling.id !== "hte-cursor") {
            this.line = this.line.previousSibling;
            var position = hte2.Measurer.calculatePosition(this.ordinal);
            this.setOffset(position.offset);
            this.ordinal = position.ordinal;
            this.pubsub.publish('positionSet', position.offset);
            this.pubsub.publish('trackerChanged', position);
        }
    },
    
    lineDown : function () {
        if (this.line.nextSibling) {
            this.line = this.line.nextSibling;
            var position = hte2.Measurer.calculatePosition(this.ordinal);
            this.setOffset(position.offset);
            this.ordinal = position.ordinal;
            this.pubsub.publish('positionSet', position.offset);
            this.pubsub.publish('trackerChanged', position);
        }
    },
    
    symbolLeft : function () {
        var position;
        this.ordinal -= 1;
        if (this.ordinal < 0) {
            this.lineUp();
            this.ordinal = this.line.firstChild.firstChild.nodeValue.length;
        }
        position = hte2.Measurer.calculatePosition(this.ordinal);
        this.setOffset(position.offset);
        this.pubsub.publish('trackerChanged', position);
    },
    
    symbolRight : function () {
        var strParts, i, length = 0, firstWordLength, position;
        this.ordinal += 1;
        strParts = this.line.childNodes;
        for (i = 0; i < strParts.length; i += 1) {
            if (strParts[i].firstChild) {
                length += strParts[i].firstChild.nodeValue.length;
            }
        }
        if (this.ordinal > length) {
            this.lineDown();
            this.ordinal = this.ordinal - length;
        }
        position = hte2.Measurer.calculatePosition(this.ordinal);
        this.setOffset(position.offset);
        this.pubsub.publish('trackerChanged', position);
    },
    
    reNotify : function () {
        this.pubsub.publish('trackerChanged', 
            hte2.Measurer.calculatePosition(this.ordinal));
    }
};

