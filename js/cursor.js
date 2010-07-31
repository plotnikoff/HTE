/*global hte2, setInterval*/

hte2.Cursor = (function () {
    var cur, Cursor, ordinal = 0, cx, cy;
    
    cur = hte2.$('hte-cursor');
    
    setInterval(function () {
        cur.style.display = cur.style.display === 'block' ? 'none' : 'block';
    }, 600);
    
    Cursor = {
        setPosition : function (x, y) {
            cur.style.left = x + 'px';
            cur.style.top = y + 'px';
            cx = x;
            cy = y;
            cur.style.display = 'block';
        },
        
        getPosition : function () {
            return {x : cx, y : cy};
        },
        
        setHeight : function (height) {
            cur.style.height = height + 'px';
        },
        
        setOrdinalPosition : function (position) {
            ordinal = position;
        },
        
        getOrdinalPosition : function () {
            return ordinal;
        },
        
        onTrackerChanged : function (positionData) {
            Cursor.setPosition(positionData.x, positionData.y);
            Cursor.setHeight(positionData.height);
            Cursor.setOrdinalPosition(positionData.ordinal);
        }
    };
    
    return Cursor;
}());