/*global hte2*/

hte2.UI = (function () {
    var UI, boldButton = new goog.ui.Button("Bold"), 
        dh = new goog.dom.DomHelper();
    boldButton.render(dh.$("hte-panel"), new goog.ui.FlatButtonRenderer());
    UI = {
        setPosition : function (offset) {
            var style = hte2.Styling.getStyles(offset);
            console.log(style);
            console.log(offset);
        }
    }
    return UI;
}())
