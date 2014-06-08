var mongoose = require('mongoose'),
  LocalStrategy = require('passport-local').Strategy,
  User = mongoose.model('User');

module.exports = function(passport, config) {

  // Configure passport strategies

  // Local strategy is handled by the server
  passport.use(new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
        email: email
      })
        .select('+hashed_password +salt')
        .exec(function(err, user) {
          if (err)
          // Server error
            return done(err);
          if (!user)
          // There is no server error, but there is no such user
            return done(null, false, {
              message: 'Unknown user'
            });
          user.authenticate(password, function(err, isAuthenticated) {
            if (err)
              return done(null, false, {
                message: 'Could not authenticate due to server error'
              });
            if (!isAuthenticated)
            // A user was found, but the given password does not match the hash for this user
              return done(null, false, {
                message: 'Invalid password'
              });
            // Everything is OK, so the user is passed as a second parameter
            return done(null, user);
          });
        });
    }));
}