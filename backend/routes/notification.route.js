import express from "express";
import { protectedRoute } from '../middleware/protectedRoute.js';
import { getAllNotifications, deleteAllNofications } from "../controllers/notification.controller.js";
const router = express.Router();
router.get('/', protectedRoute, getAllNotifications )
router.delete('/', protectedRoute, deleteAllNofications)
export default router;