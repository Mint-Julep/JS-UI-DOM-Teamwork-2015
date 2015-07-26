var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose=require('mongoose');
var logger= require('morgan');
var path = require('path');
var sha1 = require('sha1');

require('./models/models.js') ;
var data=require('./data/index-data');
var db=data.connect('mongodb://server:server@dogen.mongohq.com:10005/BombGunner');

var levels=[];

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/game/:typeOfGame', function(req, res,next) {
    var typeOfGame=req.params.typeOfGame;
    if(typeOfGame==='singleplayer'){
        res.sendFile(__dirname+'/public/game-singleplayer.html');
    }else if(typeOfGame==='multiplayer'){
        res.sendFile(__dirname+'/public/game-multiplayer.html');
    } else {
        res.sendFile(__dirname+'/public/404.html');
    }
});
app.get('/', function(req, res,next) {
    res.sendFile(__dirname+'/public/index.html');
});

var port =process.env.PORT || 3000;

server.listen(port,function(e){
    if(e){
        console.log(e);
        server.close();
    }else{
        console.log('Server listening on port '+port);
    }

});

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.sendFile(__dirname+'/public/404.html');
});

io.on('connection', function(client) {
    client.on('log-in', function(clientData) {
        data.getUser(clientData).then(function(user){
            if(user && user.username){
                client.emit('log-in', user);
            }
        },function (err) {
            client.emit('form-error', {form:'log-in','text':err.text});
        });

    });

    client.on('register', function(clientData) {
        var user = data.saveUser(clientData).then(function(user){
            client.emit('register',{text:'Registration successfull!'});
        },function (err) {
            client.emit('form-error', {form:'register','text':err.text});
        });

    });

    client.on('player-level',function(clientData){
        var playerId = clientData.playerId;
        var level='level'+clientData.levelId;
        if(levels.indexOf(level)===-1){
            levels.push(level);
            levels[level]={
                id:clientData.levelId,
                name:level,
                players:[],
                playersCount:1
            };

            client.join(level);
        } else {
            client.join(level);
            levels[level].playersCount++;

            client.broadcast.to(level).emit('other-player-joined',playerId);
        }

        client.emit('current-players',levels[level].players);

        levels[level].players.push({
            id:clientData.playerId,
            position:{
                x:-1,
                y:-1
            },
            socketId:client.id,
        });
    });

    client.on('disconnect',function(){
        var playerId=getPlayerIdBySocketId(client.id);
        console.log('disconnected');
        console.log(playerId);
        if(playerId!==-1){
            client.broadcast.emit('player-disconnected',playerId);
        }
    });

    client.on('player-moved', function(clientData) {
        client.broadcast.to(clientData.level).emit('other-player-moved',clientData);
        var userIndex = getPlayingUserById(clientData.id,clientData.level);

        if(userIndex!==-1){
            ((levels[clientData.level]).players)[userIndex].position =clientData.newPosition;
            console.log(clientData.newPosition);
        }
    });

});

function getPlayerIdBySocketId(id){
    for(var level=0;level<levels.length;level++){
        console.log('checking level '+level);
        console.log('checking with id '+id);
        console.log(levels[levels[level]]);
        var players = levels[levels[level]].players;

        console.log('players:');
        console.log(players);

        for(var i= 0,len=players.length;i<len;i++){
            if(players[i].socketId==id){
                var idToReturn =players[i].id;
                players.splice(i,1);
                return idToReturn
            }
        }
    }

    return -1;
}

function getPlayingUserById(id,level){
    var players = levels[level].players;

    for(var i= 0,len=players.length;i<len;i++){
        if(players[i].id==id){
            return i;
        }
    }

    return -1;
}


