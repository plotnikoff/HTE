/*jslint sub : true*/

/*global hte2, goog*/

/**
 * @constructor
 */
hte2.JsonRPC = function () {
    this.serializer = new goog.json.Serializer();
    this.req = {
        "id" : Math.round(Math.random() * 100000),
        "jsonrpc" : "2.0"
    };
};

hte2.JsonRPC.prototype = {
    request : function (json, method) {
        this.req["method"] = method;
        this.req["params"] = {"document" : json};
        goog.net.XhrIo.send('/', function (e) {
                console.log(e);
            }, 
            'POST', 
            this.serializer.serialize(this.req),
            {'Content-Type' : 'application/json'}
        );
    }
};
