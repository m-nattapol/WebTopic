let mongoose    = require('mongoose'),
    Schema      = mongoose.Schema

let topicSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    detail: {
        type: String,
        required: true
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        detail: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Topic', topicSchema)
