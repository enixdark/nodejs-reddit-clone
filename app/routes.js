let isLoggedIn = require('./middlewares/isLoggedIn')
let setHeader = require('./middlewares/setHeader')

let R = require('ramda')
let then = require('express-then')
let Post = require('./models/post')
module.exports = (app) => {
  let passport = app.passport
  let scope = ['email','user_posts','publish_actions']

  app.get('/', async (req, res) => {
    let posts = await Post.paginate({}, { limit: 20, pages: 3 })
    console.log(posts.docs)
    res.render('index.ejs', {message: req.flash('error'), user: req.user, posts: posts.docs })
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
      post: new Post(),
      user: req.user,
      message: req.flash('error')
    })
  })

  app.post('/post', isLoggedIn, async (req, res) => {
    let post = new Post({user_id: req.user.uuid, title: req.body.title, content: req.body.content})
    await post.save()
    res.redirect('/')
  })

  app.get('/post/:uuid', isLoggedIn,async  (req, res) => {
    let post = await Post.findOne({ user_id: req.params.uuid })
    if(post){
      res.render('post.ejs', {
        post: post,
        user: req.user,
        message: req.flash('error')
      })
    }
    else{
      res.render('404.ejs')
    }
    
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
