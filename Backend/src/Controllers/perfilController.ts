import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();

export const getPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: {
        dadosSaude: true,
        cuidador: {
          select: {
            id: true,
            nome: true,
            email: true,
          }
        }
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (!usuario.dadosSaude) {
      const dadosSaude = await prisma.dadosSaude.create({
        data: {
          usuarioId: userId,
          pressaoSistolicaNormal: 120,
          pressaoDiastolicaNormal: 80,
        },
      });
      usuario.dadosSaude = dadosSaude;
    }

    return res.json({ usuario });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro ao buscar perfil do usuário" });
  }
};


export const atualizarPerfil = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { nome, email, telefone, idade, pressaoSistolicaNormal, pressaoDiastolicaNormal, naoSeiPressao } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    if (!nome || !email || !telefone || idade === undefined || idade === null) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" });
    }

    const usuario = await prisma.usuario.update({
      where: { id: userId },
      data: { nome, email, telefone, idade },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        idade: true,
      },
    });

    const dadosExistentes = await prisma.dadosSaude.findUnique({
      where: { usuarioId: userId }
    });

    const sistolica = naoSeiPressao ? 120 : Number(pressaoSistolicaNormal);
    const diastolica = naoSeiPressao ? 80 : Number(pressaoDiastolicaNormal);

    if (dadosExistentes) {
      await prisma.dadosSaude.update({
        where: { usuarioId: userId },
        data: {
          pressaoSistolicaNormal: sistolica,
          pressaoDiastolicaNormal: diastolica,
          dataDefinicao: new Date(),
        },
      });
    } else {
      await prisma.dadosSaude.create({
        data: {
          usuarioId: userId,
          pressaoSistolicaNormal: sistolica,
          pressaoDiastolicaNormal: diastolica,
        },
      });
    }

    return res.json({ usuario, message: "Perfil atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    res.status(500).json({ message: "Erro ao atualizar perfil do usuário" });
  }
};
