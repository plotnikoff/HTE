/*global hte2, goog*/

(function () {
    var viewportSizeMonitor = new goog.dom.ViewportSizeMonitor(), setHeight,
        mouseHandler, keyHandler;
    setHeight = function () {
        var height = viewportSizeMonitor.getSize().height - 60;
        goog.style.setHeight(goog.dom.getElement('hte-workbench-container'), height);
    };
    setHeight();
    goog.events.listen(viewportSizeMonitor, goog.events.EventType.RESIZE, 
        function (e) {
            setHeight();
        });
    hte2.Workbench.render();
    hte2.Tracker.addListener(new hte2.Cursor());
    hte2.Tracker.setLineByOrdinal(hte2.$CN('hte-line', 
        hte2.Workbench.getWorkbench())[0], 1);
    mouseHandler = new hte2.MouseHandler();
    keyHandler = new hte2.KeyHandler();

    hte2.pubsub.subscribe('rerender', hte2.Workbench.render);
    hte2.pubsub.subscribe('rangeReady', hte2.Styling.addStyle);
    hte2.pubsub.subscribe('positionSet', hte2.Styling.setComputedStyle);
    hte2.pubsub.subscribe('positionSet', hte2.UI.updateRuler);
    hte2.pubsub.subscribe('updateComputedStyle', 
        hte2.Styling.changeComputedStyle);
    hte2.pubsub.subscribe('pWidth', hte2.Styling.setParagraphStyle);
    hte2.pubsub.subscribe('pWidth', hte2.Tracker.reNotify);
}());