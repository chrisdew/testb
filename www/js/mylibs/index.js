var started = false;
$(document).ready(function() {
	if (started) {
		console.log("two document ready events fired");
		return;
	}
	started = true;
	console.log("index.js started");
    var socket = new io.Socket();
    socket.connect();
    socket.on('connect', function() {
    	var jsonRpc = new JsonRpc(socket, window.CLIENT);
    	console.log("sending ping");
    	jsonRpc.rpc('ping', [], function(err, result) {
    		console.log("ping response", err, result);
        });
    });
});