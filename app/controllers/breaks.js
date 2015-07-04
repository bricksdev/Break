/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Breaks = mongoose.model('Breaks');
var Userdetail = mongoose.model('Userdetail');
var utils = require('../../lib/utils');
var localutils = require('../../lib/localutils');
var env = process.env.NODE_ENV || 'development';

/**
 * 此处将验证提前业务层，减少对model的依赖验证
 * @param {type} brk
 * @param {type} cb
 * @returns {unresolved}
 */
var validation = function (brk, cb) {
    var errs = [];
    // 验证breaks必须项
    if (!brk.runtime) {
        errs.push(new Error(localutils.error("EB0004")));// runtime cannot be blank.

    }

    if (brk.runtime && brk.runtime < 0) {
        errs.push(new Error(localutils.error("EB0005")));// runtime must be greater than zero.
    }

    if (!brk.breaktime) {
        errs.push(new Error(localutils.error("EB0006")));// breaktime cannot be blank.

    }

    if (brk.breaktime && brk.breaktime <= 0) {
        errs.push(new Error(localutils.error("EB0007")));// breaktime must be greater than zero.
    }

    if (!brk.comment) {
        errs.push(new Error(localutils.error("EB0008")));// comment cannot be blank.
    }
    if (!brk.title) {
        errs.push(new Error(localutils.error("EB0011")));// title cannot be blank.
    }


    if (!brk.relusers) {
        errs.push(new Error(localutils.error("EB0009")));// relation user cannot be blank.
    }


    return cb(errs.length ? errs : null);
};


exports.load = function (req, res, next, id) {
    var options = {
        criteria: {_id: id}
    };
    Breaks.load(options, function (err, brk) {
        if (err)
            return next(err);
        if (!brk)
            return next(new Error(localutils.error("EB0001", {breakid: id})));//'Failed to load Break '
        req.breaks = brk;
        next();
    });

};

exports.index = function (req, res) {
    var page = (req.params.page > 0 ? req.params.page : 1) - 1;
    var perPage = 30;

    var options = {
        perPage: perPage,
        page: page,
        criteria: {user: req.user.id}
    };
    Breaks.list(options, function (err, brks) {
        if (err) {
            return res.render('500');
        }
        Breaks.count().exec(function (err, count) {
            res.render('breaks/index', {
                title: localutils.message('EB0002'), //'Breaks'
                breaks: brks,
                page: page + 1,
                pages: Math.ceil(count / perPage)
            });
        });
    });
};


exports.create = function (req, res) {

    var breaks = new Breaks(req.body);

    breaks.user = req.user;
    validation(breaks, function (err) {
        if (err) {
            return res.render('breaks/new', {
                title: localutils.message('EB0010'), //'New Break Notify'
                breaks: breaks,
                errors: utils.errors(err.errors || err)
            });
        }

        breaks.save(function (err) {
            if (!err) {
                req.flash('success', localutils.message('EB0003'));//'Successfully create break notify!'
                return res.redirect('/breaks/' + breaks._id);
            }
            res.render('breaks/new', {
                title: localutils.message('EB0010'), //'New Break Notify'
                breaks: breaks,
                errors: utils.errors(err.errors || err)
            });
        });
    });

};



/**
 * Edit an break Notify
 */

exports.edit = function (req, res) {
    Userdetail.findOne({user: req.user.id}).exec(function (err, detail) {
        if (err) {
            return res.redirect('/breaks/index');
        }
        // 如果没有设定用户关联关系，跳转到关联用户页面
        if (~detail || ~detail.relusers || detail.relusers.length === 0) {
            return res.redirect('/users/detail/' + req.user.id);
        }
        res.render('breaks/edit', {
            title: localutils.message('EB0012', {title: req.breaks.title}), //'Edit '
            breaks: req.breaks,
            userdetail: detail
        });
    });
};

/**
 * Update breaks
 */

exports.update = function (req, res) {
    var breaks = req.breaks;
    // make sure no one changes the user
    delete req.body.user;
    breaks = extend(breaks, req.body);
    validation(breaks, function (err) {
        if (err) {
            res.render('breaks/edit', {
                title: localutils.message('EB0010'), //'New Break Notify'
                breaks: breaks,
                errors: utils.errors(err.errors || err)
            });
            return;
        }

        breaks.save(function (err) {
            if (!err) {
                req.flash('success', localutils.message('EB0013'));//'Successfully update break notify!'
                return res.redirect('/breaks/' + breaks._id);
            }
            res.render('breaks/edit', {
                title: localutils.message('EB0010'), //'Edit BreakNotify'
                breaks: breaks,
                errors: utils.errors(err.errors || err)
            });
        });
    });
};

/**
 * Show
 */

exports.show = function (req, res) {
    res.render('breaks/show', {
        title: req.breaks.title,
        breaks: req.breaks
    });
};

/**
 * Delete an article
 */

exports.destroy = function (req, res) {
    var breaks = req.breaks;
    breaks.remove(function (err) {
        req.flash('info', localutils.message('EB0014', {title: req.breaks.title}));//'Deleted successfully'
        res.redirect('/breaks');
    });
};

/**
 * New Breaks
 */

exports.new = function (req, res) {
    Userdetail.findOne({user: req.user.id}).exec(function (err, detail) {
        if (err) {
            return res.redirect('/breaks/index');
        }
        // 如果没有设定用户关联关系，跳转到关联用户页面
        if (!detail || detail.relusers.length === 0) {
            return res.redirect('/users/detail/' + req.user.id);
        }

        res.render('breaks/new', {
            title: localutils.message('EB0010'), //'New Article'
            breaks: new Breaks(),
            userdetail: detail
        });
    });

};

