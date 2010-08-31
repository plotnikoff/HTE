
/**
 * @constructor
 */
hte2.Line = function (left) {
    var lineCont, stringCont, textNode;
    lineCont = document.createElement('div');
    lineCont.className = 'hte-line';
    lineCont.style.paddingLeft = left + "px";
    this.lineCont = lineCont;
};

hte2.Line.prototype = {
    get : function () {
        return this.lineCont;
    }
};