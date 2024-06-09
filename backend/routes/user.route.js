import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import {getUserProfile, followUnfollowUser, updateUser, getSuggestedUsers} from '../controllers/user.controller.js';
const router = express.Router();

router.get("/profile/:username", protectedRoute, getUserProfile);
router.get("/suggested", protectedRoute, getSuggestedUsers);
router.post("/follow/:id", protectedRoute, followUnfollowUser);
router.post("/update", protectedRoute, updateUser)
export default router;