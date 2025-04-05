import express from "express";
import { updateUser,
     deleteUser,
      getSingleUser,
       getAllUser,
       getUserProfile,
       getMyAppointments
     } from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

// Rota para buscar todos os usuários
router.get('/', authenticate, restrict(["patient"]), getAllUser);

// Rota para buscar um único usuário por ID
router.get('/:id', authenticate, restrict(["admin"]), getSingleUser);

// Rota para atualizar um usuário
router.put('/:id', authenticate, restrict(["patient"]), updateUser);

// Rota para deletar um usuário
router.delete('/:id', authenticate, restrict(["patient"]), deleteUser);

// Rota para deletar um usuário
router.get('/profile/me', authenticate, restrict(["patient"]), getUserProfile);

// Rota para deletar um usuário
router.get('/appointments/my-appointments', authenticate, restrict(["patient"]), getMyAppointments);

export default router;
