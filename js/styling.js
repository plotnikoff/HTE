/*jslint sub : true*/

/*global hte2, window, document, goog */

/**
 * Class encapsultes document style related data which is represented by two 
 * objects paragraph related  array
 * <code>
 * <pre>
    "paragraphs" : [
        {
            "width" : 900, 
            "pl" : 0, 
            "pr" : 900, 
            "start" : 0, 
            "end" : 1
        }
    ]
    </pre>
    </code>
    and style related array
    <code><pre>
    "styling" : [
        {
            "style" : {
                "fs" : 12, 
                "ff" : "Arial", 
                "fw" : "normal", 
                "fst" : 
                "normal"
            },
            "start" : 0,
            "end" : 1
        }
   </pre>
 * </code>
 * @constructor
 */
hte2.Styling = function (styles, paragraphStyles) {
    this.styles = styles || {};
    this.paragraphStyles = paragraphStyles || {};
    this.currentStyle = this.computedStyle = {
        style : {"fs" : 12, "ff" : "Arial", "fw" : "normal", 
            "fst" : "normal"},
        start : 0,
        end : 13
    };
    this.isStyleModified = false;
};

/**
 * @static
 * @private
 */
hte2.Styling.dict = {"ff" : ["font-family", "", "fontFamily"],
            "fw" : ["font-weight", "", "fontWeight"], 
            "fs" : ["font-size", "pt", "fontSize"],
            "td" : ["text-decoration", "", "textDecoration"],
            "fst" : ["font-style", "", "fontStyle"]
        };

/**
 * @private
 * @param {Object} start
 * @param {Object} end
 * @param {Object} style
 */
hte2.Styling.prototype.addStyle = function (start, end, style) {
    var i, oldStart, oldEnd, len = this.styles.length;
    for (i = 0; i < len; i += 1) {
        if (this.styles[i]["start"] < start && this.styles[i]["end"] >= start) {
            oldEnd = this.styles[i]["end"];
            this.styles[i]["end"] = start - 1;
            this.styles.splice(i + 1, 0, {"style" : style, 
                "start" : start, "end" : end});
            if (this.styles[i + 2]) {
                this.styles.splice(i + 2, 0, {
                    "style": this.styles[i]["style"],
                    "start": end + 1,
                    "end": this.styles[i + 2]["start"] - 1
                });
            } else {
                this.styles.splice(i + 2, 0, {
                    "style": this.styles[i]["style"],
                    "start": end + 1,
                    "end": oldEnd
                });
            }
        }
    }
};

/**
 * Method retruns json that represents data about different styles applied to 
 * the document and their positions ("styling" field)
 * @returns {object}
 */
hte2.Styling.prototype.getStyles = function () {
    return this.styles;
};

/**
 * Method inserts paragraph data at the given position.
 * @param {Number} position
 */
hte2.Styling.prototype.addParagraph = function (position) {
    var i, len = this.paragraphStyles.length;
    for (i = 0; i < len; i += 1) {
        if (position < this.paragraphStyles[i]["end"]) {
            this.paragraphStyles.splice(i + 1, 0, {
                "width" : this.paragraphStyles[i]["width"], 
                "pl" : this.paragraphStyles[i]["pl"], 
                "pr" : this.paragraphStyles[i]["pr"],
                "start" : position,
                "end" : this.paragraphStyles[i]["end"]
            });
            this.paragraphStyles[i]["end"] = position - 1;
            break;
        }
    }
};

/**
 * Method sets current active style, that will be used if document data  was 
 * changed
 * @param {Number} offset
 * @returns {Object} json style object
 */
hte2.Styling.prototype.setComputedStyle = function (offset) {
    var i, st = this.styles, len = this.styles.length;
    if (offset) {
        for (i = 0;i < len; i += 1) {
            if (this.styles[i]["start"] <= (offset - 1)) {
                st = this.styles[i];
            }
        }
        this.currentStyle = st["style"];
        this.computedStyle = goog.object.clone(st["style"]);
        this.isStyleModified = false;
        hte2.pubsub.publish('styleChanged', this.computedStyle);
    }
    return this.computedStyle;
};

/**
 * Method is responsible for manipulations with current active style.
 * @param {Object} attr
 */
hte2.Styling.prototype.changeComputedStyle = function (attr) {
    this.computedStyle[attr[0]] = attr[1];
    this.isStyleModified = true;
};

/**
 * Method recalculates paragraph and style data in response to document changes
 * @param {Number} offset position in the document where action took place
 * @param {String} operation can be 'remove' or 'add'
 */
