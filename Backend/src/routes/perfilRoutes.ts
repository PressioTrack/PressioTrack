import { Router } from "express";
import { getPerfil, atualizarPerfil} from "../Controllers/perfilController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

router.get("/perfil", authenticateToken, getPerfil);

router.put("/atualizarPerfil", authenticateToken, atualizarPerfil);

export default router;
