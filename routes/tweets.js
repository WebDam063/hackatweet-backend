var express = require('express');
var router = express.Router();

require('../models/connection');
const Tweet = require('../models/tweets');
const { checkBody } = require('../modules/checkBody');

router.post('/newtweet', (req, res) => {
  if (!checkBody(req.body, ['message'])) {
    res.json({ result: false, error: 'Please type at least 1 character.'});
    return;
  }

      const newTweet = new Tweet({
        username: "JohnDoe",
        text: req.body.message,
        likes: 22,
        hashtags: ['#HackaTweet', '#TropCool']
      });

      newTweet.save().then(newDoc => {
        res.json({ result: true, tweet: newDoc });
      });
});

module.exports = router;
