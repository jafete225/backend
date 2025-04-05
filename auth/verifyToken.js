import jwt from 'jsonwebtoken';
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Nenhum token encontrado, autorização negada'
        });
    }

    try {
        // Remover o prefixo 'Bearer' e obter o token real
        const token = authHeader.split(' ')[1];

        // Verificar e decodificar o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Verificar se o usuário ou doutor existe no banco de dados
        const user = await User.findById(decoded.id) || await Doctor.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Autorização negada, usuário ou doutor não encontrado'
            });
        }

        // Adicionar os dados do usuário na requisição
        req.user = user;  // Armazena todo o objeto para facilitar o acesso
        req.userId = user._id;  // Manter compatibilidade com outras funções
        req.role = user.role;

        next();
    } catch (err) {
        console.error("Erro ao verificar o token:", err.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido ou expirado'
        });
    }
};

export const restrict = (roles) => async (req, res, next) => {
    try {
        const { user } = req;

        if (!user) {
            return res.status(401).json({ success: false, message: "Usuário não autenticado" });
        }

        if (!roles.includes(user.role)) {
            return res.status(403).json({ success: false, message: "Você não tem autorização" });
        }

        next();
    } catch (err) {
        console.error("Erro no middleware de restrição:", err.message);
        return res.status(500).json({ success: false, message: "Erro no servidor" });
    }
};
