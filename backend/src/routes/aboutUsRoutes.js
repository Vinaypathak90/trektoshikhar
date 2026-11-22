import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import {
  getAboutUsData,
  updateAboutUsSettings,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  reorderTeamMembers,
  resetAboutUs
} from '../controllers/aboutUsController.js';

const router = express.Router();

// GET /api/about-us - Fetch About Us settings + Meet The Team profiles
router.get('/', getAboutUsData);

// PUT /api/about-us/settings - Update About Us page content & editorial sections (Protected)
router.put('/settings', requireAdminAuth, updateAboutUsSettings);

// POST /api/about-us/reset - Reset About Us settings & team to defaults (Protected)
router.post('/reset', requireAdminAuth, resetAboutUs);

// PUT /api/about-us/team/reorder - Reorder team members (must come before :id) (Protected)
router.put('/team/reorder', requireAdminAuth, reorderTeamMembers);

// POST /api/about-us/team - Add a new team member (Protected)
router.post('/team', requireAdminAuth, createTeamMember);

// PUT /api/about-us/team/:id - Update a team member (Protected)
router.put('/team/:id', requireAdminAuth, updateTeamMember);

// DELETE /api/about-us/team/:id - Remove a team member (Protected)
router.delete('/team/:id', requireAdminAuth, deleteTeamMember);

export default router;
