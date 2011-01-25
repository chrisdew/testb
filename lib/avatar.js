var nextId = 0;

function Avatar() {
	var that = this;
	
	this.name = "avatar_" + nextId++;
	console.log("avatar " + this.name + " created");
	
	process.store.avatars[this.name] = this;
}

exports.Avatar = Avatar;