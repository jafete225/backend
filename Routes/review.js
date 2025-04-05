import express from "express";
import { getAllReviews, createReview } from '../Controllers/reviewController.js';
import { authenticate, restrict } from '../auth/verifyToken.js';

const router = express.Router({ mergeParams: true });

/**
 * @route GET /api/v1/doctors/:id/reviews
 * @description Obter todas as avaliações de um médico específico
 * @access Public
 */
router.route('/')
    .get(getAllReviews)
    .post(
        authenticate, 
        restrict(['patient']), 
        createReview
    );

export default router;