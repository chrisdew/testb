var SERVER = "SERVER";
var CLIENT = "CLIENT";
var stats_period = 10000; // 10s

function JsonRpc(socket, mode, sessionConstructor, callback) {
	console.log("JsonRpc instantiated:", socket, mode);
	
	var that = this;
	this.mode = mode;
	this.nextId = 0;
	this.methods = {};
	this.notifications = {};
	this.awaiting = {};
	this.socket = socket;
	
	// stats
	this.stats = {};
	this.stats_interval = setInterval(function() {
		//that.notify('stats', [that.stats]);
		// <-- CONTINUE here - add the session as a stats listener
		console.log('stats', JSON.stringify(that.stats));
		that.stats.bandwidthOut = 0;
		that.stats.bandwidthIn = 0;
	}, stats_period);
	this.stats.bandwidthOut = 0;
	this.stats.bandwidthIn = 0;
	this.stats.numSessions = 0;

	if (this.mode === SERVER) {
		socket.on('connection',function(client){
			console.log("connection" + client.sessionId);
			sessionConstructor(client);
			that.handleConnection(client);
		});
	} else {
		this.handleConnection(this.socket);
	}
	
	
	
	console.log("about to execute callback");
	if (callback) {
		callback();
	}
}

JsonRpc.prototype.handleConnection = function(client) {
	console.log("handleConnection");
	
	var that = this;
	
	that.stats.numSessions++;
	client.on('disconnect',function(){
		console.log("disconnect");
		that.numSession--;
	});

	client.on('message', function(message){
		console.log("message:", message);
		that.stats.bandwidthIn += message.length;
		try {
			var data = JSON.parse(message);
		} catch(err) {
			console.log("error parsing:" + message);
			return;
		}
		
		// handle notifications
		if (data.id === undefined) {
			if (that.notifications[data.method] === undefined) {
				console.log("unknown notification", message);
				return;
			}
			if (that.mode == SERVER) {
				data.params.unshift(client);
			}
			that.notifications[data.method].apply(null, data.params);
			return;
		}
		
		// handle method invocations
		if (data.result === undefined || data.error === undefined) {
			if (that.methods[data.method] === undefined) {
				console.log("unknown method", message);
				return;
			}
			var out;
			console.log("params", data.params);
			if (that.mode === SERVER) {
				data.params.unshift(client);
			}
			try {
				out = { id:data.id
					  , result: that.methods[data.method].apply(null, data.params)
					  , error: null
					  } ;
			} catch(err) {
				out = { id:data.id
					  , result: null
					  , error: err
					  } ;
			}
			if (that.mode === CLIENT) {
				out.serverTime = data.serverTime;
			}
			console.log("replying:", out, JSON.stringify(out), client);
			var txt = JSON.stringify(out);
			client.send(txt);
			that.stats.bandwidthOut += txt;
			console.log("replied");
		} else { // handle method reponse
			// find the callback and execute
			if (that.awaiting[data.id] !== undefined) {
				if (that.mode === SERVER) {
					that.awaiting[data.id](data.error, data.result, data.serverTime);
				} else {
					that.awaiting[data.id](data.error, data.result);
				}
			} else {
				throw "Unexpected response id.";
			}
		}
	});
}

JsonRpc.prototype.addMethod = function(name, method) {
	this.methods[name] = method;
}

JsonRpc.prototype.addNotificationHandler = function(name, handler) {
	this.notifications[name] = handler;
}

JsonRpc.prototype.rpc = function(method, params, callback) {
	//console.log("JsonRpc.prototype.rpc", method, params, callback);
	var that = this;
	
	if (this.numSession < 1) {
		throw "Socket not connected.";
	}
	var id = this.nextId++;
	var out = { id: id
			  , method: method
			  , params: params
			  } ;
	if (this.mode === SERVER) {
		out.serverTime = (new Date()).getTime();
	}
	console.log("rpc sending:", out);
	if (this.mode == CLIENT) {
		// work-around for flash player
		// Error: You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.
		setTimeout(function() {
			var txt = JSON.stringify(out);
			that.stats.bandwidthOut += txt.length;
			that.socket.send(txt);
		}, 1);
	} else {
		var client = params.shift(out.params);
		var txt = JSON.stringify(out);
		that.stats.bandwidthOut += txt.length;
		client.send(txt);
	}
	this.awaiting[id] = callback;
}

JsonRpc.prototype.notify = function(method, params) {
	//console.log("JsonRpc.prototype.notify", method, params);
	var that = this;
	
	if (this.numSession < 1) {
		throw "Socket not connected.";
	}
	var out = { method: method
			  , params: params
			  } ;
	console.log("notify sending:", out);
	if (this.mode == CLIENT) {
		// work-around for flash player
		// Error: You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround.
		setTimeout(function() {
			var txt = JSON.stringify(out);
			that.stats.bandwidthOut += txt.length;
			that.socket.send(txt);
		}, 1);
	} else {
		var client = params.shift(out.params);
		var txt = JSON.stringify(out);
		that.stats.bandwidthOut += txt.length;
		client.send(txt);
	}
}

JsonRpc.prototype.notifyAll = function(method, params) {
	if (this.mode !== SERVER) {
		throw "notifyAll can only be used from the server";
	}
	var that = this;
	
	if (this.numSession < 1) {
		throw "Socket not connected.";
	}
	var out = { method: method
			  , params: params
			  } ;
	var txt = JSON.stringify(out);
	that.stats.bandwidthOut += this.stats.numSessions * txt.length;
	this.socket.broadcast(txt);
}


if (typeof exports !== 'undefined') {
	exports.JsonRpc = JsonRpc;
	exports.SERVER = SERVER;
	exports.CLIENT = CLIENT;
} else {
	window.JsonRpc = JsonRpc;
	window.SERVER = SERVER;
	window.CLIENT = CLIENT;
}