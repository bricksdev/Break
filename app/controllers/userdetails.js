/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Userdetail = mongoose.model('Userdetail');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var localutils = require('../../lib/localutils');

var validation = function (userdetail, cb) {
    var errs = [];
    cb(errs.length ? errs : null);
};

exports.create = function (req, res) {

    var detail = req.detail;
    if (detail) {
        delete req.body.user;
        detail = extend(detail, req.body);
    } else {
        detail = new Userdetail(req.body);
        detail.user = req.user;
    }

    validation(detail, function (err) {

        if (err) {
            return res.render('/users/detail/' + detail.user._id + "/edit", {
                title: localutils.message('EUD001'), //'Edit User Detail'
                detail: detail,
                errors: utils.errors(err.errors || err)
            });
        }

        detail.save(function (err) {
            if (!err) {
                req.flash('success', localutils.message('EUD002'));//'Successfully save user detail!'
                return res.redirect('/users/detail/' + detail.user.id);
            }
        });
    });
};

exports.load = function (req, res, next) {
    var user = req.user;
    var options = {
        criteria: {user: user.id}
    };
    Userdetail.load(options, function (err, detail) {
        if (err)
            return next(err);
        if (!detail){
            // first init
            detail = new Userdetail();
        }
//            return next(new Error(localutils.error("EB0001", {user: user.id})));//'Failed to load Break '
        req.detail = detail;
        next();
    });
};

exports.select = function (req, res) {
    var relusers = req.params.relusers;
    var option = {
        name: relusers,
        provider: "AndroidClient"
    };
    User.find(option).select("name username").exec(function (err, user) {
        if (err) {
            return res.send({success: false, messages: err});
        }

        res.send({success: true, userid: user.id, username: user.username});
    });
};