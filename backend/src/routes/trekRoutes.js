import express from 'express';
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
router.post('/', createTrek);
router.put('/reorder', reorderTreks);
router.put('/:id', updateTrek);
router.delete('/:id', deleteTrek);

export default router;
