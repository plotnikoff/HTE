/*global hte2, goog*/

/**
 * @fileoverview
 * File contains self executing function that sets the environment, and 
 * initializes classes that are necessary for initial loading.
 */

/**
 * @param {Boolean} multiUser when set to true enables comet for collaborative
 * editing
 */
(function (multiUser, undefined) {
    var viewportSizeMonitor = new goog.dom.ViewportSizeMonitor(), setHeight,
        mouseHandler, keyHandler, dh = new goog.dom.DomHelper(), localTracker, 
        localCursor, comet, setCursorPosition, user, wbContainer;
    
    wbContainer = goog.dom.getElement('hte-workbench-container');
    
    //mock user object
    user = new hte2.User({'id' : Math.round(Math.random() * 100000)});
    
    setHeight = function () {
        var height = viewportSizeMonitor.getSize().height - 60;
        goog.style.setHeight(wbContainer, height);
    };
    
    setCursorPosition = function () {
        localTracker.setLineByOrdinal(dh.getElementsByClass('hte-line', 
            hte2.Workbench.getWorkbench())[0], 1);
    };
    
    goog.events.listen(viewportSizeMonitor, goog.events.EventType.RESIZE, 
        function (e) {
            setHeight();
        });
    setHeight();
    localTracker = new hte2.Tracker(hte2.pubsub);
    
    localCursor = new hte2.Cursor(user.getId());
    
    mouseHandler = new hte2.MouseHandler(hte2.pubsub);
    mouseHandler.setTracker(localTracker);
    
    keyHandler = new hte2.KeyHandler();
    keyHandler.setTracker(localTracker);

    hte2.pubsub.subscribe('refresh', hte2.Workbench.render);

    hte2.pubsub.subscribe('positionSet', hte2.UI.updateRuler);
    
    hte2.pubsub.subscribe('pWidth', localTracker.reNotify, localTracker);
    
    hte2.pubsub.subscribe('trackerChanged', localCursor.onTrackerChanged, 
        localCursor);
    hte2.pubsub.subscribe('trackerChanged', function (data) {
        if (multiUser) {
            var docId = hte2.Workbench.getDocument().getId(), req;
            if (docId) {
                req = new hte2.JsonRPC();
                req.request({
                    'user': user,
                    'docId': docId,
                    'data': data
                }, 'publish');
            }
        }
    });

    hte2.pubsub.subscribe('docLoaded', function (docId) {
        if (multiUser) {
            if (comet && comet.isActive()) {
                comet.abort();
            }
            if (docId !== '') {
                comet = new hte2.Comet(docId, user.getId());
            }
        }
    });
    
    hte2.pubsub.subscribe('docLoaded', function () {
        setCursorPosition();
    });
    
    hte2.TrackerMap.set('_lcl_', localTracker);
    hte2.Workbench.setDocument(new hte2.Document());
    hte2.Workbench.render();
    setCursorPosition();
    hte2.pasteHandler(localTracker);

    hte2.pubsub.subscribe('trackerChanged', hte2.Scroller(wbContainer));
}(false));
