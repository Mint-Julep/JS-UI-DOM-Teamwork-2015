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

var users=[];

app.use(logger('dev'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/game/', function(req, res,next) {
    res.sendFile(__dirname+'/public/game.html');
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
            client.emit('messages', user.toString());
        },function (err) {
            client.emit('form-error', {form:'register','text':err.text});
        });

    });

    client.on('canvas', function(clientData) {
        client.broadcast.emit('canvas',clientData);
        //client.broadcast.emit('time',new Date(Date.now()));
    });

    client.on('playerMoved', function(clientData) {
        client.broadcast.emit('playerMoved',clientData);
        //client.broadcast.emit('time',new Date(Date.now()));
    });

});


