var WIDTH = 50;
var HEIGHT = 85;

var EAST = 0;
var NORTH = 1;
var WEST = 2;
var SOUTH = 3;
var EAST_UNIT = [-50, 0];
var NORTH_UNIT = [0, -50];
var WEST_UNIT = [50, 0];
var SOUTH_UNIT = [0, 50];


function Client() {
	
}

Client.prototype.start = function() {
	var that = this;
	setTimeout(function() {
		var data = compost(["sk", "sh", "pa", "to", "ha"]);
		var sprite = new Sprite("player", data, "body", [400, 400]);
		that.player = sprite;
		that.bindKeys();					
	}, 1000);
}

// bind keyboard events to game functions (movement, etc)
Client.prototype.bindKeys = function () {
    var that = this;
    document.onkeydown = function(e) {
	    e = e || window.event;
	      console.log("down e.keyCode", e.keyCode);
		var now = (new Date()).getUTCMilliseconds()
	    switch (e.keyCode) { // which key was pressed?
	      case 38:
		  	that.player.go_to_rel(NORTH_UNIT, now + 2500); 
		  	console.log("N");
		  	break;
	      case 40: // down
		  	that.player.go_to_rel(SOUTH_UNIT, now + 2500); 
		  	console.log("S");
		  	break;
	      case 37: // left
		  	that.player.go_to_rel(WEST_UNIT, now + 2500); 
		  	console.log("W");
		  	break;
	      case 39: // right
		  	that.player.go_to_rel(EAST_UNIT, now + 2500); 
		  	console.log("E");
		  	break;
	    }
    }
  /*
  // stop the player movement/rotation when the keys are released
  document.onkeyup = function(e) {
    e = e || window.event;
      console.log("up e.keyCode", e.keyCode);
    switch (e.keyCode) {
      case 38:
      case 40:
      case 37:
      case 39:
        that.player.speed(0); break;
    }
  }
  */
}





function compost(image_urls) {
	var canvas = document.getElementById("composting_canvas");
	var ctx = canvas.getContext("2d");
	for (i in image_urls) {
		var image = document.getElementById(image_urls[i]);
		ctx.drawImage(image, 0, 0);
	}  
	return canvas.toDataURL();
}

function Sprite(id, image_data, container, coords) {
	$('<div class="sprite" id="' + id + '"></div>')
//	.css("background-image", "url(" + image_data + ")")
	.css("top", coords[0])
	.css("left", coords[1])
	.appendTo(container);

	this.image_data = image_data;
	this.id = id;
	this.coords = coords;
	this.dir = EAST;
	this.display();
}

/*
Sprite.prototype.go_to = function(coords, arrival) {
	console.log(coords, arrival);
	var that = this;
	
	if (coords[0] === this.coords[0] && coords[1] === this.coords[1]) {
		return;
	}
	
	// work out number of pixels to dest
	var dx = coords[0] - this.coords[0];
	var dy = coords[1] - this.coords[1];
	
	if (dx < 0 && Math.abs(dy) < Math.abs(dx)) {
		this.dir = EAST;
	}
	if (dx > 0 && Math.abs(dy) < Math.abs(dx)) {
		this.dir = WEST;
	}
	if (dy < 0 && Math.abs(dx) < Math.abs(dy)) {
		this.dir = NORTH;
	}
	if (dy > 0 && Math.abs(dx) < Math.abs(dy)) {
		this.dir = SOUTH;
	}
	
	var now = (new Date()).getUTCMilliseconds();
	var that = this;
	var timeleft = arrival - now;
	if (timeleft <= 0) {
		this.coords[0] = coords[0];
		this.coords[1] = coords[1];
		this.display();
		return;
	}
	this.coords[0] += dx * timeleft / 40;
	this.coords[1] += dy * timeleft / 40;
	
	setTimeout(function() {
		that.go_to(coords, arrival);
	}, 40);	
}
*/

Sprite.prototype.go_to_rel = function(coords, arrival) {
	//console.log("this", this);
	//this.go_to([coords[0] + this.coords[0], coords[1] + this.coords[1]], arrival)
	// work out number of pixels to dest
	var dx = coords[0] - this.coords[0];
	var dy = coords[1] - this.coords[1];
	console.log(this.coords, coords, dx, dy);
	if (dx < 0 && Math.abs(dy) < Math.abs(dx)) {
		this.dir = EAST;
	}
	if (dx > 0 && Math.abs(dy) < Math.abs(dx)) {
		this.dir = WEST;
	}
	if (dy < 0 && Math.abs(dx) < Math.abs(dy)) {
		this.dir = NORTH;
	}
	if (dy > 0 && Math.abs(dx) < Math.abs(dy)) {
		this.dir = SOUTH;
	}
	this.display();
}

Sprite.prototype.display = function() {
	var x, y;
	y = 0;
	if (this.dir == SOUTH) { x = 0; }
	if (this.dir == WEST) { x = 85; }
	if (this.dir == EAST) { x = 170; }
	if (this.dir == NORTH) { x = 255; }
	
	$('#' + this.id)
	.css("background-image", "url(" + this.image_data + ")")
	.css({backgroundPosition: y + "px " + x + "px"})
	.css("top", this.coords[0])
	.css("left", this.coords[1])
	;
}




