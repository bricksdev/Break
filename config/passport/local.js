
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var config = require('config');
var User = mongoose.model('User');
var localutils = require('../../lib/localutils');
/**
 * Expose
 */

module.exports = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    var options = {
      criteria: { email: email },
      select: 'name username email hashed_password salt'
    };
    User.load(options, function (err, user) {
      if (err) return done(err)
      if (!user) {
        return done(null, false, { message: localutils.error('EU0012') });
      }
      if (!user.authenticate(password)) {
        return done(null, false, { message: localutils.error('EU0013') });
      }
      return done(null, user);
    });
  }
);
