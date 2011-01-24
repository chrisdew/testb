    var socket = new io.Socket();
    socket.connect();
    var jsonRpc = new JsonRpc(socket, function() {
        jsonRpc.rpc('ping', [], function(err, result) {
            console.log("ping response", err, result);
        });
    });