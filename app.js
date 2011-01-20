var http = require('http');
var io = require('socket.io');
var pb = require('paperboy');
var path = require('path');

var PORT = 8888;
var WEBROOT = path.join(path.dirname(__filename), 'www');
var HOST = "0.0.0.0";

function log(statCode, url, ip, err) {
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

var state = 
{ blog: 
  { l: 
    [ { date: "2011-01-19"
      , content: "blah"
      } 
    , { date: "2011-01-19"
      , content: "blah"
      }
    ]
  }
, contact:
  { phone: "01234 567890"
  , email: "cmsdew@gmail.com"
  }
}

var num_clients = 0;
socket.on('connection',function(client){
  num_clients++;
  var start = new Date().getTime();
  client.send(1);
  console.log(client);
  client.on('message',function(message){ 
	  setTimeout(function() {
		  client.send(num_clients);
	  }, 1000);
	  console.log( (new Date()).getTime() - start ); 
	  start = new Date().getTime();
  });
  client.on('disconnect',function(){
	num_clients--;
  }); 	
});