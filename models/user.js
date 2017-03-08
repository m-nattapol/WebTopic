let mongoose                = require('mongoose'),
    passportLocalMongoose   = require('passport-local-mongoose'),
    Schema                  = mongoose.Schema

let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    tel: String
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['email']
})

module.exports = mongoose.model('User', userSchema)
