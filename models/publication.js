const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const PublicationSchema = new Schema({
    content: {
        type: String
    },
    imageIds: {
        type: Array
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },
})

PublicationSchema.plugin(passportLocalMongoose);

const Publication = mongoose.model('Publication', PublicationSchema);

module.exports = Publication;