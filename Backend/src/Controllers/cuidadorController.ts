import { Response, Request } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";
import jwt from "jsonwebtoken";
import { sendCaregiverAssociationEmail } from "../services/emailService";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;

export const solicitarAssociacaoCuidador = async (req: AuthRequest, res: Response) => {
  try {
    const pacienteId = req.user!.id;
    const pacienteNome = req.user!.nome;
    const { cuidadorEmail } = req.body;

    if (!cuidadorEmail) {
      return res.status(400).json({ message: "E-mail do cuidador é obrigatório." });
    }

    const paciente = await prisma.usuario.findUnique({
      where: { id: pacienteId },
      select: { cuidadorId: true },
    });

    if (paciente?.cuidadorId) {
      return res.status(400).json({
        message: "Paciente já possui um cuidador vinculado.",
        cuidadorId: paciente.cuidadorId,
      });
    }

    const cuidador = await prisma.usuario.findUnique({
      where: { email: cuidadorEmail },
    });

    if (!cuidador) {
      return res.status(404).json({ message: "Cuidador não encontrado." });
    }

    const token = jwt.sign(
      { pacienteId, cuidadorId: cuidador.id },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    await sendCaregiverAssociationEmail({
      cuidadorEmail,
      cuidadorNome: cuidador.nome,
      cuidadorId: cuidador.id,
      pacienteId,
      pacienteNome,
      token,
    });

    return res.status(200).json({
      message: "Convite enviado ao cuidador com sucesso!"
    });

  } catch (error) {
    console.error("Erro ao solicitar associação:", error);
    return res.status(500).json({ message: "Erro interno. Tente novamente mais tarde." });
  }
};

export const confirmarAssociacao = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token é obrigatório." });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      pacienteId: number;
      cuidadorId: number;
    };

    const { pacienteId, cuidadorId } = decoded;

    await prisma.usuario.update({
      where: { id: pacienteId },
      data: {
        cuidadorId,
      }
    });

    return res.status(200).json({
      message: "Associação realizada com sucesso!",
      pacienteId
    });

  } catch (err) {
    console.error("Erro ao confirmar associação:", err);
    return res.status(400).json({ message: "Token inválido ou expirado." });
  }
};

export const listarPacientesVinculados = async (req: AuthRequest, res: Response) => {
  try {
    const cuidadorId = req.user!.id;

    const pacientes = await prisma.usuario.findMany({
      where: { cuidadorId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        idade: true,
      }
    });

    return res.status(200).json(pacientes);

  } catch (error) {
    console.error("Erro ao buscar pacientes:", error);
    return res.status(500).json({ message: "Erro ao carregar pacientes." });
  }
};

export const getMedicoesPaciente = async (req: AuthRequest, res: Response) => {
  try {
    const pacienteId = Number(req.params.pacienteId);

    const paciente = await prisma.usuario.findUnique({
      where: { id: pacienteId },
      select: { cuidadorId: true },
    });

    if (!paciente) {
      return res.status(404).json({ message: "Paciente não encontrado." });
    }

    if (paciente.cuidadorId !== req.user?.id) {
      return res.status(403).json({ message: "Você não tem permissão para acessar essas medições." });
    }

    const medicoes = await prisma.medicao.findMany({
      where: { usuarioId: pacienteId },
      orderBy: { dataMedicao: "desc" }
    });

    return res.status(200).json(medicoes);
  } catch (err) {
    console.error("Erro ao buscar medições:", err);
    return res.status(500).json({ message: "Erro ao carregar medições." });
  }
};

export const gerarRelatorioPDF = async (req: AuthRequest, res: Response) => {
  try {
    const pacienteId = Number(req.params.pacienteId);

    const paciente = await prisma.usuario.findUnique({
      where: { id: pacienteId },
      select: { nome: true, cuidadorId: true },
    });

    if (!paciente) return res.status(404).json({ message: "Paciente não encontrado." });
    if (paciente.cuidadorId !== req.user?.id) return res.status(403).json({ message: "Sem permissão." });

    const medicoes = await prisma.medicao.findMany({
      where: { usuarioId: pacienteId },
      orderBy: { dataMedicao: "desc" },
      take: 30,
    });

    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=relatorio_paciente_${pacienteId}.pdf`);

    doc.pipe(res);

    doc.fontSize(18).text(`Relatório de Medições - Paciente: ${paciente.nome}`, { align: "center" });
    doc.moveDown(2);

    medicoes.forEach((m, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${m.sistolica}/${m.diastolica} mmHg - ${m.status}`,
        { align: "left" }
      );
      doc.fontSize(10).text(`Data: ${new Date(m.dataMedicao).toLocaleString()}`, { align: "left" });
      if (m.observacao) doc.text(`Observação: ${m.observacao}`, { align: "left" });
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    return res.status(500).json({ message: "Erro ao gerar PDF." });
  }
};


export const removerCuidador = async (req: AuthRequest, res: Response) => {
  try {
    const pacienteId = req.user!.id;

    await prisma.usuario.update({
      where: { id: pacienteId },
      data: { cuidadorId: null },
    });

    return res.status(200).json({ message: "Cuidador desvinculado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao remover cuidador." });
  }
};

