/*global require, module*/

var Connect = require('connect'), couch = require('./lib/couchdb'),
    client = couch.createClient(5984, 'localhost'),
    db = client.db('opendocs'), docIO;

docIO = {
    save : function (document) {
        var that = this;
        db.saveDoc(document, function (er, ok) {
            if (er) {
                console.log(er);
                that(er);
            }
            that(null, ok);
        });
        
    }
};

module.exports = Connect.createServer(
	Connect.staticProvider('../'),
	Connect.staticProvider('../../closure/closure-library-read-only/closure'),
    Connect.jsonrpc(docIO)
);

