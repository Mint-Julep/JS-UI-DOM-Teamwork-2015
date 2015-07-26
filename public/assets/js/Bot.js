Bot = Class.extend({
	id: 0,

	/**
	 * Moving speed
	 */
	speed: 0,

	/**
	 * Player image
	 */
	playerImage: undefined,

	/**
	 * Entity position on map grid
	 */
	position: {},

	frames: {},

	animations: {},

	framerate: 0,

	spriteSheet: undefined,

	sprite: undefined,

	direction: {
		up: false,
		down: false,
		left: false,
		right: false
	},

	alive: true,

	init: function(id, position, image) {
		this.id = id;
		this.position = position;
		this.playerImage = image;
		this.frames = {width: 30, height: 32, count: 12, regX: 0, regY: 0, spacing: 0, margin: 0};
		this.animations = {
			facein: [0, 2, 'facein', 0.2],
			left: [3, 5, 'left', 0.2],
			faceaway: [6, 8, 'faceaway', 0.2],
			right: [9, 11, 'right', 0.2]
		};

		var data = {
			images: [image],
			frames: this.frames,
			animations: this.animations
		};

		this.spriteSheet = new createjs.SpriteSheet(data);
		this.sprite = new createjs.Sprite(this.spriteSheet, 'left');
		this.speed = 200;
	}
});