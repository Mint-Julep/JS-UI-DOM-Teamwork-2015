BonusHandler = Class.extend({
    init: function () {

    },
    addBonus: function (bonusName) {
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
    }
});

bonusHandler = new BonusHandler();