import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import {signup, login, logout, getMe} from "../controllers/auth.controller.js";
const router = express.Router();

router.get('/me', protectedRoute, getMe)
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

export default router;