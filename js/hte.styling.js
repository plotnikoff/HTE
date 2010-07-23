/*global hte2, window, document */

hte2.Styling = (function () {
    var Styling, styles = hte2.dataStorage.styling, dict;
    
    dict = {"ff" : ["font-family", "", "fontFamily"],
            "fw" : ["font-weight", "", "fontWeight"], 
            "fs" : ["font-size", "pt", "fontSize"],
            "td" : ["text-decoration", "", "textDecoration"]
        };
    
    Styling = {
        
        getStyles : function () {
            return styles;
        },
        
        updatePositins : function (offset, operation) {
            var i, tmp = [];
            for (i = 0; i < styles.length; i += 1) {
                if (offset < styles[i].start) {
                    styles[i].start += operation === 'add' ? 1 : -1;
                }
                if (offset <= styles[i].end) {
                    styles[i].end += operation === 'add' ? 1 : -1;
                }
                if (!(styles[i].end < styles[i].start)) {
                    tmp.push(styles[i]);
                }
            }
            styles = tmp;
        },
        
        addStyle : function (start, end, style) {
            var i, oldStart, oldEnd;
            for (i = 0; i < styles.length; i += 1) {
                if (styles[i].start < start && styles[i].end > start) {
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
            hte2.pubsub.publish('rerender');
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
                    if (domEl.style[dict[prop][2]])
                    output += dict[prop][0] + ":" + 
                        domEl.style[dict[prop][2]] + ";";
                }
            }
            return output;
        }
    };
    
    return Styling;
}());