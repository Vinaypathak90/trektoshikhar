import express from 'express';
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

// PUT /api/hero-slides/reorder - Batch reorder slides (must come before /:id)
router.put('/reorder', reorderHeroSlides);

// GET /api/hero-slides/:id - Fetch single slide
router.get('/:id', getHeroSlideById);

// POST /api/hero-slides - Create new slide
router.post('/', createHeroSlide);

// PUT /api/hero-slides/:id - Update slide
router.put('/:id', updateHeroSlide);

// DELETE /api/hero-slides/:id - Delete slide
router.delete('/:id', deleteHeroSlide);

export default router;
