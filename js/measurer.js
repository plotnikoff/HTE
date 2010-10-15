/*global hte2, goog*/

hte2.Measurer = (function () {
    var Measurer, holder, calculateOffset, calculateYPosition, calculateHeight,
    dh = new goog.dom.DomHelper();
    
    holder = dh.getElement('hte-measurer');
    
    calculateOffset = function () {
        var prevLine, child, strParts, i = 0, j, offset = 0, line;
        line = hte2.TrackerMap.get('_lcl_').getLine();
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
    
    calculateYPosition = function (currentNode) {
        return currentNode.offsetTop;
    };
    
    calculateHeight = function (currentNode) {
        return currentNode.offsetHeight;
    };
    
    Measurer = {
        
        calculatePosition : function (condition, useCoord) {
            var i = 0, j, curPos = 0, charComparator, coordComparator, 
                comparator, line, str, strParts, ordinal = 1, xCorrection,
                currentNode;
            curPos = parseInt(hte2.Workbench.getWorkbench().style.paddingLeft, 10);
            line = hte2.TrackerMap.get('_lcl_').getLine();
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
                        holder.innerHTML = "<span style=\"" + 
                            hte2.Styling.copyStyleToString(strParts[j]) + 
                            "\">" + str.charAt(i) + "</span>";
                        curPos += holder.firstChild.offsetWidth;
                        i += 1;
                        ordinal += 1;
                        currentNode = strParts[j];
                        if (i === str.length) {
                            break;
                        }
                    }
                }
                i = 0;
            }
            if (!currentNode) {
                currentNode = strParts[0];
            }
            return {'x' : curPos + parseInt(line.style.paddingLeft, 10), 
                'y' : calculateYPosition(currentNode), 
                'height' : calculateHeight(currentNode), 
                'ordinal' : ordinal, 
                'offset' : calculateOffset() + ordinal};
        },
        
        getGlyphWidth : function (glyph) {
            holder.innerHTML = glyph;
            return holder.offsetWidth;
        }
    };
    
    return Measurer;
}());