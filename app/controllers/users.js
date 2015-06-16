
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

var validateEMail = function (email) {
    var bool = false;
//    User.
    return bool;
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
        if (err)
            return next(err);
        if (!user)
            return next(new Error('Failed to load User ' + id));
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
                title: 'Sign up'
            });
        }
        user.save(function (err) {
            if (err) {
                return res.render('users/signup', {
                    errors: utils.errors(err.errors || err),
                    user: user,
                    title: 'Sign up'
                });
            }

            // manually login the user once successfully signed up
            req.logIn(user, function (err) {
                if (err)
                    req.flash('info', 'Sorry! We are not able to log you in!');
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
        title: 'Login'
    });
};

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
    res.render('users/signup', {
        title: 'Sign up',
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

