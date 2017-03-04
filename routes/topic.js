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
            res.json({
                err: err,
                topic: {
                    title: topic.title,
                    detail: topic.detail
                }
            })
        })
    })

router.route('/:topicId')

    // get topic content
    .get((req, res) => {
        Topic
            .findById(req.params.topicId)
            .populate('author')
            .select('title detail date author')
            .exec((err, topic) => {
                res.json({
                    err: err,
                    topic: topic
                })
            })
    })

    // edit topic content
    .put(checkAuthenticated, (req, res) => {
        Topic
            .findByIdAndUpdate(req.params.topicId, req.body, (err, topic) => {
                res.json({
                    err: err,
                    id: topic._id
                })
            })
    })

    // delete topic
    .delete(checkAuthenticated, (req, res) => {
        Topic.remove({_id: req.params.topicId}, (err, topic) => {
            res.json({
                err: err,
                id: topic._id
            })
        })
    })

module.exports = router
