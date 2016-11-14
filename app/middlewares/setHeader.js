let then = require('express-then')
module.exports = (app) => {
  return then(async (req, res, next) => {
    
    return next()
  })
}
