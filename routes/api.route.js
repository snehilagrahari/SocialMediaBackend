const express = require('express');
const { UserModel } = require('../models/user.model');
const { PostModel } = require('../models/post.model');

const apiRouter = express.Router();

apiRouter.post('/register',async (req,res)=>{
    try{
        const {email, name, password, dob, bio } = req.body;
        const newUser = new UserModel({
            email, name, password, bio, dob
        });
        await newUser.save();
        res.send({message : 'Registaration successful'});
    }
    catch(err){
        res.send({message : err.message})
    }
})

apiRouter.get('/users',async (req,res)=>{
    try{
        const match = await UserModel.find({});
        res.send(match);
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.get('/users/:id/friends', async (req,res)=>{
    try{
        const {id} = req.params;
        const match = await UserModel.findById({_id : id});
        if(match.friends!==undefined){
            res.send(match.friends)
        }
        else{
            res.send({message : 'Id not found!'});
        }
    }
    catch(err){
        res.send({message : err.message})
    }
})

apiRouter.post('/users/:id/friends', async (req,res)=>{
    try{
        const {userId} = req.body;
        const {id} = req.params;
        const match = await UserModel.findById({_id : userId});
        const match2 = await UserModel.findById({_id : id});
        if(match2.name===undefined){
            res.send({message : 'Id not found!'});
            return;
        }
        const {friendRequests} = match2;
        for(let i=0;i<friendRequests.length;i++){
            if(friendRequests[i]._id === userId){
                res.send({message : 'Request Already Sent!'});
                return;
            }
        }
        friendRequests.push(match);
        await UserModel.findByIdAndUpdate({_id : id},{friendRequests});
        res.send({message : 'Friend Request Sent!'});
    }
    catch(err){
        res.send({message : err.message})
    }
})

apiRouter.patch('/users/:id/friends/:friendId', async(req,res)=>{
    try{
        const {id, friendId} = req.params;
        const {status} = req.body;
        const matchUser = await UserModel.findById({_id : id});
        const { friends, friendRequests} = matchUser;
        let t;
        for(let i=0;i<friendRequests.length;i++){
            if(friendRequests[i]._id===friendId){
                t = friendRequests[i];
                return;
            }
        }
        friendRequests.filter((el)=>el!==friendId);
        if(status==='accept'){
            friends.push(t);
            await UserModel.findByIdAndUpdate({_id : id},{friends, friendRequests})
            res.send({message : "Friend request accepted!"})
        }
        else{
            await UserModel.findByIdAndUpdate({_id : id},{friendRequests});
            res.send({message : "Friend request rejected"});
        }
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.get('/posts', async(req,res)=>{
    try{
        const data = await PostModel.find({});
        res.send(data);
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.post('/posts', async(req,res)=>{
    try{
        const {userId, text, image} = req.body;
        const createdAt = new Date();
        const newPost = new PostModel({user : userId, text, image, createdAt});
        await newPost.save();
        res.send({message : 'Posted Successfully'});
    }
    catch(err){
        res.send({message : err.message})
    }
})

apiRouter.patch('/posts/:id',async (req,res)=>{
    try{
        const {id} = req.params;
        const {text, image} = req.body;
        await PostModel.findByIdAndUpdate({_id : id}, {text, image});
        res.send({message : "Post Updated!"})
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.delete("/posts/:id", async (req,res)=>{
    try{
        const {id} = req.params;
        await PostModel.findByIdAndDelete({_id : id});
        res.send({message : 'Post Deleted!'});
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.post('/posts/:id/like', async (req,res)=>{
    try{
        const {userId} = req.body;
        const {id} = req.params;
        const matchPost = await PostModel.findById({_id : id});
        const matchUser = await UserModel.findById({_id : userId});
        let {likes} = matchPost;
        likes.push(matchUser);
        await PostModel.findByIdAndUpdate({_id : id},{likes});
        res.send({message : "Post Liked"});
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.post('/posts/:id/comment', async (req,res)=>{
    try{
        const {id} = req.params;
        const {userId, text} = req.body;
        const matchPost = await PostModel.findById({_id : id});
        const matchUser = await UserModel.findById({_id : userId});
        const {comments} = matchPost;
        const createdAt = new Date();
        comments.push({user : matchUser, text, createdAt});
        await PostModel.findByIdAndUpdate({_id : id},{comments});
        res.send({message : 'Comment Added to Post!'})
    }
    catch(err){
        res.send({message : err.message});
    }
})

apiRouter.get('/posts/:id',async (req,res)=>{
    try{
        const {id} = req.params;
        const match = await PostModel.find({_id : id});
        if(match.user === undefined){
            res.send({message : 'No Post Found!'});
            return;
        }
        res.send(match);
    }
    catch(err){
        res.send({message : err.message})
    }
})
module.exports = {
    apiRouter
}
