/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var localutils = require('../../lib/localutils');
exports.home = function (req, res) {

    res.render('homes/home', {
        title: localutils.message("EH0001")//Home
    });
};

exports.search = function (req, res) {
    res.redirect('/articles');
};

