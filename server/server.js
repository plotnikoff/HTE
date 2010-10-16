/*global require, module*/

var Connect = require('connect'), 
    couch = require('./lib/nodeCouch/couchdb'),
    client = couch.createClient(5984, 'localhost'),
    db = client.db('opendocs'), 
    url = require('url'),
    hub = require("./lib/tunguska/hub"), 
    jsonrpc = require("./lib/connect-jsonrpc"),
    rest, comet, docIO;

docIO = {
    save : function (data, fn) {
        db.saveDoc(data, function (er, ok) {
            if (er) {
                fn(er);
            }
            fn(null, ok);
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
        if (res.method === 'POST') {
            this("Method should be called RESTfully");
        }
    }
};

rest = function (app) {
    app.get('/get/:id', function (req, res, next) {
        res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
            });
        docIO.get(req.params.id, res);
    });
    
    app.get('/getall', function (req, res, next) {
        res.writeHead(200, {
                'Content-Type': 'text/plain',
                'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
            });
        docIO.getAll(res);
    });
};

comet = {
    publish : function (data, fn) {
        if (data.docId !== '') {
            hub.publish(data.docId, '\n' + JSON.stringify(data));
        }
        fn(null, "ok");
    }
};

module.exports = Connect.createServer(
    Connect.staticProvider('../'),
    Connect.staticProvider('../../closure/closure-library-read-only/closure'),
    jsonrpc(docIO, comet),
    Connect.router(rest),
    function (req, res, next) {
            res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate'
                });
            var channelId = url.parse(req.url, true).query.id;
            if (channelId !== '') {
                hub.subscribe(channelId, 
                    function listenerFunction(message) {
                        res.write(message);
                    });
            }
        }
);

