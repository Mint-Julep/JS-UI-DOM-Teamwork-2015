var Bomb = (function () {
    var bombImage = '/assets/img/bomb.png';
    var explosionImage = '/assets/img/fire.png';
    var sprite;

    var Bomb = Entity.extend({
        id: 0,

        staticBomb: undefined,

        exploded: false,

        bombImage: undefined,

        explosionImage: undefined,

        position: {},

        frames: {},

        animation: {},

        spriteSheet: undefined,

        sprite: undefined,

        explosionSprite: undefined,

        size: {
            w: 28,
            h: 28
        },
        coordinatesToCheck: [
            {x: 0, y: 0},
            {x: -50, y: 0},
            {x: 50, y: 0},
            {x: 0, y: -50},
            {x: 0, y: 50}
        ],

        init: function (id, position,extendedExplosion) {
            if(!extendedExplosion){
                extendedExplosion = gameEngine.player.extendedExplosion;
            }

            if(extendedExplosion){
                this.coordinatesToCheck.push({x:-50,y:50},{x:50,y:50},{x:-50,y:-50},{x:50,y:-50})
            }

            if (!sprite) {
                var frames = {width: 28, height: 28, regX: 0, regY: 0};
                var animations = {
                    idle: [0, 4, 'idle', 0.2]
                };

                var data = {
                    images: [bombImage],
                    frames: frames,
                    animations: animations
                };

                var spriteSheet = new createjs.SpriteSheet(data);
                sprite = new createjs.Sprite(spriteSheet, 'idle');

            }

            this.explosionImage = explosionImage;
            this.sprite = sprite.clone();

            return this;
        },
        activate: function (stage) {
            var base = this;
            setTimeout(function () {
                base.detonation(stage);
            }, 5000);
        },
        detonation: function (stage) {
            var frames,
                animations,
                data,
                spriteSheet,
                x,
                y;

            frames = {width: 38, height: 37, count: 7, regX: 0, regY: 0, spacing: 0, margin: 0};
            animations = {
                idle: 6,
                explode: [0, 5, 'idle', 0.1]
            };

            data = {
                images: [this.explosionImage],
                frames: frames,
                animations: animations
            };

            stage.removeChild(this.sprite);

            x = this.sprite.x-5;
            y = this.sprite.y-5;

            spriteSheet = new createjs.SpriteSheet(data);
            this.explosionSprite = new createjs.Sprite(spriteSheet, 'explode');

            this.explosionSprite.x = x;
            this.explosionSprite.y = y;
            var base = this;

            stage.addChild(this.explosionSprite);
            this.explosionSprite.on('animationend',function(){
               stage.removeChild(base.explosionSprite);
            });
            createjs.Sound.play('bomb-sound');


            for(var i=0;i<this.coordinatesToCheck.length;i+=1){
                var xToCheck = x+this.coordinatesToCheck[i].x,
                    yToCheck = y+this.coordinatesToCheck[i].y;
                var toRemove = gameEngine.containers.backgroundDestructable.getObjectUnderPoint(xToCheck, yToCheck);
                if (gameEngine.containers.backgroundDestructable.removeChild(toRemove)) {
                    gameEngine.levelData.map[(yToCheck / 50 | 0)][(xToCheck / 50 | 0)] = 0;
                }
            }

            gameEngine.levelData.map[(this.sprite.y / 50 | 0)][(this.sprite.x / 50 | 0)] =0;

            gameEngine.player.avaliableBombs++;

            this.exploded = true;
        }
    });

    return Bomb;
}());

