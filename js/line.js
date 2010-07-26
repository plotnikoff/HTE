
hte2.Line = function (text) {
    var lineCont, stringCont, textNode;
    lineCont = document.createElement('div');
    lineCont.className = 'hte-line';
    this.text = text;
    this.lineCont = lineCont;
};

hte2.Line.prototype = {
    get : function () {
        return this.lineCont;
    }
};