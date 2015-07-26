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

            socket.on('current-players',function(currentPlayers){

                for(var i=0;i<currentPlayers.length;i++){

                   gameEngine.otherPlayerJoined(currentPlayers[i].id,currentPlayers[i].position);
                }
            });

            socket.on('other-player-moved',function(clientData){
                var otherPlayerIndex = gameEngine.findOtherPlayerById(clientData.id);

                if(otherPlayerIndex>=0 && otherPlayerIndex!==-1){
                    var newPosition = clientData.newPosition,
                        animation = clientData.animation,
                        otherPlayerSprite =  gameEngine.containers.otherPlayers.getChildAt(otherPlayerIndex);


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


        }
    });

    return Server;
}());

server = new Server();









