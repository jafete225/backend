import express from 'express';
import { authenticate } from "../auth/verifyToken.js";
import { 
  getCheckOutSessions,
  getUserAppointments,
  cancelBooking
} from "../Controllers/bookingController.js";

const router = express.Router();

router.post("/checkout-session/:doctorId", authenticate, getCheckOutSessions);
router.get("/", authenticate, getUserAppointments);
router.delete("/:id", authenticate, cancelBooking);

export default router;