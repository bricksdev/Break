
/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var users = require('users');
var articles = require('articles');
var comments = require('comments');
var tags = require('tags');
var homes = require('homes');
var breaks = require('breaks');
var userdetails = require('userdetails');
var auth = require('./middlewares/authorization');
var localutils = require('../lib/localutils');
/**
 * Route middlewares
 */

var breaksAuth = [auth.requiresLogin, auth.breaks.hasAuthorization];
var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    
    app.post('/users', users.create);
    
    app.post('/users/session',
            passport.authenticate('local', {
                failureRedirect: '/login',
                failureFlash: localutils.error('EU0011')//Invalid email or password.
            }), users.session);
    app.get('/users/:userId', users.show);
    
    app.get('/auth/facebook',
            passport.authenticate('facebook', {
                scope: ['email', 'user_about_me'],
                failureRedirect: '/login'
            }), users.signin);
    app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                failureRedirect: '/login'
            }), users.authCallback);
    app.get('/auth/github',
            passport.authenticate('github', {
                failureRedirect: '/login'
            }), users.signin);
    app.get('/auth/github/callback',
            passport.authenticate('github', {
                failureRedirect: '/login'
            }), users.authCallback);
    app.get('/auth/twitter',
            passport.authenticate('twitter', {
                failureRedirect: '/login'
            }), users.signin);
    app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                failureRedirect: '/login'
            }), users.authCallback);
    app.get('/auth/google',
            passport.authenticate('google', {
                failureRedirect: '/login',
                scope: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ]
            }), users.signin);
    app.get('/auth/google/callback',
            passport.authenticate('google', {
                failureRedirect: '/login'
            }), users.authCallback);
    app.get('/auth/linkedin',
            passport.authenticate('linkedin', {
                failureRedirect: '/login',
                scope: [
                    'r_emailaddress'
                ]
            }), users.signin);
    app.get('/auth/linkedin/callback',
            passport.authenticate('linkedin', {
                failureRedirect: '/login'
            }), users.authCallback);

    app.param('userId', users.load);
    
    app.get('/users/select/:name', auth.requiresLogin, users.select);
    app.post('/users/client', users.createClient);
    // get client user
    app.get('/users/client/:username',users.showClientUser)
    
    // article routes
    app.param('id', articles.load);
    app.get('/articles', articles.index);
    app.get('/articles/new', auth.requiresLogin, articles.new);
    app.post('/articles', auth.requiresLogin, articles.create);
    app.get('/articles/:id', articles.show);
    app.get('/articles/:id/edit', articleAuth, articles.edit);
    app.put('/articles/:id', articleAuth, articles.update);
    app.delete('/articles/:id', articleAuth, articles.destroy);
    
    // breaks routes
    app.param('breakid', breaks.load);
    app.get('/breaks', auth.requiresLogin, breaks.index);
    app.get('/breaks/new', auth.requiresLogin, breaks.new);
    app.post('/breaks', auth.requiresLogin, breaks.create);
    app.get('/breaks/:breakid', breaks.show);
    app.get('/breaks/:breakid/edit', breaksAuth, breaks.edit);
    app.put('/breaks/:breakid', breaksAuth, breaks.update);
    app.delete('/breaks/:breakid', breaksAuth, breaks.destroy);
    
    // home route
    app.get('/', homes.home);
    app.get('/search', homes.search);
    
    app.param('imagename', articles.image);
    app.get('/articles/image/:imagename', articles.image);

    // comment routes
    app.param('commentId', comments.load);
    app.post('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.get('/articles/:id/comments', auth.requiresLogin, comments.create);
    app.delete('/articles/:id/comments/:commentId', commentAuth, comments.destroy);

    // tag routes
    app.get('/tags/:tag', tags.index);


    // user detail
    app.get("/users/detail/:userid", auth.requiresLogin, userdetails.show);
    app.get("/users/detail/:userid/edit",auth.requiresLogin, userdetails.edit);
    app.post("/users/detail/:userid/edit/:detailid",auth.requiresLogin, userdetails.create);

    /**
     * Error handling
     */

    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
                && (~err.message.indexOf('not found')
                        || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page
        res.status(500).render('500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: localutils.error('E00003')
        });
    });
};
