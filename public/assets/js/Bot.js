Bot = Entity.extend({
	id: 0,

	// Bot direction
	direction: undefined,
	oldDirection: 'right',
	// Moving speed
	speed: 1,

	// Bot image
	botImage: undefined,

	// Entity position on map grid
	position: {},

	frames: {},

	animations: {},

	framerate: 0,

	spriteSheet: undefined,

	sprite: undefined,

	// Bitmap dimensions
	size: {
		w: 32,
		h: 38
	},

	alive: true,


	init: function (id, position, image) {
		this.id = id;
		this.position = position;
		this.botImage = image;
		this.frames = {width: 32, height: 32, count: 18, regX: 0, regY: 0, spacing: 0, margin: 0};
		this.animations = {
			facein: [0, 2, 'facein', 0.2],
			left: [3, 5, 'left', 0.2],
			right: [6, 8, 'right', 0.2],
			faceaway: [9, 11, 'faceaway', 0.2],
            die:[12,17,'die',0.2/3]
		};

		var data = {
			images: [image],
			frames: this.frames,
			animations: this.animations
		};

		this.spriteSheet = new createjs.SpriteSheet(data);
		this.sprite = new createjs.Sprite(this.spriteSheet, 'left');

	},
	chooseDirection: function () {
		var i,
			tmp,
			counter = 0,
			dir = this.direction,
			directions = [];

		if (this.canMove('up')) directions.push('up');
		if (this.canMove('down')) directions.push('down');
		if (this.canMove('left')) directions.push('left');
		if (this.canMove('right')) directions.push('right');

		if(this.sprite.paused){
			this.move();
		}

		counter = directions.length;

		if ((Math.random() * 300 | 0) === 5) {
			this.direction = Math.floor((Math.random() * 10 | 0) % counter);
			return;
		}

		if (directions.indexOf(this.oldDirection) >= 0) {
			this.direction = this.oldDirection;
			return;
		}

		switch (counter) {
			case 1:
				this.direction = directions[0];
				break;
			case 2:
				tmp = Math.floor((Math.random() * 10 | 0) % 2);
				this.direction = directions[tmp];
				break;
			case 3:
				tmp = Math.floor((Math.random() * 10 | 0) % 3);
				this.direction = directions[tmp];
				break;
			case 4:
				tmp = Math.floor((Math.random() * 10 | 0) % 4);
				this.direction = directions[tmp];
				break;
			default:
				break;
		}
	},

	canMove: function (direction) {
		var x = this.position.x,
			y = this.position.y;

		x = (x + 1) | 0;
		y = (y + 1) | 0;

		if (direction === "down") {
			if (y < 554 && gameEngine.isMapEmptyAt(x + 4, y + 42) && gameEngine.isMapEmptyAt(x + 22, y + 42)) {
				return true;
			} else {
				return false;
			}
		} else if (direction === "up" && gameEngine.isMapEmptyAt(x + 4, y - 3) && gameEngine.isMapEmptyAt(x + 22, y - 3)) {
			if (y > 2) {
				return true;
			} else {
				return false;
			}
		} else if (direction === "left" && gameEngine.isMapEmptyAt(x - 1, y + 4) && gameEngine.isMapEmptyAt(x - 1, y + 39)) {
			if (x > 2) {
				return true;
			} else {
				return false;
			}
		} else if (direction === "right" && gameEngine.isMapEmptyAt(x + 39, y + 4) && gameEngine.isMapEmptyAt(x + 39, y + 39)) {
			if (x < 754) {
				return true;
			} else {
				return false;
			}
		}
	},
	move: function () {
		switch (this.direction) {
			case 'up':
				this.position.y -= this.speed;
				if (this.oldDirection !== 'up') {
					this.sprite.gotoAndPlay('faceaway');
				}
				break;
			case 'down':
				this.position.y += this.speed;
				if (this.oldDirection !== 'down') {
					this.sprite.gotoAndPlay('facein');
				}
				break;
			case 'left':
				this.position.x -= this.speed;
				if (this.oldDirection !== 'left') {
					this.sprite.gotoAndPlay('left');
				}
				break;
			case 'right':
				this.position.x += this.speed;
				if (this.oldDirection !== 'right') {
					this.sprite.gotoAndPlay('right');
				}
				break;
		}

		this.oldDirection = this.direction;
		this.sprite.setTransform(this.position.x, this.position.y, 1.25, 1.25)
	}
});
