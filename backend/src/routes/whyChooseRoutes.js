import express from 'express';
import {
  getWhyChooseSection,
  updateWhyChooseSection,
  resetWhyChooseSection
} from '../controllers/whyChooseController.js';

const router = express.Router();

// GET /api/why-choose - Fetch global Why Choose TrekToShikhar section & stats
router.get('/', getWhyChooseSection);

// PUT /api/why-choose - Update section config & stats from Admin Dashboard
router.put('/', updateWhyChooseSection);

// POST /api/why-choose/reset - Reset to defaults
router.post('/reset', resetWhyChooseSection);

export default router;
