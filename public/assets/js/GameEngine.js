//debugger;
GameEngine = Class.extend({
    id: 0,

    player: undefined,

    stage: undefined,

    base: this,

    containers: {},

    lastTime:Date.now(),

    init: function () {
        var queue,
            initializingQueue;

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

        //player.sprite.update(deltaTime);
        //this.player.update(deltaTime);

        gameEngine.handleInput(deltaTime);

    },
    handleInput: function (deltaTime) {
        var moved=false;
        //console.log(deltaTime);
        if (input.isDown('DOWN') || input.isDown('s')) {
            this.player.position.y += this.player.speed * deltaTime;
            moved=true;
            if(!this.player.direction.down) {
                this.player.direction.down = true;
                this.player.sprite.gotoAndPlay('facein');
            }
        } else {
            this.player.direction.down=false;
        }

        if (input.isDown('Up') || input.isDown('w')) {
            this.player.position.y -= this.player.speed * deltaTime;
            moved=true;
            if(!this.player.direction.up) {
                this.player.direction.up = true;
                this.player.sprite.gotoAndPlay('faceaway');
            }
        } else {
            this.player.direction.up=false;
        }

        if (input.isDown('LEFT') || input.isDown('a')) {
            this.player.position.x -= this.player.speed * deltaTime;
            moved=true;
            if(!this.player.direction.left) {
                this.player.direction.left = true;
                this.player.sprite.gotoAndPlay('left');
            }
        }  else {
            this.player.direction.left=false;
        }

        if (input.isDown('Right') || input.isDown('d')) {
            this.player.position.x += this.player.speed * deltaTime;
            moved=true;
            if(!this.player.direction.right) {
                this.player.direction.right = true;
                this.player.sprite.gotoAndPlay('right');
            }
        } else {
           this.player.direction.right=false;
        }

        if(moved){
            gameEngine.render();
        } else {
            //this.player.clearDirections();
            this.player.sprite.gotoAndPlay('idle');
            this.stage.update();
        }


    },
    render: function () {
        console.log('will render');
        this.player.sprite.x = this.player.position.x;
        this.player.sprite.y = this.player.position.y;
        this.stage.update();
    },
    startEngine: function () {
        this.loadLibraries();
    },
    loadLibraries: function () {
        var intializingQueue = new createjs.LoadQueue();
        intializingQueue.loadManifest([
            {
                id: "SoundJS",
                src: "/bower_components/SoundJS/lib/soundjs-0.6.1.min.js"
            },
            {
                id: "EaselJS",
                src: "/bower_components/EaselJS/lib/easeljs-0.8.1.min.js"
            }]);

        intializingQueue.addEventListener('complete', this.loadFiles);
    },
    loadFiles: function () {
        gameEngine.queue = new createjs.LoadQueue();
        gameEngine.queue.installPlugin(createjs.Sound);


        gameEngine.queue.loadManifest([
            {id: "Entity", src: "/assets/js/Entity.js"},
            {id: "Player", src: "/assets/js/Player.js"},
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
        ]);


        gameEngine.queue.addEventListener('complete',gameEngine.setupGame);
    },
    setupGame: function () {
        console.log('files loaded');

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
        gameEngine.stage.addChild(gameEngine.containers.player);
        gameEngine.stage.addChild(gameEngine.containers.playerBombs);
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
        var tileWall = new createjs.Bitmap(gameEngine.queue.getResult('tile-wall'));
        var tileGrass = new createjs.Bitmap(gameEngine.queue.getResult('tile-grass'));
        var tileWood = new createjs.Bitmap(gameEngine.queue.getResult('tile-wood'));

        var levelData = levels.data[levelNumber],
            color;

        levelData.map.forEach(function(row,y){
           row.forEach(function(tile,x){

               if(tile===1){
                   tileWall.x=x*50;
                   tileWall.y=y*50;
                   gameEngine.containers.backgroundDestructable.addChild(tileWall.clone());
               } else if(tile===0){
                   tileGrass.x=x*50;
                   tileGrass.y=y*50;
                   gameEngine.containers.backgroundDestructable.addChild(tileGrass.clone());
               } else if(tile===2){
                   tileWood.x=x*50;
                   tileWood.y=y*50;
                   gameEngine.containers.backgroundDestructable.addChild(tileWood.clone());
               }
           });
        });


        gameEngine.stage.update();

    },
    loadPlayer:function(){
        gameEngine.containers.player.addChild(gameEngine.player.sprite);
        gameEngine.stage.update();
    }

});

gameEngine = new GameEngine();

//gameEngine.init();
