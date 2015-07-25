Player = Entity.extend({
    id: 0,

    /**
     * Moving speed
     */
    speed: 200,

    /**
     * Player image
     */
    playerImage: undefined,

    /**
     * Max number of bombs user can spawn
     */
    bombsMax: 1,

    /**
     * How far the fire reaches when bomb explodes
     */
    bombStrength: 1,

    /**
     * Entity position on map grid
     */
    position: {},

    frames:{},

    animations:{},

    framerate:0,

    spriteSheet:undefined,

    sprite:undefined,

    /**
     * Bitmap dimensions
     */
    size: {
        w: 48,
        h: 48
    },

    alive: true,

    bombs: [],

    controls: {
        'up': 'up',
        'left': 'left',
        'down': 'down',
        'right': 'right',
        'bomb': 'bomb'
    },

    init: function(id,position,image) {
        this.id=id;
        this.position=position;
        this.playerImage =  image;
        this.frames = {width:25, height:35, count:16, regX: 0, regY:0, spacing:5, margin:0};
        this.animations ={
            idle:0,
            facein:[0,3,'facein'],
            left:[4,7,'left'],
            faceaway:[8,11,'faceaway'],
            right:[12,15,'right']
        };
        this.framerate =20;

        var data = {
            images:[image],
            frames:this.frames,
            animations:this.animations
        };

        //console.log('here');

        this.spriteSheet = new createjs.SpriteSheet(data);

        this.sprite=  new createjs.Sprite(this.spriteSheet,'facein');



    }
});

