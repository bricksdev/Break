/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Userdetail = mongoose.model('Userdetail');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var extend = require('util')._extend;
var localutils = require('../../lib/localutils');

var validation = function (userdetail, cb) {
    var errs = [];
    cb(errs.length ? errs : null);
};

exports.edit = function (req, res) {
    var options = {user: req.params.userid};
    Userdetail.load(options, function (err, detail) {
        if (err) {
            return res.render('users/detail', {
                title: localutils.message('EUD001'), //'Edit User Detail'
                detail: new Userdetail(),
                errors: utils.errors(err.errors || err)
            });
        }
        if (!detail) {
            // first init
            detail = new Userdetail();
        }
        res.render('users/editdetail', {
            title: localutils.message('EUD001'),
            detail: detail,
            user:req.user
        });
    });
}

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
            return res.render('users/detail', {
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

/**
 * Show
 */

exports.show = function (req, res) {

    var options = {user: req.params.userid};
    Userdetail.load(options, function (err, detail) {
        if (err) {
            return res.render('users/detail', {
                title: localutils.message('EUD001'), //'Edit User Detail'
                detail: new Userdetail(),
                errors: utils.errors(err.errors || err)
            });
        }
        if (!detail) {
            // first init
            detail = new Userdetail();

        }
        res.render('users/detail', {
            title: localutils.message('EUD001'),
            detail: detail,
            user:req.user
        });
    });

};