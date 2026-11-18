import express from 'express';
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

// PUT /api/about-us/settings - Update About Us page content & editorial sections
router.put('/settings', updateAboutUsSettings);

// POST /api/about-us/reset - Reset About Us settings & team to defaults
router.post('/reset', resetAboutUs);

// PUT /api/about-us/team/reorder - Reorder team members (must come before :id)
router.put('/team/reorder', reorderTeamMembers);

// POST /api/about-us/team - Add a new team member
router.post('/team', createTeamMember);

// PUT /api/about-us/team/:id - Update a team member
router.put('/team/:id', updateTeamMember);

// DELETE /api/about-us/team/:id - Remove a team member
router.delete('/team/:id', deleteTeamMember);

export default router;
