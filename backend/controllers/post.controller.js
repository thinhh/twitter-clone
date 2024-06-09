import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import {v2 as cloudinary} from 'cloudinary';
export const createPost = async (req, res) =>{
    try {
        const {text} = req.body;
        let {img} = req.body;
        const userId  = req.user._id.toString();
        const user= await User.findById(userId);
        if(!user) return res.status(404).json({error: 'User not found'});
        if (!text && !img) {
            return res.status(400).json({error: 'Post must have at least text or image'});
        }
        if(img) {
            const uploadedResponse = await cloudinary.uploader.upload(img);
            img = uploadedResponse.secure_url;
        }
        const newPost =  new Post({
            user: userId,
            text, 
            img,
        })
        await newPost.save();
        return res.status(201).json({message: "successfully create post"});
        
    } catch (error) {
           console.log("Error in createPost controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
    
}

export const deletePost= async(req,res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        } 
        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: "Not authorized to delete this post"});
        }
        if(post.img){
            const imgId = post.img.split("/").pop().split('.')[0];
            await cloudinary.uploader.destroy(imgId);
        }
        await Post.deleteOne(post);
        return res.status(200).json({message: 'Successfully delete post'});
    } catch (error) {
        console.log("Error in deletePost controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
   
}

export const commentPost= async(req, res) => {
    
    try {
        const {text}= req.body;
        const postId = req.params.id;
        const userId= req.user._id;
        if(!text) {
            return res.status(400).json({error: "Text field is required"});
        } 
        const post = await Post.findById(postId);
        if(!post){
            return res.status(404).json({error: 'Post not found'});
        }
        const comment = {
            user: userId, 
            text,
        }
        post.comments.push(comment);
        await post.save();
        return res.status(200).json({message: 'Successfully post a comment'});
    } catch (error) {
        console.log("Error in commentPost controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}

export const likePost= async (req, res) => {
    try {
        const { id: postId } = req.params;
        const userId= req.user._id;
        let post = await Post.findById(postId);
        if(!post) {return res.status(404).json({error: 'Post not found'});} 

        const isLike= post.likes.includes(userId);
        if(isLike){
            await Post.updateOne({_id: postId}, {$pull: {likes : userId}});
            await User.updateOne({_id: userId}, {$pull: {likedPosts: postId}});
            res.status(200).json({message: 'Successfully unlike post'});
        }
        else {
            await Post.updateOne({_id: postId}, {$push: {likes : userId}});
            await User.updateOne({_id: userId}, {$push: {likedPosts: postId}});
            const newNotification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await newNotification.save();
            res.status(200).json({message: 'Successfully like post'});
        }
    } catch (error) {
        console.log("Error in likePost controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}

export const getAllPost= async(req, res) => {
    try {
        const posts = await Post.find().sort({createAt: -1}).populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: "comments.user",
            select: '-password',
        });
        if(posts.length === 0 ){
            return res.status(200).json([])
        }
        res.status(200).json(posts);
    } catch (error) {
        console.log("Error in getAllPost controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}
export const getLikePosts= async(req, res) =>{
        const userId = req.params.userId;
    try {
        const user= await User.findById(userId);
        if(!user) return res.status(404).json({error: 'User not found'});
        const likedPosts = await Post.find({_id: {$in: user.likedPosts}}).populate({
            path: 'user',
            select: '-password',
        }).populate({
            path: 'likes', 
            select:"-password",
        })
        return res.status(200).json(likedPosts);

    } catch (error) {
        console.log("Error in getLikePosts controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}

export const getFollowPosts= async (req, res) => {
    try {
        const following = req.user.following
        const followPosts= await Post.find({user: {$in : following}}).sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });;
    
        return res.status(200).json(followPosts)
    } catch (error) {
        console.log("Error in getFollowPosts controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}

export const getUserPosts= async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({username});
        if (!user) return res.status(404).json({ error: "User not found" });
        const posts = await Post.find({user: user._id}).sort({ createdAt: -1 })
        .populate({
            path: "user",
            select: "-password",
        })
        .populate({
            path: "comments.user",
            select: "-password",
        });
        return res.status(200).json({posts});
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error.message);
        return res.status(500).json({error: error.message});
    }
}