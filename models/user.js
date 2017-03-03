let mongoose                = require('mongoose'),
    Schema                  = mongoose.Schema,
    passportLocalMongoose   = require('passport-local-mongoose')

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
    tel: Number
})

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email',
    usernameQueryFields: ['email']
})

module.exports = mongoose.model('User', userSchema)
