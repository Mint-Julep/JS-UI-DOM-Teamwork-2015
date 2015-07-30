////////////////////////////////////////////////////////////
//                      Levels                            //
////////////////////////////////////////////////////////////

var LevelHandler = Class.extend({
	// Level data
	data: [
		{ // First level
            id:1,
			name:"Level 1",
			map:[
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,2,0,1],
                [1,0,0,1,1,1,2,2,2,2,1,1,0,0,2,1],
                [1,0,0,1,0,1,1,2,2,1,1,0,1,2,0,1],
                [1,2,0,0,2,2,1,2,2,1,2,2,2,2,2,1],
                [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
                [1,2,2,2,2,1,1,2,2,1,1,0,0,0,0,1],
                [1,0,0,0,1,1,2,2,2,2,1,1,0,0,0,1],
                [1,0,0,0,2,1,1,2,2,1,1,2,0,0,0,1],
                [1,0,0,0,2,2,1,1,1,1,2,2,0,0,0,1],
                [1,0,0,0,2,2,2,2,2,2,2,2,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			],
            tiles:{
                background:"tile-grass",
                wall:"tile-wall",
                breakable:"tile-wood"
            },
            initialPosition:{
                x:55,
                y:55
            },
            bonuses:[
                { x:8,y:1, type:'addBomb' },
                { x:4,y:1, type:'addExplosionRange' },
                { x:1,y:5, type:'addSpeed' },
            ],
            bots:[
                {x:14,y:1},
                {x:4,y:3},
                {x:3,y:7},
                {x:3,y:10},
            ],
            img:'level1.png'
		},
		{ // Second level
            id:2,
			name:"Level 2",
			map:[
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
                [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,0,2,0,0,0,0,0,1],
                [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,0,0,2,0,0,2,0,0,0,0,2,2,0,0,1],
                [1,0,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,0,1,0,0,0,0,0,0,0,0,2,2,0,0,1],
                [1,2,1,0,1,1,1,1,0,1,1,1,1,1,0,1],
                [1,2,2,0,0,0,0,0,0,0,0,2,0,0,0,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			],
            tiles:{
                background:"tile-snow",
                wall:"tile-crate",
                breakable:"tile-ice"
            },
            initialPosition:{
                x:55,
                y:55
            },
            img:'level2.png'
		},
		{ // Third level
            id:3,
			name:"Level 0",
			map:[
				[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
			],
            tiles:{
                background:"tile-grass",
                wall:"tile-wall",
                breakable:"tile-crate"
            },
            initialPosition:{
                x:55,
                y:205
            },
            img:'level3.png'
		}
	],
    currentLevel:-1,
    init:function(){

    },
    getLevel:function(levelNumber,callback){
        this.currentLevel = levelNumber;
        if(multiplayer){
            server.getCurrentLevel('level'+(levelNumber+1),function(err,level){
                if(err){
                    gameEngine.levelData = levelHandler.data[levelNumber];
                    callback();
                } else {
                    levelHandler.data[levelNumber] = level.map;
                    gameEngine.levelData = levelHandler.data[levelNumber];
                    callback();
                }
            });
        }else {
            gameEngine.levelData = levelHandler.data[levelNumber];
            callback();
        }


    },
    checkMapForBonusAt:function(x,y){
        x=((x/50)|0);
        y=((y/50)|0);

        for(var i= 0,len=this.data[this.currentLevel].bonuses.length;i<len;i++){
            if(this.data[this.currentLevel].bonuses[i].x===x && this.data[this.currentLevel].bonuses[i].y===y){
                createjs.Sound.play('powerup-sound');
                var bonus = this.data[this.currentLevel].bonuses.splice(i,1)[0];
                server.sendBonusUpdate(this.data[this.currentLevel].bonuses);
                var toRemove = gameEngine.containers.backgroundBonuses.getObjectUnderPoint(x*50, y*50);
                gameEngine.containers.backgroundBonuses.removeChild(toRemove);
                return bonus.type;
            }
        }

        return -1;
    }
});

levelHandler = new LevelHandler();
