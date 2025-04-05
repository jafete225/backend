import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

// Atualizar médico
export const updateDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ success: false, message: "Médico não encontrado" });
        }

        res.status(200).json({ success: true, message: "Médico atualizado com sucesso", data: updatedDoctor });
    } catch (err) {
        res.status(500).json({ success: false, message: "Falha ao atualizar médico", error: err.message });
    }
};

// Deletar médico
export const deleteDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        
        if (!deletedDoctor) {
            return res.status(404).json({ success: false, message: "Médico não encontrado" });
        }

        res.status(200).json({ success: true, message: "Médico deletado com sucesso" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Falha ao deletar médico", error: err.message });
    }
};

// Buscar médico específico
export const getSingleDoctor = async (req, res) => {
    const id = req.params.id;

    try {
        const doctor = await Doctor.findById(id)
            .populate("reviews")
            .select("-password");

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Médico não encontrado" });
        }

        res.status(200).json({ success: true, message: "Médico encontrado", data: doctor });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erro ao buscar médico", error: err.message });
    }
};

// Buscar todos os médicos
export const getAllDoctor = async (req, res) => {
    try {
        const searchQuery = req.query.query || "";
        let doctors;

        if (searchQuery) {
            doctors = await Doctor.find({
                isApproved: 'approved',
                $or: [
                    { name: { $regex: searchQuery, $options: "i" } },
                    { specialization: { $regex: searchQuery, $options: "i" } },
                ],
            });
        } else {
            doctors = await Doctor.find({ isApproved: 'approved' }).select("-password");
        }

        res.status(200).json({ success: true, message: "Médicos encontrados", data: doctors });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erro ao buscar médicos", error: err.message });
    }
};

// Buscar perfil do médico
export const getDoctorProfile = async (req, res) => {
    const userId = req.userId;

    if (!userId) {
        return res.status(400).json({ success: false, message: "ID do usuário está faltando" });
    }

    try {
        const doctor = await Doctor.findById(userId);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Médico não encontrado" });
        }

        const { password, ...rest } = doctor._doc;
        const appointments = await Booking.find({ doctor: userId });

        res.status(200).json({
            success: true,
            message: "Perfil do médico recuperado com sucesso",
            data: { ...rest, appointments },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Erro ao recuperar perfil", error: err.message });
    }
};
