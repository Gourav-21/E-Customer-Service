const { User } = require("./database");
const LocalStrategy = require("passport-local").Strategy;

exports.initializingPassport = (passport) => {
  passport.use(User.createStrategy());

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
