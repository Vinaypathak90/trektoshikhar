import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
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

// PUT /api/gallery/settings - Update Gallery hero slides, headings & CTA (Protected)
router.put('/settings', requireAdminAuth, updateGallerySettings);

// POST /api/gallery/reset - Reset gallery to defaults (Protected)
router.post('/reset', requireAdminAuth, resetGallery);

// PUT /api/gallery/photos/reorder - Batch reorder photos (must come before :id) (Protected)
router.put('/photos/reorder', requireAdminAuth, reorderGalleryPhotos);

// POST /api/gallery/photos - Add a new photo (Protected)
router.post('/photos', requireAdminAuth, createGalleryPhoto);

// PUT /api/gallery/photos/:id - Update an existing photo (Protected)
router.put('/photos/:id', requireAdminAuth, updateGalleryPhoto);

// DELETE /api/gallery/photos/:id - Delete a photo (Protected)
router.delete('/photos/:id', requireAdminAuth, deleteGalleryPhoto);

export default router;
