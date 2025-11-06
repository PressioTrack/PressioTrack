import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { AuthRequest, authorizePaciente, authenticateToken } from "../middlewares/authMiddleware";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRATION_MS = 24 * 60 * 60 * 1000; //24 horas

//registrar usuário
export const register = async (req: Request, res: Response) => {
    const { nome, email, senha, perfil, telefone } = req.body;

    if (!nome || !email || !senha || !perfil) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios e a senha deve conter no minímo 6 caracteres" })
    }
    if (senha.length < 6) {
        return res
          .status(400)
          .json({ message: "A senha deve conter no mínimo 6 caracteres." });
      }
    
    try {
        const hashedPassword = await argon2.hash(senha);
        const novoUsuario = await prisma.usuario.create({
            data: {
                nome,
                email,
                senha: hashedPassword,
                perfil,
                telefone,
            },
            select: { id: true, email: true, nome: true, perfil: true, telefone: true, cuidadorId: true, criadoEm: true }
        });
        
        const tokenPayload = {
            id: novoUsuario.id,
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

//login
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

//logout
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logout com sucesso" });
};

