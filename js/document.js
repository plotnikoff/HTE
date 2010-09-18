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
};

hte2.Document.prototype.deleteSymbol = function (position, amount) {
    this.docText.splice(position, amount);
};