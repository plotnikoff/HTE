/*jslint sub : true*/

/*global hte2, goog*/

/**
 * @constructor
 */
hte2.JsonRPC = function (url) {
    this.serializer = new goog.json.Serializer();
    this.url = url || '/';
    this.req = {
        "id" : Math.round(Math.random() * 100000),
        "jsonrpc" : "2.0"
    };
};

hte2.JsonRPC.prototype = {
    request : function (jsonObj, method) {
        this.req["method"] = method;
        this.req["params"] = {"document" : jsonObj};
        goog.net.XhrIo.send(this.url, function (e) {
        }, 
            'POST', 
            this.serializer.serialize(this.req),
            {'Content-Type' : 'application/json'}
        );
    }
};
