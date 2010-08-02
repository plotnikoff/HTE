/*global hte2, goog*/

/*jslint sub:true*/

hte2.UI = (function () {
    var UI, tb, dh = new goog.dom.DomHelper(), boldButton, italicButton, 
        underlineButton, lineThroughButton, fontsizeSelect, fontfaceSelect, 
        ruler, rulerStyle, rulerPxStep;
    
    boldButton = new goog.ui.ToolbarToggleButton(dh.createDom('div', 
        {"id" : "hte-boldbutton"},
        dh.createTextNode(String.fromCharCode(160))));
    hte2.pubsub.subscribe('styleChanged', function (cStyle) {
        if (cStyle["fw"] === "bold") {
            boldButton.setChecked(true);
        } else {
            boldButton.setChecked(false);
        } 
    });
    goog.events.listen(boldButton, goog.ui.Component.EventType.ACTION,
        function (e) {
            if (boldButton.isChecked()) {
                hte2.pubsub.publish('updateComputedStyle', ["fw", "bold"]);
            } else {
                hte2.pubsub.publish('updateComputedStyle', ["fw", "normal"]);
            }
        }
    );
    
    italicButton = new goog.ui.ToolbarToggleButton(dh.createDom('div', 
        {"id" : "hte-italicbutton"},
        dh.createTextNode(String.fromCharCode(160))));
    hte2.pubsub.subscribe('styleChanged', function (cStyle) {
        if (cStyle["fst"] === "italic") {
            italicButton.setChecked(true);
        } else {
            italicButton.setChecked(false);
        } 
    });
    goog.events.listen(italicButton, goog.ui.Component.EventType.ACTION,
        function (e) {
            if (italicButton.isChecked()) {
                hte2.pubsub.publish('updateComputedStyle', ["fst", "italic"]);
            } else {
                hte2.pubsub.publish('updateComputedStyle', ["fst", "normal"]);
            }
        }
    );
    
    underlineButton = new goog.ui.ToolbarToggleButton(dh.createDom('div', 
        {"id" : "hte-underlinebutton"},
        dh.createTextNode(String.fromCharCode(160))));
    hte2.pubsub.subscribe('styleChanged', function (cStyle) {
        if (cStyle["td"] === "underline") {
            underlineButton.setChecked(true);
        } else {
            underlineButton.setChecked(false);
        } 
    });
    goog.events.listen(underlineButton, goog.ui.Component.EventType.ACTION,
        function (e) {
            if (underlineButton.isChecked()) {
                hte2.pubsub.publish('updateComputedStyle', ["td", "underline"]);
            } else {
                hte2.pubsub.publish('updateComputedStyle', ["td", "none"]);
            }
        }
    );
    
    lineThroughButton = new goog.ui.ToolbarToggleButton(dh.createDom('div', 
        {"id" : "hte-linethroughbutton"},
        dh.createTextNode(String.fromCharCode(160))));
    hte2.pubsub.subscribe('styleChanged', function (cStyle) {
        if (cStyle["td"] === "line-through") {
            lineThroughButton.setChecked(true);
        } else {
            lineThroughButton.setChecked(false);
        } 
    });
    goog.events.listen(lineThroughButton, goog.ui.Component.EventType.ACTION,
        function (e) {
            if (lineThroughButton.isChecked()) {
                hte2.pubsub.publish('updateComputedStyle', ["td", "line-through"]);
            } else {
                hte2.pubsub.publish('updateComputedStyle', ["td", "none"]);
            }
        }
    );
    
    fontsizeSelect = new goog.ui.ToolbarSelect("");
    fontsizeSelect.addItem(new goog.ui.MenuItem("8"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("10"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("11"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("12"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("14"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("18"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("24"));
    fontsizeSelect.addItem(new goog.ui.MenuItem("36"));
    fontsizeSelect.setValue("12");
    hte2.pubsub.subscribe('styleChanged', function (cStyle) {
        fontsizeSelect.setValue(cStyle["fs"]);
    });
    goog.events.listen(fontsizeSelect, goog.ui.Component.EventType.ACTION,
        function (e) {
            hte2.pubsub.publish('updateComputedStyle', ["fs", 
                fontsizeSelect.getValue()]);
        }
    );
    
    fontfaceSelect = new goog.ui.ToolbarSelect("");
    fontfaceSelect.addItem(new goog.ui.MenuItem("Arial"));
    fontfaceSelect.addItem(new goog.ui.MenuItem("Courier new"));
    fontfaceSelect.addItem(new goog.ui.MenuItem("Times New Roman"));
    fontfaceSelect.setValue("Arial");
    hte2.pubsub.subscribe('styleChanged', function (cStyle) {
        fontfaceSelect.setValue(cStyle["ff"]);
    });
    goog.events.listen(fontfaceSelect, goog.ui.Component.EventType.ACTION,
        function (e) {
            hte2.pubsub.publish('updateComputedStyle', ["ff", 
                fontfaceSelect.getValue()]);
        }
    );
    
    tb = new goog.ui.Toolbar();
    tb.addChild(boldButton, true);
    tb.addChild(italicButton, true);
    tb.addChild(underlineButton, true);
    tb.addChild(lineThroughButton, true);
    tb.addChild(fontsizeSelect, true);
    tb.addChild(fontfaceSelect, true);
    tb.render(dh.$("hte-panel"));
    
    ruler = new goog.ui.TwoThumbSlider();
    ruler.createDom();
    rulerStyle = ruler.getElement();
    rulerStyle.style.width = '100%';
    rulerStyle.style.height = '10px';
    ruler.setStep(1);
    rulerPxStep = parseInt(hte2.Workbench.getWorkbench().style.width, 10) / 100;
    ruler.addEventListener(goog.ui.Component.EventType.CHANGE, function () {
        var left, right;
        left = ruler.getValue() * rulerPxStep;
        right = (ruler.getValue() + ruler.getExtent()) * rulerPxStep;
        hte2.pubsub.publish("pWidth", (right - left), left, right);
    });
    ruler.render(dh.$("hte-slider"));
    
    UI = {
        updateRuler : function (offset) {
            var style = hte2.Styling.getParagraphByOffset(offset);
            ruler.setExtent((style["pr"] - style["pl"]) / rulerPxStep);
            ruler.setValue(style["pl"] / rulerPxStep);
            console.log(style["pr"]);
            console.log((style["pr"] - style["pl"]) / rulerPxStep);
            
        }
    };
    return UI;
}());