import express from 'express';
import {
  getGallery,
  updateGallerySettings,
  createGalleryPhoto,
  updateGalleryPhoto,
  deleteGalleryPhoto,
  reorderGalleryPhotos,
  resetGallery
} from '../controllers/galleryController.js';

const router = express.Router();

// GET /api/gallery - Fetch Gallery hero settings + expedition photos
router.get('/', getGallery);

// PUT /api/gallery/settings - Update Gallery hero slides, headings & CTA
router.put('/settings', updateGallerySettings);

// POST /api/gallery/reset - Reset gallery to defaults
router.post('/reset', resetGallery);

// PUT /api/gallery/photos/reorder - Batch reorder photos (must come before :id)
router.put('/photos/reorder', reorderGalleryPhotos);

// POST /api/gallery/photos - Add a new photo
router.post('/photos', createGalleryPhoto);

// PUT /api/gallery/photos/:id - Update an existing photo
router.put('/photos/:id', updateGalleryPhoto);

// DELETE /api/gallery/photos/:id - Delete a photo
router.delete('/photos/:id', deleteGalleryPhoto);

export default router;
