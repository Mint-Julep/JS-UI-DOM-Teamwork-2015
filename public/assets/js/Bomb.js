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
            if(!gameEngine.player.alive){
                gameEngine.containers.playerBombs.children.forEach(function(bomb){
                   bomb.stop();
                });
                return;
            }
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
            gameEngine.levelData.map[(this.sprite.y / 50 | 0)][(this.sprite.x / 50 | 0)] =0;
            this.kill(x,y);

            gameEngine.player.avaliableBombs++;

            this.exploded = true;
        },
        kill:function(x,y){
            this.removeBreakableTiles(x,y);
            this.killBots(x,y);
            this.killPlayer(x,y);
        },
        removeBreakableTiles:function(x,y){
            for(var i=0;i<this.coordinatesToCheck.length;i+=1){
                var xToCheck = x+this.coordinatesToCheck[i].x,
                    yToCheck = y+this.coordinatesToCheck[i].y;
                var toRemove = gameEngine.containers.backgroundDestructable.getObjectUnderPoint(xToCheck, yToCheck);

                if (gameEngine.containers.backgroundDestructable.removeChild(toRemove)) {
                    gameEngine.levelData.map[(yToCheck / 50 | 0)][(xToCheck / 50 | 0)] = 0;
                    if(multiPlayer) {
                        server.sendMapUpdate(gameEngine.levelData.map);
                    }
                }
            }
        },
        killBots:function(x,y){
            for(var i=0;i<this.coordinatesToCheck.length;i+=1){
                var additionalCoordinatesToCheck = [{x:0,y:15},{x:15,y:0},{x:15,y:30},{x:30,y:15}];


                for(var j=0;j<additionalCoordinatesToCheck.length;j++) {


                    var xToCheck = x + this.coordinatesToCheck[i].x + additionalCoordinatesToCheck[j].x+4,
                        yToCheck = y + this.coordinatesToCheck[i].y + additionalCoordinatesToCheck[j].y+4;
                    var toRemove = gameEngine.containers.bot.getObjectUnderPoint(xToCheck, yToCheck);

                    if(toRemove){
                        var botToKill = utils.getBotBySprite(toRemove);
                        if(botToKill===-1){
                            return;
                        }
                        botToKill.alive=false;
                        botToKill.sprite.gotoAndPlay('die');
                        botToKill.sprite.on('animationend',function(){
                            gameEngine.containers.bot.removeChild(botToKill.sprite);
                            gameEngine.removeBot(botToKill);
                        });

                    }
                }
            }
        },
        killPlayer:function(x,y){
            for(var i=0;i<this.coordinatesToCheck.length;i+=1){
                var additionalCoordinatesToCheck = [{x:0,y:15},{x:15,y:0},{x:15,y:30},{x:30,y:15}];

                for(var j=0;j<additionalCoordinatesToCheck.length;j++) {


                    var xToCheck = x + this.coordinatesToCheck[i].x + additionalCoordinatesToCheck[j].x+4,
                        yToCheck = y + this.coordinatesToCheck[i].y + additionalCoordinatesToCheck[j].y+4;
                    var toRemove = gameEngine.containers.player.getObjectUnderPoint(xToCheck, yToCheck);

                    if(toRemove){
                        gameEngine.killPlayer();

                    }
                }
            }
        }
    });

    return Bomb;
}());

