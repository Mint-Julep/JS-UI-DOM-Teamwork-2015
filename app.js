var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var mongoose=require('mongoose');
var logger= require('morgan');
var cookieParser = require('cookie-parser')
var path = require('path');
var sha1 = require('sha1');

require('./models/models.js') ;
var userData = require('./data/user-data'),
    mapData = require('./data/maps-data');
var utils = require('./data/utils');

var db=userData.connect('mongodb://server:server@dogen.mongohq.com:10005/BombGunner');
//var db = userData.connect('127.0.0.1:27017/BombGunner');

var levels=[];

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

app.get('/game/:typeOfGame', function(req, res,next) {
    var typeOfGame=req.params.typeOfGame;
    if(typeOfGame==='singleplayer'){
        res.sendFile(__dirname+'/public/game-singleplayer.html');
    }else if(typeOfGame==='multiplayer'){
        var userId=req.cookies.bombGunner_userId;
        var token=req.cookies.bombGunner_token;
        userData.verifyUserToken({id:userId,token:token},function(){
            res.sendFile(__dirname+'/public/game-multiplayer.html');
        },function(){
            res.status(401).sendFile(__dirname+'/public/401.html');
        });

    } else {
        res.status(404).sendFile(__dirname+'/public/404.html');
    }
});
app.get('/view', function(req, res,next) {
    console.log(levels);
    res.sendFile(__dirname+'/public/404.html');
});
app.get('/', function(req, res,next) {
    res.sendFile(__dirname+'/public/index.html');
});



var port =process.env.PORT || 3000;

server.listen(port,function(e){
    if(e){
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
        userData.getUser(clientData).then(function(user){
            if(user && user.username){
                client.emit('log-in', user);
            }
        },function (err) {
            client.emit('form-error', {form:'log-in','text':err.text});
        });

    });

    client.on('register', function(clientData) {
        var user = userData.saveUser(clientData).then(function(user){
            client.emit('register',{text:'Registration successfull!'});
        },function (err) {
            client.emit('form-error', {form:'register','text':err.text});
        });

    });

    client.on('player-level',function(clientData){
        console.log('my levels',levels);
        if(utils.getPlayingUserById(clientData.playerId,false,true,levels)!==-1){
            client.broadcast.emit('player-disconnected',clientData.playerId);
        }

        console.log('map from player:',clientData.map);
        var playerId = clientData.playerId;
        var level='level'+clientData.levelId;
        if(levels.indexOf(level)===-1){
            levels.push(level);
            levels[level]={
                id:clientData.levelId,
                name:level,
                players:[],
                playersCount:1,
                map:clientData.map
            };

            client.join(level);
        } else {
            client.join(level);
            levels[level].playersCount++;

            client.broadcast.to(level).emit('other-player-joined',playerId);
        }

        client.emit('current-players',levels[level].players);
        console.log('server map',levels[level])

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
        var playerId=utils.getPlayerIdBySocketId(client.id,levels);

        if(playerId!==-1){
            client.broadcast.emit('player-disconnected',playerId);
        }

        utils.removeEmptyRooms(levels);
    });

    client.on('player-moved', function(clientData) {
        client.broadcast.to(clientData.level).emit('other-player-moved',clientData);
        var userIndex = utils.getPlayingUserById(clientData.id,clientData.level,false,levels);

        if(userIndex!==-1){
            ((levels[clientData.level]).players)[userIndex].position =clientData.newPosition;
        }
    });

    client.on('bomb-placed', function(bombPosition) {
        client.broadcast.to(bombPosition.level).emit('bomb-placed',bombPosition);
    });

    client.on('get-all-maps',function(data,callback){
        mapData.getAllMaps().then(function(allMaps){
            callback(0,allMaps);
        },function(err){
            callback(err);
        });
    });

    client.on('get-level',function(data,callback){
        for(var i=0;i<levels.length;i++){
            if(levels[i]===data.level){
                console.log('all good, returning',levels[levels[i]])
                callback(0,levels[levels[i]]);
                return;
            }
        }

        callback(1,{});
    });

    client.on('map-changed',function(data){
       var level = data.level,
           newMap = data.newMap;

        for(var i=0;i<levels.length;i++){
            if(levels[i]===level){
                levels[levels[i]].map.map = newMap;
                console.log('map changed successfully');
            }
        }

         console.log(levels[level]);
    });

    client.on('bonus-changed',function(data){
        var level = data.level,
            newBonuses = data.newBonuses;

        for(var i=0;i<levels.length;i++){
            if(levels[i]===level){
                levels[levels[i]].map.bonuses = newBonuses;
                console.log('map bonuses changed successfully');
            }
        }

        client.broadcast.to(data.level).emit('bonus-changed',newBonuses);

    })

});





