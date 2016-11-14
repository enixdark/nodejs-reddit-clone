let mongoose = require('mongoose')
let mongoosePaginate = require('mongoose-paginate')
mongoosePaginate.paginate.options = { 
  lean:  true,
  limit: 20
}

let postSchema = mongoose.Schema({
  user_id: {type: String, default: null, required: true},
  title: { type: String, required: true },
  content: {type: String, required: true},
  subreddit: {type: Array, default: []}
})


let Post = mongoose.model('Post', postSchema)


module.exports = Post
