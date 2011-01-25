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
    	jsonRpc.addMethod("ping", function(error, result) {
    		console.log("ping invoked");
    		return "pong";
    	});
    	
    	jsonRpc.addNotificationHandler("latency", function(latency) {
    		console.log("handling " + latency + "ms");
    		$('#debug span.latency').text(latency);
    	});
    	
    	console.log("sending ping");
    	jsonRpc.rpc('ping', [], function(err, result) {
    		console.log("ping response", err, result);
        });
    });
});