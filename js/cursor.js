/*global hte2, setInterval, goog*/

/**
 * @constructor
 */
hte2.Cursor = function () {
    var dh = new goog.dom.DomHelper(), blink;
    this.cur = dh.$('hte-cursor');
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

hte2.Cursor.prototype = {
    setPosition : function (x, y) {
        var curStyle = this.cur.style;
        curStyle.left = x + 'px';
        curStyle.top = y + 'px';
        this.cx = x;
        this.cy = y;
        curStyle.display = 'block';
    },
    
    getPosition : function () {
        return {x : this.cx, y : this.cy};
    },
    
    setHeight : function (height) {
        this.cur.style.height = height + 'px';
    },
    
    setOrdinalPosition : function (position) {
        this.ordinal = position;
    },
    
    getOrdinalPosition : function () {
        return this.ordinal;
    },
    
    onTrackerChanged : function (positionData) {
        this.setPosition(positionData.x, positionData.y);
        this.setHeight(positionData.height);
        this.setOrdinalPosition(positionData.ordinal);
    }
};