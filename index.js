import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoute from "./Routes/auth.js";
import userRoute from "./Routes/user.js";
import doctorRoute from "./Routes/doctor.js";
import reviewRoute from "./Routes/review.js";
import bookingRoute from "./Routes/booking.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Configuração do CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || "https://hospital-odbzpegrm-jafetes-projects.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Conexão com o MongoDB
mongoose.set("strictQuery", false);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB conectado");
  } catch (err) {
    console.error("❌ Erro no MongoDB:", err.message);
    process.exit(1);
  }
};

// Rotas
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/doctors", doctorRoute);
app.use("/api/v1/doctors/:id/reviews", reviewRoute);
app.use("/api/v1/bookings", bookingRoute);

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message 
  });
});

// Rota de teste
app.get("/", (req, res) => {
  res.send("API está funcionando");
});

// Inicia servidor
app.listen(port, async () => {
  await connectDB();
  console.log(`🚀 Servidor rodando na porta ${port}`);
});