var lastTime = Date.now();

$(window).load(function () {
    game.init();
});

////////////////////////////////////////////////////////////
//                Game Engine                             //
////////////////////////////////////////////////////////////
var player;

var game = {

    //  Start initializing objects, preloading assets and display start screen
    init: function () {
        var queue,
            initializingQueue;

        levels.init();
        loader.init();

        // Hide all game layers and display the start screen
        $('.gamelayer').hide();
        $('#gamestartscreen').show();

        // Get handler for game canvas and context
        this.canvas = $('#gamecanvas')[0];
        if (this.canvas) {
            this.context = this.canvas.getContext('2d');
        }

        this.stages={};
        var base=this;

        intializingQueue = new createjs.LoadQueue();
        intializingQueue.loadManifest([
            {
                id: "SoundJS",
                src: "/bower_components/SoundJS/lib/soundjs-0.6.1.min.js"
            },
            {
                id: "EaselJS",
                src: "/bower_components/EaselJS/lib/easeljs-0.8.1.min.js"
            }]);

        intializingQueue.addEventListener('complete',function(){

            queue = new createjs.LoadQueue();
            queue.installPlugin(createjs.Sound);

            queue.loadManifest([
                {id: "Class", src: "/assets/js/Class.js" },
                {id: "Entity", src: "/assets/js/Entity.js" },
                {id: "Player", src: "/assets/js/Player.js" },
                {id: "input", src: "/assets/js/input.js" },
                {id: "sprite", src: "/assets/js/sprite.js" },
                {id: "inputEngine", src: "/assets/js/inputEngine.js" },
                {id: "utils", src: "/assets/js/utils.js" },
                {id: "levels", src: "/assets/js/levels.js" },
                {id: "clipper", src: "/assets/js/libs/clipper.js" },
                {id: "intro-sound", src:"/assets/sound/get-ready.mp3" },
                {id: "bomb-sound", src:"/assets/sound/bomb.mp3"  }
            ]);

            queue.addEventListener('complete',function(){
                //createjs.Sound.play("intro-sound");

                var player = new Player()
                player = {
                    pos: [0, 0],
                    speed: 70,
                    sprite: playerSprite('/assets/img/icons/player.png', [10, 5], [28, 40], 20, [0, 1, 0])
                };

                base.stages.gameStage = new createjs.Stage("gamecanvas");
                //base.stages.mapStage = new createjs.Stage("gamecanvas");

                var circle = new createjs.Shape();
                circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
                circle.x = 100;
                circle.y = 100;
                var background = new createjs.Container();
                background.name = "background";
                background.addChild(circle);
                base.stages.gameStage.addChild(background);
                base.stages.gameStage.update();

            });
        });



    },
    showLevelScreen: function () {
        $('.gamelayer').hide();
        $('#levelselectscreen').show('slow');
    },
    main: function () {
        var now = Date.now();
        var deltaTime = (now - lastTime) / 1000.0;

        game.update(deltaTime);
        game.render();

        lastTime = now;

        requestAnimationFrame(game.main);
    },
    update: function (deltaTime) {
        player.sprite.update(deltaTime);
        game.handleInput(deltaTime);

    },
    handleInput: function (deltaTime) {
        if (input.isDown('DOWN') || input.isDown('s')) {
            player.pos[1] += player.speed * deltaTime;
            player.sprite.move();
            player.sprite.direction(0);
        }

        if (input.isDown('Up') || input.isDown('w')) {
            player.pos[1] -= player.speed * deltaTime;
            player.sprite.move();
            player.sprite.direction(2);
        }

        if (input.isDown('LEFT') || input.isDown('a')) {
            player.pos[0] -= player.speed * deltaTime;
            player.sprite.move();
            player.sprite.direction(1);
        }

        if (input.isDown('Right') || input.isDown('d')) {
            player.pos[0] += player.speed * deltaTime;
            player.sprite.move();
            player.sprite.direction(3);
        }
    },
    render: function () {
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        game.renderEntity(player);
    },
    renderEntity: function (entity) {
        this.context.save();
        //this.context.translate(entity.pos[0], entity.pos[1]);
        entity.sprite.render(this.context,entity.pos[0], entity.pos[1]);
        this.context.restore();
    },
    stages:{}
};

////////////////////////////////////////////////////////////
//                      Levels                         //
////////////////////////////////////////////////////////////

var levels = {
    // Level data
    data: [
        { // First level
            foreground: 'foreground',
            background: 'background',
            entities: []
        },
        { // Second level
            foreground: 'foreground',
            background: 'background',
            entities: []
        },
        { // Third level
            foreground: 'foreground',
            background: 'background',
            entities: []
        }
    ],
    // Initialize level selection screen
    init: function () {
        var html = "";
        for (var i = 0; i < levels.data.length; i++) {
            var level = levels.data[i];
            html += '<input type="button" value="' + (i + 1) + '">';
        }
        $('#levelselectscreen').html(html);

        // Set the button click event handlers to load level
        $('#levelselectscreen').find('input').click(function () {
            levels.load(this.value - 1);
            $('#levelselectscreen').hide();

            //for debugging purpose
            $('#gamecanvas').show();


            game.main();
        });
    },
    // Load all data and images for a specific level
    load: function (number) {
    }
};

////////////////////////////////////////////////////////////
//        Image/Sound Assets Loader       //
////////////////////////////////////////////////////////////

var loader = {
    loaded: true,
    loadedCount: 0, // Assets that have been loaded so far
    totalCount: 0, // Total number of assets that need to be loaded
    init: function () {
        // Check for sound support
        var mp3Support, oggSupport;
        var audio = document.createElement('audio');
        if (audio.canPlayType) {
            // Currently canPlayType() returns: "", "maybe" or "probably"
            mp3Support = "" != audio.canPlayType('audio/mpeg');
            oggSupport = "" != audio.canPlayType('audio/ogg; codecs = "vorbis"');
        } else {
            // The audio tag is not supported
            mp3Support = false;
            oggSupport = false;
        }
        // Check for ogg, then mp3, and finally set soundFileExtn to undefined
        loader.soundFileExtn = oggSupport ? ".ogg" : mp3Support ? ".mp3" : undefined;
    },
    loadImage: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();
        var image = new Image();
        image.src = url;
        image.onload = loader.itemLoaded;
        return image;
    },
    soundFileExtn: ".ogg",
    loadSound: function (url) {
        this.totalCount++;
        this.loaded = false;
        $('#loadingscreen').show();

        var audio = new Audio();
        audio.src = url + loader.soundFileExtn;
        audio.addEventListener("canplaythrough", loader.itemLoaded, false);
        return audio;
    },
    itemLoaded: function () {
        loader.loadedCount++;
        $('#loadingmessage').html('Loaded ' + loader.loadedCount + ' of ' + loader.totalCount);
        if (loader.loadedCount === loader.totalCount) {
            // Loader has loaded completely..
            loader.loaded = true;
            // Hide the loading screen
            $('#loadingscreen').hide();
            // and call the loader.onload method if it exists
            if (loader.onload) {
                loader.onload();
                loader.onload = undefined;
            }
        }
    }
};
