import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware";
import { solicitarAssociacaoCuidador, confirmarAssociacao, listarPacientesVinculados, getMedicoesPaciente, gerarRelatorioPDF, removerCuidador } from "../Controllers/cuidadorController";

const router = Router();

router.post("/associacao/solicitar", authenticateToken, solicitarAssociacaoCuidador);
router.post("/associacao/confirmar", confirmarAssociacao);
router.get("/associacao/pacientes", authenticateToken, listarPacientesVinculados);
router.get("/:pacienteId", authenticateToken, getMedicoesPaciente);
router.get("/:pacienteId/pdf", authenticateToken, gerarRelatorioPDF);
router.delete("/associacao/remover", authenticateToken, removerCuidador);
export default router;
