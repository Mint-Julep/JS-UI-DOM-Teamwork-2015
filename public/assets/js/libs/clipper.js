//Adds functionallity to clip images in EeaselJS

(function(w, e, c, i, j){

    e = w.createjs || console.warn('EaselJS clip plugin: EaselJS not found.'),
        c = ['Container', 'BitmapAnimation', 'DOMElement', 'Text', 'Bitmap', 'Shape', 'Stage'];

    for(i = c.length; --i; j=e[c[i]])
        if(j && j.prototype && j.prototype.draw)
            (function(ori_draw){
                j.prototype.draw = function(ctx){
                    if(this.clip && this.clip.draw ){
                        ctx.save();
                        this.clip.draw(ctx);
                        ctx.clip();
                        ori_draw.apply(this, arguments);
                        ctx.restore();
                    }
                    else{
                        ori_draw.apply(this, arguments);
                    }
                };
            })(j.prototype.draw);

})(this);
