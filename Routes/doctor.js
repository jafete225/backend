import express from "express";
import { 
    updateDoctor, 
    deleteDoctor, 
    getSingleDoctor, 
    getAllDoctor, 
    getDoctorProfile 
} from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from './auth.js';  

const router = express.Router();

// Nested route for reviews
router.use("/:doctorId/reviews", reviewRouter);

// Route to get all doctors
router.get('/', getAllDoctor);

// Route to get a single doctor by ID
router.get('/:id', getSingleDoctor);

// Route to update a doctor (only for authenticated doctors)
router.put('/:id', authenticate, restrict(["doctor"]), updateDoctor);

// Route to delete a doctor (only for authenticated doctors)
router.delete('/:id', authenticate, restrict(["doctor"]), deleteDoctor);

// Route to get the profile of the logged-in doctor
router.get('/profile/me', authenticate, restrict(['doctor']), getDoctorProfile);

export default router;
