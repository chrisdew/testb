/*
 * Copyright 2011, Barricane Technology Ltd.  All Rights Reserved.
 */

var us = require('./user')

var nextId = 0;

function Session(jsonRpc, client) {
	var that = this;
	
	this.id = nextId++;
	this.jsonRpc = jsonRpc;
	this.client = client;
	this.user = new us.User();
	this.avatar = this.user.avatars[0];
	console.log("session " + this.client.sessionId + ", " + this.id + " created");
	
	setInterval(function() {
		console.log("sending ping");
		that.jsonRpc.rpc("ping", [that.client], function(error, result, serverTime) {
			console.log("rpcing ping called back");
			var now = (new Date()).getTime();
			that.jsonRpc.notify("latency", [that.client, (now - serverTime) / 2])
		});
	}, 10000);
}

exports.Session = Session;