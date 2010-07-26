/*global hte2, goog*/

hte2.UI = (function () {
    var UI, tb, dh = new goog.dom.DomHelper(), boldButton, italicButton, 
        underlineButton;
    
    boldButton = new goog.ui.ToolbarToggleButton("B");
    italicButton = new goog.ui.ToolbarToggleButton("I");
    underlineButton = new goog.ui.ToolbarToggleButton("U");
    tb = new goog.ui.Toolbar();
    
    tb.addChild(boldButton, true);
    tb.addChild(italicButton, true);
    tb.addChild(underlineButton, true);
    tb.render(dh.$("hte-panel"));

    UI = {
        setPosition : function (offset) {
            var style = hte2.Styling.getStyles(offset);
            console.log(style);
            console.log(offset);
        }
    };
    return UI;
}());
