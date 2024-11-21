const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  username: String,
  firstname: String,
  text: String,
  likes: Number,
  hashtag: [String]
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;