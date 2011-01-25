var av = require('./avatar');
var nextId = 0;

function User() {
	var that = this;
	
	this.name = "user_" + nextId++;
	console.log("user " + this.name + " created");
	
	this.avatars = [new av.Avatar(this)];
	
	process.store.users[this.name] = this;
}

exports.User = User;
