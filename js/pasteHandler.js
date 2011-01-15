/*global hte2, window, document, goog */

goog.require('goog.editor.Field');

hte2.pasteHandler = function (tracker) {
    var cp = new goog.editor.Field('hte-clipboard'), pasteHandler;
    cp.makeEditable();
    goog.events.listen(cp, 
        goog.editor.Field.EventType.DELAYEDCHANGE,
        function () {
            var clean = this.getCleanContents();
            this.setHtml(false, null, true);
            if (clean !== '') {
                var curPos = hte2.Measurer.calculatePosition(tracker.getOrdinal())['offset'] - 1;
                hte2.Workbench.addFragment(clean, curPos);
                console.log(clean);
                window.focus();
            }
        });

    pasteHandler = new goog.events.KeyHandler(document);
    goog.events.listen(pasteHandler, 'key', function (ev) {
        if (ev.ctrlKey && ev.keyCode === 86) {
            cp.focusAndPlaceCursorAtStart();
        }
    });
};
