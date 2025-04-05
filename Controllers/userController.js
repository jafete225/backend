import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js"
import Doctor from "../models/DoctorSchema.js"

// Atualizar usuário
export const updateUser = async (req, res) => {
    const id = req.params.id;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.status(200).json({ success: true, message: "Successfully updated", data: updatedUser });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update", error: err.message });
    }
};

// Deletar usuário
export const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Successfully deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete", error: err.message });
    }
};

// Buscar usuário específico
export const getSingleUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User found", data: user });
    } catch (err) {
        res.status(500).json({ success: false, message: "No user found", error: err.message });
    }
};

// Buscar todos os usuários
export const getAllUser = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.status(200).json({ success: true, message: "Users found", data: users });
    } catch (err) {
        res.status(404).json({ success: false, message: "Not found", error: err.message });
    }
};

export const getUserProfile = async(req, res) => {
    const userId = req.userId

    try{
        const user = await User.findById(userId)

        if (!user) {
            return (
                res.status(404)
                .json({success:false,
                    message:'User not found'
                })
            )
        }

        const {password, ...rest} = user._doc

        res
        .status(200)
        .json({success:true,
            message:"Profile info is getting",
            data:{...rest}
        })

    }catch (err) {
        res
        .status(500)
        .json({success:false, 
            message:"Something went wrong, cannot get"
        });
    }
};

export const getMyAppointments = async(req, res) => {
    try {
        //step -1 : retrieve appointement from booking for specifc user
    const booking = await Booking.find({user: req.userId});

    //step -2 : exprsct doctor ids appointement from booking
    const doctorIds = booking.map(el => el.doctor.id);
    
    //step -3 : retrieve doctors using doctor ids
    const doctors =  await Doctor.find({_id: {$in: doctorIds }}).select(
        "-password"
    );

    res
        .status(200)
        .json({success:true,
            message:"Profile info is getting",
            data: doctors
        })
    } catch (err) {
        res
        .status(500)
        .json({success:false, 
            message:"Something went wrong, cannot get"
        });
    }

}
