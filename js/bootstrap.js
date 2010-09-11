/*global hte2, goog*/

(function () {
    var viewportSizeMonitor = new goog.dom.ViewportSizeMonitor(), setHeight,
        mouseHandler, keyHandler, dh = new goog.dom.DomHelper(), localTracker, 
        localCursor;
    
    setHeight = function () {
        var height = viewportSizeMonitor.getSize().height - 60;
        goog.style.setHeight(goog.dom.getElement('hte-workbench-container'), height);
    };
    setHeight();
    goog.events.listen(viewportSizeMonitor, goog.events.EventType.RESIZE, 
        function (e) {
            setHeight();
        });
    
    localTracker = new hte2.Tracker(hte2.pubsub);
    
    localCursor = new hte2.Cursor();
    
    mouseHandler = new hte2.MouseHandler(hte2.pubsub);
    mouseHandler.setTracker(localTracker);
    
    keyHandler = new hte2.KeyHandler();
    keyHandler.setTracker(localTracker);

    hte2.pubsub.subscribe('rerender', hte2.Workbench.render);
    
    hte2.pubsub.subscribe('rangeReady', hte2.Styling.addStyle);
    
    hte2.pubsub.subscribe('positionSet', hte2.Styling.setComputedStyle);
    hte2.pubsub.subscribe('positionSet', hte2.UI.updateRuler);
    
    hte2.pubsub.subscribe('updateComputedStyle', 
        hte2.Styling.changeComputedStyle);
    
    hte2.pubsub.subscribe('pWidth', localTracker.reNotify, localTracker);
    hte2.pubsub.subscribe('pWidth', hte2.Styling.setParagraphStyle);
    
    hte2.pubsub.subscribe('trackerChanged', localCursor.onTrackerChanged, 
        localCursor);
    hte2.pubsub.subscribe('trackerChanged', function (data) {
        var req = new hte2.JsonRPC();
        req.request(data, 'publish');
    });
    
    hte2.TrackerMap.set('_lcl_', localTracker);
    hte2.Workbench.render();
    localTracker.setLineByOrdinal(dh.getElementsByClass('hte-line', 
        hte2.Workbench.getWorkbench())[0], 1);
    
    
}());