var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');

router.post('/newtweet', (req, res) => {
  if (!checkBody(req.body, ['message'])) {
    res.json({ result: false, error: 'Please type at least 1 character.' });
    return;
  }

  const { username, message, hashtags, firstname } = req.body

  console.log({ username, message, hashtags });


  const newTweet = new Tweet({
    username,
    firstname,
    text: message,
    likes: 0,
    hashtags
  });

  newTweet.save().then(newDoc => {
    res.json({ result: true, tweet: newDoc });
  });
});

router.post('/gettweets', (req, res) => {
console.log(req.body)
  if(!checkBody(req.body, ['user'])){
    res.json({result: false, error: 'Login or register'})
    return;
  }
  const user = req.body.user;

    Tweet.find({username: user.username}).then((data) => {
      res.json({data})
    })
})

module.exports = router;
