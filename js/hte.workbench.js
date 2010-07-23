/*global hte2, goog*/

hte2.Workbench = (function () {
    var Workbench, container, containerWidth, splitted, redraw, addSymbol,
        splitByWhiteSpace, dh = new goog.dom.DomHelper(), generateStyle;
    
    container = dh.$('hte-workbench');
    containerWidth = parseInt(container.style.width, 10);

    splitted = hte2.dataStorage.docText.split('');
    
    splitByWhiteSpace = function () {
        var splittedWS;
        splittedWS = splitted.join('').split('\n');
        splittedWS = splittedWS.join(' \n ');
        return splittedWS.split(' ');
    };

    addSymbol = function (symbol, position) {
        var part1, part2;
        part1 = splitted.slice(0, position + 1);
        part2 = splitted.slice(position + 1);
        part1.push(symbol);
        splitted = part1.concat(part2);
        hte2.Styling.updatePositins(position, 'add');
        hte2.pubsub.publish('rerender');
    };

    generateStyle = hte2.Styling.generateStyle;

    Workbench = {
        
        render : function () {
            var styles = hte2.Styling.getStyles(), i, j, k = 0, lineWidth, 
                textBuffer = "", textHolder, offset = 0, wsSplitted, frstart, 
                frend, currentFr, oldLines, pushline, currentFrWidth;
            wsSplitted = splitByWhiteSpace();
            j = 0;
            frstart = 0;
            frend = 0;
            currentFr = '';
            lineWidth = 0;
            oldLines = hte2.$CN('hte-line', container);
            pushline = false;
            for (i = 0; i < wsSplitted.length; i += 1) {
                currentFr = wsSplitted[i] + String.fromCharCode(160);
                frstart = offset;
                frend = offset + (currentFr.length - 1);
                if (currentFr !== ('\n' + String.fromCharCode(160))) {
                    if (styles[j].start < frstart && frend <= styles[j].end) {
                        currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + generateStyle(styles[j].style) + "\">" + currentFr + "</span>");
                        if ((lineWidth + currentFrWidth) < containerWidth) {
                            lineWidth += currentFrWidth;
                            textBuffer += currentFr;
                        }
                        else {
                            i -= 1;
                            pushline = true;
                            offset -= currentFr.length;
                        }
                    } else if (frend > styles[j].end) {
                        while (currentFr.length !== 0) {
                            frend -= 1;
                            currentFr = currentFr.split('');
                            currentFr.pop();
                            currentFr = currentFr.join('');
                            if (frend === styles[j].end) {
                                if (frstart <= styles[j].start) {
                                    currentFr = currentFr.split('');
                                    currentFr.splice(0, styles[j].start - frstart);
                                    currentFr = currentFr.join('');
                                    lineWidth += hte2.Measurer.getGlyphWidth("<span style=\"" + generateStyle(styles[j].style) + "\">" + currentFr + "</span>");
                                    textBuffer += "<span style=\"" + generateStyle(styles[j].style) + "\">" + currentFr + "</span>";
                                } else {
                                    console.log(currentFr);
                                    lineWidth += hte2.Measurer.getGlyphWidth("<span style=\"" + generateStyle(styles[j].style) + "\">" + currentFr + "</span>");
                                    textBuffer += currentFr + "</span>";
                                }
                                j += 1;
                                i -= 1;
                                break;
                            }
                        }
                        offset -= currentFr.length;
                    } else {
                        lineWidth += hte2.Measurer.getGlyphWidth("<span style=\"" + generateStyle(styles[j].style) + "\">" + currentFr.substr(styles[j].start - frstart) + "</span>");
                        textBuffer += "<span style=\"" + generateStyle(styles[j].style) + "\">" + currentFr.substr(styles[j].start - frstart);
                    }
                } else {
                    offset -= 2;
                }
                
                offset += currentFr.length;
                if (pushline || currentFr === ('\n' + String.fromCharCode(160))) {
                    pushline = false;
                    textBuffer += "</span>";
                    if (oldLines.length === 0) {
                        textHolder = new hte2.Line('').get();
                        container.appendChild(textHolder);
                        textHolder.innerHTML = textBuffer;
                    } else {
                        if (oldLines[k]) {
                            oldLines[k].innerHTML = textBuffer;
                            k += 1;
                        } else {
                            textHolder = new hte2.Line('').get();
                            container.appendChild(textHolder);
                            textHolder.innerHTML = textBuffer;
                        }
                    }
                    textBuffer = "<span style=\"" + generateStyle(styles[j].style) + "\">";
                    lineWidth = 0;
                }
            }
            if (oldLines.length !== 0 && oldLines.length > k) {
                for (i = k; i < oldLines.length; i += 1) {
                    oldLines[k].parentNode.removeChild(oldLines[k]);
                }
            }
        },
        
        removeLetter : function (position) {
            splitted.splice(position, 1);
            hte2.Styling.updatePositins(position, 'remove');
            hte2.pubsub.publish('rerender');
        },
        
        addParagraph : function (position) {
            addSymbol('\n', position);
        },
        
        addLetter : function (charCode, position) {
            addSymbol(String.fromCharCode(charCode), position);
        },
        
        getWorkbench : function () {
            return container;
        },
        
        getSplitted : function () {
            return splitted;
        }
    };
    
    return Workbench;
}());