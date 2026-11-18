import express from 'express';
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

// GET /api/blogs/admin/all - Fetch all posts (including drafts) for Admin
router.get('/admin/all', getAdminBlogData);

// PUT /api/blogs/settings - Update 100vh Hero slides, headings & copy
router.put('/settings', updateBlogSettings);

// POST /api/blogs/reset - Reset to defaults
router.post('/reset', resetBlogs);

// POST /api/blogs - Create a new trail journal
router.post('/', createPost);

// GET /api/blogs/:slug - Get a single journal by slug (must come after specific subroutes)
router.get('/:slug', getPostBySlug);

// PUT /api/blogs/:id - Update existing journal
router.put('/:id', updatePost);

// DELETE /api/blogs/:id - Delete journal
router.delete('/:id', deletePost);

// PATCH /api/blogs/:id/status - Toggle published / draft
router.patch('/:id/status', togglePostStatus);

// PATCH /api/blogs/:id/featured - Toggle spotlight or homepage featured
router.patch('/:id/featured', togglePostFeatured);

export default router;
