const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
var slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const PostSchema = new Schema({
    title: {
        type: String
    },
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
    date: {
        type: Date,
        default: () => new Date()
    },
    slug: {
        type: String,
        slug: 'title',
        slugPaddingSize: 2,
        unique: true,
    }
});

PostSchema.plugin(passportLocalMongoose);
const BlogPost = mongoose.model('BlogPost', PostSchema);

module.exports = BlogPost;