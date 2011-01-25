var started = false;
$(document).ready(function() {
	if (started) {
		console.log("two document ready events fired");
		return;
	}
	started = true;
	console.log("index.js started");
    var socket = new io.Socket();
    window.socket = socket; //debugging
    socket.connect();
    socket.on('connect', function() {
    	var jsonRpc = new JsonRpc(socket, window.CLIENT);
    	jsonRpc.addMethod("foo", function() {
    		console.log("foo executed");
    		return "bar";
    	});
    	
    	console.log("sending ping");
    	jsonRpc.rpc('ping', [], function(err, result) {
    		console.log("ping response", err, result);
        });
    });
});