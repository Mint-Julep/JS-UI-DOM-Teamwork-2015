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
        sendPlayerDied: function (playerPosition,animation) {
            socket.emit('player-moved', {
                id: playerID,
                newPosition: playerPosition,
                animation:animation,
                level:playerLevel
            });
        },
        sendLevel:function(levelId){
            console.log('sent info about my initial position');
            playerLevel='level'+levelId;

            console.log('map im sending',levelHandler.data[levelHandler.currentLevel])

            socket.emit('player-level',{
                playerId:playerID,
                levelId:levelId,
                map:levelHandler.data[levelHandler.currentLevel]
            });
        },
        getAllMaps:function(callback){
            socket.emit('get-all-maps',{},function(error,allMaps){
                if(error){
                    console.log(error);
                    return;
                } else {
                    callback(allMaps);
                }

            });
        },
        getCurrentLevel:function(levelName,callback){
            socket.emit('get-level',{level:levelName},callback);
        },
        sendMapUpdate:function(newMap){
            socket.emit('map-changed',{level:playerLevel,newMap:newMap});
        },
        sendBonusUpdate:function(newBonuses){
            socket.emit('bonus-changed',{level:playerLevel,newBonuses:newBonuses});
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
                var otherPlayerSprite = gameEngine.findOtherPlayerById(clientData.id);

                if(otherPlayerSprite && otherPlayerSprite!==-1){
                    var newPosition = clientData.newPosition,
                        animation = clientData.animation;

                    if(animation==='die'){
                        otherPlayerSprite.position =  newPosition;
                        otherPlayerSprite.setTransform(newPosition.x,newPosition.y,1.2,1.2);
                        otherPlayerSprite.gotoAndPlay('die');
                        otherPlayerSprite.on('animationend',function(){
                            this.stop();
                        });
                    }


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
                gameEngine.levelData.map[(bombPosition.bombPosition.y / 50 | 0)][(bombPosition.bombPosition.x / 50 | 0)] = 'b';
                otherUserBomb.sprite.setTransform(bombPosition.bombPosition.x,bombPosition.bombPosition.y);
                gameEngine.containers.otherPlayersBombs.addChild(otherUserBomb.sprite);
                otherUserBomb.activate( gameEngine.containers.otherPlayersBombs);
            });

            socket.on('bonus-changed',function(newBonuses){
                console.log('will remove bonuses',newBonuses);
                bonusHandler.changeBonuses(newBonuses);
            });
        }
    });

    return Server;
}());

server = new Server();









