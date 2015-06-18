/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var fs = require('fs');
/**
 * 本地图片读取功能
 * @param {type} filename
 * @param {type} cb
 * @returns {undefined}
 */
exports.image = function (filename, cb) {
    var path = config.imageLocalPath;

    if (filename) {
        fs.readFile(path + "/" + filename, function (err, data) {
            cb(err, data);
        });
    }
};
