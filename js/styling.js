/*global hte2, window, document, goog */

/*jslint sub:true*/

hte2.Styling = (function () {
    var Styling, styles = hte2.dataStorage.styling, dict, computedStyle,
        currentStyle, isStyleModified = false, 
        paragraphStyles = hte2.dataStorage.paragraph;
    
    currentStyle = computedStyle = {
            style : {"fs" : 12, "ff" : "Arial", "fw" : "normal", 
                "fst" : "normal"},
            start : 0,
            end : 13
        };
    
    dict = {"ff" : ["font-family", "", "fontFamily"],
            "fw" : ["font-weight", "", "fontWeight"], 
            "fs" : ["font-size", "pt", "fontSize"],
            "td" : ["text-decoration", "", "textDecoration"],
            "fst" : ["font-style", "", "fontStyle"]
        };
    
    Styling = {
        
        getStyles : function () {
            return styles;
        },
        
        setComputedStyle : function (offset) {
            var i, st = styles;
            if (offset) {
                for (i = 0;i < styles.length; i += 1) {
                    if (styles[i].start <= (offset - 1)) {
                        st = styles[i];
                    }
                }
                currentStyle = st.style;
                computedStyle = goog.object.clone(st.style);
                isStyleModified = false;
                hte2.pubsub.publish('styleChanged', computedStyle);
            }
            return computedStyle;
        },
        
        changeComputedStyle : function (attr) {
            computedStyle[attr[0]] = attr[1];
            isStyleModified = true;
        },
        
        updatePositions : function (offset, operation) {
            var i, tmp = [];
            for (i = 0; i < styles.length; i += 1) {
                if (offset < styles[i].start && styles[i].start !== 0) {
                    styles[i].start += operation === 'add' ? 1 : -1;
                }
                if (offset <= styles[i].end) {
                    styles[i].end += operation === 'add' ? 1 : -1;
                }
                tmp.push(styles[i]);
            }
            styles = tmp;
            if (isStyleModified) {
                Styling.addStyle(offset + 1, offset + 1, goog.object.clone(computedStyle));
            }
        },
        
        addStyle : function (start, end, style) {
            var i, oldStart, oldEnd;
            for (i = 0; i < styles.length; i += 1) {
                if (styles[i].start < start && styles[i].end >= start) {
                    oldEnd = styles[i].end;
                    styles[i].end = start - 1;
                    styles.splice(i + 1, 0, {"style" : style, "start" : start, "end" : end});
                    if (styles[i + 2]) {
                        styles.splice(i + 2, 0, {
                            "style": styles[i].style,
                            "start": end + 1,
                            "end": styles[i + 2].start - 1
                        });
                    } else {
                        styles.splice(i + 2, 0, {
                            "style": styles[i].style,
                            "start": end + 1,
                            "end": oldEnd
                        });
                    }
                }
            }
        },
        
        generateStyle : function (styleJSON) {
            var prop, output = "";
            
            for (prop in styleJSON) {
                if (styleJSON.hasOwnProperty(prop)) {
                    output += dict[prop][0] + ':' + styleJSON[prop] + 
                    dict[prop][1] + ';';
                }
            }
            return output;
        },
        
        copyStyleToString : function (domEl) {
            var prop, output = "";
            for (prop in dict) {
                if (dict.hasOwnProperty(prop)) {
                    if (domEl.style[dict[prop][2]]) {
                        output += dict[prop][0] + ":" +
                            domEl.style[dict[prop][2]] + ";";
                    }
                }
            }
            return output;
        },
        
        getParagraphStyles : function () {
            return paragraphStyles;
        },
        
        setParagraphStyle : function (width, left, right) {
            if (paragraphStyles["width"] !== width) {
                paragraphStyles["width"] = width;
                paragraphStyles["pl"] = left;
                paragraphStyles["pr"] = right;
                hte2.pubsub.publish('rerender');
            }
        }
    };
    
    return Styling;
}());