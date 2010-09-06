/**
 * This middleware module provides Comet functionality, helping compensate for
 * browser idionsynchrasies. It also provides a REST Channels implementation. 
 */

var getQueue = require("../queue").getQueue,
	hub = require("../hub");


// this gets a client connection that can be used to add events to the 
// associated connection queue.
exports.getClientConnection = function(request){
	if(request.clientConnection){
		return request.clientConnection;
	}
	var headers = request.headers;
	var clientId = headers ? (headers["client-id"] || headers["Client-Id"]) : request;
	var clientConnection = request.clientConnection = getQueue(clientId);
	if(headers && (headers["create-client-id"] || headers["Create-Client-Id"])){
		clientConnection.startedHere = true;
	}
	return clientConnection;
};

// this is the Comet end-point 
exports.Broadcaster = function(nextApp){
	return function(request){
		nextApp && nextApp(request); // ignore the response
		var headers = request.headers;
		var clientConnection = exports.getClientConnection(request);
		if(!clientConnection){
			throw new Error("No client connection");
		}
		var body;
		if(clientConnection.length){
			body = clientConnection.splice(0, clientConnection.length);
		}else{
			body = {
				forEach: function(callback){
					if(clientConnection.length){
						clientConnection.splice(0, clientConnection.length).forEach(callback);
					}else{
						var promiseCallback;
						var observer = clientConnection.observe("message", function(message){
							observer.dismiss();
							// TODO: maybe queue this up for the next event turn
							clientConnection.splice(0, clientConnection.length).forEach(callback);
							if(promiseCallback){
								promiseCallback();
							}
						});
						return {
							then: function(callback, errback){
								promiseCallback = callback;
							},
							cancel: function(){
								clientConnection.close();
							}
						}
					}
				}
			};
		}
		
		return {
			status: 200,
			headers: {},
			body: body 
		};
	};
}

// this subscribes to stores to listen for events to send through the Broadcaster
exports.Subscriber = function(subscriptions, nextApp){
	return function(request){
		if(nextApp){
			var response = nextApp(request);
		}
		subscriptions = subscriptions || request.body;
		clientConnection = request.clientConnection;
		var clientHub = hub.fromClient(clientConnection.clientId);
		subscriptions.forEach(function(subscription){
			var subscription = clientHub.subscribe(request.pathInfo, function(message){
				clientConnection.send(message);
			});
			clientConnection.onclose = subscription.unsubscribe;
		});
		return response;
		//response.headers.link = '<' + path + '>; rel="hub"'; // we will just define the relationship in the schema
		//return response;
	};
};

/**
 * Comet JSGI app factory that allows data to be sent to clients
 */
exports.Notifications = function(path, subscriptions, nextApp){
	if(typeof subscriptions === "function"){
		nextApp = subscriptions;
		subscriptions = null;
	}
	return exports.Connections(
			exports.Broadcaster(path, 
				exports.Subscriber(subscriptions),
				nextApp
			)
		);
};
