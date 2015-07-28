var multiplayer = multiplayer || false;

GameEngine = Class.extend({
	id: 0,

	player: undefined,

	bot: undefined,

	stage: undefined,

	base: this,

	containers: {},

	keysQueue: [],

	lastTime: Date.now(),

	muted: false,

	init: function() {
		var filesQueue,
			librariesQueue;

		this.startEngine();

	},
	showLevelScreen: function() {
		$('.gamelayer').hide();
		$('#levelselectscreen').css('opacity', 0);
		$('#levelselectscreen').show();
		$('#levelselectscreen').animate({opacity: 1});
	},
	showSettingsScreen: function() {
		$('.gamelayer').hide();
		$('#settingsscreen').hide().slideDown(1000);
	},
	main: function() {
		var now = Date.now();
		gameEngine.deltaTime = (now - this.lastTime) / 1000.0;

		gameEngine.update();

		this.lastTime = now;

		requestAnimationFrame(gameEngine.main);
	},
	update: function() {
		this.bot.chooseDirection();
		this.bot.move();
		gameEngine.handleInput();

	},
	handleInput: function() {
		var moved = false;

		if (input.isDown('DOWN') || input.isDown('s')) {
			moved = true;

			if (this.keysQueue[0] !== "down") {
				if (!(this.keysQueue.indexOf("down") >= 0)) {
					this.keysQueue.unshift("down");
				}
			}

		} else {
			var keysBefore = this.keysQueue.length;
			this.keysQueue.remove("down");
			var keysAfter = this.keysQueue.length;

			if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length
			                                                                                    === 1
			                                                                                    && this.keysQueue[0]
			                                                                                       === "space"))) {
				server.sendMoveToServer(this.player.position, 'stopped');
			}
		}

		if (input.isDown('Up') || input.isDown('w')) {
			moved = true;

			if (this.keysQueue[0] !== "up") {
				if (!(this.keysQueue.indexOf("up") >= 0)) {
					this.keysQueue.unshift("up");
				}
			}
		} else {
			var keysBefore = this.keysQueue.length;
			this.keysQueue.remove("up");
			var keysAfter = this.keysQueue.length;

			if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length
			                                                                                    === 1
			                                                                                    && this.keysQueue[0]
			                                                                                       === "space"))) {
				server.sendMoveToServer(this.player.position, 'stopped');
			}
		}

		if (input.isDown('LEFT') || input.isDown('a')) {
			moved = true;

			if (this.keysQueue[0] !== "left") {
				if (!(this.keysQueue.indexOf("left") >= 0)) {
					this.keysQueue.unshift("left");
				}
			}

		} else {
			var keysBefore = this.keysQueue.length;
			this.keysQueue.remove("left");
			var keysAfter = this.keysQueue.length;

			if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length
			                                                                                    === 1
			                                                                                    && this.keysQueue[0]
			                                                                                       === "space"))) {
				server.sendMoveToServer(this.player.position, 'stopped');
			}
		}

		if (input.isDown('Right') || input.isDown('d')) {

			moved = true;

			if (this.keysQueue[0] !== "right") {
				if (!(this.keysQueue.indexOf("right") >= 0)) {
					this.keysQueue.unshift("right");
				}
			}

		} else {
			var keysBefore = this.keysQueue.length;
			this.keysQueue.remove("right");
			var keysAfter = this.keysQueue.length;

			if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length
			                                                                                    === 1
			                                                                                    && this.keysQueue[0]
			                                                                                       === "space"))) {
				server.sendMoveToServer(this.player.position, 'stopped');
			}
		}

		if (input.isDown('Space') || input.isDown('x')) {

			if (this.keysQueue.indexOf("space") === -1) {
				this.keysQueue.push('space');
				if (multiplayer) {
					server.sendPlacedBombToServer(this.player.position);
				}

				var bomb = new Bomb(1, {x: 0, y: 0});
				bomb.sprite.setTransform(this.player.position.x, this.player.position.y + (bomb.size.w / 2));
				gameEngine.containers.playerBombs.addChild(bomb.sprite);
				bomb.activate(gameEngine.containers.playerBombs);
			}

		} else {
			this.keysQueue.remove("space");
		}

		if (input.isDown('M')) {

			if (this.keysQueue.indexOf("m") === -1) {
				this.keysQueue.push('m');

				gameEngine.muted = !gameEngine.muted;
				createjs.Sound.muted = !createjs.Sound.muted;

			}

		} else {
			this.keysQueue.remove("m");
		}

		if (moved) {
			if (this.keysQueue[0] === "up") {

				if (this.player.canMove("up")) {
					this.player.position.y -= this.player.speed * gameEngine.deltaTime;
				}

				if (multiplayer) {
					server.sendMoveToServer(this.player.position, 'faceaway');
				}

				if (this.player.sprite.currentAnimation !== 'faceaway') {
					this.player.sprite.gotoAndPlay('faceaway');
				}

			}
			if (this.keysQueue[0] === "down") {
				if (this.player.canMove("down")) {
					this.player.position.y += this.player.speed * gameEngine.deltaTime;
				}

				if (multiplayer) {
					server.sendMoveToServer(this.player.position, 'facein');
				}

				if (this.player.sprite.currentAnimation !== 'facein' || this.player.sprite.paused) {
					this.player.sprite.gotoAndPlay('facein');
				}
			}
			if (this.keysQueue[0] === "left") {
				if (this.player.canMove("left")) {
					this.player.position.x -= this.player.speed * gameEngine.deltaTime;
				}

				if (multiplayer) {
					server.sendMoveToServer(this.player.position, 'left');
				}

				if (this.player.sprite.currentAnimation !== 'left') {
					this.player.sprite.gotoAndPlay('left');
				}
			}
			if (this.keysQueue[0] === "right") {
				if (this.player.canMove("right")) {
					this.player.position.x += this.player.speed * gameEngine.deltaTime;
				}

				if (multiplayer) {
					server.sendMoveToServer(this.player.position, 'right');
				}

				if (this.player.sprite.currentAnimation !== 'right') {
					this.player.sprite.gotoAndPlay('right');
				}
			}

			gameEngine.render();
		} else {
			this.player.clearDirections();
			this.player.sprite.gotoAndStop('facein');
			this.stage.update();
		}
	},
	render: function() {
		//console.log('will render');
		this.player.sprite.x = this.player.position.x;
		this.player.sprite.y = this.player.position.y;
		this.stage.update();
	},
	startEngine: function() {
		this.loadLibraries();
	},
	loadLibraries: function() {
		var librariesQueue = new createjs.LoadQueue();
		librariesQueue.loadManifest([
			{
				id: "SoundJS",
				src: "/bower_components/SoundJS/lib/soundjs-0.6.1.min.js"
			},
			{
				id: "EaselJS",
				src: "/bower_components/EaselJS/lib/easeljs-0.8.1.min.js"
			}]);

		librariesQueue.addEventListener('complete', this.loadFiles);
		librariesQueue.addEventListener('progress', function(e) {
			$('.loadie').html('Loading libraries');
			$('#gamecontainer').loadie(e.progress);
		});
	},
	loadFiles: function() {
		gameEngine.filesQueue = new createjs.LoadQueue();
		gameEngine.filesQueue.installPlugin(createjs.Sound);

		var filesToLoad = [
			{id: "Entity", src: "/assets/js/Entity.js"},
			{id: "Player", src: "/assets/js/Player.js"},
			{id: "Bot", src: "/assets/js/Bot.js"},
			{id: "Bomb", src: "/assets/js/Bomb.js"},
			{id: "input", src: "/assets/js/input.js"},
			{id: "sprite", src: "/assets/js/sprite.js"},
			{id: "inputEngine", src: "/assets/js/inputEngine.js"},
			{id: "utils", src: "/assets/js/utils.js"},
			{id: "levels", src: "/assets/js/levels.js"},
			{id: "clipper", src: "/assets/js/libs/clipper.js"},
			{id: "intro-sound", src: "/assets/sound/get-ready.mp3"},
			{id: "bomb-sound", src: "/assets/sound/explosion.mp3"},
			{id: "gameplay-sound", src: "/assets/sound/game-play-normal.mp3"},
			{id: "click", src: "/assets/sound/click.wav"},
			{id: "tile-grass", src: "/assets/img/grass.png"},
			{id: "tile-wall", src: "/assets/img/wall.png"},
			{id: "tile-wood", src: "/assets/img/wood.png"},
			{id: "tile-snow", src: "/assets/img/snow.png"},
			{id: "tile-ice", src: "/assets/img/ice.png"},
			{id: "tile-crate", src: "/assets/img/crate.png"}
		];

		if (multiplayer) {
			filesToLoad.unshift({id: "Server", src: "/assets/js/multiplayer/Server.js"});
			filesToLoad.unshift({id: "ServerResponse", src: "/assets/js/multiplayer/handleServerResponse.js"});
		}

		gameEngine.filesQueue.loadManifest(filesToLoad);

		gameEngine.filesQueue.addEventListener('complete', gameEngine.setupGame);
		gameEngine.filesQueue.addEventListener('progress', function(e) {
			$('.loadie').html('Loading files');
			$('.loadie').show();
			$('#gamecontainer').loadie(e.progress);
		});
	},
	setupGame: function() {
		if (multiplayer) {
			socket = io.connect(window.location.origin);
			socket.on('connect', function() {
				server.startListeningFromServer();
			});
			gameEngine.player = new Player(server.playerID, {x: 0, y: 0}, '/assets/img/sprite-fixed.png');
			gameEngine.otherPlayers = [];
		} else {
			gameEngine.player = new Player(gameEngine.id++, {x: 0, y: 0}, '/assets/img/sprite-fixed.png');
		}

		gameEngine.bot = new Bot(gameEngine.id++, {x: 0, y: 0}, '/assets/img/bot.png');

		gameEngine.containers = {};

		gameEngine.stage = new createjs.Stage("gamecanvas");

		gameEngine.containers.background = new createjs.Container();
		gameEngine.containers.background.name = "background";
		gameEngine.containers.backgroundDestructable = new createjs.Container();
		gameEngine.containers.backgroundDestructable.name = "backgroundDestructable";

		if (multiplayer) {
			gameEngine.containers.otherPlayers = new createjs.Container();
			gameEngine.containers.otherPlayers.name = "otherPlayers";
			gameEngine.containers.otherPlayersBombs = new createjs.Container();
			gameEngine.containers.otherPlayersBombs.name = "otherPlayersBombs";
		}

		gameEngine.containers.bot = new createjs.Container();
		gameEngine.containers.bot.name = "bot";
		gameEngine.containers.player = new createjs.Container();
		gameEngine.containers.player.name = "player";
		gameEngine.containers.playerBombs = new createjs.Container();
		gameEngine.containers.playerBombs.name = "playerBombs";

		gameEngine.stage.addChild(gameEngine.containers.background);
		gameEngine.stage.addChild(gameEngine.containers.backgroundDestructable);

		if (multiplayer) {
			gameEngine.stage.addChild(gameEngine.containers.otherPlayersBombs);
		}

		gameEngine.stage.addChild(gameEngine.containers.playerBombs);

		gameEngine.stage.addChild(gameEngine.containers.bot);
		if (multiplayer) {
			gameEngine.stage.addChild(gameEngine.containers.otherPlayers);
		}

		gameEngine.stage.addChild(gameEngine.containers.player);
		gameEngine.stage.update();

		$('.gamelayer').hide();
		$('#gamestartscreen').fadeIn();
		gameEngine.loadLevels();

	},
	loadLevels: function() {
		var html = "";
		for (var i = 0; i < levels.data.length; i++) {
			var level = levels.data[i];
			html += '<input class="click-sound" type="button" value="' + (i + 1) + '">';
		}

		$('#levelselectscreen').html(html);

		// Set the button click event handlers to load level
		$('#levelselectscreen').find('input').click(function() {
			gameEngine.loadLevel(this.value - 1);
			gameEngine.loadPlayer();
			gameEngine.loadBot();
			$('#levelselectscreen').hide();
			$('#gamecanvas').show();

			createjs.Sound.play('gameplay-sound', "none", 0, 0, -1, 1, 0, null, 21945);

			gameEngine.main();
		});
	},
	loadLevel: function(levelNumber) {
		this.levelData = levels.data[levelNumber];
		if (multiplayer) {
			server.sendLevel(this.levelData.id);
		}
		var color;

		var backgroundTile = new createjs.Bitmap(gameEngine.filesQueue.getResult(this.levelData.tiles.background));
		var wallTile = new createjs.Bitmap(gameEngine.filesQueue.getResult(this.levelData.tiles.wall));
		var breakableTile = new createjs.Bitmap(gameEngine.filesQueue.getResult(this.levelData.tiles.breakable));

		this.levelData.map.forEach(function(row, y) {
			row.forEach(function(tile, x) {
				if (tile === 0) { // Background tiles
					backgroundTile.x = x * 50;
					backgroundTile.y = y * 50;
					gameEngine.containers.backgroundDestructable.addChild(backgroundTile.clone());
				} else if (tile === 1) { // Object tiles
					wallTile.x = x * 50;
					wallTile.y = y * 50;
					gameEngine.containers.backgroundDestructable.addChild(wallTile.clone());
				} else if (tile === 2) {
					breakableTile.x = x * 50;
					breakableTile.y = y * 50;
					gameEngine.containers.backgroundDestructable.addChild(breakableTile.clone());
				}
			});
		});

		gameEngine.stage.update();

	},
	loadPlayer: function() {
		var initialX = this.levelData.initialPosition.x;
		var initialY = this.levelData.initialPosition.y;
		gameEngine.player.position = JSON.parse(JSON.stringify(this.levelData.initialPosition));

		gameEngine.player.sprite.setTransform(initialX, initialY, 1.2, 1.2);
		gameEngine.containers.player.addChild(gameEngine.player.sprite);
		gameEngine.stage.update();
	},
	loadBot: function() {
		var initialX = this.levelData.initialPosition.x + 655;
		var initialY = this.levelData.initialPosition.y;
		gameEngine.bot.position.x = initialX;
		gameEngine.bot.position.y = initialY;

		gameEngine.bot.sprite.setTransform(initialX, initialY, 1.2, 1.2);
		gameEngine.containers.bot.addChild(gameEngine.bot.sprite);
		gameEngine.stage.update();
	},
	isMapEmptyAt: function(x, y) {
		return this.levelData.map[(y / 50 | 0)][(x / 50 | 0)] === 0;
	},
	otherPlayerJoined: function(otherPlayerId, initialPosition) {
		initialPosition = initialPosition || false;
		var initialX, initialY;

		if (initialPosition === false || initialPosition.x === -1) {
			initialPosition = this.levelData.initialPosition;
		}

		initialX = initialPosition.x | 0;
		initialY = initialPosition.y | 0;

		var otherPlayer = new Player(otherPlayerId, {
			x: initialX,
			y: initialY
		}, '/assets/img/sprite-other-player.png', true);
		otherPlayer.name = 'user-' + otherPlayerId;
		otherPlayer.sprite.name = 'user-' + otherPlayerId;
		otherPlayer.sprite['playerId'] = otherPlayerId * 1;

		otherPlayer.position = initialPosition;
		otherPlayer.sprite.setTransform(initialX, initialY, 1.2, 1.2);
		otherPlayer.sprite.gotoAndStop('facein');

		gameEngine.otherPlayers.push(otherPlayer);
		gameEngine.containers.otherPlayers.addChild(otherPlayer.sprite);
		gameEngine.update();
	},
	findOtherPlayerById: function(otherPlayerId) {
		otherPlayerId = otherPlayerId * 1;
		for (var i = 0, len = gameEngine.containers.otherPlayers.children.length; i < len; i++) {
			if (gameEngine.containers.otherPlayers.children[i]
			    && gameEngine.containers.otherPlayers.children[i].playerId === otherPlayerId) {
				return gameEngine.containers.otherPlayers.children[i];
			}

			return -1;
		}
	}
});

gameEngine = new GameEngine();
