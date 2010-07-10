/*global document, setInterval, window */

var hte2 = {};
//Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mauris dui, cursus in tincidunt vitae, tempus vel purus. Nam adipiscing porta mattis. Praesent fermentum commodo dignissim. Curabitur consectetur dolor quis libero cursus tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ucltrices posuere cubilia Curae; Aenean vulputate massa nulla. Sed felis ligula, ullamcorper ut commodo at, tincidunt quis purus. Nulla facilisi. Quisque\nFusce quam nibh, suscipit et tempor ac, pharetra consectetur leo. Aliquam sit amet mi ante, sed accumsan mi. Proin suscipit dictum augue, at placerat lorem fermentum eu. Praesent tortor justo, posuere quis fermentum nec, blandit quis odio. Vestibulum eget cursus neque. Donec quam nunc, ultricies quis tempus in, volutpat nec ipsum. Aenean consequat, diam non viverra rhoncus, justo tortor tempor mi, fermentum euismod nisl ipsum vel tellus. Sed auctor, tellus et imperdiet lobortis, orci urna malesuada felis, quis rhoncus ligula nisi ut risus. Nam commodo mattis vulputate. Suspendisse ac quam enim, non aliquam turpis. Suspendisse congue faucibus mi, et pulvinar nisi commodo quis. Nunc tincidunt eros convallis mi molestie posuere eu vel felis. Duis suscipit sapien vitae tortor euismod dignissim. Maecenas mi neque, euismod eu scelerisque sed, luctus nec orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce scelerisque, velit ac mattis eleifend, diam augue lacinia eros, eu ornare est erat et erat. Donec condimentum viverra euismod. Donec et nibh sit amet risus vestibulum interdum.\n
hte2.dataStorage = {
    docText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mauris dui, cursus in tincidunt vitae, tempus vel purus. Nam adipiscing porta mattis. Praesent fermentum commodo dignissim. Curabitur consectetur dolor quis libero cursus tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ucltrices posuere cubilia Curae; Aenean vulputate massa nulla. Sed felis ligula, ullamcorper ut commodo at, tincidunt quis purus. Nulla facilisi. Quisque\nFusce quam nibh, suscipit et tempor ac, pharetra consectetur leo. Aliquam sit amet mi ante, sed accumsan mi. Proin suscipit dictum augue, at placerat lorem fermentum eu. Praesent tortor justo, posuere quis fermentum nec, blandit quis odio. Vestibulum eget cursus neque. Donec quam nunc, ultricies quis tempus in, volutpat nec ipsum. Aenean consequat, diam non viverra rhoncus, justo tortor tempor mi, fermentum euismod nisl ipsum vel tellus. Sed auctor, tellus et imperdiet lobortis, orci urna malesuada felis, quis rhoncus ligula nisi ut risus. Nam commodo mattis vulputate. Suspendisse ac quam enim, non aliquam turpis. Suspendisse congue faucibus mi, et pulvinar nisi commodo quis. Nunc tincidunt eros convallis mi molestie posuere eu vel felis. Duis suscipit sapien vitae tortor euismod dignissim. Maecenas mi neque, euismod eu scelerisque sed, luctus nec orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce scelerisque, velit ac mattis eleifend, diam augue lacinia eros, eu ornare est erat et erat. Donec condimentum viverra euismod. Donec et nibh sit amet risus vestibulum interdum.\n",
    styling : [
        {
            style : [""],
            start : 0,
            end : 13
        }, {
            style : ["font-weight:bold;"],
            start : 14,
            end : 25
        }, {
            style : [""],
            start : 26,
            end : 29
        }, {
            style : ["font-weight:bold;"],
            start : 30,
            end : 36
        }, {
            style : [""],
            start : 37,
            end : 39
        }, {
            style : ["font-weight:bold;"],
            start : 40,
            end : 40
        }, {
            style : [""],
            start : 41,
            end : 41
        }, {
            style : ["font-weight:bold;"],
            start : 42,
            end : 42
        }, {
            style : [""],
            start : 43,
            end : 149
        }, {
            style : ["font-weight:bold;"],
            start : 150,
            end : 178
        }, {
            style : ["text-decoration:underline;"],
            start : 179,
            end : 250
        }, {
            style : [""],
            start : 251,
            end : 1607
        }
    ]
};

