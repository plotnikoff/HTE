/*jslint sub : true*/

/*global hte2, window, document, goog */

hte2.Styling = (function () {
    var Styling, styles, dict, computedStyle, currentStyle, 
        isStyleModified = false, addStyle, addParagraph, paragraphStyles;
    
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
    
    addStyle = function (start, end, style) {
        var i, oldStart, oldEnd;
        for (i = 0; i < styles.length; i += 1) {
            if (styles[i]["start"] < start && styles[i]["end"] >= start) {
                oldEnd = styles[i]["end"];
                styles[i]["end"] = start - 1;
                styles.splice(i + 1, 0, {"style" : style, "start" : start, "end" : end});
                if (styles[i + 2]) {
                    styles.splice(i + 2, 0, {
                        "style": styles[i]["style"],
                        "start": end + 1,
                        "end": styles[i + 2]["start"] - 1
                    });
                } else {
                    styles.splice(i + 2, 0, {
                        "style": styles[i]["style"],
                        "start": end + 1,
                        "end": oldEnd
                    });
                }
            }
        }
    };
    
    Styling = {
        
        getStyles : function () {
            return styles;
        },
        
        setStyles : function (style) {
            styles = style;
        },
        
        addParagraph : function (position) {
            var i;
            for (i = 0; i < paragraphStyles.length; i += 1) {
                if (position < paragraphStyles[i]["end"]) {
                    paragraphStyles.splice(i + 1, 0, {
                        "width" : paragraphStyles[i]["width"], 
                        "pl" : paragraphStyles[i]["pl"], 
                        "pr" : paragraphStyles[i]["pr"],
                        "start" : position,
                        "end" : paragraphStyles[i]["end"]
                    });
                    paragraphStyles[i]["end"] = position - 1;
                    break;
                }
            }
        },
        
        setComputedStyle : function (offset) {
            var i, st = styles;
            if (offset) {
                for (i = 0;i < styles.length; i += 1) {
                    if (styles[i]["start"] <= (offset - 1)) {
                        st = styles[i];
                    }
                }
                currentStyle = st["style"];
                computedStyle = goog.object.clone(st["style"]);
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
                if (offset < styles[i]["start"] && styles[i]["start"] !== 0) {
                    styles[i]["start"] += operation === 'add' ? 1 : -1;
                }
                if (offset <= styles[i]["end"]) {
                    styles[i]["end"] += operation === 'add' ? 1 : -1;
                }
                tmp.push(styles[i]);
            }
            styles = tmp;
            tmp = [];
            for (i = 0; i < paragraphStyles.length; i += 1) {
                if (operation !== 'add' && offset === paragraphStyles[i]["start"]) {
                    paragraphStyles[i - 1]["end"] = paragraphStyles[i]["end"] - 1;
                    paragraphStyles[i + 1]["start"] = paragraphStyles[i]["end"] + 1;
                    paragraphStyles.splice(i, 1);
                }
                if (offset < paragraphStyles[i]["start"]) {
                    paragraphStyles[i]["start"] += operation === 'add' ? 1 : -1;
                }
                if (offset <= paragraphStyles[i]["end"]) {
                    paragraphStyles[i]["end"] += operation === 'add' ? 1 : -1;
                }
                tmp.push(paragraphStyles[i]);
            }
            paragraphStyles = tmp;
            if (isStyleModified) {
                addStyle(offset + 1, offset + 1, goog.object.clone(computedStyle));
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
        
        getAllParagraphStyles : function () {
            return paragraphStyles;
        },
        
        setAllParagraphStyles : function (styles) {
            paragraphStyles = styles;
        },
        
        getParagraphStyles : function (paragraphOrdinal) {
            if (paragraphStyles[paragraphOrdinal]) {
                return paragraphStyles[paragraphOrdinal];
            } else {
                return paragraphStyles[paragraphStyles.length - 1];
            }
        },
        
        getParagraphByOffset : function (offset) {
            var i, paragraphOrdinal = 0, cursorOffset = offset;
            for (i = 0; i < paragraphStyles.length; i += 1) {
                if (paragraphStyles[i]["start"] <= cursorOffset &&
                    cursorOffset <= paragraphStyles[i]["end"]) {
                    paragraphOrdinal = i;
                    break;
                }
            }
            return paragraphStyles[paragraphOrdinal];
        },
        
        setParagraphStyle : function (width, left, right) {
            var paragraph = Styling.getParagraphByOffset(hte2.TrackerMap.get('_lcl_').getOffset());
            if (paragraph["width"] !== width) {
                paragraph["width"] = width;
                paragraph["pl"] = left;
                paragraph["pr"] = right;
                hte2.pubsub.publish('rerender');
            }
        }
    };
    
    return Styling;
}());