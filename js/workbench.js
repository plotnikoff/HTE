/*jslint sub : true*/

/*global hte2, goog*/

hte2.Workbench = (function () {
    var Workbench, container, containerWidth, redraw, addSymbol,
        splitByWhiteSpace, dh = new goog.dom.DomHelper(), currentDoc;
    
    container = dh.$('hte-workbench');
    
    splitByWhiteSpace = function () {
        var splittedWS;
        splittedWS = currentDoc.getDocText().split('\n');
        splittedWS = splittedWS.join(' \n ');
        return splittedWS.split(' ');
    };

    Workbench = {
        
        render : function () {
            var styles = hte2.Styling.getStyles(), i, j, k = 0, lineWidth, 
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
                paragraphStyle = hte2.Styling.getParagraphStyles(paragraphCounter);
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
                            textBuffer += currentFr;
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
                                        currentFr + "</span>";
                                } else {
                                    currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + 
                                        currentDoc.styleToString(styles[j]["style"]) + "\">" + 
                                        currentFr + "</span>");
                                    currentFrMU = currentFr + "</span>";
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
                                "\">" + currentFr.substr(styles[j]["start"] - frstart);
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
        
        removeLetter : function (position) {
            currentDoc.deleteSymbol(position, 1);
            hte2.pubsub.publish('rerender');
        },
        
        addParagraph : function (position) {
            currentDoc.addSymbol('\n', position);
            hte2.pubsub.publish('rerender');
        },
        
        addLetter : function (charCode, position) {
            currentDoc.addSymbol(String.fromCharCode(charCode), position);
            hte2.pubsub.publish('rerender');
        },
        
        getWorkbench : function () {
            return container;
        },
        
        getDocument : function () {
            return currentDoc.get();
        },
        
        setDocument : function (doc) {
            var lines = dh.getElementsByClass('hte-line');
            goog.array.forEach(lines, function (el) {
                dh.removeNode(el);
            });
            currentDoc = doc;

            hte2.pubsub.publish('rerender');
            hte2.pubsub.publish('docLoaded', doc.getId());
        }
    };
    
    return Workbench;
}());