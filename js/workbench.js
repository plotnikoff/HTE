/*jslint sub : true*/

/*global hte2, goog*/

/**
 * @fileoverview
 * File contains class that is responsible for visualization of data and 
 * provides facilities to work with it.
 */

/**
 * Singleton class represents workspace and gives facilities to work with it, 
 * and the document that is associated with it.
 * @class
 * @name hte2.Workbench
 */
hte2.Workbench = (function () {
    var Workbench, container, containerWidth, redraw, addSymbol, cleanUp,
        splitByWhiteSpace, dh = new goog.dom.DomHelper(), currentDoc;
    
    container = dh.$('hte-workbench');
    
    /**
     * @private
     */
    splitByWhiteSpace = function () {
        var splittedWS;
        splittedWS = currentDoc.getDocText().split('\n');
        splittedWS = splittedWS.join(' \n ');
        return splittedWS.split(' ');
    };

    cleanUp = function (text) {
        return text.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
    };

    Workbench = {
        
        /**
         * Method gives the structured html output that is suitable for editing.
         *  Ideally should be replaced to sort of rendering factory, so it will 
         *  be possible to produce different output.
         *  @memberOf hte2.Workbench#
         */
        render : function () {
            var styles = currentDoc.getStyling(), i, j, k = 0, lineWidth, 
                textBuffer = "", textHolder, offset = 0, wsSplitted, frstart, 
                frend, currentFr, oldLines, pushline, currentFrWidth, 
                currentFrMU, wordPart, partWidth, paragraphCounter = 0,
                paragraphStyle;
            wsSplitted = splitByWhiteSpace();
            j = 0;
            frstart = 0;
            frend = 0;
            currentFr = '';
            lineWidth = 0;
            oldLines = dh.getElementsByClass('hte-line', container);
            pushline = false;
            for (i = 0; i < wsSplitted.length; i += 1) {
                paragraphStyle = currentDoc.getParagraphStyle(paragraphCounter);
                containerWidth = parseInt(paragraphStyle["width"], 10);
                currentFr = wsSplitted[i] + String.fromCharCode(160);
                frstart = offset;
                frend = offset + (currentFr.length - 1);
                if (currentFr !== ('\n' + String.fromCharCode(160))) {
                    if (styles[j]["start"] < frstart && frend <= styles[j]["end"]) {
                        currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + 
                            currentDoc.styleToString(styles[j]["style"]) + "\">" + currentFr + 
                            "</span>");
                        if ((lineWidth + currentFrWidth) < containerWidth) {
                            lineWidth += currentFrWidth;
                            textBuffer += cleanUp(currentFr);
                        }
                        else {
                            i -= 1;
                            pushline = true;
                            offset -= currentFr.length;
                        }
                    } else if (frend > styles[j]["end"]) {
                        wordPart = "";
                        while (currentFr.length !== 0) {
                            frend -= 1;
                            currentFr = currentFr.split('');
                            wordPart += currentFr.pop();
                            currentFr = currentFr.join('');
                            if (frend === styles[j]["end"]) {
                                if (frstart <= styles[j]["start"]) {
                                    currentFr = currentFr.split('');
                                    currentFr.splice(0, styles[j]["start"] - frstart);
                                    currentFr = currentFr.join('');
                                    currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + 
                                        currentDoc.styleToString(styles[j]["style"]) + "\">" + 
                                        currentFr + "</span>");
                                    currentFrMU = "<span style=\"" + 
                                        currentDoc.styleToString(styles[j]["style"]) + "\">" + 
                                        cleanUp(currentFr) + "</span>";
                                } else {
                                    currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + 
                                        currentDoc.styleToString(styles[j]["style"]) + "\">" + 
                                        currentFr + "</span>");
                                    currentFrMU = cleanUp(currentFr) + "</span>";
                                }
                                j += 1;
                                i -= 1;
                                break;
                            }
                        }
                        partWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + 
                            currentDoc.styleToString(styles[j]["style"]) + "\">" + wordPart + 
                            "</span>");
                        if ((lineWidth + (currentFrWidth + partWidth)) < containerWidth) {
                            lineWidth += currentFrWidth;
                            textBuffer += currentFrMU;
                        } else {
                            j -= 1;
                            pushline = true;
                        }
                        offset -= currentFr.length;
                    } else {
                        currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + 
                            currentDoc.styleToString(styles[j]["style"]) + "\">" + 
                            currentFr.substr(styles[j]["start"] - frstart) + "</span>");
                        if ((lineWidth + currentFrWidth) < containerWidth) {
                            textBuffer += "<span style=\"" + currentDoc.styleToString(styles[j]["style"]) + 
                                "\">" + cleanUp(currentFr.substr(styles[j]["start"] - frstart));
                            lineWidth += currentFrWidth;
                        } else {
                            i -= 1;
                            pushline = true;
                            offset -= currentFr.length;
                        }
                    }
                } else {
                    offset -= 2;
                }
                
                offset += currentFr.length;
                if (pushline || currentFr === ('\n' + String.fromCharCode(160))) {
                    pushline = false;
                    textBuffer += "</span>";
                    if (oldLines.length === 0) {
                        textHolder = new hte2.Line(paragraphStyle["pl"]).get();
                        container.appendChild(textHolder);
                        textHolder.innerHTML = textBuffer;
                    } else {
                        if (oldLines[k]) {
                            oldLines[k].style.paddingLeft = paragraphStyle["pl"] + "px";
                            oldLines[k].innerHTML = textBuffer;
                            k += 1;
                        } else {
                            textHolder = new hte2.Line(paragraphStyle["pl"]).get();
                            container.appendChild(textHolder);
                            textHolder.innerHTML = textBuffer;
                        }
                    }
                    textBuffer = "<span style=\"" + currentDoc.styleToString(styles[j].style) + "\">";
                    lineWidth = 0;
                    if (currentFr === ('\n' + String.fromCharCode(160))) {
                        paragraphCounter += 1;
                    }
                }
            }
            if (oldLines.length !== 0 && oldLines.length > k) {
                for (i = k; i < oldLines.length; i += 1) {
                    if (oldLines[k].parentNode) {
                        oldLines[k].parentNode.removeChild(oldLines[k]);
                    }
                }
            }
            hte2.pubsub.publish('render');
        },
        
        /**
         * Method encapsulates logic for removing symbol from the current 
         * <code>hte2.Document</code> object so <code>hte2.KeyHandler</code> is 
         * not aware of document object.
         * @memberOf hte2.Workbench#
         * @param {Number} position
         */
        removeLetter : function (position) {
            currentDoc.deleteSymbol(1, position);
            hte2.pubsub.publish('refresh');
        },
        
        /**
         * Special case method for adding EOL symbol for determening end of 
         * paragraph.
         * @memberOf hte2.Workbench#
         * @param {Number} position
         */
        addParagraph : function (position) {
            currentDoc.addSymbol('\n', position);
            hte2.pubsub.publish('refresh');
        },
        
        /**
         * Method encapsulates logic for adding symbol to the current 
         * <code>hte2.Document</code> object so <code>hte2.KeyHandler</code> is 
         * not aware of document object.
         * @memberOf hte2.Workbench#
         * @param {Number} charCode
         * @param {Number} position
         */
        addLetter : function (charCode, position) {
            currentDoc.addSymbol(String.fromCharCode(charCode), position);
            hte2.pubsub.publish('refresh');
        },
        
        addFragment : function (str, position) {
            var localPosition = position, i, len = str.length, symb;
            for (i = 0; i < len; i += 1) {
                symb = str[i];
                if (symb === '\n') {
                    currentDoc.addSymbol('\n', localPosition);
                } else {
                    currentDoc.addSymbol(symb, localPosition);
                }
                localPosition += 1;
            }
            hte2.pubsub.publish('refresh');
        },
        
        /**
         * Returns DOM node associated with this workbench
         * @memberOf hte2.Workbench#
         * @returns {Element}
         */
        getWorkbench : function () {
            return container;
        },
        
        /**
         * Returns current active document associated with the workbench
         * @memberOf hte2.Workbench#
         * @returns {hte2.Document}
         */
        getDocument : function () {
            return currentDoc;
        },
        
        /**
         * Method is responsible for binding workbench with document. Method 
         * rerenders content of the workbench.
         * @memberOf hte2.Workbench#
         * @param {hte2.Document} doc
         */
        setDocument : function (doc) {
            var lines = dh.getElementsByClass('hte-line');
            goog.array.forEach(lines, function (el) {
                dh.removeNode(el);
            });
            currentDoc = doc;

            hte2.pubsub.publish('refresh');
            hte2.pubsub.publish('docLoaded', doc.getId());
        }
    };
    
    return Workbench;
}());