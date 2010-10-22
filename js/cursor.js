/*jslint sub : true*/

/*global hte2, setInterval, goog*/

/**
 * Class encapsulates visual representation of cursor. Every cursor instance is 
 * associated with user, so number of unique users editing the document equals 
 * number of cursors.
 * @constructor
 * @param {String} id user UID
 */
hte2.Cursor = function (id) {
    var dh = new goog.dom.DomHelper(), blink, parent;
    parent = dh.getElement('hte-workbench');
    this.cur = dh.createDom('div', {
        'id' : 'hte-cursor-' + id,
        'class' : 'hte-cursor'
    });
    dh.appendChild(parent, this.cur);
    blink = (function (cur) {
        return function () {
            cur.style.display = cur.style.display === 'block' ? 'none' : 'block';
        };
    }(this.cur));
    this.ordinal = 0;
    this.cx = 0;
    this.cy = 0;
    setInterval(blink, 600);
};

/**
 * Sets the cursor to the position provided as parameters.
 * @param {Number} x
 * @param {Number} y
 */
hte2.Cursor.prototype.setPosition = function (x, y) {
        var curStyle = this.cur.style;
        curStyle.left = x + 'px';
        curStyle.top = y + 'px';
        this.cx = x;
        this.cy = y;
        curStyle.display = 'block';
    };

/**
 * Returns current cursor position
 * @returns {Object} json object like: <code>{'x' : 1, 'y' : 1}</code>
 */
hte2.Cursor.prototype.getPosition = function () {
        return {x : this.cx, y : this.cy};
    };

/**
 * Sets cursor height.
 * @param {Number} height
 */
hte2.Cursor.prototype.setHeight = function (height) {
        this.cur.style.height = height + 'px';
    };

/**
 * Method sets the ordinal position of the cursor 
 * (ordinal = letter from the beginning of the line)
 * @param {Object} position
 */
hte2.Cursor.prototype.setOrdinalPosition = function (position) {
        this.ordinal = position;
    };

/**
 * Returns current ordinal position of the cursor. 
 * (ordinal = letter from the beginning of the line)
 * @returns {Number}
 */
hte2.Cursor.prototype.getOrdinalPosition = function () {
        return this.ordinal;
    };

/**
 * Method should be a listener of appropriate <code>hte2.Tracker</code>. Method 
 * is responsible for cursor positioning.
 * @param {Object} positionData
 */
hte2.Cursor.prototype.onTrackerChanged = function (positionData) {
        this.setPosition(positionData['x'], positionData['y']);
        this.setHeight(positionData['height']);
        this.setOrdinalPosition(positionData['ordinal']);
    };

/**
 * Method removes DOM elemnt aqssociated with the current cursor.
 */
hte2.Cursor.prototype.remove = function () {
    var dh = new goog.dom.DomHelper();
    dh.removeNode(this.cur);
}
