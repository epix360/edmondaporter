const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const HomeSchema = new Schema({
    heading: {
        type: String
    },
    image: {
        type: String
    },
    filename: {
        type: String
    },
    imageIds: {
        type: Array
    },
    content: {
        type: String
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    }
})

HomeSchema.plugin(passportLocalMongoose);

const Home = mongoose.model('Home', HomeSchema);

module.exports = Home;