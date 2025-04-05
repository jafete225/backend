import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "approved", "cancelled"],
    default: "pending"
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  ticketPrice: {
    type: Number,
    required: true
  },
  session: {
    type: String,
  }
}, { 
  timestamps: true
});

// Auto-populate doctor and user data
BookingSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'doctor',
    select: 'name photo specialization'
  }).populate({
    path: 'user',
    select: 'name email photo gender'
  });
  next();
});

export default mongoose.model("Booking", BookingSchema);
