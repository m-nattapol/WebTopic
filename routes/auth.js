let express     = require('express'),
    passport    = require('passport'),
    User        = require('../models/user'),
    router      = express.Router()

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) { res.json({ err: err }) }

        if (user) {
            req.login(user, (err) => {
                if (err) { res.json({ err: err }) }
                else { res.json({ user: {
                    id: user._id,
                    name: `${user.name} ${user.lastname}`
                } }) }
            })
        } else {
            res.json({ err: {
                name: 'Authentication Fail',
                message: 'username or password incorrect.'
            } })
        }
    })(req, res, next)
})

router.post('/logout', (req, res, next) => {
    req.logout();
    res.json({ user: user })
})

module.exports = router
