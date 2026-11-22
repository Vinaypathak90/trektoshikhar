import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import {
  getContactPublic,
  getContactAdmin,
  updateContactSettings,
  createOffice,
  updateOffice,
  deleteOffice,
  submitInquiry,
  updateInquiryStatus,
  deleteInquiry,
  createFaq,
  updateFaq,
  deleteFaq
} from '../controllers/contactController.js';

const router = express.Router();

// ============================================================================
// PUBLIC ROUTES
// ============================================================================
router.get('/', getContactPublic);
router.post('/inquiries', submitInquiry);

// ============================================================================
// ADMIN PROTECTED ROUTES
// ============================================================================
router.get('/admin', requireAdminAuth, getContactAdmin);
router.put('/settings', requireAdminAuth, updateContactSettings);

// Offices CRUD
router.post('/offices', requireAdminAuth, createOffice);
router.put('/offices/:id', requireAdminAuth, updateOffice);
router.delete('/offices/:id', requireAdminAuth, deleteOffice);

// Inquiries Management
router.patch('/inquiries/:id/status', requireAdminAuth, updateInquiryStatus);
router.delete('/inquiries/:id', requireAdminAuth, deleteInquiry);

// FAQs CRUD
router.post('/faqs', requireAdminAuth, createFaq);
router.put('/faqs/:id', requireAdminAuth, updateFaq);
router.delete('/faqs/:id', requireAdminAuth, deleteFaq);

export default router;
