//debugger;
GameEngine = Class.extend({
    id: 0,

    player: undefined,

    stage: undefined,

    base: this,

    containers: {},

    keysQueue:[],

    lastTime:Date.now(),

    levelData:undefined,

    init: function () {
        var filesQueue,
            librariesQueue;

        this.startEngine();

    },
    showLevelScreen: function () {
        $('.gamelayer').hide();
        $('#levelselectscreen').css('opacity',0)
        $('#levelselectscreen').show();
        $('#levelselectscreen').animate({opacity:1});
    },
    main: function () {
        var now = Date.now();
        var deltaTime = (now - this.lastTime) / 1000.0;

        gameEngine.update(deltaTime);
        //gameEngine.render();

        this.lastTime = now;

        requestAnimationFrame(gameEngine.main);
    },
    update: function (deltaTime) {

        gameEngine.handleInput(deltaTime);

    },
    handleInput: function (deltaTime) {
        var moved=false;

        if (input.isDown('DOWN') || input.isDown('s')) {
            moved=true;

            if(this.keysQueue[0]!=="down"){
                if(!(this.keysQueue.indexOf("down")>=0)){
                    this.keysQueue.unshift("down");
                }
            }

        }else {
            this.keysQueue.remove("down");
        }

        if (input.isDown('Up') || input.isDown('w')) {
            moved=true;

            if(this.keysQueue[0]!=="up"){
                if(!(this.keysQueue.indexOf("up")>=0)){
                    this.keysQueue.unshift("up");
                }
            }
        }else {
            this.keysQueue.remove("up");
        }

        if (input.isDown('LEFT') || input.isDown('a')) {
            moved=true;

            if(this.keysQueue[0]!=="left"){
                if(!(this.keysQueue.indexOf("left")>=0)){
                    this.keysQueue.unshift("left");
                }
            }

        } else {
            this.keysQueue.remove("left");
        }

        if (input.isDown('Right') || input.isDown('d')) {

            moved=true;

            if(this.keysQueue[0]!=="right"){
                if(!(this.keysQueue.indexOf("right")>=0)){
                    this.keysQueue.unshift("right");
                }
            }

        } else{
            this.keysQueue.remove("right");
        }

        if (input.isDown('Space') || input.isDown('x')) {

            if(this.keysQueue.indexOf("space")===-1){
                console.log('space pressed');
                this.keysQueue.push('space');
                var bomb= new Bomb(1,{x:0,y:0});
                bomb.sprite.setTransform(this.player.position.x,this.player.position.y +(bomb.size.h/2));
                gameEngine.containers.playerBombs.addChild(bomb.sprite);
                bomb.activate( gameEngine.containers.playerBombs);
            }

        } else{
            this.keysQueue.remove("space");
        }

        if(moved){

            if(this.keysQueue[0]==="up"){
                if(this.player.canMove("up")) {
                    this.player.position.y -= this.player.speed * deltaTime;
                }
                if(this.player.sprite.currentAnimation!=='faceaway') {
                    this.player.sprite.gotoAndPlay('faceaway');
                }
            }
            if(this.keysQueue[0]==="down"){
                if(this.player.canMove("down")) {
                    this.player.position.y += this.player.speed * deltaTime;
                }
                if(this.player.sprite.currentAnimation!=='facein' || this.player.sprite.paused) {
                    this.player.sprite.gotoAndPlay('facein');
                }
            }
            if(this.keysQueue[0]==="left"){
                if(this.player.canMove("left")) {
                    this.player.position.x -= this.player.speed * deltaTime;
                }
                if(this.player.sprite.currentAnimation!=='left') {
                    this.player.sprite.gotoAndPlay('left');
                }
            }
            if(this.keysQueue[0]==="right"){
                if(this.player.canMove("right")) {
                    this.player.position.x += this.player.speed * deltaTime;
                }
                if(this.player.sprite.currentAnimation!=='right') {
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
    render: function () {
        //console.log('will render');
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
        librariesQueue.addEventListener('progress',function(e){
            $('.loadie').html('Loading libraries');
            $('#gamecontainer').loadie(e.progress);
        });
    },
    loadFiles: function () {
        gameEngine.filesQueue = new createjs.LoadQueue();
        gameEngine.filesQueue.installPlugin(createjs.Sound);


        gameEngine.filesQueue.loadManifest([
            {id: "Entity", src: "/assets/js/Entity.js"},
            {id: "Player", src: "/assets/js/Player.js"},
            {id: "Bomb", src: "/assets/js/Bomb.js"},
            {id: "input", src: "/assets/js/input.js"},
            {id: "sprite", src: "/assets/js/sprite.js"},
            {id: "inputEngine", src: "/assets/js/inputEngine.js"},
            {id: "utils", src: "/assets/js/utils.js"},
            {id: "levels", src: "/assets/js/levels.js"},
            {id: "clipper", src: "/assets/js/libs/clipper.js"},
            {id: "intro-sound", src: "/assets/sound/get-ready.mp3"},
            {id: "bomb-sound", src: "/assets/sound/bomb.mp3"},
            {id: "tile-grass", src: "/assets/img/grass.png"},
            {id: "tile-wall", src: "/assets/img/wall.png"},
            {id: "tile-wood", src: "/assets/img/wood.png"},
            {id: "tile-snow", src: "/assets/img/snow.png"},
            {id: "tile-ice", src: "/assets/img/ice.png"},
            {id: "tile-crate", src: "/assets/img/crate.png"}
        ]);


        gameEngine.filesQueue.addEventListener('complete',gameEngine.setupGame);
        gameEngine.filesQueue.addEventListener('progress',function(e){
            $('.loadie').html('Loading files');
            $('.loadie').show();
            $('#gamecontainer').loadie(e.progress);
        });
    },
    setupGame: function () {

        //createjs.Sound.play('bomb-sound');

        gameEngine.player = new Player(gameEngine.id++, {x: 0, y: 0}, '/assets/img/sprite-fixed.png');

        gameEngine.containers = {};

        gameEngine.stage = new createjs.Stage("gamecanvas");


        gameEngine.containers.background = new createjs.Container();
        gameEngine.containers.background.name = "background";
        gameEngine.containers.backgroundDestructable = new createjs.Container();
        gameEngine.containers.backgroundDestructable.name = "backgroundDestructable";
        gameEngine.containers.player = new createjs.Container();
        gameEngine.containers.player.name = "player";
        gameEngine.containers.playerBombs = new createjs.Container();
        gameEngine.containers.playerBombs.name = "playerBombs";

        gameEngine.stage.addChild(gameEngine.containers.background);
        gameEngine.stage.addChild(gameEngine.containers.backgroundDestructable);
        gameEngine.stage.addChild(gameEngine.containers.playerBombs);
        gameEngine.stage.addChild(gameEngine.containers.player);
        gameEngine.stage.update();

        $('.gamelayer').hide();
        $('#gamestartscreen').fadeIn();
        gameEngine.loadLevels();
    },
    loadLevels:function(){
        var html = "";
        for (var i = 0; i < levels.data.length; i++) {
            var level = levels.data[i];
            html += '<input type="button" value="' + (i + 1) + '">';
        }

        $('#levelselectscreen').html(html);

        // Set the button click event handlers to load level
        $('#levelselectscreen').find('input').click(function () {
            gameEngine.loadLevel(this.value-1);
            gameEngine.loadPlayer();
            $('#levelselectscreen').hide();

            $('#gamecanvas').show();

            gameEngine.main();
        });
    },
    loadLevel:function(levelNumber){
        this.levelData = levels.data[levelNumber];
        var color;

        var backgroundTile =new createjs.Bitmap(gameEngine.filesQueue.getResult(this.levelData.tiles.background));
        var wallTile =   new createjs.Bitmap(gameEngine.filesQueue.getResult(this.levelData.tiles.wall));
        var breakableTile =  new createjs.Bitmap(gameEngine.filesQueue.getResult(this.levelData.tiles.breakable));

        this.levelData.map.forEach(function(row,y){
           row.forEach(function(tile,x){
               if(tile===0){ // Background tiles
                   backgroundTile.x=x*50;
                   backgroundTile.y=y*50;
                   gameEngine.containers.backgroundDestructable.addChild(backgroundTile.clone());
               }else if(tile===1){ // Object tiles
                   wallTile.x=x*50;
                   wallTile.y=y*50;
                   gameEngine.containers.backgroundDestructable.addChild(wallTile.clone());
               }else if(tile===2){
                   breakableTile.x=x*50;
                   breakableTile.y=y*50;
                   gameEngine.containers.backgroundDestructable.addChild(breakableTile.clone());
               }
           });
        });


        gameEngine.stage.update();

    },
    loadPlayer:function(){
        var initialX=this.levelData.initialPosition.x;
        var initialY=this.levelData.initialPosition.y;
        gameEngine.player.position=this.levelData.initialPosition;

        gameEngine.player.sprite.setTransform(initialX,initialY,1.2,1.2);
        gameEngine.containers.player.addChild(gameEngine.player.sprite);
        gameEngine.stage.update();
    },
    isMapEmptyAt:function(x,y){
        return this.levelData.map[(y/50|0)][(x/50|0)]===0;
    }

});

gameEngine = new GameEngine();

//gameEngine.init();
