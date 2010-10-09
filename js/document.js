/*jslint sub : true*/

/*global hte2*/

/**
 * @fileoverview
 * File contains Document class that is responsible for document data 
 * representation
 */

/**
 * Document class encapsulates document data and provides an API to access this 
 * data
 * @class
 * @constructor
 * @param {Object} data json object, example can be found at index.html
 * hte2.dataStorage
 */
hte2.Document = function (data) {
    var paragraphs, styling;
    paragraphs = data ? data["paragraphs"] : hte2.dataStorage["paragraphs"];
    styling = data ? data["styling"] : hte2.dataStorage["styling"];
    this.id = data ? data["_id"] : "";
    this.rev = data ? data["_rev"] : "";
    this.docText = data ? data["docText"] : hte2.dataStorage["docText"];
    this.docText = this.docText.split('');
    
    hte2.Styling.setStyles(styling);
    hte2.Styling.setAllParagraphStyles(paragraphs);
    
    hte2.pubsub.subscribe('positionSet', hte2.Styling.setComputedStyle);
    hte2.pubsub.subscribe('pWidth', hte2.Styling.setParagraphStyle);
    hte2.pubsub.subscribe('updateComputedStyle', hte2.Styling.changeComputedStyle);
};

/**
 * Method returns JSON object that represents document in format defined in 
 * hte2.dataStorage
 * @returns {Object}
 */
hte2.Document.prototype.get = function () {
    var doc = {};
    if (this.id !== "") {
        doc["_id"] = this.id;
    }
    if (this.rev !== "") {
        doc["_rev"] = this.rev;
    }
    doc["docText"] = this.getDocText();
    doc["paragraphs"] = hte2.Styling.getAllParagraphStyles();
    doc["styling"] = hte2.Styling.getStyles();
    return doc;
};

/**
 * Method returns ID of a current document
 * @returns {String}
 */
hte2.Document.prototype.getId = function () {
    return this.id;
};

/**
 * Method returns revision of a current document
 * @returns {String}
 */
hte2.Document.prototype.getRevision = function () {
    return this.rev;
};

/**
 * Method returns document text content as a single string
 * @returns {String}
 */
hte2.Document.prototype.getDocText = function () {
    return this.docText.join('');
};

/**
 * Method returns style json object associated with current document
 * @returns {Object}
 */
hte2.Document.prototype.getStyling = function () {
    return hte2.Styling.getStyles();
};

/**
 * Method converts provided style json object to DOM style attribute string
 * @param {Object} obj style json object
 * @returns {String}
 */
hte2.Document.prototype.styleToString = function (obj) {
    return hte2.Styling.generateStyle(obj);
};

/**
 * Method returns paragraph related json object. If second parameter is set to 
 * <code>true</code> first parameter will be treated as letter offset from the 
 * begining of the document, otherwise paragraph ordinal.
 * @param {Object} ordinal
 * @param {Boolean} isOffset <code>false</code> by default
 * @returns {Object}
 */
hte2.Document.prototype.getParagraphStyle = function (num, isOffset) {
    if (isOffset) {
        return hte2.Styling.getParagraphByOffset(num);
    } else {
        return hte2.Styling.getParagraphStyles(num);
    }
};

/**
 * Method is responsible for inserting symbol at a given position and updating 
 * style object
 * @param {String} symbol
 * @param {Number} position
 */
hte2.Document.prototype.addSymbol = function (symbol, position) {
    var part1, part2;
    part1 = this.docText.slice(0, position + 1);
    part2 = this.docText.slice(position + 1);
    part1.push(symbol);
    this.docText = part1.concat(part2);
    hte2.Styling.updatePositions(position, 'add');
    if (symbol === '\n') {
        hte2.Styling.addParagraph(position);
    }
};

/**
 * Method is responsible for deleting given number of symbols at the given 
 * position
 * @param {Number} position
 * @param {Number} amount
 */
hte2.Document.prototype.deleteSymbol = function (amount, position) {
    this.docText.splice(position, amount);
    hte2.Styling.updatePositions(position, 'remove');
};