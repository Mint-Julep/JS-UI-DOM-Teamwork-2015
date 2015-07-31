var multiplayer = multiplayer || false;

GameEngine = Class.extend({
    id: 0,

    player: undefined,

    bot: undefined,

    bots:[],

    stage: undefined,

    base: this,

    containers: {},

    keysQueue: [],

    lastTime: Date.now(),

    muted: true,


    init: function () {
        var filesQueue,
            librariesQueue;

        this.startEngine();

    },
    showLevelScreen: function () {
        $('.gamelayer').hide();
        $('#levelselectscreen').css('opacity', 0)
        $('#levelselectscreen').show();
        $('#levelselectscreen').animate({opacity: 1});
    },
    showSettingsScreen:function(){
        $('.gamelayer').hide();
        $('#settingsscreen').hide().slideDown(1000);

        $('#return-to-main-menu').on('click', function(){
            $('#settingsscreen').hide();
            $('#gamestartscreen').show();
        });
    },
    main: function () {
        var now = Date.now();
        gameEngine.deltaTime = (now - this.lastTime) / 1000.0;

        gameEngine.update();

        this.lastTime = now;

        requestAnimationFrame(gameEngine.main);
    },
    update: function () {
        if(gameEngine.player.alive) {
                for (var i = 0; i < gameEngine.bots.length; i++) {
                    if (gameEngine.bots[i].alive) {
                        gameEngine.bots[i].chooseDirection();
                        gameEngine.bots[i].move();
                        this.checkCollisions();
                    }
                }
            gameEngine.handleInput();
        }else {
            if(gameEngine.player.sprite.currentAnimation!=='die'){
                gameEngine.player.sprite.gotoAndPlay('die');
                gameEngine.player.sprite.on('animationend',function(){
                    gameEngine.player.sprite.stop();
                });
            }

            for(var i=0;i<gameEngine.bots.length;i++) {

                gameEngine.bots[i].sprite.stop();
            }
            gameEngine.stage.update();
        }


    },
    handleInput: function () {
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

            if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length === 1 && this.keysQueue[0] === "space"))) {
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

            if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length === 1 && this.keysQueue[0] === "space"))) {
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

            if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length === 1 && this.keysQueue[0] === "space"))) {
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

            if (multiplayer && keysBefore - keysAfter !== 0 && (this.keysQueue.length === 0 || (this.keysQueue.length === 1 && this.keysQueue[0] === "space"))) {
                server.sendMoveToServer(this.player.position, 'stopped');
            }
        }

        if (input.isDown('Space') || input.isDown('x')) {

            if (this.keysQueue.indexOf("space") === -1) {
                if (gameEngine.player.avaliableBombs > 0) {
                    gameEngine.player.avaliableBombs--;
                    this.keysQueue.push('space');

                    var bomb = new Bomb(1, {x: 0, y: 0});
                    var bombX = this.player.position.x + 12,
                        bombY = this.player.position.y + 18;

                    bombX = ((bombX / 50) | 0) * 50;
                    bombY = ((bombY / 50) | 0) * 50;

                    bombX += 11;
                    bombY += 11;

                    if (multiplayer) {
                        server.sendPlacedBombToServer({x: bombX, y: bombY});
                    }

                    this.levelData.map[(bombY / 50 | 0)][(bombX / 50 | 0)] = 'b';

                    bomb.sprite.setTransform(bombX, bombY);
                    gameEngine.containers.playerBombs.addChild(bomb.sprite);
                    bomb.activate(gameEngine.containers.playerBombs);
                }
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
                    bonusHandler.getBonusAt(this.player.position.x,this.player.position.y,'up');
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
                    bonusHandler.getBonusAt(this.player.position.x,this.player.position.y,'down');
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
                    bonusHandler.getBonusAt(this.player.position.x,this.player.position.y,'left');
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
                    bonusHandler.getBonusAt(this.player.position.x,this.player.position.y,'right');
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
    checkCollisions: function () {

        for (var i = 0; i < gameEngine.bots.length; i++) {
            var currentBot = gameEngine.bots[i];
            if(this.collideWithPlayer(currentBot)){
                this.killPlayer();
            }
        }

    },
    collideWithPlayer: function (entity) {
        var x = this.player.position.x,
            y = this.player.position.y,
            width = this.player.size.w,
            height = this.player.size.h;


        return (x < entity.position.x+5 + entity.size.w-5 &&
        x + width > entity.position.x+5 &&
        y < entity.position.y + entity.size.h &&
        y + height > entity.position.y )
    },
    render: function () {
        this.player.sprite.x = this.player.position.x;
        this.player.sprite.y = this.player.position.y;
        this.stage.update();
    },
    startEngine: function () {
        this.loadLibraries();
    },
    loadLibraries: function () {
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
        //librariesQueue.addEventListener('progress', function (e) {
        //    $('.loadie').html('Loading libraries');
        //    $('#gamecontainer').loadie(e.progress);
        //});
    },
    loadFiles: function () {
        gameEngine.filesQueue = new createjs.LoadQueue();
        gameEngine.filesQueue.installPlugin(createjs.Sound);


        var filesToLoad = [
            {id: "Entity", src: "/assets/js/Entity.js"},
            {id: "Player", src: "/assets/js/Player.js"},
            {id: "Bot", src: "/assets/js/Bot.js"},
            {id: "Bomb", src: "/assets/js/Bomb.js"},
            {id: "levels", src: "/assets/js/levels.js"},
            {id: "BonusHandler", src: "/assets/js/BonusHandler.js"},
            {id: "input", src: "/assets/js/input.js"},
            {id: "sprite", src: "/assets/js/sprite.js"},
            {id: "inputEngine", src: "/assets/js/inputEngine.js"},
            {id: "utils", src: "/assets/js/utils.js"},
            {id: "clipper", src: "/assets/js/libs/clipper.js"},
            {id: "intro-sound", src: "/assets/sound/get-ready.mp3"},
            {id: "bomb-sound", src: "/assets/sound/explosion.mp3"},
            {id: "gameplay-sound", src: "/assets/sound/game-play-normal.mp3"},
            {id: "powerup-sound", src: "/assets/sound/powerup.wav"},
            {id: "die-sound", src: "/assets/sound/shutdown.wav"},
            {id: "game-over", src: "/assets/sound/end.mp3"},
            {id: "click", src: "/assets/sound/click.wav"},
            {id: "tile-grass", src: "/assets/img/grass.png"},
            {id: "tile-wall", src: "/assets/img/wall.png"},
            {id: "tile-wood", src: "/assets/img/wood.png"},
            {id: "tile-snow", src: "/assets/img/snow.png"},
            {id: "tile-ice", src: "/assets/img/ice.png"},
            {id: "tile-crate", src: "/assets/img/crate.png"},
            {id: "tile-darkgrass", src: "/assets/img/darkgrass.png"},
            {id: "tile-box", src: "/assets/img/box.png"},
            {id: "tile-brickwall", src: "/assets/img/brickwall.png"},
            {id: "more-speed", src: "/assets/img/moreSpeed.png"},
            {id: "more-bombs", src: "/assets/img/moreBombs.png"},
            {id: "more-explosion", src: "/assets/img/moreExplosionRange.png"}
        ];

        if (multiplayer) {
            filesToLoad.unshift({id: "Server", src: "/assets/js/multiplayer/Server.js"});
            filesToLoad.unshift({id: "ServerResponse", src: "/assets/js/multiplayer/handleServerResponse.js"});
        }

        gameEngine.filesQueue.loadManifest(filesToLoad);


        gameEngine.filesQueue.addEventListener('complete', gameEngine.setupGame);
        gameEngine.filesQueue.addEventListener('progress', function (e) {
            $('.loadie').html('Loading files');
            $('.loadie').show();
            $('#gamecontainer').loadie(e.progress);
        });
    },
    setupGame: function () {
        if (multiplayer) {
            socket = io.connect(window.location.origin);
            socket.on('connect', function () {
                server.startListeningFromServer();
            });
            gameEngine.player = new Player(server.playerID, {x: 0, y: 0}, '/assets/img/sprite-fixed2.png');
            gameEngine.otherPlayers = [];
        } else {
            gameEngine.player = new Player(gameEngine.id++, {x: 0, y: 0}, '/assets/img/sprite-fixed2.png');
        }



        gameEngine.containers = {};

        gameEngine.stage = new createjs.Stage("gamecanvas");


        gameEngine.containers.background = new createjs.Container();
        gameEngine.containers.background.name = "background";
        gameEngine.containers.backgroundDestructable = new createjs.Container();
        gameEngine.containers.backgroundDestructable.name = "backgroundDestructable";
        gameEngine.containers.backgroundBonuses = new createjs.Container();
        gameEngine.containers.backgroundBonuses.name = "backgroundBonuses";

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
        gameEngine.stage.addChild(gameEngine.containers.backgroundBonuses);
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
    loadLevels: function () {

        if(multiplayer) {
            server.getAllMaps(function (allMaps) {
                if (allMaps) {
                    levelHandler.data = allMaps;
                }

                initializeLevels();
            });
        } else {
            initializeLevels();
        }

        function initializeLevels(){
            var html = "";

            for (var i = 0; i < levelHandler.data.length; i++) {
                var level = levelHandler.data[i];
                html += '<input class="click-sound level-picture-' + (i + 1) + '" type="button" value="' + (i + 1) + '">';
            }

            $('#levelselectscreen-container').html(html);
            // Set the button click event handlers to load level
            $('#levelselectscreen-container').find('input').click(function () {
                gameEngine.loadLevel(this.value - 1);

            });
        }
    },
    loadLevel: function (levelNumber) {
        levelHandler.getLevel(levelNumber, function () {

            if (multiplayer) {
                server.sendLevel(gameEngine.levelData.id);
            }

            console.log('my level data',gameEngine.levelData);
            var color;

            console.log('my level data tile',gameEngine.levelData.tiles);
            //tiles =gameEngine.levelData.tiles;
            console.log('background',gameEngine.levelData.tiles.background);
            var backgroundTile = new createjs.Bitmap(gameEngine.filesQueue.getResult(gameEngine.levelData.tiles.background));
            var wallTile = new createjs.Bitmap(gameEngine.filesQueue.getResult(gameEngine.levelData.tiles.wall));
            var breakableTile = new createjs.Bitmap(gameEngine.filesQueue.getResult(gameEngine.levelData.tiles.breakable));

            var moreSpeedTile = new createjs.Bitmap(gameEngine.filesQueue.getResult('more-speed'));
            var moreBombsTile = new createjs.Bitmap(gameEngine.filesQueue.getResult('more-bombs'));
            var moreExplosionTile = new createjs.Bitmap(gameEngine.filesQueue.getResult('more-explosion'));

            gameEngine.levelData.map.forEach(function (row, y) {
                row.forEach(function (tile, x) {


                    var bonusUnderTile = utils.findBonus(gameEngine.levelData.bonuses, x, y);
                    if (bonusUnderTile !== -1) {
                        if (bonusUnderTile === 'addSpeed') {
                            moreSpeedTile.x = x * 50;
                            moreSpeedTile.y = y * 50;
                            gameEngine.containers.backgroundBonuses.addChild(moreSpeedTile.clone());
                        } else if (bonusUnderTile === 'addBomb') {
                            moreBombsTile.x = x * 50;
                            moreBombsTile.y = y * 50;
                            gameEngine.containers.backgroundBonuses.addChild(moreBombsTile.clone());
                        } else if (bonusUnderTile === 'addExplosionRange') {
                            moreExplosionTile.x = x * 50;
                            moreExplosionTile.y = y * 50;
                            gameEngine.containers.backgroundBonuses.addChild(moreExplosionTile.clone());
                        }
                    }

                    if (tile === 0) { // Background tiles
                        backgroundTile.x = x * 50;
                        backgroundTile.y = y * 50;
                        gameEngine.containers.background.addChild(backgroundTile.clone());
                    } else if (tile === 1) { // Object tiles
                        wallTile.x = x * 50;
                        wallTile.y = y * 50;
                        gameEngine.containers.background.addChild(wallTile.clone());
                    } else if (tile === 2) {
                        backgroundTile.x = x * 50;
                        backgroundTile.y = y * 50;
                        gameEngine.containers.background.addChild(backgroundTile.clone());

                        breakableTile.x = x * 50;
                        breakableTile.y = y * 50;
                        gameEngine.containers.backgroundDestructable.addChild(breakableTile.clone());
                    }
                });
            });

            gameEngine.stage.update();

            gameEngine.loadPlayer();
            gameEngine.loadBot();
            $('#levelselectscreen').hide();
            $('#gamecanvas').show();

            createjs.Sound.play('gameplay-sound', "none", 0, 0, -1, 1, 0, null, 21945);

            gameEngine.main();
        });

    },
    loadPlayer: function () {
        var initialX = this.levelData.initialPosition.x;
        var initialY = this.levelData.initialPosition.y;
        gameEngine.player.position = JSON.parse(JSON.stringify(this.levelData.initialPosition));

        gameEngine.player.sprite.setTransform(initialX, initialY, 1.2, 1.2);
        gameEngine.containers.player.addChild(gameEngine.player.sprite);
        gameEngine.stage.update();
    },
    loadBot: function () {
        for(var i=0;i<this.levelData.bots.length;i++) {
            console.log(this.levelData.bots,this.levelData.bots[i]);
            var initialX = this.levelData.bots[i].x*50;
            var initialY = this.levelData.bots[i].y*50;
            var newBot = new Bot(gameEngine.id++, {x: 0, y: 0}, '/assets/img/bot2.png');
            newBot.position.x = initialX;
            newBot.position.y = initialY;
            newBot.sprite.setTransform(initialX, initialY, 1.25, 1.25);
            newBot.sprite.gotoAndStop('facein');

            gameEngine.containers.bot.addChild(newBot.sprite);
            gameEngine.bots.push(newBot)
        }
        gameEngine.stage.update();
    },
    isMapEmptyAt: function (x, y) {
        if (this.levelData.map[(y / 50 | 0)][(x / 50 | 0)] === 0) {
            return true;
        }
        else if (this.levelData.map[(y / 50 | 0)][(x / 50 | 0)] === 'b') {
            var matrixX = Math.floor(x / 50);
            var matrixY = Math.floor(y / 50);

            if (((x / 50) - matrixX > 0.45 && (x / 50) - matrixX < 0.55) ||
                (( y / 50) - matrixY > 0.45 && (y / 50) - matrixY < 0.55)) {
                return false
            }
            return true;
        } else {
            return false;
        }

    },
    otherPlayerJoined: function (otherPlayerId, initialPosition) {
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
    findOtherPlayerById: function (otherPlayerId) {
        for (var i = 0, len = gameEngine.otherPlayers.length; i < len; i++) {
            if (gameEngine.otherPlayers[i].id == otherPlayerId) {
                return gameEngine.otherPlayers[i].sprite;
            }
        }

        return -1;
    },
    removeBot:function(bot){
        for (var i = 0; i < gameEngine.bots.length; i++) {
            if(gameEngine.bots[i]===bot){

                gameEngine.bots.splice(i,1);
            }

        }
    },
    killPlayer:function(){
        createjs.Sound.stop();
        createjs.Sound.play('die-sound');
        createjs.Sound.play('game-over','none',2200);
        gameEngine.player.alive=false;
        if(gameEngine.player.sprite.currentAnimation!=='die'){
            if(multiplayer) {
                server.sendPlayerDied(this.player.position, 'die');
            }
            gameEngine.player.sprite.gotoAndPlay('die');
            gameEngine.player.sprite.on('animationend',function(){
                gameEngine.player.sprite.stop();
            });
        }

        setTimeout(function(){
            gameEngine.gameOver();
        },3000);
    },
    gameOver: function(){
      var $endingScreen =  $('#endingscreen');
        $endingScreen.fadeIn();

        $('#playAgain').on('click', function(){
            window.location.reload();
        })
    }
});

gameEngine = new GameEngine();
