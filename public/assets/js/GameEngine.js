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
        gameEngine.render();

        lastTime = now;

        //requestAnimationFrame(game.main);
    },
    update: function (deltaTime) {

        //this.stage.update();

        //gameEngine.containers.player.addChild(gameEngine.player.sprite);
        //gameEngine.stage.update();
        //
        //setInterval(function(){
        //    gameEngine.stage.update();
        //    if(Math.random()*20|0>17){
        //        gameEngine.player.sprite=  new createjs.Sprite(gameEngine.player.spriteSheet,'left');
        //    }
        //},100);

        //player.sprite.update(deltaTime);
        //this.player.update(deltaTime);

        gameEngine.handleInput(deltaTime);

    },
    handleInput: function (deltaTime) {
        //console.log(this.player.y);
        console.log(deltaTime);
        if (input.isDown('DOWN') || input.isDown('s')) {
            this.player.y += this.player.speed * deltaTime;
            //this.player.sprite.move();
            //this.player.sprite.direction(0);
        }

        if (input.isDown('Up') || input.isDown('w')) {
            this.player.y -= this.player.speed * deltaTime;
            //this.player.sprite.move();
            //this.player.sprite.direction(2);
        }

        if (input.isDown('LEFT') || input.isDown('a')) {
            this.player.x -= this.player.speed * deltaTime;
            //this.player.sprite.move();
            //this.player.sprite.direction(1);
        }

        if (input.isDown('Right') || input.isDown('d')) {
            this.player.x += this.player.speed * deltaTime;
            //this.player.sprite.move();
            //this.player.sprite.direction(3);
        }
    },
    render: function () {
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //game.renderEntity(player);
    },
    renderEntity: function (entity) {
        //this.context.save();
        //this.context.translate(entity.x, entity.y);
        //entity.sprite.render(this.context, entity.x, entity.y);
        //this.context.restore();
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
        var queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.Sound);


        queue.loadManifest([
            {id: "Entity", src: "/assets/js/Entity.js"},
            {id: "Player", src: "/assets/js/Player.js"},
            {id: "input", src: "/assets/js/input.js"},
            {id: "sprite", src: "/assets/js/sprite.js"},
            {id: "inputEngine", src: "/assets/js/inputEngine.js"},
            {id: "utils", src: "/assets/js/utils.js"},
            {id: "levels", src: "/assets/js/levels.js"},
            {id: "clipper", src: "/assets/js/libs/clipper.js"},
            {id: "intro-sound", src: "/assets/sound/get-ready.mp3"},
            {id: "bomb-sound", src: "/assets/sound/bomb.mp3"}
        ]);


        queue.addEventListener('complete',gameEngine.setupGame);
    },
    setupGame: function () {

        //createjs.Sound.play('bomb-sound');

        gameEngine.player = new Player(gameEngine.id++, {x: 0, y: 0}, '/assets/img/sprite-fixed.png');
        //gameEngine.player.init();

        gameEngine.containers = {};

        gameEngine.stage = new createjs.Stage("gamecanvas");


        gameEngine.containers.background = new createjs.Container();
        gameEngine.containers.background.name = "background";
        gameEngine.containers.player = new createjs.Container();
        gameEngine.containers.player.name = "player";
        gameEngine.containers.playerBombs = new createjs.Container();
        gameEngine.containers.playerBombs.name = "playerBombs";

        gameEngine.stage.addChild(gameEngine.containers.background);
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
            $('#levelselectscreen').hide();

            $('#gamecanvas').show();

            gameEngine.main();
        });
    },
    loadLevel:function(levelNumber){
        var tileGrass=new createjs.Bitmap('/assets/img/grass.png');
        var tileWall=new createjs.Bitmap('/assets/img/wall.png');
        tileWall.x=100;
        tileWall.y=100;
        gameEngine.containers.background.addChild(tileWall);

        gameEngine.stage.update();
        console.log('added tile wall');
        return;
        var levelData = levels.data[levelNumber],
            color;
        console.log(levelData);
        levelData.map.forEach(function(row,y){
           row.forEach(function(tile,x){
               var currentTile=new createjs.Shape();

               if(tile===1){
                   tileWall.x=x;
                   tileWall.y.y;
                   gameEngine.containers.background.addChild(tileWall);
               } else if(tile===0){
                   tileGrass.x=x;
                   tileGrass.y.y;
                   gameEngine.containers.background.addChild(tileGrass);
               }


           });
        });

    }

});

gameEngine = new GameEngine();

//gameEngine.init();
