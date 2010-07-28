/*global hte2, goog*/

hte2.UI = (function () {
    var UI, tb, dh = new goog.dom.DomHelper(), boldButton, italicButton, 
        underlineButton;
    
    boldButton = new goog.ui.ToolbarToggleButton("B");
    italicButton = new goog.ui.ToolbarToggleButton("I");
    underlineButton = new goog.ui.ToolbarToggleButton("U");
    fontsizeSelect = new goog.ui.ToolbarSelect("Size");
    fontsizeSelect.addItem(new goog.ui.MenuItem("8"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("10"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("11"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("12"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("14"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("18"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("24"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("36"));
    tb = new goog.ui.Toolbar();
    
    tb.addChild(boldButton, true);
    tb.addChild(italicButton, true);
    tb.addChild(underlineButton, true);
    tb.addChild(fontsizeSelect, true);
    tb.render(dh.$("hte-panel")); 
    UI = {
        setPosition : function (offset) {
            var style = hte2.Styling.getStyles(offset).style;
            if (style["fw"] === "bold") {
                boldButton.setChecked(true);
            } else {
                boldButton.setChecked(false);
            }
            if (style["td"] === "underline") {
                underlineButton.setChecked(true);
            } else {
                underlineButton.setChecked(false);
            }
            if (style["fst"] === "italic") {
                italicButton.setChecked(true);
            } else {
                italicButton.setChecked(false);
            }
            fontsizeSelect.setValue(style["fs"]);
        }
    };
    return UI;
}());
