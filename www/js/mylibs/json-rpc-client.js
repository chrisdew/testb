function JsonRpc(socket, callback) {
	var that = this;
	this.nextId = 0;
	this.methods = {};
	this.connected = false;
	this.awaiting = {};
	
	socket.on('connection',function(){
		that.connected = true;
		socket.on('disconnect',function(){
			that.connected = false;
		});
		socket.on('message', function(message){
			var data = JSON.parse(message);
			if (data.id === undefined) {
				console.log("bad message", message);
				return;
			}
			// is it a request or a response?
			if (data.method !== undefined) {
				if (that.methods[data.method] === undefined) {
					console.log("unknown method", message);
					return;
				}
				try {
					console.log("params", that.params);
					socket.send(JSON.stringify(
						{ id:data.id
						, result: that.methods[data.method].apply(null, data.params)
						, error: null
						}
					));
				} catch(err) {
					socket.send(JSON.stringify(
						{ id:data.id
						, result: null
						, error: err
						}
					));
				}
			}
			if (data.result !== undefined || data.error !== undefined) {
				// find the callback and execute
				if (awaiting[id] !== undefined) {
					awaiting[id](data.error, data.result);
				} else {
					throw "Unexpected response id.";
				}
			}
		});
		callback();
	});
}

JsonRpc.prototype.addMethod = function(name, method) {
	this.methods[name] = method;
}

JsonRpc.prototype.rpc = function(method, params, callback) {
	if (!this.connected) {
		throw "Socket not connected.";
	}
	var id = nextId++;
	this.socket.send(JSON.stringify(
		{ id: id
		, method: method
		, params: params
		}
	));
	this.awaiting[id] = callback;
}
