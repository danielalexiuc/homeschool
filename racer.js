/*global Car,TO_RADIANS,drawRotatedImage */

var canvas   = document.getElementById('canvas'),
	context  = canvas.getContext('2d'),
	ctxW     = canvas.width,
	ctxH     = canvas.height,
	player1   = new Car('judecar.png', 'player1', 870, 370),
	player2   = new Car('theGreenD.png', 'player2', 890, 400),
	track    = new Image(),
	trackHit = new Image(),

	elPX     = document.getElementById('px'),
	elPY     = document.getElementById('py')
;

track.src = "track.png";
trackHit.src = "track-hit.png";

// collision

var hit = new HitMap(trackHit);
// Keyboard Variables
var player1Keys = {
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39
};

var player2Keys = {
	UP:  87,
	DOWN:  83,
	LEFT:  65,
	RIGHT:  68
};

var keys = {
	38: false,
	40: false,
	37: false,
	39: false,
	87: false,
	83: false,
	65: false,
	68: false
};


function speedXY (rotation, speed) {
	return {
		x: Math.sin(rotation * TO_RADIANS) * speed,
		y: Math.cos(rotation * TO_RADIANS) * speed * -1
	};
}

var x=10,y=10;

function controls(car, up, down, left, right) {
	// constantly decrease speed
	if (!car.isMoving()) {
		car.speed = 0;
	} else {
		car.speed *= car.speedDecay;
	}
	// keys movements
	if (keys[up]) {
		car.accelerate();
	}
	if (keys[down]) {
		car.decelerate();
	}
	if (keys[left]) {
		car.steerLeft();
	}
	if (keys[right]) {
		car.steerRight();
	}

	var speedAxis = speedXY(car.rotation, car.speed);
	car.x += speedAxis.x;
	car.y += speedAxis.y;

	// collisions
	if (car.collisions.left.isHit(hit) || car.collisions.right.isHit(hit) || car.collisions.top.isHit(hit) || car.collisions.bottom.isHit(hit)) {
		car.onGrass = true;
	} else {
		car.onGrass = false;
	}

	// info
	elPX.innerHTML = Math.floor(car.x);
	elPY.innerHTML = Math.floor(car.y);
}

function step (car) {
	if (car.code === 'player1'){
		controls(car, player1Keys.UP, player1Keys.DOWN, player1Keys.LEFT, player1Keys.RIGHT);
	} else if(car.code === 'player2') {
		controls(car, player2Keys.UP, player2Keys.DOWN, player2Keys.LEFT, player2Keys.RIGHT);
	}
}

function draw (car1, car2) {
	context.clearRect(0,0,ctxW,ctxH); //clears the screen
	context.drawImage(track, 0, 0); //draws the track
	drawRotatedImage(car1.img, car1.x, car1.y, car1.rotation); //draws car 1
	drawRotatedImage(car2.img, car2.x, car2.y, car2.rotation); //draws car 2
}

// Keyboard event listeners
$(window).keydown(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = true;
		// e.preventDefault();
	}
});
$(window).keyup(function(e){
	if (keys[e.keyCode] !== 'undefined'){
		keys[e.keyCode] = false;
		// e.preventDefault();
	}
});

//start at the beginning if player 1 and player 2 collide
function crashCheck(player1, player2) {

	var xDifference = Math.abs(player1.x - player2.x);
	var yDifference = Math.abs(player1.y - player2.y);


	if(xDifference <15 && yDifference <15) {
		player1.x = 870;
		player1.y = 370
		player1.rotation=350
		player2.rotation=350

		player2.x = 890
		player2.y = 400

	}
}

function frame () {
	step(player1);
	step(player2);
	crashCheck(player1,player2);

	//This will draw both of the cars
	draw(player1, player2);
	window.requestAnimationFrame(frame);
}

frame();


