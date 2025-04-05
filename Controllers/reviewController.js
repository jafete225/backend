import Review from '../models/ReviewSchema.js';
import Doctor from '../models/DoctorSchema.js';

// Obter todas as avaliações de um médico
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ doctor: req.params.id }).populate({
            path: "user",
            select: "name photo"  // Inclui apenas o nome e a foto do usuário
        });

        res.status(200).json({ 
            success: true, 
            message: "Reviews encontradas com sucesso", 
            data: reviews 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Falha ao buscar reviews",
            error: err.message 
        });
    }
};

// Criar uma nova avaliação
export const createReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const doctorId = req.params.id;

        if (!rating || !reviewText) {
            return res.status(400).json({ 
                success: false, 
                message: "Avaliação e comentário são obrigatórios" 
            });
        }

        const newReview = new Review({
            doctor: doctorId,
            user: req.userId,
            rating: Number(rating),
            reviewText
        });

        const savedReview = await newReview.save();

        // Atualizar o médico com a nova avaliação
        await Doctor.findByIdAndUpdate(doctorId, {
            $push: { reviews: savedReview._id }
        }, { new: true });

        res.status(201).json({ 
            success: true, 
            message: "Avaliação enviada com sucesso", 
            data: savedReview 
        });

    } catch (err) {
        res.status(500).json({ 
            success: false, 
            message: "Falha ao enviar avaliação",
            error: err.message 
        });
    }
};
