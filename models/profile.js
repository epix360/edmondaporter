const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const ProfileSchema = new Schema({
    name: {
        type: String
    },
    pname: {
        type: String
    },
    image: {
        type: String,
    },
    filename: {
        type: String
    },
    imageIds: {
        type: Array
    },
    bio: {
        type: String
    },
    blogPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'BlogPost'
        }
    ],
    publications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Publication'
        }
    ],
    links: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Link'
        }
    ],
    homes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Home'
        }
    ]
})

ProfileSchema.plugin(passportLocalMongoose);

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;