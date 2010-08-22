/*global require, module*/

var Connect = require('connect'), db;

db = {
    save : function () {
    }
}

module.exports = Connect.createServer(
	Connect.staticProvider('../'),
	Connect.staticProvider('../../closure/closure-library-read-only/closure'),
    Connect.jsonrpc()
);

