let express = require('express'),
    User    = require('../models/user'),
    router  = express.Router()

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

module.exports = router
