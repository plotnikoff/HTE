
hte2.Measurer = (function () {
    var Measurer, holder, calculateOffset, calculateYPosition, calculateHeight;
    
    holder = hte2.$('hte-measurer');
    
    calculateOffset = function () {
        var prevLine, child, strParts, i = 0, j, offset = 0, line;
        line = hte2.Tracker.getLine();
        prevLine = line.previousSibling;
        while (prevLine && prevLine.id !== 'hte-cursor') {
            child = prevLine.childNodes;
            for (j = 0; j < child.length; j += 1) {
                if (child[j].firstChild) {
                    offset += child[j].firstChild.nodeValue.length;
                }
            }
            prevLine = prevLine.previousSibling;
            i = 0;
        }
        //array is zero based, that's why we should subtract 1;
        return offset - 1;
    };
    
    calculateYPosition = function (direction) {
        return hte2.Tracker.getLine().offsetTop;
    };
    
    calculateHeight = function () {
        return hte2.Tracker.getLine().firstChild.offsetHeight;
    };
    
    Measurer = {
        
        calculatePosition : function (condition, useCoord) {
            var i = 0, j, curPos = 0, charComparator, coordComparator, comparator, line, str, strParts, ordinal = 0, xCorrection;
            curPos = parseInt(hte2.Workbench.getWorkbench().style.paddingLeft, 10);
            line = hte2.Tracker.getLine();
            strParts = line.childNodes;
            charComparator = function () {
                return ordinal < condition;
            };
            coordComparator = function () {
                return curPos <= condition;
            };
            comparator = useCoord ? coordComparator : charComparator;
            for (j = 0; j < strParts.length; j += 1) {
                str = strParts[j].firstChild;
                if (str !== null) {
                    str = str.nodeValue;
                    while (comparator()) {
                        holder.innerHTML = "<span style=\"font-weight:" + strParts[j].style.fontWeight + "\">" + str.charAt(i) + "</span>";
                        curPos += holder.firstChild.offsetWidth;
                        i += 1;
                        ordinal += 1;
                        if (i === str.length) {
                            break;
                        }
                    }
                }
                i = 0;
            }
            return {x : curPos, y : calculateYPosition(), height : calculateHeight(), ordinal : ordinal, offset : calculateOffset() + ordinal};
        },
        
        getGlyphWidth : function (glyph) {
            holder.innerHTML = glyph;
            return holder.offsetWidth;
        }
    };
    
    return Measurer;
}());