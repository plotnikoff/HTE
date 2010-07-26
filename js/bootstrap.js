/*global hte2*/

(function () {
    hte2.Workbench.render();
    hte2.Tracker.addListener(hte2.Cursor);
    hte2.Tracker.setLineByOrdinal(hte2.$CN('hte-line', hte2.Workbench.getWorkbench())[0], 1);
    new hte2.MouseHandler();
    new hte2.KeyHandler();
    hte2.pubsub.subscribe('rerender', hte2.Workbench.render);
    hte2.pubsub.subscribe('rangeReady', hte2.Styling.addStyle);
    hte2.pubsub.subscribe('positionSet', hte2.UI.setPosition);
}());