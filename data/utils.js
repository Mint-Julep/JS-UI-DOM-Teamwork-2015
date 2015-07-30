function getPlayerIdBySocketId(id,levels){
    for(var level=0;level<levels.length;level++){
        var players = levels[levels[level]].players;

        for(var i= 0,len=players.length;i<len;i++){
            if(players[i].socketId==id){
                var idToReturn =players[i].id;
                players.splice(i,1);
                levels[levels[level]].playersCount--;
                return idToReturn
            }
        }
    }

    return -1;
}

function getPlayingUserById(id,level,remove,levels){
    level =  level ||false;
    remove = remove || false;

    if(level) {
        var players = levels[level].players;

        for (var i = 0, len = players.length; i < len; i++) {
            if (players[i].id == id) {
                return i;
            }
        }
    } else {
        for(var level=0;level<levels.length;level++){

            var players = levels[levels[level]].players;
            for(var i= 0,len=players.length;i<len;i++){
                if(players[i].id==id){
                    var idToReturn =players[i].id;
                    if(remove) {
                        players.splice(i, 1);
                    }
                    return idToReturn
                }
            }
        }
    }

    return -1;
}

function removeEmptyRooms(levels){
    console.log(levels);
    for(var level=0;level<levels.length;level++){
        var players = levels[levels[level]].players;

        if(players.length<1){
            delete levels[levels[level]];
            levels.splice(level,1);
        }
    }
    console.log(levels);
}

module.exports = {
    getPlayerIdBySocketId:getPlayerIdBySocketId,
    getPlayingUserById:getPlayingUserById,
    removeEmptyRooms:removeEmptyRooms
};