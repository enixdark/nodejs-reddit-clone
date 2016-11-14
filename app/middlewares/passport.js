let passport = require('passport')
let wrap = require('nodeifyit')
let User = require('../models/user')
let LocalStrategy = require('passport-local').Strategy
let uuid = require('node-uuid')
async function localAuthHandler(req, username, password, done) {
  let user = await User.promise.findOne({ 'username': username})
  if (!user || username !== user.username) {
    return [false, {message: 'Invalid username'}]
  }

  if (!await user.validatePassword(password)) {
    return [false, {message: 'Invalid password'}]
  }
  user.token = await user.generateToken()
  return user.save()
}

async function localSignupHandler(req, username, password, done) {
  username = (username || '').toLowerCase()

  if(req.body.password_confirmation != password){
    return [false, {message: 'password not match'}]
  }
  // Is the email taken?
  if (await User.promise.findOne({'username': username})) {
    return [false, {message: 'That username is already taken.'}]
  }

  if(!(await User.promise.validatorPassword(password))){
    return [false, {message: 'password have to least 1 uppercase ,1 lowercase letter and 1 number.'}]
  }

  // create the user
  let user = new User()

  user.username = username
  // Use a password hash instead of plain-text
  user.password = await user.generateHash(password)
  user.uuid = uuid.v4()
  // req.flash('success', 'Login success')
  return await user.save()
}



// async function localLoginHandler(email,password){
//   email = (email || '').toLowerCase()
//   if (! (await User.promise.findOne({email})) ) {
//     return [false, {message: 'email not exists'}]
//   }
//   let password_hash = await user.generateHash(password)
//   if(await user.password === password_hash){
//     return [true, {message: `user ${email} login success`}]
//   }
//   return [false, {message: 'password or username incorrect'}]
// }

function configure(CONFIG) {
  // Required for session support / persistent login sessions
  passport.serializeUser(wrap(async (user) => user._id))
  passport.deserializeUser(wrap(async (id) => {
    return await User.promise.findById(id)
  }))

  /**
   * Local Auth
   */
  // let localStrategy = new LocalStrategy({
  //   usernameField: 'email', // Use "email" instead of "username"
  //   failureFlash: true // Enable session-based error logging
  // }, wrap(localAuthHandler, {spread: true}))
  let localSignupStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    password_confirmationField: 'password_confirmation',
    failureFlash: true,
    session: false,
    passReqToCallback: true
  }, wrap(localSignupHandler, {spread: true}))

  let localLoginStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    failureFlash: true,
    session: false,
    passReqToCallback: true
  }, wrap(localAuthHandler, {spread: true}))

  // passport.use(localLoginStrategy)
  passport.use('local-login', localLoginStrategy)
  passport.use('local-signup', localSignupStrategy)
 
  /**
   * 3rd-Party Auth
   */

  // loadPassportStrategy(LinkedInStrategy, {...}, 'linkedin')
  // loadPassportStrategy(FacebookStrategy, {...}, 'facebook')
  // loadPassportStrategy(GoogleStrategy, {...}, 'google')
  // loadPassportStrategy(TwitterStrategy, {...}, 'twitter')

  return passport
}

module.exports = {passport, configure}
