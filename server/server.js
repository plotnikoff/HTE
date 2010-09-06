/*global require, module*/

var Connect = require('connect'), couch = require('./lib/nodeCouch/couchdb'),
    client = couch.createClient(5984, 'localhost'),
    db = client.db('opendocs'), docIO,
    hub = require("./lib/tunguska/hub"), rest;

docIO = {
    save : function (document) {
        var that = this;
        db.saveDoc(document, function (er, ok) {
            if (er) {
                that(er);
            }
            that(null, ok);
        });
        
    },
    
    get : function (id, res) {
        var that = this;
        db.getDoc(id, function (er, ok) {
            if (er) {
                res.write(JSON.stringify(er));
            } else {
                res.write(JSON.stringify(ok));
            }
            res.end();
        });
        if (res.method === 'POST') {
            this("Method should be called RESTfully");
        }
    },
    
    getAll : function (res) {
        db.allDocs(function (er, ok) {
            if (er) {
                res.write(JSON.stringify(er));
            } else {
                res.write(JSON.stringify(ok));
            }
            res.end();
        });
        if (!res.method === 'POST') {
            this("Method should be called RESTfully");
        }
    }
};

rest = function (app) {
    app.get('/get/:id', function(req, res, next) {
        res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
           });
        docIO.get(req.params.path.id, res);
    });
    
    app.get('/getall', function(req, res, next) {
        res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
           });
        docIO.getAll(res);
    });
};

module.exports = Connect.createServer(
	Connect.staticProvider('../'),
	Connect.staticProvider('../../closure/closure-library-read-only/closure'),
    Connect.jsonrpc(docIO),
    Connect.router(rest),
    function (req, res, next) {
        if (req.method === 'POST') {
            //TODO: add channel id
            hub.publish("channel", Math.random().toString(36) + '\n\n');
            res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
            res.write("ok");
            res.end();
        } else {
            res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
                });
            //TODO: add channel id
            hub.subscribe("channel", function listenerFunction(message){
                res.write(message);
            });
        }
    }
);

