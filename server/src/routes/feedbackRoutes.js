import express from 'express';
import { 
  getFeedbacks, 
  getFeedbackById, 
  createFeedback, 
  updateFeedback, 
  deleteFeedback,
  responderFeedback 
} from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/', getFeedbacks);
router.get('/:id', getFeedbackById);
router.post('/', createFeedback);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);
router.post('/:id/responder', responderFeedback);

export default router; 