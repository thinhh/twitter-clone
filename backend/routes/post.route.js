import express from 'express';

import { protectedRoute } from '../middleware/protectedRoute.js';
import {commentPost, createPost, deletePost, likePost, getAllPost, getLikePosts, getFollowPosts, getUserPosts} from '../controllers/post.controller.js'
const router = express.Router();
// GET METHOD
router.get("/all", protectedRoute, getAllPost); 
router.get("/user/:username", protectedRoute, getUserPosts);
router.get("/likes/:userId", protectedRoute, getLikePosts);
router.get("/following", protectedRoute, getFollowPosts)
// POST METHOD
router.post("/create", protectedRoute, createPost);
router.post("/like/:id", protectedRoute, likePost)
router.post("/comment/:id", protectedRoute, commentPost);
router.delete("/:id", protectedRoute, deletePost)
export default router;