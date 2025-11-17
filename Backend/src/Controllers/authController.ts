import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import * as crypto from 'crypto';
import { sendPasswordResetEmail, ADMIN_CONTACT_EMAIL } from '../services/emailService';
import { AuthRequest, authorizePaciente, authenticateToken } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION_MS = 24 * 60 * 60 * 1000;
const RESET_TOKEN_EXPIRATION_HOURS = 1;
const ACTIVATION_TOKEN_EXPIRATION_HOURS = 24;

export const register = async (req: Request, res: Response) => {
    const { nome, email, senha, perfil, telefone, idade } = req.body;

    const idadeNumber = Number(idade);
    if (!nome || !email || !senha || !perfil || !telefone || isNaN(idadeNumber)) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios e a senha deve conter no minímo 6 caracteres" })
    }
    if (senha.length < 6) {
        return res
            .status(400)
            .json({ message: "A senha deve conter no mínimo 6 caracteres." });
    }

    try {

        const activationToken = crypto.randomBytes(32).toString('hex');
        const hashedActivationToken = await argon2.hash(activationToken);

        const activationTokenExpiry = new Date(Date.now() + ACTIVATION_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

        const hashedPassword = await argon2.hash(senha);
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                perfil,
                telefone,
                idade: Number(idade),
                resetToken: hashedActivationToken,
                resetTokenExpiry: activationTokenExpiry,
            },
            select: { id: true, email: true, nome: true, perfil: true, telefone: true, idade: true, cuidadorId: true, criadoEm: true }
        });

        const tokenPayload = {
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            perfil: novoUsuario.perfil,
            email: novoUsuario.email
        }
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: JWT_EXPIRATION_MS
        });
        return res.status(200).json({
            message: "Login com sucesso!",
            usuario: {
                id: novoUsuario.id,
                nome: novoUsuario.nome,
                email: novoUsuario.email,
                perfil: novoUsuario.perfil,
                telefone: novoUsuario.telefone,
                idade: novoUsuario.idade,
                cuidadorId: novoUsuario.cuidadorId,
            },
            token: token,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(409).json({ message: "Usuário já cadastrado" })
        }
        console.log("Erro ao cadastrar usuário", error);
        return res.status(500).json({ message: "Tente mais tarde! " })
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: "credenciais inválidas" });
    }

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } })
        if (!usuario) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        const senhaCorreta = await argon2.verify(usuario.senha, senha);
        if (!senhaCorreta) {
            return res.status(400).json({ message: "Credenciais inválidas" });
        }
        const tokenPayload = {
            id: usuario.id,
            nome: usuario.nome,
            perfil: usuario.perfil,
            email: usuario.email
        }
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "24h" });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: JWT_EXPIRATION_MS
        });
        return res.status(200).json({
            message: "Login com sucesso!",
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.perfil,
                telefone: usuario.telefone,
                idade: usuario.idade,
                cuidadorId: usuario.cuidadorId,
            },
            token: token,
        });
    }
    catch (error) {
        console.log("Erro no processo do login", error);
        return res.status(500).json({ message: "Tente mais tarde!" });
    }
};

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout com sucesso" });
};

export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'O email é obrigatório.' });
    }

    try {
        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            console.log(`Tentativa de redefinição para email inexistente: ${email}`);
            return res.status(200).json({
                message: 'Se o email estiver cadastrado, um link de redefinição será enviado.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await argon2.hash(resetToken);

        const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000);

        await prisma.usuario.update({
            where: { id: usuario.id },
            data: {
                resetToken: hashedToken,
                resetTokenExpiry: resetTokenExpiry
            },
        });

        sendPasswordResetEmail(usuario.email, resetToken).catch(err => {
            console.error("Falha ao enviar o email de redefinição:", err);
        });

        return res.status(200).json({
            message: 'Se o email estiver cadastrado, um link de redefinição será enviado.'
        });

    } catch (error) {
        console.error('Erro na solicitação de redefinição de senha:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    const { token, novaSenha } = req.body;

    if (!token || !novaSenha || novaSenha.length < 6) {
        return res.status(400).json({ message: 'Token e nova senha válidos (mínimo 6 caracteres) são obrigatórios.' });
    }

    try {
        const usuarioComToken = await prisma.usuario.findFirst({
            where: {
                resetToken: { not: null },
                resetTokenExpiry: { gt: new Date() },
            },
        });

        if (!usuarioComToken) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        const tokenValido = await argon2.verify(usuarioComToken.resetToken as string, token);

        if (!tokenValido) {
            return res.status(400).json({ message: 'Token inválido ou expirado.' });
        }

        const hashedNewPassword = await argon2.hash(novaSenha);

        await prisma.usuario.update({
            where: { id: usuarioComToken.id },
            data: {
                senha: hashedNewPassword,
                resetToken: null,
                resetTokenExpiry: null,
            },
        });

        return res.status(200).json({
            message: 'Senha redefinida com sucesso! Você já pode fazer login com sua nova senha.'
        });

    } catch (error) {
        console.error('Erro na redefinição de senha:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

