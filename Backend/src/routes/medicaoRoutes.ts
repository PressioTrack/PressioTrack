import { Router } from 'express';
import { inserirMedicao, buscarMedicoesDoUsuario, buscarMedicaoPorId, deletarMedicao, atualizarMedicao } from '../Controllers/medicaoController';
import {authenticateToken, AuthRequest} from "../middlewares/authMiddleware";
import { Response } from 'express';

const router = Router();

router.post('/inserir', authenticateToken, inserirMedicao);
router.get('/buscar', authenticateToken, buscarMedicoesDoUsuario);
router.get('/buscarUnica/:id', authenticateToken, buscarMedicaoPorId);
router.delete('/deletar/:id', authenticateToken, deletarMedicao);
router.put('/atualizar/:id', authenticateToken, atualizarMedicao); 

export default router;