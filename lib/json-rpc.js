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
	this.socket = null;
	
	socket.on('connection',function(client){
		console.log("connection");
		if (that.mode === CLIENT) {
			client = socket;
		}
		that.numSessions++;
		client.on('disconnect',function(){
			console.log("disconnect");
			that.numSession--;
		});
		client.on('message', function(message){
			console.log("message:", message);
			var data = JSON.parse(message);
			if (!data.method || !data.params || data.id === undefined) {
				console.log("bad message", message);
				return;
			}
			if (that.methods[data.method] === undefined) {
				console.log("unknown method", message);
				return;
			}
			var out;
			console.log("params", that.params);
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
			console.log("sending:", out);
			client.send(JSON.stringify(out));
			
			if (data.result !== undefined || data.error !== undefined) {
				// find the callback and execute
				if (awaiting[id] !== undefined) {
					awaiting[id](data.error, data.result);
				} else {
					throw "Unexpected response id.";
				}
			}
		});
	});
	console.log("about to execute callback");
	if (callback) {
		callback();
	}
}

JsonRpc.prototype.addMethod = function(name, method) {
	this.methods[name] = method;
}

JsonRpc.prototype.rpc = function(method, params, callback) {
	console.log("JsonRpc.prototype.rpc", method, params, callback);
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
	console.log("sending:", out);
	if (this.mode == CLIENT) {
		this.socket.send(JSON.stringify(out));
	} else {
		var client = params.shift();
		<--- CONTINUE HERE - make it work for the server too
		client.send();
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