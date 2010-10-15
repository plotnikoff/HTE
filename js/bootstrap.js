/*global hte2, goog*/

/**
 * @fileoverview
 * File contains self executing function that sets the environment, and 
 * initializes classes that are necessary for initial loading.
 */

(function () {
    var viewportSizeMonitor = new goog.dom.ViewportSizeMonitor(), setHeight,
        mouseHandler, keyHandler, dh = new goog.dom.DomHelper(), localTracker, 
        localCursor, comet, setCursorPosition, user;
    
    //mock user object
    user = new hte2.User({'id' : Math.round(Math.random() * 100000)});
    
    setHeight = function () {
        var height = viewportSizeMonitor.getSize().height - 60;
        goog.style.setHeight(goog.dom.getElement('hte-workbench-container'), height);
    };
    
    setCursorPosition = function () {
        localTracker.setLineByOrdinal(dh.getElementsByClass('hte-line', 
            hte2.Workbench.getWorkbench())[0], 1);
    };
    
    goog.events.listen(viewportSizeMonitor, goog.events.EventType.RESIZE, 
        function (e) {
            setHeight();
        });
    
    localTracker = new hte2.Tracker(hte2.pubsub);
    
    localCursor = new hte2.Cursor(user.getId());
    
    mouseHandler = new hte2.MouseHandler(hte2.pubsub);
    mouseHandler.setTracker(localTracker);
    
    keyHandler = new hte2.KeyHandler();
    keyHandler.setTracker(localTracker);

    hte2.pubsub.subscribe('rerender', hte2.Workbench.render);

    hte2.pubsub.subscribe('positionSet', hte2.UI.updateRuler);
    
    hte2.pubsub.subscribe('pWidth', localTracker.reNotify, localTracker);
    
    hte2.pubsub.subscribe('trackerChanged', localCursor.onTrackerChanged, 
        localCursor);
    hte2.pubsub.subscribe('trackerChanged', function (data) {
        var req = new hte2.JsonRPC();
        req.request({
            'user': user,
            'data': data
        }, 'publish');
    });

    hte2.pubsub.subscribe('docLoaded', function (docId) {
        if (comet && comet.isActive()) {
            comet.abort();
        }
        comet = new hte2.Comet(docId);
    });
    
    hte2.pubsub.subscribe('docLoaded', function () {
        setCursorPosition();
    });
    
    hte2.TrackerMap.set('_lcl_', localTracker);
    hte2.Workbench.setDocument(new hte2.Document());
    hte2.Workbench.render();
    setCursorPosition();
}());