/*jslint  sub : true*/

/*global hte2, window, document, goog */

goog.require('goog.editor.Field');
goog.require('goog.editor.plugins.BasicTextFormatter');
goog.require('goog.dom.Range');
goog.require('goog.dom.DomHelper');

hte2.pasteHandler = function (tracker) {
    var cp = new goog.editor.Field('hte-clipboard'), pasteHandler, 
    dh = new goog.dom.DomHelper(), buffer;
    buffer = dh.createElement('textarea');
    cp.makeEditable();
    goog.events.listen(cp, 
        goog.editor.Field.EventType.DELAYEDCHANGE,
        function () {
            var clean, curPos;
            if (this.getCleanContents() !== '') {
                clean = goog.dom.Range.createFromNodeContents(this.getElement());
                clean = clean.getPastableHtml();
                curPos = hte2.Measurer.calculatePosition(tracker.getOrdinal())['offset'] - 1;
                clean = clean.replace(/<div>/gi, '')
                            .replace(/(<br><\/div>)|(<\/div>)/gi, '\n')
                            .replace(/\//gi, '\\/');
                buffer.innerHTML = clean;
                hte2.Workbench.addFragment(buffer.value, curPos);
                this.setHtml(false, null, true);
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
