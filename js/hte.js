/*global document, setInterval, window */

var hte2 = {};

hte2.dataStorage = {
    docText : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque mauris dui, cursus in tincidunt vitae, tempus vel purus. Nam adipiscing porta mattis. Praesent fermentum commodo dignissim. Curabitur consectetur dolor quis libero cursus tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ucltrices posuere cubilia Curae; Aenean vulputate massa nulla. Sed felis ligula, ullamcorper ut commodo at, tincidunt quis purus. Nulla facilisi. Quisque\nFusce quam nibh, suscipit et tempor ac, pharetra consectetur leo. Aliquam sit amet mi ante, sed accumsan mi. Proin suscipit dictum augue, at placerat lorem fermentum eu. Praesent tortor justo, posuere quis fermentum nec, blandit quis odio. Vestibulum eget cursus neque. Donec quam nunc, ultricies quis tempus in, volutpat nec ipsum. Aenean consequat, diam non viverra rhoncus,\n justo tortor tempor mi, fermentum euismod nisl ipsum vel tellus. Sed auctor, tellus et imperdiet lobortis, orci urna malesuada felis, quis rhoncus ligula nisi ut risus. Nam commodo mattis vulputate. Suspendisse ac quam enim, non aliquam turpis. Suspendisse congue faucibus mi, et pulvinar nisi commodo quis. Nunc tincidunt eros convallis mi molestie posuere eu vel felis. Duis suscipit sapien vitae tortor euismod dignissim. Maecenas mi neque, euismod eu scelerisque sed, luctus nec orci. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Fusce scelerisque, velit ac mattis eleifend, diam augue lacinia eros, eu ornare est erat et erat. Donec condimentum viverra euismod. Donec et nibh sit amet risus vestibulum interdum.\n",
    styling : [
        {
            style : {"fs" : 12},
            start : 0,
            end : 13
        }, {
            style : {"fs" : 12, "fw" : "bold"},
            start : 14,
            end : 25
        }, {
            style : {"fs" : 12},
            start : 26,
            end : 29
        }, {
            style : {"fs" : 12, "fw" : "bold"},
            start : 30,
            end : 36
        }, {
            style : {"fs" : 12},
            start : 37,
            end : 39
        }, {
            style : {"fs" : 12, "fw" : "bold"},
            start : 40,
            end : 40
        }, {
            style : {"fs" : 12},
            start : 41,
            end : 41
        }, {
            style : {"fs" : 12, "fw" : "bold"},
            start : 42,
            end : 42
        }, {
            style : {"fs" : 12},
            start : 43,
            end : 149
        }, {
            style : {"fs" : 12, "fw" : "bold", "td" : "underline"},
            start : 150,
            end : 178
        }, {
            style : {"fs" : 12, "td" : "underline"},
            start : 179,
            end : 250
        }, {
            style : {"fs" : 15},
            start : 251,
            end : 475
        }, {
            style : {"fs" : 12, "fw" : "bold"},
            start : 476,
            end : 483
        }, {
            style : {"fs" : 12},
            start : 484,
            end : 1697
        }
    ]
};

hte2.CONST = {};

hte2.CONST.ELEMENT_NODE = 1;
hte2.CONST.TEXT_NODE = 3;

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
