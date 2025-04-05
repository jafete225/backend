import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

export const getCheckOutSessions = async (req, res) => {
  try {
    // Removido o appointmentDate da requisição
    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

    if (!doctor || !user) {
      return res.status(404).json({
        success: false,
        message: "Usuário ou médico não encontrado"
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: `Consulta com Dr. ${doctor.name}`,
            description: doctor.specialization,
            images: doctor.photo ? [doctor.photo] : []
          },
          unit_amount: doctor.ticketPrice * 100,
        },
        quantity: 1,
      }],
    });

    // Remover o appointmentDate ao criar o agendamento
    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
      status: "pending"
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Sessão de pagamento criada",
      sessionId: session.id
    });

  } catch (err) {
    console.error("Erro no checkout:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Erro ao criar sessão de pagamento"
    });
  }
};

export const getUserAppointments = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (err) {
    console.error("Erro ao buscar agendamentos:", err);
    res.status(500).json({
      success: false,
      message: "Erro ao buscar agendamentos"
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Agendamento não encontrado"
      });
    }

    res.status(200).json({
      success: true,
      message: "Agendamento cancelado",
      data: booking
    });
  } catch (err) {
    console.error("Erro ao cancelar agendamento:", err);
    res.status(500).json({
      success: false,
      message: "Erro ao cancelar agendamento"
    });
  }
};