hte2.CONST = {};

hte2.CONST.ELEMENT_NODE = 1;
hte2.CONST.TEXT_NODE = 3;

hte2.CONST.ARR_UP = 38;
hte2.CONST.ARR_DOWN = 40;
hte2.CONST.ARR_LEFT = 37;
hte2.CONST.ARR_RIGHT = 39;
hte2.CONST.DELETE = 46;
hte2.CONST.BACKSPACE = 8;

hte2.$ = function (string) {
    return document.getElementById(string);
};

hte2.$CN = function (classname, context) {
    var res = [], tmp, length, i;
    tmp = context.getElementsByTagName('*');
    length = tmp.length;
    for (i = 0; i < length; i += 1) {
        if (tmp[i].className === classname) {
            res.push(tmp[i]);
        }
    }
    return res;
};

hte2.MouseHandler = function () {
    this.wb = hte2.Workbench.getWorkbench();
    this.wb.onclick = (function (that) {
        return function (ev) {
            that.setCursor(ev);
        };
    }(this));
    this.wb.ondblclick = (function (that) {
        return function (ev) {
            that.selectText(ev);
        };
    }(this));
};

hte2.MouseHandler.prototype = {
    setCursor : function (ev) {
        var e = ev ? ev : window.event, targ, posX, posY, substr, curPos, i;
        targ = e.target ? e.target : e.srcElement;
        if (e.pageX || e.pageY) {
            posX = e.pageX;
            posY = e.pageY;
        } else if (e.clientX || e.clientY) {
            posX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        if (targ.nodeName === 'SPAN') {
            hte2.Tracker.setLine(targ.parentNode, (posX - 8));
        }
    },
    
    selectText : function (ev) {
        var range = '';
        if (window.getSelection) {
            range = window.getSelection();
        } else if (document.selection) {
            range = document.selection.createRange();
        }
        console.log(range);
    }
};

hte2.Tracker = (function () {
    var line, ordinal, Tracker, listeners = [], notifyListeners;
    
    notifyListeners = function (data) {
        var length = listeners.length, i;
        for (i = 0; i < length; i += 1) {
            listeners[i].onTrackerChanged(data);
        }
    };
    
    Tracker = {
        
        getOrdinal : function () {
            return ordinal;
        },
        
        addListener : function (listener, xPosition) {
            listeners.push(listener);
        },
        
        setLine : function (target, xPosition) {
            line = target;
            var position = hte2.Measurer.calculatePosition(xPosition, true);
            ordinal = position.ordinal;
            notifyListeners(position);
        },
        
        setLineByOrdinal : function (target, ordinal) {
            line = target;
            ordinal = ordinal;
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        },
        
        getLine : function () {
            return line;
        },
        
        lineUp : function () {
            line = line.previousSibling;
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        },
        
        lineDown : function () {
            line = line.nextSibling;
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        },
        
        symbolLeft : function () {
            ordinal -= 1;
            if (ordinal < 0) {
                Tracker.lineUp();
                ordinal = line.firstChild.firstChild.nodeValue.length;
            }
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        },
        
        symbolRight : function () {
            var strParts, i, length = 0, firstWordLength;
            ordinal += 1;
            strParts = line.childNodes;
            for (i = 0; i < strParts.length; i += 1) {
                if (strParts[i].firstChild) {
                    length += strParts[i].firstChild.nodeValue.length;
                }
            }
            if (ordinal > length) {
                Tracker.lineDown();
                ordinal = ordinal - length;
            }
            notifyListeners(hte2.Measurer.calculatePosition(ordinal));
        }
    };
    
    return Tracker;
}());

hte2.Cursor = (function () {
    var cur, Cursor, ordinal = 0, cx, cy;
    
    cur = hte2.$('hte-cursor');
    
    setInterval(function () {
        cur.style.display = cur.style.display === 'block' ? 'none' : 'block';
    }, 600);
    
    Cursor = {
        setPosition : function (x, y) {
            cur.style.left = x + 'px';
            cur.style.top = y + 'px';
            cx = x;
            cy = y;
            cur.style.display = 'block';
        },
        
        getPosition : function () {
            return {x : cx, y : cy};
        },
        
        setHeight : function (height) {
            cur.style.height = height + 'px';
        },
        
        setOrdinalPosition : function (position) {
            ordinal = position;
        },
        
        getOrdinalPosition : function () {
            return ordinal;
        },
        
        onTrackerChanged : function (positionData) {
            Cursor.setPosition(positionData.x, positionData.y);
            Cursor.setHeight(positionData.height);
            Cursor.setOrdinalPosition(positionData.ordinal);
        }
    };
    
    return Cursor;
}());

hte2.Measurer = (function () {
    var Measurer, holder, calculateOffset, calculateYPosition, calculateHeight;
    
    holder = hte2.$('hte-measurer');
    
    calculateOffset = function () {
        var prevLine, child, strParts, i = 0, j, offset = 0, line;
        line = hte2.Tracker.getLine();
        prevLine = line.previousSibling;
        while (prevLine && prevLine.id !== 'hte-cursor') {
            child = prevLine.childNodes;
            for (j = 0; j < child.length; j += 1) {
                if (child[j].firstChild) {
                    offset += child[j].firstChild.nodeValue.length;
                }
            }
            prevLine = prevLine.previousSibling;
            i = 0;
        }
        //array is zero based, that's why we should subtract 1;
        return offset - 1;
    };
    
    calculateYPosition = function (direction) {
        return hte2.Tracker.getLine().offsetTop;
    };
    
    calculateHeight = function () {
        return hte2.Tracker.getLine().firstChild.offsetHeight;
    };
    
    Measurer = {
        
        calculatePosition : function (condition, useCoord) {
            var i = 0, j, curPos = 0, charComparator, coordComparator, comparator, line, str, strParts, ordinal = 0, xCorrection;
            curPos = parseInt(hte2.Workbench.getWorkbench().style.paddingLeft, 10);
            line = hte2.Tracker.getLine();
            strParts = line.childNodes;
            charComparator = function () {
                return ordinal < condition;
            };
            coordComparator = function () {
                return curPos <= condition;
            };
            comparator = useCoord ? coordComparator : charComparator;
            for (j = 0; j < strParts.length; j += 1) {
                str = strParts[j].firstChild;
                if (str !== null) {
                    str = str.nodeValue;
                    while (comparator()) {
                        holder.innerHTML = "<span style=\"font-weight:" + strParts[j].style.fontWeight + "\">" + str.charAt(i) + "</span>";
                        curPos += holder.firstChild.offsetWidth;
                        i += 1;
                        ordinal += 1;
                        if (i === str.length) {
                            break;
                        }
                    }
                }
                i = 0;
            }
            return {x : curPos, y : calculateYPosition(), height : calculateHeight(), ordinal : ordinal, offset : calculateOffset() + ordinal};
        },
        
        getGlyphWidth : function (glyph) {
            holder.innerHTML = glyph;
            return holder.offsetWidth;
        }
    };
    
    return Measurer;
}());

hte2.Workbench = (function () {
    var Workbench, container, containerWidth, splitted, redraw, splitByWhiteSpace;
    
    container = hte2.$('hte-workbench');
    containerWidth = parseInt(container.style.width, 10);

    splitted = hte2.dataStorage.docText.split('');
    
    splitByWhiteSpace = function () {
        var splittedWS;
        splittedWS = splitted.join('').split('\n');
        splittedWS = splittedWS.join(' \n ');
        return splittedWS.split(' ');
    };

    Workbench = {
        
        render : function () {
            var styles = hte2.Styling.getStyles(), i, j, k = 0, lineWidth, textBuffer = "", 
                textHolder, offset = 0, wsSplitted, frstart, frend, currentFr, oldLines, pushline, currentFrWidth;
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
                if (styles[j].start < frstart && frend <= styles[j].end) {
                    if (currentFr !==  ('\n' + String.fromCharCode(160))) {
                        currentFrWidth = hte2.Measurer.getGlyphWidth("<span style=\"" + styles[j].style + "\">" + currentFr + "</span>");
                        if ((lineWidth + currentFrWidth) < containerWidth) {
                            lineWidth += currentFrWidth;
                            textBuffer += currentFr;
                        } else {
                            i -= 1;
                            pushline = true;
                            offset -= currentFr.length;
                        }
                    }
                } else if (frend > styles[j].end) {
                    if (currentFr !== '\n') {
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
                                    lineWidth += hte2.Measurer.getGlyphWidth("<span style=\"" + styles[j].style + "\">" + currentFr + "</span>");
                                    textBuffer += "<span style=\"" + styles[j].style + "\">" + currentFr + "</span>";
                                } else {
                                    lineWidth += hte2.Measurer.getGlyphWidth("<span style=\"" + styles[j].style + "\">" + currentFr + "</span>");
                                    textBuffer += currentFr + "</span>";
                                }
                                j += 1;
                                i -= 1;
                                break;
                            }
                        }
                        offset -= currentFr.length;
                    }
                } else {
                    if (currentFr !== '\n') {
                        lineWidth += hte2.Measurer.getGlyphWidth("<span style=\"" + styles[j].style + "\">" + currentFr.substr(styles[j].start - frstart) + "</span>");
                        textBuffer += "<span style=\"" + styles[j].style + "\">" + currentFr.substr(styles[j].start - frstart);
                    }
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
                    textBuffer = "<span style=\"" + styles[j].style + "\">";
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
            splitted.splice(position + 1, 1);
            hte2.Styling.updatePositins(position + 1, 'remove');
            Workbench.render();
        },
        
        addLetter : function (charCode, position) {
            var symb = String.fromCharCode(charCode), part1, part2;
            part1 = splitted.slice(0, position + 2);
            part2 = splitted.slice(position + 2);
            part1.push(symb);
            splitted = part1.concat(part2);
            hte2.Styling.updatePositins(position + 1, 'add');
            Workbench.render();
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

hte2.Styling = (function () {
    var Styling, styles = hte2.dataStorage.styling;
    
    Styling = {
        
        getStyles : function () {
            return styles;
        },
        
        updatePositins : function (offset, operation) {
            var i, tmp = [];
            console.log("offset :" + offset);
            for (i = 0; i < styles.length; i += 1) {
                if (offset < styles[i].start) {
                    styles[i].start += operation === 'add' ? 1 : -1;
                }
                if (offset <= styles[i].end) {
                    styles[i].end += operation === 'add' ? 1 : -1;
                }
                if (!(styles[i].end < styles[i].start)) {
                    tmp.push(styles[i]);
                }
            }
            styles = tmp;
        }
    };
    
    return Styling;
}());

hte2.Line = function (text) {
    var lineCont, stringCont, textNode;
    lineCont = document.createElement('div');
    lineCont.className = 'hte-line';
    this.text = text;
    this.lineCont = lineCont;
};

hte2.Line.prototype = {
    get : function () {
        return this.lineCont;
    }
};

hte2.KeyHandler = function () {
    document.onkeypress = this.intercept;
};

hte2.KeyHandler.prototype = {
    intercept : function (ev) {
        var code, e, curPos;
        e = ev ? ev : window.event;
        if (e.keyCode) {
            code = e.keyCode;
        } else if (e.which) {
            code = e.which;
        }
        switch (code) {
        case hte2.CONST.ARR_LEFT:
            hte2.Tracker.symbolLeft();
            break;
        case hte2.CONST.ARR_RIGHT:
            hte2.Tracker.symbolRight();
            break;
        case hte2.CONST.ARR_UP:
            hte2.Tracker.lineUp();
            break;
        case hte2.CONST.ARR_DOWN:
            hte2.Tracker.lineDown();
            break;
        case hte2.CONST.BACKSPACE:
            hte2.Tracker.symbolLeft();
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset);
            break;
        case hte2.CONST.DELETE:
            hte2.Workbench.removeLetter(hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset);
            break;
        default:
            if (code !== undefined) {
                hte2.Workbench.addLetter(code, hte2.Measurer.calculatePosition(hte2.Tracker.getOrdinal()).offset - 1);
                hte2.Tracker.symbolRight();
            }
            break; 
        }
    }
};

(function () {
    var curPos;
    hte2.Workbench.render();
    hte2.Tracker.addListener(hte2.Cursor);
    hte2.Tracker.setLineByOrdinal(hte2.$CN('hte-line', hte2.Workbench.getWorkbench())[0], 0);
    new hte2.MouseHandler();
    new hte2.KeyHandler();
}());