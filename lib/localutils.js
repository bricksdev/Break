/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var fs = require('fs'),
        path = require('path');
// 设定语言
var _local_lang = _local_lang || "en"
var _local_messages = {};
/**
 * 读取指定路径下国际化文件
 * @param {type} root
 * @returns {messages_file_path.res|Array}
 */
var messages_file_path = function (root) {
    var res = [], files = fs.readdirSync(root);
    files.forEach(function (file) {
        var pathname = root + '/' + file
                , stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()) {
            res.push(pathname);
        } else {
            res = res.concat(messages_file_path(pathname));
        }
    });
    return res;
};
/**
 * 解析所有语言包下的国际化文件
 * @returns {undefined}
 */
var parse_messages_file = function () {
    var filepaths = messages_file_path(path.join(__dirname, "/..", "locales"));

    filepaths.forEach(function (filepath) {

        var rawMessages = fs.readFileSync(filepath, {"encoding": 'utf8'});
        var contents = rawMessages.split("\n");
        var messages = {};
        for (var idx in contents) {
            var content = contents[idx];
            if(content.indexOf("#") === 0 || content.trim() === ""){
                continue;
            }
            var pairs = content.split("=");
            messages[pairs[0]] = pairs[1];
        }
        var local_langs = filepath.split("/");

        _local_messages[local_langs[local_langs.length - 2]] = messages;
    });
    
};


/**
 * 设定语言
 * @param {type} local
 * @returns {undefined}
 */
var setLocal = function (local) {
    var langs = getLocal(local);
    if (langs && langs.length > 1) {
        _local_lang = langs[0].lang;
    } else {
        _local_lang = "en";
    }
};
/**
 * @param {type} key
 * @param {type} params
 * @returns 
 * 模板化国际化消息，key=content${p1},params:{p1:value}
 */
var templateMessage = function (key, params) {

    if(_local_messages && _local_messages[_local_lang]){
        var messageTemplate = _local_messages[_local_lang][key];
        messageTemplate = transferKey(messageTemplate, params);
        return messageTemplate;
    }
    return key;
};

var errorMessage = function (key, params) {
    var message = templateMessage(key, params);
    // 添加错误号在前面
    return key+":"+message;
};
/**
 * 替换${key}中定义的key的内容，
 * @param {type} messageTemplate
 * @param {type} params {key:value}
 * @returns 被替换完成的内容
 */
var transferKey = function (messageTemplate, params) {
    var idx = -1;
    // 如果存在对应的替换位，将递归进行替换
    if (params && (idx = messageTemplate.indexOf("${")) > 0) {
        var key = messageTemplate.slice(idx + 2, messageTemplate.indexOf("}"));
        var content = params[key] ? params[key] : key;
        messageTemplate = messageTemplate.slice(0, idx) + content + messageTemplate.slice(messageTemplate.indexOf("}")+1);
        messageTemplate = transferKey(messageTemplate, params);
    }
    return messageTemplate;
};
// 排列比较对象
var comparer = function (a, b) {
    if (a.quality === b.quality) {
        return 0;
    } else if (a.quality < b.quality) {
        return 1;
    } else {
        return -1;
    }
};
/**
 * 获取请求头中语言
 * @param {type} header
 * @returns {Array|getLocal.langs}
 */
var getLocal = function getLocal(header) {
    // pl,fr-FR;q=0.3,en-US;q=0.1
    if (!header || !header.split) {
        return [];
    }
    // 依照，进行分割计算出语言
    var raw_langs = header.split(',');
    var langs = raw_langs.map(function (raw_lang) {
        var parts = raw_lang.split(';');
        var q = 1;
        if (parts.length > 1 && parts[1].indexOf('q=') === 0) {
            var qval = parseFloat(parts[1].split('=')[1]);
            if (isNaN(qval) === false) {
                q = qval;
            }
        }
        return {lang: parts[0].trim(), quality: q};
    });
    // 按照语言优先排序
    langs.sort(comparer);

    return langs;
};


exports.parse = parse_messages_file;
exports.message = templateMessage;
exports.setLocal = setLocal;
exports.error = errorMessage;


