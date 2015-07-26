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

        init: function (id, position) {
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

            x = this.sprite.x;
            y = this.sprite.y;

            spriteSheet = new createjs.SpriteSheet(data);
            this.explosionSprite = new createjs.Sprite(spriteSheet, 'explode');

            this.explosionSprite.x = x;
            this.explosionSprite.y = y;

            stage.addChild(this.explosionSprite);
            createjs.Sound.play('bomb-sound');

            this.exploded = true;
        }
    });

    return Bomb;
}());

