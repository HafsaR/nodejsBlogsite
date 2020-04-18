const localStrategy = require("passport-local").Strategy;

function initialize(passport, getUserByEmail) {
  const authenticateUser = (username, password, done) => {
    const user = getUserByEmail(username);
    if (user == null) {
      return done(null, false, { massage: "No user with that email" });
    }
    if (passport == user.password) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  };
  passport.use(localStrategy({ usernameField: "username" }, authenticateUser));
  passport.serializeUser((user, done) => {});
  passport.deserializeUser((id, done) => {});
}
module.exports = initialize;
