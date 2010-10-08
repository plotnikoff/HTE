/*jslint sub : true*/

/*global hte2*/

/**
 * @constructor
 * @param {Object} data
 */
hte2.Document = function (data) {
    this.id = data ? data["_id"] : "";
    this.rev = data ? data["_rev"] : "";
    this.docText = data ? data["docText"] : hte2.dataStorage["docText"];
    this.docText = this.docText.split('');
    this.paragraphs = data ? data["paragraphs"] : hte2.dataStorage["paragraphs"];
    this.styling = data ? data["styling"] : hte2.dataStorage["styling"];
    hte2.Styling.setStyles(this.getStyling());
    hte2.Styling.setAllParagraphStyles(this.getParagraphs());
};

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

hte2.Document.prototype.getId = function () {
    return this.id;
};

hte2.Document.prototype.getRevision = function () {
    return this.rev;
};

hte2.Document.prototype.getDocText = function () {
    return this.docText.join('');
};

hte2.Document.prototype.getStyling = function () {
    return this.styling;
};

hte2.Document.prototype.styleToString = function (obj) {
    return hte2.Styling.generateStyle(obj);
}

hte2.Document.prototype.getParagraphs = function () {
    return this.paragraphs;
};

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

hte2.Document.prototype.deleteSymbol = function (position, amount) {
    this.docText.splice(position, amount);
    hte2.Styling.updatePositions(position, 'remove');
};