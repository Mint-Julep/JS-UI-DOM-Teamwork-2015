var Server = (function () {
    var playerID= 0,
        playerLevel=0;

    Server = Class.extend({
        init:function(){
            var value = "; " + document.cookie;
            var parts = value.split("; bombGunner_userId=");
            if (parts.length == 2){
                playerID = parts.pop().split(";").shift();
            }
        },
        sendMoveToServer: function (playerPosition,animation) {
            socket.emit('player-moved', {
                id: playerID,
                newPosition: playerPosition,
                animation:animation,
                level:playerLevel
            });
        },
        sendPlacedBombToServer: function (bombPosition) {
            socket.emit('bomb-placed', {
                id: playerID,
                bombPosition: bombPosition,
                extendedExplosion:gameEngine.player.extendedExplosion,
                level:playerLevel
            });
        },
        playerDied: function () {
            socket.emit('player-died', {
                id: playerID,
                level:playerLevel
            });
        },
        sendLevel:function(levelId){
            console.log('sent info about my position');
            playerLevel='level'+levelId;

            socket.emit('player-level',{
                playerId:playerID,
                levelId:levelId
            });
        },
        startListeningFromServer:function(){
            socket.on('other-player-joined',function(otherPlayerId){
                gameEngine.otherPlayerJoined(otherPlayerId,false);
            });

            socket.on('player-disconnected',function(otherPlayerId){
                console.log('player-disconnected',otherPlayerId,gameEngine.otherPlayers);
                if(otherPlayerId==playerID){
                    window.location.replace(window.location.origin);
                    return;
                }
                var otherPlayerSpriteIndex;

                gameEngine.containers.otherPlayers.removeChild(gameEngine.containers.otherPlayers.getChildByName('user-'+otherPlayerId));
                for(var i=0;i<gameEngine.otherPlayers.length;i++){
                    if(gameEngine.otherPlayers[i].id==otherPlayerId){
                        gameEngine.otherPlayers.splice(i,1);
                    }
                }

                console.log(gameEngine.otherPlayers);
            });

            socket.on('current-players',function(currentPlayers){
                console.log('cp',currentPlayers);

                for(var i=0;i<currentPlayers.length;i++){

                   gameEngine.otherPlayerJoined(currentPlayers[i].id,currentPlayers[i].position);
                }
            });

            socket.on('other-player-moved',function(clientData){
                console.log('op-moves',clientData);
                var otherPlayerSprite = gameEngine.findOtherPlayerById(clientData.id);

                if(otherPlayerSprite && otherPlayerSprite!==-1){
                    var newPosition = clientData.newPosition,
                        animation = clientData.animation;


                    otherPlayerSprite.position =  newPosition;
                    otherPlayerSprite.setTransform(newPosition.x,newPosition.y,1.2,1.2);

                    if(animation!=="stopped" && (otherPlayerSprite.currentAnimation!==animation || otherPlayerSprite.paused)){
                        otherPlayerSprite.gotoAndPlay(animation);

                    }

                    if(animation==="stopped"){
                        otherPlayerSprite.gotoAndStop('facein');
                    }
                }
            });

            socket.on('bomb-placed',function(bombPosition){
                var otherUserBomb =  new Bomb(1,{x:0,y:0},bombPosition.extendedExplosion);
                otherUserBomb.sprite.setTransform(bombPosition.bombPosition.x,bombPosition.bombPosition.y);
                gameEngine.containers.otherPlayersBombs.addChild(otherUserBomb.sprite);
                otherUserBomb.activate( gameEngine.containers.otherPlayersBombs);
            });


        }
    });

    return Server;
}());

server = new Server();









