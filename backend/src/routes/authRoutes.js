import express from 'express';
import {
  handleRegister,
  handleLogin,
  handleLogout,
  handleAutoLogin
} from "../controllers/authControllers.js";
import {protectRoute} from '../middleware/protectedRoute.js'

const router = express.Router();

router.post('/register', handleRegister);
router.post('/login', handleLogin);
router.post('/autologin', protectRoute, handleAutoLogin);
router.post('/logout', handleLogout);

export default router;