hte2.Styling.prototype.updatePositions = function (offset, operation) {
    var i, tmp = [], len = this.styles.length;
    for (i = 0; i < len; i += 1) {
        if (offset < this.styles[i]["start"] && this.styles[i]["start"] !== 0) {
            this.styles[i]["start"] += operation === 'add' ? 1 : -1;
        }
        if (offset <= this.styles[i]["end"]) {
            this.styles[i]["end"] += operation === 'add' ? 1 : -1;
        }
        tmp.push(this.styles[i]);
    }
    this.styles = tmp;
    tmp = [];
    for (i = 0, len = this.paragraphStyles.length; i < len; i += 1) {
        if (operation !== 'add' && offset === this.paragraphStyles[i]["start"]) {
            this.paragraphStyles[i - 1]["end"] = this.paragraphStyles[i]["end"] - 1;
            this.paragraphStyles[i + 1]["start"] = this.paragraphStyles[i]["end"] + 1;
            this.paragraphStyles.splice(i, 1);
        }
        if (offset < this.paragraphStyles[i]["start"]) {
            this.paragraphStyles[i]["start"] += operation === 'add' ? 1 : -1;
        }
        if (offset <= this.paragraphStyles[i]["end"]) {
            this.paragraphStyles[i]["end"] += operation === 'add' ? 1 : -1;
        }
        tmp.push(this.paragraphStyles[i]);
    }
    this.paragraphStyles = tmp;
    if (this.isStyleModified) {
        this.addStyle(offset + 1, offset + 1, goog.object.clone(this.computedStyle));
    }
};

/**
 * Generate DOM style attribute string from style JSON. EX:
 * input:
 * <code><pre>
 * "style" : {
                "fs" : 12, 
                "ff" : "Arial", 
                "fw" : "normal", 
                "fst" : "normal"
            }
 * </pre></code>
 * output:
 * font-size:12; font-family:Arial; font-weight: normal; font-style: normal;
 * @param {Object} styleJSON
 * @returns {String}
 */
hte2.Styling.prototype.generateStyle = function (styleJSON) {
    var prop, output = "";
            
    for (prop in styleJSON) {
        if (styleJSON.hasOwnProperty(prop)) {
            output += hte2.Styling.dict[prop][0] + ':' + styleJSON[prop] + 
            hte2.Styling.dict[prop][1] + ';';
        }
    }
    return output;
};

/**
 * Method for copying DOM style attribute data to string.
 * @static
 * @param {Element} domEl
 * @returns {String}
 */
hte2.Styling.copyStyleToString = function (domEl) {
    var prop, output = "";
    for (prop in hte2.Styling.dict) {
        if (hte2.Styling.dict.hasOwnProperty(prop)) {
            if (domEl.style[hte2.Styling.dict[prop][2]]) {
                output += hte2.Styling.dict[prop][0] + ":" +
                domEl.style[hte2.Styling.dict[prop][2]] + ";";
            }
        }
    }
    return output;
};

/**
 * Method returns paragraph related data.
 * @returns {Object} json object
 */
hte2.Styling.prototype.getAllParagraphStyles = function () {
    return this.paragraphStyles;
};

/**
 * Method returns paragraph related data according to the ordinal number of 
 * the paragraph, if ordinal is bigger then paragraph data array length method 
 * returns last element.
 * @param {Number} paragraphOrdinal
 * @returns {Object}
 */
hte2.Styling.prototype.getParagraphStyles = function (paragraphOrdinal) {
    if (this.paragraphStyles[paragraphOrdinal]) {
        return this.paragraphStyles[paragraphOrdinal];
    } else {
        return this.paragraphStyles[this.paragraphStyles.length - 1];
    }
};

/**
 * Method allows To fetch data about paragraph by tracker offset data
 * @param {Number} offset
 * @returns {Object} json
 */
hte2.Styling.prototype.getParagraphByOffset = function (offset) {
    var i, paragraphOrdinal = 0, cursorOffset = offset, 
    len = this.paragraphStyles.length;
    for (i = 0; i < len; i += 1) {
        if (this.paragraphStyles[i]["start"] <= cursorOffset &&
            cursorOffset <= this.paragraphStyles[i]["end"]) {
            paragraphOrdinal = i;
            break;
        }
    }
    return this.paragraphStyles[paragraphOrdinal];
};

/**
 * Changes paragraph data, and causes document rerendering.
 * @param {Number} width paragraph width
 * @param {Number} left padding left
 * @param {Number} right padding right
 */
hte2.Styling.prototype.setParagraphStyle = function (width, left, right) {
    var paragraph = this.getParagraphByOffset(hte2.TrackerMap.get('_lcl_').getOffset());
    if (paragraph["width"] !== width) {
        paragraph["width"] = width;
        paragraph["pl"] = left;
        paragraph["pr"] = right;
        hte2.pubsub.publish('rerender');
    }
};