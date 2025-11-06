import { Router, Response } from "express";
import { login, register, logout } from "../Controllers/authController"
import { authenticateToken, AuthRequest, authorizePaciente } from "../middlewares/authMiddleware";


const router = Router();

//rota para registrar usuário
router.post("/register", register);

//rota de login
router.post("/login", login);

//rota de logout
router.post("/logout", logout);

//rota para validar token e retornar informações do usuário
router.get("/me", authenticateToken, (req: AuthRequest, res: Response) => {
    return res.status(200).json({
        message: "Usuário autenticado com sucesso.",
        authenticated: true,
        user: req.user
    });
});

export default router;