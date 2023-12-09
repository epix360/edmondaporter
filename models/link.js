const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const LinkSchema = new Schema({
    content: {
        type: String
    },
    imageIds: {
        type: Array
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

LinkSchema.plugin(passportLocalMongoose);

const Link = mongoose.model('Link', LinkSchema);

module.exports = Link;