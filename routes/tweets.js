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
    Tweet.find().then((data) => {
      res.json({data})
    })
})

router.get('/trend', async (req, res) => {
  const hashtags = await Tweet.aggregate([
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
      Tweet.findById(tweetId).then(tweet => {
        res.json({  likes:tweet.likes })
      })

    })

})

router.post('/unlike', (req, res) => {
  if(!checkBody(req.body, ['tweetId'])) {
    res.json({result: false, error: 'No tweet to dislike'})
    return;
  }

  const {tweetId} = req.body;
  
    Tweet.updateOne({_id: tweetId}, { $inc: {likes: -1} })
    .then(response => {
      Tweet.findById(tweetId).then(tweet => {
        res.json({  likes:tweet.likes })
      })

    })

})

router.post('/deletetweets', async (req, res) => {
  if(!checkBody(req.body, ['tweetId'])){
    res.json({result: false, error: 'No tweet to delete'})
    return;
  }

  const {tweetId} = req.body
  const tweet = await Tweet.findOne({_id: tweetId});
  console.log('Tweet: ', tweet)

  Tweet.deleteOne({_id: tweetId}).then((response) => {
    console.log(response)
      res.json({tweet})
  });
})

router.post('/getHashtags', (req, res) => {
  // Vérifiez si le corps de la requête contient la propriété 'hashtag'
  if (!checkBody(req.body, ['hashTagSearch'])) {
    return res.json({ result: false, error: 'No Hashtag provided' });
  }

  const { hashTagSearch } = req.body;

  // Recherchez les tweets contenant le hashtag spécifié
  Tweet.find({ hashtags: { $in: [hashTagSearch] } })
    .then(tweets => {
      res.json({ result: true, tweets });
    })
});

module.exports = router;
