/*jslint sub : true*/

/*global hte2, goog*/

/**
 * @fileoverview
 * JsonRPC client class
 */

/**
 * JsonRPC client class.
 * @constructor
 * @param {Object} [url] url where RPC service resides
 */
hte2.JsonRPC = function (url) {
    this.serializer = new goog.json.Serializer();
    this.url = url || '/';
    this.req = {
        "id" : Math.round(Math.random() * 100000),
        "jsonrpc" : "2.0"
    };
};

/**
 * Method sends POST request with content type application/json to the server, 
 * with appropriate params, encapsulated in json object, that are necessary for 
 * server-side method call 
 * TODO: Implement error handling.
 * @param {Object} jsonObj params for the server method
 * @param {String} method server method name
 */
hte2.JsonRPC.prototype.request = function (jsonObj, method) {
        this.req["method"] = method;
        this.req["params"] = {"data" : jsonObj};
        goog.net.XhrIo.send(this.url, function (e) {
            //Implement me
        }, 
            'POST', 
            this.serializer.serialize(this.req),
            {'Content-Type' : 'application/json'}
        );
    };
