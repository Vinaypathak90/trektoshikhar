import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import {
  getBlogData,
  getAdminBlogData,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  togglePostStatus,
  togglePostFeatured,
  updateBlogSettings,
  resetBlogs
} from '../controllers/blogController.js';

const router = express.Router();

// GET /api/blogs - Fetch live public blog posts & hero settings
router.get('/', getBlogData);

// GET /api/blogs/admin/all - Fetch all posts (including drafts) for Admin (Protected)
router.get('/admin/all', requireAdminAuth, getAdminBlogData);

// PUT /api/blogs/settings - Update 100vh Hero slides, headings & copy (Protected)
router.put('/settings', requireAdminAuth, updateBlogSettings);

// POST /api/blogs/reset - Reset to defaults (Protected)
router.post('/reset', requireAdminAuth, resetBlogs);

// POST /api/blogs - Create a new trail journal (Protected)
router.post('/', requireAdminAuth, createPost);

// GET /api/blogs/:slug - Get a single journal by slug (must come after specific subroutes)
router.get('/:slug', getPostBySlug);

// PUT /api/blogs/:id - Update existing journal (Protected)
router.put('/:id', requireAdminAuth, updatePost);

// DELETE /api/blogs/:id - Delete journal (Protected)
router.delete('/:id', requireAdminAuth, deletePost);

// PATCH /api/blogs/:id/status - Toggle published / draft (Protected)
router.patch('/:id/status', requireAdminAuth, togglePostStatus);

// PATCH /api/blogs/:id/featured - Toggle spotlight or homepage featured (Protected)
router.patch('/:id/featured', requireAdminAuth, togglePostFeatured);

export default router;
