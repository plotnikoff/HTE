/*global hte2, window, document */

hte2.Styling = (function () {
    var Styling, styles = hte2.dataStorage.styling;
    
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
        }
    };
    
    return Styling;
}());