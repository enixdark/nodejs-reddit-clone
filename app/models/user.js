let mongoose = require('mongoose')
let crypto = require('crypto')
let mongoosePaginate = require('mongoose-paginate')
// mongoosePaginate.paginate.options = { 
//   lean:  true,
//   limit: 20,
//   page: 3
// }
const PEPPER = 'salt'

let userSchema = mongoose.Schema({
  uuid: {type: String, default: null, required: true},
  username: {type: String, default: null, required: true},
  password: {
    type: String, 
    // min: [4, 'Too short, please password have to greater than 4 letters'],
    required: true,
    // validate: [passValidator, 'password have to least 1 uppercase ,1 lowercase letter and 1 number']
  },
  token: {type: String, default: null}
},
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)


function passValidator(password){
  return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/) == null ? false : true
}


userSchema.plugin(mongoosePaginate)

userSchema.methods.generateHash = async function(password) {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex')
}

userSchema.methods.validatePassword = async function(password, type = 'local') {
  let hash = await crypto.promise.pbkdf2(password, PEPPER, 4096, 512, 'sha256')
  return hash.toString('hex') === this[type].password
}

userSchema.methods.generateToken = async function() {
  return crypto.randomBytes(64).toString('hex')
}


let User = mongoose.model('User', userSchema)

User.promise.validatorPassword = async function(password){
  return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/) == null ? false : true
}

// userSchema.path('local.password').validate( (password) => {
//     return password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,}$/)
// },'password have to least 1 uppercase ,1 lowercase letter and 1 number')

module.exports = User
