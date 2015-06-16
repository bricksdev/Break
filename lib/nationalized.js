/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
/**
 * extends swig tag
 * @param {type} swig
 * @returns {undefined}
 */
var i18n = require("./i18n");
var localutils = require("./localutils");

exports.extend = function (swig) {
    // 初始化国际化文件
    localutils.parse();
    swig.setTag("i18n", i18n.parse, i18n.compile, i18n.ends, i18n.block);
};

exports.setLocal = function (req) {
    if (req.headers) {
       
        localutils.setLocal(req.headers['accept-language']);
    }
};