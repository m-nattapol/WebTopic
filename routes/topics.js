let express = require('express'),
    Topic = require('../models/topic'),
    router = express.Router()

router.route('/')

    .post((req, res) => {
        Topic
            .find()
            .select('title detail author date')
            .populate('author')
            // .skip(req.body.)
            .limit(5)
            .sort({ date: -1 })
            .exec((err, topics) => {
                if (err) {
                    res.json({ err: err })
                } else {
                    res.json({ topics: topics })
                }
            })
    })

module.exports = router
