import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateToken = user => {
    return jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET_KEY, {
        expiresIn: '15d'  
    });
};

export const register = async (req, res) => {
    const { email, password, name, role, photo, gender } = req.body;

    try {
        let user = null;

        // Verificar se o usuário é paciente ou doutor
        if (role === 'patient') {
            user =  await User.findOne({ email });
        } else if (role === "doctor") {
            user =  await Doctor.findOne({ email });
        }

        // Verificar se o usuário já existe
        if (user) {
            return res.status(400).json({ message: 'Já tem está cadastrado.' });
        }

        // Gerar salt e hash da senha
        const salt = await bcrypt.genSalt(10); 
        const hashPassword = await bcrypt.hash(password, salt);

        // Criar novo usuário conforme o papel (role)
        if (role === 'patient') {
            user = new User({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            });
        }

        if (role === 'doctor') {
            user = new Doctor({
                name,
                email,
                password: hashPassword,
                photo,
                gender,
                role
            });
        }

        // Salvar usuário no banco de dados
        await user.save();

        res.status(200).json({ success: true, message: 'Conta criada com sucesso!' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Erro interno do servidor, tente mais tarde.' });
    }
};

export const login = async (req, res) => {
    const {email, } = req.body;
    
    try {
        // Verificar se o usuário é paciente ou doutor
        let user = null;
        const patient = await User.findOne({email});
        const doctor = await Doctor.findOne({email});

        if (patient) {
            user = patient;
        }
        if (doctor) {
            user = doctor;
        }

        // Verificar se o usuário existe
        if (!user) {
            return res.status(404).json({message: "Usuário não encontrado."});
        }

        // Comparar a senha
        const isPasswordMatch = await bcrypt.compare(
            req.body.password,
             user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({message: "Credencial inválida."});
        }

        // Gerar token
        const token = generateToken(user);

        const {password, role, appointments, ...rest} = user._doc || {};

        res.status(200).json({
            status: true,
            message: "Login realizado com sucesso",
            token,
            data: {...rest},
            role,
        });
    } catch (err) {
       res.status(500).json({status:false, message:"Falha ao logar"});
    }
};
