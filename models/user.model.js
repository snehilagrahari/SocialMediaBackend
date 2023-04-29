const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    bio: String,
    posts: [{ type: Object, ref: 'Post' }],
    friends: [{ type: Object, ref: 'User' }],
    friendRequests: [{ type: Object, ref: 'User' }]
},{
    versionKey  : false
});


const UserModel = mongoose.model('user',userSchema);

module.exports = {
    UserModel
}