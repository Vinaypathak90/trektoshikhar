import express from 'express';
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

// PUT /api/reviews/settings - Update section header settings (EXCELLENT, stars, count)
router.put('/settings', updateReviewsSettings);

// PUT /api/reviews/reorder - Reorder review cards
router.put('/reorder', reorderReviews);

// POST /api/reviews/reset - Reset settings & reviews to defaults
router.post('/reset', resetReviews);

// POST /api/reviews - Create a new review card
router.post('/', createReview);

// PUT /api/reviews/:id - Update a review card
router.put('/:id', updateReview);

// DELETE /api/reviews/:id - Delete a review card
router.delete('/:id', deleteReview);

export default router;
