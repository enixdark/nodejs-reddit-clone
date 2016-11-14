let mongoose = require('mongoose')
let mongoosePaginate = require('mongoose-paginate')
// mongoosePaginate.paginate.options = { 
//   limit: 20,
//   page: 3
// }

let postSchema = mongoose.Schema({
  user_id: {type: String, default: null, required: true},
  title: { type: String, required: true },
  content: {type: String, required: true},
  subreddit: {type: Array, default: []}
},
  {timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }}
)

postSchema.plugin(mongoosePaginate)


let Post = mongoose.model('Post', postSchema)


module.exports = Post
