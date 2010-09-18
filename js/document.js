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
    return this.docText;
};

hte2.Document.prototype.getStyling = function () {
    return this.styling;
};

hte2.Document.prototype.getParagraphs = function () {
    return this.paragraphs;
};