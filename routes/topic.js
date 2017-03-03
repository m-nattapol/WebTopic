let express = require('express'),
    Topic = require('../models/topic'),
    router = express.Router()

function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({ err: {
            name: "There are mistake!",
            message: "You need to authenticate"
        } })
    } else {
        next()
    }
}

router.route('/')

    // add new topic
    .post(checkAuthenticated, (req, res) => {
        let newTopic = {
            title: req.body.title,
            detail: req.body.detail,
            author: req.user._id
        }

        Topic.create(newTopic, (err, topic) => {
            if (err) { res.json({ err: err }) }
            else {
                res.json({
                    topic: {
                        title: topic.title,
                        detail: topic.detail
                    }
                })
            }
        })
    })

module.exports = router
