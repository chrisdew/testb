var http = require('http');
var io = require('socket.io');
var pb = require('paperboy');
var path = require('path');
var rpc = require('./lib/json-rpc');
var sess = require('./lib/session');

var PORT = 8888;
var WEBROOT = path.join(path.dirname(__filename), 'www');
var HOST = "0.0.0.0";

function log(statCode, url, ip, err) {
	return;
	  var logStr = statCode + ' - ' + url + ' - ' + ip;
	  if (err)
	    logStr += ' - ' + err;
	  console.log(logStr);
	}


var server = http.createServer(function(req, res) {
	  var ip = req.connection.remoteAddress;
	  pb
	    .deliver(WEBROOT, req, res)
	    .addHeader('Expires', 300)
	    .addHeader('X-PaperRoute', 'Node')
	    .before(function() {
	      console.log('Received Request');
	    })
	    .after(function(statCode) {
	      log(statCode, req.url, ip);
	    })
	    .error(function(statCode, msg) {
	      res.writeHead(statCode, {'Content-Type': 'text/plain'});
	      res.end("Error " + statCode);
	      log(statCode, req.url, ip, msg);
	    })
	    .otherwise(function(err) {
	      res.writeHead(404, {'Content-Type': 'text/plain'});
	      res.end("Error 404: File not found");
	      log(404, req.url, ip, err);
	    });
});

server.listen(PORT, HOST);

var socket = io.listen(server);

process.store = {};
process.store.users = {};
process.store.avatars = {};
process.trans = {};
process.trans.sessions = {};

var jsonRpc = new rpc.JsonRpc(socket, rpc.SERVER, function(client) {
	var session = new sess.Session(jsonRpc, client);
	process.trans.sessions[session.id] = session;
});
jsonRpc.addMethod('ping', function() {return 'pong';});
