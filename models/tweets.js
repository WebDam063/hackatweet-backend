const mongoose = require('mongoose');

const tweetSchema = mongoose.Schema({
  username: String,
  text: String,
  likes: Number,
  hashtags: [String]
});

const Tweet = mongoose.model('tweets', tweetSchema);

module.exports = Tweet;