
hte2.KeyHandler = function () {
    document.onkeypress = this.intercept;
};

hte2.KeyHandler.prototype = {
    intercept : function (ev) {
        var code, e, curPos;
        e = ev ? ev : window.event;
        if (e.keyCode) {
            code = e.keyCode;
        } else if (e.which) {
            code = e.which;
        }
        switch (code) {
        case hte2.CONST.ARR_LEFT:
            hte2.Tracker.symbolLeft();
            break;
        case hte2.CONST.ARR_RIGHT:
            hte2.Tracker.symbolRight();
            break;
        case hte2.CONST.ARR_UP:
            hte2.Tracker.lineUp();
            break;
        case hte2.CONST.ARR_DOWN:
            hte2.Tracker.lineDown();
            break;
        case hte2.CONST.BACKSPACE:
            hte2.Tracker.symbolLeft();
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset);
            break;
        case hte2.CONST.DELETE:
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset);
            break;
        default:
            if (code !== undefined) {
                hte2.Workbench.addLetter(code, hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset - 1);
                hte2.Tracker.symbolRight();
            }
            break; 
        }
    }
};