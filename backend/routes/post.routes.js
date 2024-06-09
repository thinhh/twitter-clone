import express from 'express';

import { protectedRoute } from '../middleware/protectedRoute.js';
import {commentPost, createPost, deletePost, likePost, getAllPost, getLikePosts, getFollowPosts, getUserPosts} from '../controllers/post.controller.js'
const router = express.Router();
// GET METHOD
router.get("/all-post", protectedRoute, getAllPost); 
router.get("/get-user-post/:username", protectedRoute, getUserPosts);
router.get("/like-post/:userId", protectedRoute, getLikePosts);
router.get("/following-post", protectedRoute, getFollowPosts)
// POST METHOD
router.post("/create-post", protectedRoute, createPost);
router.post("/like-post/:id", protectedRoute, likePost)
router.post("/comment-post/:id", protectedRoute, commentPost);
router.delete("/:id", protectedRoute, deletePost)
export default router;