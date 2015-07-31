BonusHandler = Class.extend({
    init: function () {

    },
    addBonus: function (bonusName) {
        if(bonusName===-1){
            return;
        }

        switch (bonusName) {
            case 'addBomb':
                if (gameEngine.player.avaliableBombs < 5) {
                    gameEngine.player.avaliableBombs++;
                }
                break;
            case 'addSpeed':
                if (gameEngine.player.speed < 300) {
                    gameEngine.player.speed+=10;
                }
                break;
            case 'addExplosionRange':
                gameEngine.player.extendedExplosion=true;
                break;
        }
    },
    getBonusAt:function(x,y,direction){
        if(direction=='up'){
            this.addBonus(levelHandler.checkMapForBonusAt(x,y+3));
            this.addBonus(levelHandler.checkMapForBonusAt(x+30,y+3));
        } else if(direction=='down'){
            this.addBonus(levelHandler.checkMapForBonusAt(x,y+37));
            this.addBonus(levelHandler.checkMapForBonusAt(x+30,y+37));
        } else if(direction=='left'){
            this.addBonus(levelHandler.checkMapForBonusAt(x+3,y));
            this.addBonus(levelHandler.checkMapForBonusAt(x+3,y+37));
        } else if(direction=='right'){
            this.addBonus(levelHandler.checkMapForBonusAt(x+27,y));
            this.addBonus(levelHandler.checkMapForBonusAt(x+27,y+37));
        }
    },
    changeBonuses: function (newBonuses) {
        if(Array.isArray(newBonuses) && newBonuses.length<1){
            gameEngine.levelData.bonuses=[];
            gameEngine.containers.backgroundBonuses.removeAllChildren();
        }

        bonusToRemove = gameEngine.levelData.bonuses.filter(function (bonus) {
            for (var i = 0; i < newBonuses.length; i++) {
                if (bonus.x === newBonuses[i].x &&
                    bonus.y === newBonuses[i].y &&
                    bonus.type === newBonuses[i].type) {

                    return false;
                } else {
                    return true;
                }
            }
        });



        if(bonusToRemove){
            for(var j=0;j<bonusToRemove.length;j++) {
                var currentBonusToRemove = bonusToRemove[j];

                for (var i = 0; i < gameEngine.levelData.bonuses.length; i++) {
                    if (gameEngine.levelData.bonuses[i] === currentBonusToRemove) {
                        var x = currentBonusToRemove.x,
                            y = currentBonusToRemove.y;

                        var imageToRemove = gameEngine.containers.backgroundBonuses.getObjectUnderPoint(x * 50, y * 50);
                        gameEngine.containers.backgroundBonuses.removeChild(imageToRemove);
                    }
                }

                gameEngine.levelData.bonuses = newBonuses;
            }
        }


    }

});

bonusHandler = new BonusHandler();