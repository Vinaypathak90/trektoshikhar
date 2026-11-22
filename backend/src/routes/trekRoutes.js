import express from 'express';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import {
  getAllTreks,
  getTrekBySlug,
  createTrek,
  updateTrek,
  deleteTrek,
  reorderTreks
} from '../controllers/trekController.js';

const router = express.Router();

router.get('/', getAllTreks);
router.get('/:slug', getTrekBySlug);
router.post('/', requireAdminAuth, createTrek);
router.put('/reorder', requireAdminAuth, reorderTreks);
router.put('/:id', requireAdminAuth, updateTrek);
router.delete('/:id', requireAdminAuth, deleteTrek);

export default router;
