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
            //idle:0,
            facein:[0,3,'facein',0.2],
            left:[4,7,'left',0.2],
            faceaway:[8,11,'faceaway',0.2],
            right:[12,15,'right',0.2]
        };

        var data = {
            images:[image],
            frames:this.frames,
            animations:this.animations
        };

        this.spriteSheet = new createjs.SpriteSheet(data);

        this.sprite=  new createjs.Sprite(this.spriteSheet,'facein');

        this.speed=100;
        //console.log(this.sprite.currentAnimation);

    },
    canMove:function(direction){
        var x=this.position.x,
            y=this.position.y;

        x=(x+1)|0;
        y=(y+1)|0;
        console.log(x+'  '+y);

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

