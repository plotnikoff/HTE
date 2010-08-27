/*global document, setInterval, window, goog */

goog.require('goog.dom');
goog.require('goog.dom.DomHelper');
goog.require('goog.dom.ViewportSizeMonitor');
goog.require('goog.style');
goog.require('goog.json');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.pubsub.PubSub');
goog.require('goog.ui.Toolbar');
goog.require('goog.ui.ToolbarToggleButton');
goog.require('goog.ui.ToolbarButton');
goog.require('goog.ui.ToolbarSelect');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.TwoThumbSlider');
goog.require('goog.net.XhrIo');

hte2.$ = function (string) {
    return document.getElementById(string);
};

hte2.$CN = function (classname, context) {
    var res = [], tmp, length, i;
    tmp = context.getElementsByTagName('*');
    length = tmp.length;
    for (i = 0; i < length; i += 1) {
        if (tmp[i].className === classname) {
            res.push(tmp[i]);
        }
    }
    return res;
};