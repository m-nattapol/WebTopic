let express = require('express'),
    Topic   = require('../models/topic'),
    router  = express.Router()

function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({
            err: {
                name: "There are mistake!",
                message: "You need to authenticate"
            }
        })
    } else {
        next()
    }
}

router.route('/:topicId')

    // add new comment to topic
    .post(checkAuthenticated, (req, res) => {
        Topic
            .findByIdAndUpdate(
                req.params.topicId, {
                    $push: {
                        'comments': {
                            $each: [{
                                detail: req.body.newComment,
                                author: req.user._id
                            }],
                            $position: 0
                        }
                    }
                },
                (err, topic) => {
                    if (err) {
                        res.json({ err: err })
                    } else {
                        Topic
                            .findById(req.params.topicId)
                            .populate('comments.author')
                            .select('comments')
                            .slice('comments', [0, 1])
                            .exec((err, topic) => {
                                res.json({
                                    err: err,
                                    comment: topic.comments
                                })
                            })
                    }
                }
            )
    })

    // edit comment
    .put(checkAuthenticated, (req, res) => {
        Topic
            .update({
                '_id': req.params.topicId,
                'comments._id': req.body.id
            }, {
                $set : { 'comments.$.detail' : req.body.commentEdit }
            }, (err, topic) => {
                res.json({
                    err: err,
                    topic: topic
                })
            })
    })

    // delete comment
    .delete(checkAuthenticated, (req, res) => {
        Topic
            .findByIdAndUpdate(req.params.topicId, {
                $pull: { 'comments': { '_id': req.body.id } }
            }, (err) => {
                res.json({
                    err: err,
                    commentId: req.body.id
                })
            })
    })

// get comment list
router.get('/:topicId/:page/:skip/:back', (req, res) => {
        Topic
            .findById(req.params.topicId)
            .populate('comments.author')
            .select('comments')
            .slice('comments', [((req.params.page * 5) + parseInt(req.params.skip)) - parseInt(req.params.back), 5])
            .exec((err, topic) => {
                res.json({
                    err: err,
                    comments: topic.comments
                })
            })
    })


module.exports = router
