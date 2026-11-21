import express from 'express';
import {
  loginWithPassword,
  loginWithGoogle,
  sendSupabaseOtp,
  verifySupabaseOtp,
  getCurrentAdmin,
  logoutAdmin
} from '../controllers/authController.js';

const router = express.Router();

// 1. Password login (Direct credentials)
router.post('/login', loginWithPassword);

// 2. Google OAuth 2.0 (Strictly whitelisted to 2 admins)
router.post('/google', loginWithGoogle);

// 3. Supabase OTP (Email 6-digit code)
router.post('/otp/send', sendSupabaseOtp);
router.post('/otp/verify', verifySupabaseOtp);

// 4. Session inspection & logout
router.get('/me', getCurrentAdmin);
router.post('/logout', logoutAdmin);

export default router;
