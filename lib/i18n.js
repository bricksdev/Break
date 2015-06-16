/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/**
 * Localization variable in the current context. This will get Localization value already set .properies to the context for the given <var>varname</var>.
 *
 * @alias i18n
 *
 *  
 * @example
 * {% i18n key %}
 * 
 * // => Localization value
 *
 */
'use strict';
var localutils = require("./localutils");

exports.compile = function (compiler, args, content, parents, options, blockName) {

    return '_output += "' + localutils.message(args[0]) + '";\n';
};

exports.parse = function (str, line, parser, types, stack, options, swig) {
    if (typeof str === "undefined") {
        throw new Error('No i18n Localization key provided on line ' + line + '.');
    }
    parser.on(types.VAR, function (token) {
        this.out.push(token.match);
        this.filterApplyIdx.push(this.out.length);
        return true;
    });


    return true;
};

exports.block = true;

exports.ends = false;

