module.exports = {
    development: {
        type: 'mongo',
        url: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reddit_example'
    }
}