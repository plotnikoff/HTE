/*global hte2, goog */

goog.require('goog.array');
goog.require('goog.dom.DomHelper');

/**
 * @constructor
 * @param {Element} st
 * @param {Element} et
 * @param {Number} sp
 * @param {Number} ep
 */
hte2.selectionUI = function (st, et, sp, ep) {
    st = st.parentNode;
    et = et.parentNode;
    var dh = new goog.dom.DomHelper(), currentNode = st,
        lastNode = dh.getNextElementSibling(et),
        selection, startOffset = '', width = '';
    while (currentNode !== lastNode) {
        if (currentNode === st) {
            startOffset = 'left:' + sp + 'px;';
        } else {
            startOffset = '';
        }
        if (currentNode === et) {
            width = currentNode.firstChild.offsetWidth > ep ?
                ('width:' + ep + 'px;') :
                    ('width:' + currentNode.firstChild.offsetWidt + 'px;');
        } else {
            width = 'width:' + currentNode.firstChild.offsetWidth + 'px;';
        }
        selection = dh.createDom('div', {
            'class' : 'hte-select-overlay',
            'style' : startOffset + 'height:' + currentNode.offsetHeight + 'px;' + width
        });
        dh.appendChild(currentNode, selection);
        currentNode = dh.getNextElementSibling(currentNode);
    }
};

hte2.selectionUI.prototype.destroy = function () {
    var dh = new goog.dom.DomHelper(), nodes;
    nodes = dh.getElementsByClass('hte-select-overlay');
    goog.array.forEach(nodes, function (el) {
        dh.removeNode(el);
    });
};
