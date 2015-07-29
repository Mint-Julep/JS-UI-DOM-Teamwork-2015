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

    avaliableBombs:2,

    extendedExplosion:false,

    direction:{
        up:false,
        down:false,
        left:false,
        right:false
    },

    /**
     * Bitmap dimensions
     */
    size: {
        w: 30,
        h: 40
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

    init: function(id,position,image,isOtherPlayer) {
        isOtherPlayer = isOtherPlayer || false;

        this.id=id;
        this.position=position;
        this.playerImage =  image;
        this.frames = {width:25, height:35, count:16, regX: 0, regY:0, spacing:5, margin:0};

        var frequency = 0.2;

        this.animations ={
            facein:[0,3,'facein',frequency],
            left:[4,7,'left',frequency],
            faceaway:[8,11,'faceaway',frequency],
            right:[12,15,'right',frequency]
        };

        this.animations.framerate=100;

        var data = {
            images:[image],
            frames:this.frames,
            animations:this.animations
        };

        this.spriteSheet = new createjs.SpriteSheet(data);
        this.sprite=  new createjs.Sprite(this.spriteSheet,'facein');
        this.speed=100;

    },
    canMove:function(direction){
        var x=this.position.x,
            y=this.position.y;

        x=(x+1)|0;
        y=(y+1)|0;

        if(direction==="down"){
            if(y<564 && gameEngine.isMapEmptyAt(x+4,y+42) && gameEngine.isMapEmptyAt(x+22,y+42)){
                return true;
            } else {
                return false;
            }
        } else if(direction==="up"&& gameEngine.isMapEmptyAt(x+4,y-3) && gameEngine.isMapEmptyAt(x+22,y-3)){
            if(y>2){
                return true;
            } else {
                return false;
            }
        } else if(direction==="left"&& gameEngine.isMapEmptyAt(x-1,y+4) && gameEngine.isMapEmptyAt(x-1,y+39)){
            if(x>2){
                return true;
            } else {
                return false;
            }
        } else if(direction==="right"&& gameEngine.isMapEmptyAt(x+29,y+4) && gameEngine.isMapEmptyAt(x+29,y+39)){
            if(x<774){
                return true;
            } else {
                return false;
            }

        }
    },
    clearDirections:function(){
        this.direction.down=false;
        this.direction.up=false;
        this.direction.left=false;
        this.direction.right=false;
    }
});

