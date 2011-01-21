

function JsonRpc(socket) {
	var that = this;
	this.nextId = 0;
	this.methods = {};
	
	socket.on('connection',function(client){
		that.numSessions++;
		client.on('disconnect',function(){
		});
		client.on('message', function(message){
			var data = JSON.parse(message);
			if (!data.method || !data.params || data.id === undefined) {
				console.log("bad message", message);
				return;
			}
			if (that.methods[data.method] === undefined) {
				console.log("unknown method", message);
				return;
			}
			try {
				console.log("oarams", params);
				client.send(JSON.stringify(
					{ id:data.id
					, result: that.methods[data.method].apply(null, data.params)
					, error: null
					}
				));
			} catch(err) {
				client.send(JSON.stringify(
					{ id:data.id
					, result: null
					, error: err
					}
				));
			}
		});
	});
}

JsonRpc.prototype.addMethod = function(name, method) {
	this.methods[name] = method;
}

if (exports !== undefined) {
	exports.JsonRpc = JsonRpc;
} else {
	window.JsonRpc = JsonRpc;
}