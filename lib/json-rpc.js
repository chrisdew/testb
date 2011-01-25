var SERVER = "SERVER";
var CLIENT = "CLIENT";

function JsonRpc(socket, mode, callback) {
	console.log("JsonRpc instantiated:", socket, mode);
	
	var that = this;
	this.mode = mode;
	this.nextId = 0;
	this.methods = {};
	this.numSessions = 0;
	this.awaiting = {};
	this.socket = socket;

	if (this.mode === SERVER) {
		socket.on('connection',function(client){
			console.log("connection");
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
	
	that.numSessions++;
	client.on('disconnect',function(){
		console.log("disconnect");
		that.numSession--;
	});
	if (that.mode === SERVER) {
		setInterval(function() {
			console.log("sending foo");
			that.rpc("foo", [client], function() {
				console.log("rpcing foo called back");
			});
		}, 2000);
	} else {
		setInterval(function() {
			console.log("sending ping");
			that.rpc("ping", [], function() {
				console.log("rpcing ping called back");
			});
		}, 3000);
	}
	client.on('message', function(message){
		console.log("message:", message);
		try {
			var data = JSON.parse(message);
		} catch(err) {
			console.log("error parsing:" + message);
			return;
		}
		if (data.id === undefined) {
			console.log("bad message", message);
			return;
		}
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
			client.send(JSON.stringify(out));
			console.log("replied");
		} else {
			// find the callback and execute
			if (that.awaiting[data.id] !== undefined) {
				that.awaiting[data.id](data.error, data.result);
			} else {
				throw "Unexpected response id.";
			}
		}
	});
}

JsonRpc.prototype.addMethod = function(name, method) {
	this.methods[name] = method;
}

JsonRpc.prototype.rpc = function(method, params, callback) {
	console.log("JsonRpc.prototype.rpc", method, params, callback);
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
			that.socket.send(JSON.stringify(out));
		}, 1);
	} else {
		var client = params.shift(out.params);
		client.send(JSON.stringify(out));
	}
	this.awaiting[id] = callback;
}

try {
	exports.JsonRpc = JsonRpc;
	exports.SERVER = SERVER;
	exports.CLIENT = CLIENT;
} catch(e) {
	window.JsonRpc = JsonRpc;
	window.SERVER = SERVER;
	window.CLIENT = CLIENT;
}