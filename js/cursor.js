/*jslint sub : true*/

/*global hte2, setInterval, goog*/

/**
 * @constructor
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


hte2.Cursor.prototype.setPosition = function (x, y) {
        var curStyle = this.cur.style;
        curStyle.left = x + 'px';
        curStyle.top = y + 'px';
        this.cx = x;
        this.cy = y;
        curStyle.display = 'block';
    };
    
hte2.Cursor.prototype.getPosition = function () {
        return {x : this.cx, y : this.cy};
    };
    
hte2.Cursor.prototype.setHeight = function (height) {
        this.cur.style.height = height + 'px';
    };
    
hte2.Cursor.prototype.setOrdinalPosition = function (position) {
        this.ordinal = position;
    };
    
hte2.Cursor.prototype.getOrdinalPosition = function () {
        return this.ordinal;
    };
    
hte2.Cursor.prototype.onTrackerChanged = function (positionData) {
        this.setPosition(positionData['x'], positionData['y']);
        this.setHeight(positionData['height']);
        this.setOrdinalPosition(positionData['ordinal']);
    };