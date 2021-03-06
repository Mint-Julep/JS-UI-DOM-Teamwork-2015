var fs = require('fs');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var sha1 = require('sha1');
var User = mongoose.model('users');

var data = {
    connect: function (connectionString) {
        mongoose.connect(connectionString);
        console.log('Connected to database');
    },
    getNextId: function () {
        var promise = new Promise(function (resolve, reject) {
            var db = mongoose.connection;
            var generalCollection = db.collection('general');

            generalCollection.findOne({name: 'options'}, function (err, data) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data.id);
            });
        });

        return promise;
    },
    getUser: function (userData) {
        var promise = new Promise(function (resolve, reject) {
            if(userData.name.length<6){
                reject({text:'Invalid username'});
            }else if(userData.pass.length<6){
                reject({text:'Invalid password'});
            }

            var userName = userData.name,
                userPass = sha1(userData.pass),
                token = sha1(Date.now());

            User.findOne({name: userName, pass: userPass}, function (err, user) {
                if (err) {
                    err.text = 'Database error';
                    reject(err);
                    return;
                }

                if (user) {
                    user.token = token;
                    user.save();

                    resolve({
                        id:user.id,
                        username:user.name,
                        token:token
                    });

                    return;
                } else {
                    User.findOne({name: userName}, function (err, user) {
                        if (err) {
                            err.text = 'Database error';
                            reject(err);
                            return;
                        }

                        if (user) {
                            reject({text:'Wrong password!'});
                        }else {
                            reject({text:'No such username found'});
                        }
                    })
                }
            });
        });

        return promise;
    },
    saveUser: function (userData) {
        var promise = new Promise(function (resolve, reject) {

            if(userData.name.length<6){
                reject({text:'Username must be at least 6 symbols!'});
            }
            if(userData.pass.length<6){
                reject({text:'Password must be at least 6 symbols!'});
            }
            var nextId;
            mongoose.connection.collection('general').findOne({name: 'options'}, function (err, optionsResponse) {
                if (err) {
                    err.text='Database error';
                    reject(err);
                    return;
                }
                User.findOne({name: userData.name}, function (err, user) {
                    if (err) {
                        err.text='Database error';
                        reject(err);
                    }

                    if(user){
                        reject('User already exists');
                    } else {
                        var options = optionsResponse;
                        nextId = ++options.id;

                        var db = mongoose.connection;
                        var generalCollection = db.collection('general');
                        generalCollection.update({_id: optionsResponse._id}, options);
                        
                        userData.pass= sha1(userData.pass);

                        var newUser = new User({id: nextId, name: userData.name, pass:userData.pass, rank: 0});
                        newUser.save(function (err, dbData) {
                            if (err) {
                                err.text='Database error';
                                reject(err);
                                return;
                            }

                            resolve(dbData);
                        });
                    }
                });

            });
        });

        return promise;
    },
    getUserById: function (id) {
        var promise = new Promise(function (resolve, reject) {
            User.findById(id, function (err, user) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(user);
            });
        })

        return promise;
    },
    getAllUsers: function () {
        var promise = new Promise(function (resolve, reject) {
            User.find({}, function (err, users) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(users);
            });
        });

        return promise;
    },
    verifyUserToken: function (user,response,reject) {
        if(!user.token){
            reject();
        }

        var promise = new Promise(function (resolve, reject) {
            User.find(user, function (err, users) {
                if (err) {
                    reject();
                    return;
                }
                if(users){
                    response();
                } else {
                    reject();
                }

            });
        });

        return promise;
    }
};


module.exports = data;
