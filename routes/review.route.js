import express from 'express';
import { verifyToken } from '../middleware/jwt.js';
import {
  createReview,
  getReviews,
  getallReviewsByproductId,
} from '../controllers/review.controller.js';

const router = express.Router();

//create new review route
router.post('/', verifyToken, createReview);

//view review relavernt addId route
router.get('/single/:id', getReviews);

//view allreview relavernt addId route
router.get('/:productId', getallReviewsByproductId);

export default router;
