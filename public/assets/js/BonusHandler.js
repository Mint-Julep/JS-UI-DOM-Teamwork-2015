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

});

bonusHandler = new BonusHandler();