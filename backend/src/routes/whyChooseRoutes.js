import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import {
  getWhyChooseSection,
  updateWhyChooseSection,
  resetWhyChooseSection
} from '../controllers/whyChooseController.js';

const router = express.Router();

// GET /api/why-choose - Fetch global Why Choose TrekToShikhar section & stats
router.get('/', getWhyChooseSection);

// PUT /api/why-choose - Update section config & stats from Admin Dashboard (Protected)
router.put('/', requireAdminAuth, updateWhyChooseSection);

// POST /api/why-choose/reset - Reset to defaults (Protected)
router.post('/reset', requireAdminAuth, resetWhyChooseSection);

export default router;
