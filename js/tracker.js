/*jslint sub : true*/

/*global hte2, window, document, goog */

hte2.TrackerMap = new goog.structs.Map();

/**
 * Class encapsulates cursor behavior related logic.
 * @constructor
 * @param {hte2.pubsub} pubsub
 */
hte2.Tracker = function (pubsub) {
    this.ordinal = 0;
    this.offset = 0;
    this.listeners = [];
    this.line = null;
    this.pubsub = pubsub;
};

/**
 * Returns ordinal position of the cursor associated with the current tracker
 * (ordinal = letter from the beginning of the line)
 * @returns {Number}
 */
hte2.Tracker.prototype.getOrdinal = function () {
        return this.ordinal;
    };

/**
 * Returns offset position of the cursor associated with the current tracker
 * (offset = letter from the beginning of the document)
 * @returns {Number}
 */
hte2.Tracker.prototype.getOffset = function () {
        return this.offset;
    };

/**
 * Sets offset position for the current tracker, and notifies cursor.
 * @param {Number} offset
 */
hte2.Tracker.prototype.setOffset = function (offset) {
        this.offset = offset;
        this.pubsub.publish('positionSet', offset);
    };

/**
 * Method computes tracker related data by DOM node (represents line) and x 
 * coordinate
 * @param {Element} target DOM node
 * @param {Number} xPosition
 */
hte2.Tracker.prototype.setLine = function (target, xPosition) {
        this.line = target;
        var position = hte2.Measurer.calculatePosition(xPosition, true);
        this.ordinal = position['ordinal'];
        this.setOffset(position['offset']);
        this.pubsub.publish('trackerChanged', position);
    };

/**
 * @deprecated
 * @param {Element} target
 * @param {Number} ordinal
 */
hte2.Tracker.prototype.setLineByOrdinal = function (target, ordinal) {
        this.line = target;
        var position = hte2.Measurer.calculatePosition(ordinal);
        this.ordinal = position['ordinal'];
        this.setOffset(position['offset']);
        this.pubsub.publish('trackerChanged', position);
    };

/**
 * method returns current DOM node, that represents line in the document.
 * @returns {Element}
 */
hte2.Tracker.prototype.getLine = function () {
        return this.line;
    };

/**
 * Method calculates cursor related data for the line previous to the current
 */
hte2.Tracker.prototype.lineUp = function () {
        if (this.line.previousSibling.id !== "hte-cursor") {
            this.line = this.line.previousSibling;
            var position = hte2.Measurer.calculatePosition(this.ordinal);
            this.setOffset(position['offset']);
            this.ordinal = position['ordinal'];
            this.pubsub.publish('positionSet', position['offset']);
            this.pubsub.publish('trackerChanged', position);
        }
    };

/**
 * Method calculates cursor related data for the line next to the current
 */
hte2.Tracker.prototype.lineDown = function () {
        if (this.line.nextSibling) {
            this.line = this.line.nextSibling;
            var position = hte2.Measurer.calculatePosition(this.ordinal);
            this.setOffset(position['offset']);
            this.ordinal = position['ordinal'];
            this.pubsub.publish('positionSet', position['offset']);
            this.pubsub.publish('trackerChanged', position);
        }
    };

/**
 * Method calculates cursor related data for the symbol to the left from the 
 * current
 */
hte2.Tracker.prototype.symbolLeft = function () {
        var position;
        this.ordinal -= 1;
        if (this.ordinal < 0) {
            this.lineUp();
            this.ordinal = this.line.firstChild.firstChild.nodeValue.length;
        }
        position = hte2.Measurer.calculatePosition(this.ordinal);
        this.setOffset(position['offset']);
        this.pubsub.publish('trackerChanged', position);
    };

/**
 * Method calculates cursor related data for the symbol to the right from the 
 * current
 */
hte2.Tracker.prototype.symbolRight = function () {
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
        this.setOffset(position['offset']);
        this.pubsub.publish('trackerChanged', position);
    };

/**
 * Method is responsible for refiring <code>trackerChanged</code> in resopnse 
 * for outer changes (Ex. paragraph width changed)
 */
hte2.Tracker.prototype.reNotify = function () {
        this.pubsub.publish('trackerChanged', 
            hte2.Measurer.calculatePosition(this.ordinal));
    };

