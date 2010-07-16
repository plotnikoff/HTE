/*global hte2, window, document */

hte2.Tracker = (function () {
    var line, ordinal = 0, offset = 0, Tracker, listeners = [], notifyListeners;
    
    notifyListeners = function (data) {
        var length = listeners.length, i;
        for (i = 0; i < length; i += 1) {
            listeners[i].onTrackerChanged(data);
        }
    };
    
    Tracker = {
        
        getOrdinal : function () {
            return ordinal;
        },
        
        getOffset : function () {
            return offset;
        },
        
        addListener : function (listener, xPosition) {
            listeners.push(listener);
        },
        
        setLine : function (target, xPosition) {
            line = target;
            var position = hte2.Measurer.calculatePosition(xPosition, true);
            ordinal = position.ordinal;
            offset = position.offset;
            notifyListeners(position);
        },
        
        setLineByOrdinal : function (target, ord) {
            line = target;
            var position = hte2.Measurer.calculatePosition(ord);
            ordinal = position.ordinal;
            offset = position.offset;
            notifyListeners(position);
        },
        
        getLine : function () {
            return line;
        },
        
        lineUp : function () {
            line = line.previousSibling;
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        },
        
        lineDown : function () {
            line = line.nextSibling;
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        },
        
        symbolLeft : function () {
            var position;
            ordinal -= 1;
            if (ordinal < 0) {
                Tracker.lineUp();
                ordinal = line.firstChild.firstChild.nodeValue.length;
            }
            position = hte2.Measurer.calculatePosition(ordinal);
            offset = position.offset;
            notifyListeners(position);
            console.log(offset);
        },
        
        symbolRight : function () {
            var strParts, i, length = 0, firstWordLength, position;
            console.log(ordinal)
            ordinal += 1;
            strParts = line.childNodes;
            for (i = 0; i < strParts.length; i += 1) {
                if (strParts[i].firstChild) {
                    length += strParts[i].firstChild.nodeValue.length;
                }
            }
            if (ordinal > length) {
                Tracker.lineDown();
                ordinal = ordinal - length;
            }
            position = hte2.Measurer.calculatePosition(ordinal);
            offset = position.offset;
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        }
    };
    
    return Tracker;
}());
