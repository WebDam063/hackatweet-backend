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
//console.log(req.body)
  if(!checkBody(req.body, ['user'])){
    res.json({result: false, error: 'Login or register'})
    return;
  }
  const user = req.body.user;

    Tweet.find({username: user.username}).then((data) => {
      res.json({data})
    })
})

router.post('/trend', async (req, res) => {
  if (!checkBody(req.body, ['username'])) {
    res.json({ result: false, error: 'Login or register' })
    return;
  }
  const { username } = req.body;
  console.log(username);

  const hashtags = await Tweet.aggregate([
    { $match: { username: username } },
    { $unwind: "$hashtags" },
    { $group: { _id: "$hashtags", count: { $sum: 1 } } },
  ])

  res.json({ result: true, hashtags })
})

router.post('/like', (req, res) => {
  if(!checkBody(req.body, ['tweetId'])) {
    res.json({result: false, error: 'No tweet to like'})
    return;
  }

  const {tweetId} = req.body;
  
    Tweet.updateOne({_id: tweetId}, { $inc: {likes: 1} })
    .then(response => {
      res.json({ response })
    })

})
module.exports = router;
