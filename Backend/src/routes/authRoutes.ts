import { Router, Response } from "express";
import { login, register, logout, forgotPassword, resetPassword, } from "../Controllers/authController"
import { authenticateToken, AuthRequest, authorizePaciente } from "../middlewares/authMiddleware";


const router = Router();

router.post("/register", register);

router.post("/login", login);

router.post("/logout", logout);

router.post('/forgot', forgotPassword); 

router.post('/reset', resetPassword);   

router.get("/me", authenticateToken, (req: AuthRequest, res: Response) => {
    return res.status(200).json({
        message: "Usuário autenticado com sucesso.",
        authenticated: true,
        user: req.user
    });
});

export default router;