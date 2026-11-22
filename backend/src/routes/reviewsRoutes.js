import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import {
  getAllReviews,
  updateReviewsSettings,
  createReview,
  updateReview,
  deleteReview,
  reorderReviews,
  resetReviews
} from '../controllers/reviewsController.js';

const router = express.Router();

// GET /api/reviews - Fetch global header settings + review cards
router.get('/', getAllReviews);

// PUT /api/reviews/settings - Update section header settings (Protected)
router.put('/settings', requireAdminAuth, updateReviewsSettings);

// PUT /api/reviews/reorder - Reorder review cards (Protected)
router.put('/reorder', requireAdminAuth, reorderReviews);

// POST /api/reviews/reset - Reset settings & reviews to defaults (Protected)
router.post('/reset', requireAdminAuth, resetReviews);

// POST /api/reviews - Create a new review card (Protected)
router.post('/', requireAdminAuth, createReview);

// PUT /api/reviews/:id - Update a review card (Protected)
router.put('/:id', requireAdminAuth, updateReview);

// DELETE /api/reviews/:id - Delete a review card (Protected)
router.delete('/:id', requireAdminAuth, deleteReview);

export default router;
