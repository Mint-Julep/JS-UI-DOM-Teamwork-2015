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
        sendPlacedBombToServer: function ( bombPosition) {
            socket.emit('bomb-placed', {
                id: playerID,
                bombPosition: bombPosition,
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
                console.log('will remove player');
                console.log(otherPlayerId);
                var otherPlayerSpriteIndex;

                for(var i=0;i<gameEngine.otherPlayers;i++){
                    if(gameEngine.otherPlayers.id===otherPlayerId){
                        gameEngine.otherPlayers.splice(i,1);
                    }
                }

                gameEngine.containers.otherPlayers.removeChild(gameEngine.containers.otherPlayers.getChildByName('user-'+otherPlayerId));
            });

            socket.on('current-players',function(currentPlayers){

                for(var i=0;i<currentPlayers.length;i++){

                   gameEngine.otherPlayerJoined(currentPlayers[i].id,currentPlayers[i].position);
                }
            });

            socket.on('other-player-moved',function(clientData){
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

                    //gameEngine.stage.update();
                }
            });

            socket.on('bomb-placed',function(bombPosition){
                console.log('bomb placed at');
                console.log(bombPosition);
                var otherUserBomb =  new Bomb(1,{x:0,y:0});
                otherUserBomb.sprite.setTransform(bombPosition.bombPosition.x,bombPosition.bombPosition.y);
                gameEngine.containers.otherPlayersBombs.addChild(otherUserBomb.sprite);
                otherUserBomb.activate( gameEngine.containers.otherPlayersBombs);
            });


        }
    });

    return Server;
}());

server = new Server();









