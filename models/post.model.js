const mongoose = require('mongoose');


const postScehma = mongoose.Schema({
    user: { type: Object, ref: 'User' },
    text: String,
    image: String,
    createdAt: Date,
    likes: [{ type: Object, ref: 'User' }],
    comments: [{
        user: { type: Object, ref: 'User' },
        text: String,
        createdAt: Date
    }]
});


const PostModel = mongoose.model('post',postScehma);

module.exports = {
    PostModel
}