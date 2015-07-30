var fs = require('fs');
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Map = mongoose.model('maps');

var data = {
    getAllMaps: function () {
        var promise = new Promise(function (resolve, reject) {
            Map.find({}, function (err, maps) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(maps);
            });
        });

        return promise;
    },
};


module.exports = data;
