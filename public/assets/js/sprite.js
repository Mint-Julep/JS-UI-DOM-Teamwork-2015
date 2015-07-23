(function () {
    var sprite = (function () {
        var sprite = {
            init: function (url, position, size, speed, frames, dir, once) {
                this.position = position;
                this.size = size;
                this.speed = typeof speed === 'number' ? speed : 0;
                this.frames = frames;
                this._index = 0;
                this.url = url;
                this.dir = dir || 'horizontal';
                this._once = once;
                this._resourcesCache = {};
                return this;
            },
            update: function (deltaTime) {
                this._index += this.speed * deltaTime;
            },
            render: function (context) {
                var frame;

                if (!this._resourcesCache[this.url]) {
                    var image = new Image();
                    image.src = this.url;
                    this._resourcesCache[this.url] = image;
                }

                var x = this.position[0];
                var y = this.position[1];

                if (this.speed > 0) {
                    var maxFrames = this.frames.length;
                    var idx = Math.floor(this._index);
                    frame = this.frames[idx % maxFrames];

                    if (this._once && idx >= maxFrames) {
                        return;
                    }

                } else {
                    frame = 0;
                }

                if (this.dir === 'vertical') {
                    y += frame * this.size[1];
                } else {
                    x += frame * this.size[0];
                }

                context.drawImage(this._resourcesCache[this.url], x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
            }
        };

        return sprite;
    }());

    var playerSprite = (function (parent) {
        var playerSprite = Object.create(parent);

        Object.defineProperty(playerSprite, 'init', {
            value: function (url, position, size, speed, frames, dir) {
                parent.init.call(this, url, position, size, speed, frames, dir, true);
                return this;
            }
        });

        Object.defineProperty(playerSprite, 'direction', {
            value: function (currentDirection) {
                var directions = [5, 45, 85, 125];
                this.position[1] = directions[currentDirection];
            }
        });
        Object.defineProperty(playerSprite, 'move', {
            value: function () {
                if (this._index >= this.frames.length) {
                    this._index = 0;
                }
            }
        });

        Object.defineProperty(playerSprite, 'render', {
            value: function (context) {
                var frame;

                if (!this._resourcesCache[this.url]) {
                    var image = new Image();
                    image.src = this.url;
                    this._resourcesCache[this.url] = image;
                }

                var x = this.position[0];
                var y = this.position[1];

                if (this.speed > 0) {
                    var maxFrames = this.frames.length;
                    var idx = Math.floor(this._index);
                    frame = this.frames[idx % maxFrames];

                    if (this._once && idx >= maxFrames) {
                        context.drawImage(this._resourcesCache[this.url], x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
                        return;
                    }

                } else {
                    frame = 0;
                }

                if (this.dir === 'vertical') {
                    y += frame * this.size[1];
                } else {
                    x += frame * this.size[0];
                }

                context.drawImage(this._resourcesCache[this.url], x, y, this.size[0], this.size[1], 0, 0, this.size[0], this.size[1]);
            }
        });

        return playerSprite;
    }(sprite));


    window.sprite = function (url, pos, size, speed, frames, dir, once) {
        return Object.create(sprite)
            .init(url, pos, size, speed, frames, dir, once);
    };
    window.playerSprite = function (url, pos, size, speed, frames, dir) {
        return Object.create(playerSprite)
            .init(url, pos, size, speed, frames, dir);
    };
}());
