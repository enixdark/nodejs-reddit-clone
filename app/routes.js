let isLoggedIn = require('./middlewares/isLoggedIn')
let setHeader = require('./middlewares/setHeader')

let R = require('ramda')
let then = require('express-then')
let Post = require('./models/post')
module.exports = (app) => {
  let passport = app.passport
  let scope = ['email','user_posts','publish_actions']

  app.get('/', (req, res) => {
    res.render('index.ejs', {message: req.flash('error'), user: req.user })
  })

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }))
  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  app.get('/post', isLoggedIn, (req, res) => {
    res.render('post.ejs', {
      user: req.user,
      message: req.flash('error')
    })
  })

  app.post('/post', isLoggedIn, (req, res) => {
    debugger
    let post = new Post({user_id: req.user.id, title: req.body.title, content: req.body.content})
    post.save()
    res.redirect('/')
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
  })

  app.get('/login', (req, res) => {
      res.render('login.ejs', {message: req.flash('error')})
  })

  app.get('/signup', (req, res) => {
    res.render('signup.ejs', {message: req.flash('error') })
  })

 
  return passport 

}
