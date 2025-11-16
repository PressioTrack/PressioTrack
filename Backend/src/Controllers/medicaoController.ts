import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendHypertensionAlertEmail } from '../services/emailService';

const prisma = new PrismaClient();

export const inserirMedicao = async (req: AuthRequest, res: Response) => {
  try {
    const { sistolica, diastolica, observacao } = req.body;
    const usuarioId = Number(req.user?.id);

    if (!sistolica || !diastolica || !observacao) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    const dadosSaude = await prisma.dadosSaude.findUnique({
      where: { usuarioId },
    });

    const sistNormal = dadosSaude?.pressaoSistolicaNormal ?? 120;
    const diasNormal = dadosSaude?.pressaoDiastolicaNormal ?? 80;


    let status = "NORMAL";

    if (sistolica >= sistNormal + 15 || diastolica >= diasNormal + 10) {
      status = "HIPERTENSÃO";
    } else if (sistolica < sistNormal - 15 || diastolica < diasNormal - 10) {
      status = "BAIXA";
    }

    const novaMedicao = await prisma.medicao.create({
      data: {
        sistolica: Number(sistolica),
        diastolica: Number(diastolica),
        observacao,
        status,
        usuarioId,
      },
    });

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { email: true, nome: true }
    });

    if (status === "HIPERTENSÃO" && usuario?.email) {
      await sendHypertensionAlertEmail(
        usuario.email,
        usuario.nome,
        Number(sistolica),
        Number(diastolica)
      );
    }

    return res.status(201).json({
      message: "Medição registrada com sucesso.",
      medicao: novaMedicao,
    });

  } catch (error) {
    console.error("Erro ao cadastrar medição:", error);
    return res.status(500).json({ message: "Tente mais tarde!!" });
  }
};

export const buscarMedicoesDoUsuario = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user!.id;

  try {
    const medicoes = await prisma.medicao.findMany({
      where: { usuarioId },
      orderBy: { dataMedicao: 'desc' },
    });

    return res.status(200).json(medicoes);
  } catch (error) {
    console.error("Erro ao buscar medições:", error);
    return res.status(500).json({ message: "Erro ao buscar medições." });
  }
};

export const buscarMedicaoPorId = async (req: AuthRequest, res: Response) => {
  const usuarioId = req.user!.id;
  const medicaoId = Number(req.params.id);

  if (isNaN(medicaoId)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  try {
    const medicao = await prisma.medicao.findFirst({
      where: { id: medicaoId, usuarioId },
    });

    if (!medicao) {
      return res.status(404).json({ message: "Medição não encontrada." });
    }

    return res.status(200).json(medicao);
  } catch (error) {
    console.error("Erro ao buscar medição:", error);
    return res.status(500).json({ message: "Erro ao buscar medição." });
  }
};

export const deletarMedicao = async (req: AuthRequest, res: Response) => {
  const medicaoId = Number(req.params.id);
  const usuarioId = req.user!.id;

  if (isNaN(medicaoId)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  try {
    const medicao = await prisma.medicao.findFirst({
      where: { id: medicaoId, usuarioId },
    });

    if (!medicao) {
      return res.status(404).json({ message: "Medição não encontrada ou não pertence ao usuário." });
    }

    await prisma.medicao.delete({ where: { id: medicaoId } });

    return res.status(200).json({ message: "Medição deletada com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar medição:", error);
    return res.status(500).json({ message: "Tente novamente mais tarde." });
  }
};

export const atualizarMedicao = async (req: AuthRequest, res: Response) => {
  const medicaoId = Number(req.params.id);
  const usuarioId = req.user!.id;
  const { sistolica, diastolica, observacao } = req.body;

  if (isNaN(medicaoId)) {
    return res.status(400).json({ message: "ID inválido." });
  }

  if (!sistolica || !diastolica || !observacao) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios." });
  }

  try {
    const medicao = await prisma.medicao.findFirst({
      where: { id: medicaoId, usuarioId },
    });

    if (!medicao) {
      return res.status(404).json({ message: "Medição não encontrada ou não pertence ao usuário." });
    }

    const dadosSaude = await prisma.dadosSaude.findUnique({
      where: { usuarioId },
    });

    const sistNormal = dadosSaude?.pressaoSistolicaNormal ?? 120;
    const diasNormal = dadosSaude?.pressaoDiastolicaNormal ?? 80;

    let status = "NORMAL";

    if (sistolica >= sistNormal + 15 || diastolica >= diasNormal + 10) {
      status = "HIPERTENSÃO";
    } else if (sistolica < sistNormal - 15 || diastolica < diasNormal - 10) {
      status = "BAIXA";
    }

    const medicaoAtualizada = await prisma.medicao.update({
      where: { id: medicaoId },
      data: {
        sistolica: Number(sistolica),
        diastolica: Number(diastolica),
        observacao,
        status,
      },
    });

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { email: true, nome: true }
    });

    if (status === "HIPERTENSÃO" && usuario?.email) {
      await sendHypertensionAlertEmail(
        usuario.email,
        usuario.nome,
        Number(sistolica),
        Number(diastolica)
      );
    }

    return res.status(200).json({
      message: "Medição atualizada com sucesso!",
      medicao: medicaoAtualizada,
    });

  } catch (error) {
    console.error("Erro ao atualizar medição:", error);
    return res.status(500).json({ message: "Erro ao atualizar medição. Tente novamente." });
  }
};


