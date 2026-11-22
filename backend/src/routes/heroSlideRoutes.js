import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { 
  getAllHeroSlides, 
  getHeroSlideById, 
  createHeroSlide, 
  updateHeroSlide, 
  deleteHeroSlide, 
  reorderHeroSlides 
} from '../controllers/heroSlideController.js';

const router = express.Router();

// GET /api/hero-slides - Fetch active slides (or ?admin=true for all)
router.get('/', getAllHeroSlides);

// PUT /api/hero-slides/reorder - Batch reorder slides (must come before /:id) (Protected)
router.put('/reorder', requireAdminAuth, reorderHeroSlides);

// GET /api/hero-slides/:id - Fetch single slide
router.get('/:id', getHeroSlideById);

// POST /api/hero-slides - Create new slide (Protected)
router.post('/', requireAdminAuth, createHeroSlide);

// PUT /api/hero-slides/:id - Update slide (Protected)
router.put('/:id', requireAdminAuth, updateHeroSlide);

// DELETE /api/hero-slides/:id - Delete slide (Protected)
router.delete('/:id', requireAdminAuth, deleteHeroSlide);

export default router;
