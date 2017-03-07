let express     = require('express'),
    passport    = require('passport'),
    User        = require('../models/user'),
    router      = express.Router()

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

router.get('/', checkAuthenticated, (req, res) => {
    res.json({
        user: req.user._id
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) { res.json({ err: err }) }

        if (user) {
            req.login(user, (err) => {
                res.json({
                    err: err,
                    user: {
                        id: user._id,
                        name: user.name,
                        lastname: user.lastname,
                        email: user.email,
                        tel: user.tel
                    }
                })
            })
        } else {
            res.json({
                err: {
                    name: 'Authentication Fail',
                    message: 'username or password incorrect.'
                }
            })
        }
    })(req, res, next)
})

router.post('/logout', (req, res) => {
    req.logout();
    res.json({ user: req.user })
})

module.exports = router
