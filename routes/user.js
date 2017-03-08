let express = require('express'),
    User    = require('../models/user'),
    router  = express.Router()

function checkAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        res.json({
            err: {
                name: 'There are mistake!',
                message: 'You need to authenticate.'
            }
        })
    } else {
        next()
    }
}

router.route('/')

    // add new user
    .post((req, res, next) => {
        let newUser = {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            tel: req.body.tel
        }
        console.log(newUser);

        User.register(new User(newUser), req.body.password, (err, user) => {
            if (err) { res.json({ err: err }) }

            if (user) {
                req.login(user, (err) => {
                    res.json({
                        err: err,
                        user: {
                            id: user._id,
                            name: `${user.name} ${user.lastname}`
                        }
                    })
                })
            }
        })
    })

router.route('/:userId')

    // edit user profile
    .put(checkAuthenticated, (req, res) => {
        User
            .findByIdAndUpdate(req.params.userId, req.body, (err, user) => {
                console.log(user);
                res.json({
                    err: err,
                    user: {
                        id: user._id,
                        name: req.body.name,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        tel: req.body.tel
                    }
                })
            })
    })

router.route('/changepass/:userId')

    // change password
    .put(checkAuthenticated, (req, res) => {
        User.findById(req.params.userId, (err, user) => {
            if (err) {
                res.json({
                    err: err
                })
            }
            user.setPassword(req.body.newPass, (err, user) => {
                console.log(err);
                console.log(user);
                user.save()
                res.json({
                    err: err,
                    user: user
                })
            })
        })
    })

module.exports = router
