////////////////////////////////////////////////////////////
//                      Polyfills                         //
////////////////////////////////////////////////////////////

(function () {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
    }
}());

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
        var queue;

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

        queue = new createjs.LoadQueue();
        queue.installPlugin(createjs.SoundJS);
        queue.installPlugin(createjs.EaselJS);
        queue.addEventListener('complete',function(){
            player = {
                pos: [0, 0],
                speed: 100,
                sprite: playerSprite('/assets/img/icons/player.png', [10, 5], [28, 40], 16, [0, 1, 0])
            };
        });
        queue.loadManifest([
            {
                id: "input",
                src: "/assets/js/input.js"
            },
            {
                id: "sprite",
                src: "/assets/js/sprite.js"
            },
            {
                id: "inputEngine",
                src: "/assets/js/inputEngine.js"
            },
            {
                id: "utils",
                src: "/assets/js/utils.js"
            },
            {
                id: "levels",
                src: "/assets/js/levels.js"
            }]);

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
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        game.renderEntity(player);
    },
    renderEntity: function (entity) {
        this.context.save();
        this.context.translate(entity.pos[0], entity.pos[1]);
        entity.sprite.render(this.context);
        this.context.restore();
    }
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
