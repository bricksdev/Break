
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');
var localutils = require('../../lib/localutils');

var oAuthTypes = [
    'github',
    'twitter',
    'facebook',
    'google',
    'linkedin'
];

/**
 * 此处将验证提前业务层，减少对model的依赖验证
 * @param {type} user
 * @param {type} cb
 * @returns {unresolved}
 */
var validation = function (user, cb) {
    var errs = [];
    if (!skipValidation(user.provider)) {

        // 验证必须输入
        if (!user.name) {
            errs.push(new Error(localutils.error("EU0001")));

        }
        if (!user.email) {
            errs.push(new Error(localutils.error("EU0002")));
        } else {
            validateEMail(user.email, function (bool) {
                if (bool) {
                    errs.push(new Error(localutils.error("EU0003")));
                }
            });
        }
        if (!user.username) {
            errs.push(new Error(localutils.error("EU0004")));
        }
        if (!user.hashed_password) {
            errs.push(new Error(localutils.error("EU0005")));
        }

    }
    return cb(errs.length ? errs : null);
};

var validateEMail = function (email, cb) {
    var bool = false;
    User.find({email: email}).exec(function (err, users) {

        cb(!err && (users.length === 0));

    });
    cb(bool);
};

/**
 * Validation is not required if using OAuth
 * @param {type} provider
 * @returns {Number}
 */
var skipValidation = function (provider) {
    return ~oAuthTypes.indexOf(provider);
};
/**
 * 
 * @param {type} value
 * @returns {unresolved}
 */
var validatePresenceOf = function (value) {
    return value && value.length;
};
/**
 * Load
 */

exports.load = function (req, res, next, id) {
    var options = {
        criteria: {_id: id}
    };
    User.load(options, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next(new Error(localutils.error("EU0007", {userid: id})));//'Failed to load User '
        }
        req.profile = user;
        next();
    });
};

/**
 * Create user
 */

exports.create = function (req, res) {
    var user = new User(req.body);

    user.provider = 'local';
    validation(user, function (err) {
        if (err) {
            return res.render('users/signup', {
                errors: utils.errors(err.errors || err),
                user: user,
                title: localutils.message("EU0008")//Sign up
            });
        }
        user.save(function (err) {
            if (err) {
                return res.render('users/signup', {
                    errors: utils.errors(err.errors || err),
                    user: user,
                    title: localutils.message("EU0008")//Sign up
                });
            }

            // manually login the user once successfully signed up
            req.logIn(user, function (err) {
                if (err)
                    req.flash('info', localutils.error("EU0009"));//Sorry! We are not able to log you in!
                return res.redirect('/');
            });
        });

    });

};

/**
 *  Show profile
 */

exports.show = function (req, res) {
    var user = req.profile;
    res.render('users/show', {
        title: user.name,
        user: user
    });
};

exports.signin = function (req, res) {
};

/**
 * Auth callback
 */

exports.authCallback = login;

/**
 * Show login form
 */

exports.login = function (req, res) {
    res.render('users/login', {
        title: localutils.message("EU0010")//Login
    });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('users/signup', {
        title: localutils.message("EU0008"), //Sign up
        user: new User()
    });
};

/**
 * Logout
 */

exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};

/**
 * Session
 */

exports.session = login;

/**
 * 
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
function login(req, res) {
    var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}
/**
 * 获取AJAX用户信息,模糊检索
 */
exports.select = function (req, res) {
    
    var name = req.params.name;
    
    User.find({name:  { $regex: name,$options:"si"}, provider: "client"})
            .select("name username")
            .exec(function (err, users) {
                if (~err) {
                    return res.send({success:true,datas:users});
                }
                
                res.send({success:false});
            });
};
/**
 * 创建客户端
 * @param  req
 * @returns json {success:bool}
 */
exports.createClient = function (req, res) {
    var user = new User(req.body);
    user.provider = "client";
    user.save(function (err) {
        if (err) {
            return res.send({
                errors: utils.errors(err.errors || err),
                success: false
            });
        }

        res.send({
            success: true
        });
    });
};


exports.showClientUser = function (req, res) {
    var username = req.params.username;

    User.findOne({name: username})
        .exec(function (err, user) {
                if (~err && user) {
                    return res.render('users/show', {
                        title: user.name,
                        user: user
                    });
                }
                
        return res.redirect("/users/"+req.user.id)
    });
};

exports.checkClient = function(req, res){
    var csrf_token = req.csrfToken();
    res.header('Content-Type', 'application/json');
    res.send({success:true, token:csrf_token}); 
};