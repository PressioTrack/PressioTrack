import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
        perfil: 'ADMIN' | 'PACIENTE' | 'CUIDADOR';
    };
}

export const authenticateToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Necessário estar logado.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: number;
            email: string;
            perfil: 'ADMIN' | 'PACIENTE' | 'CUIDADOR';
        };

        req.user = decoded;

        next();

    } catch (err) {
        res.clearCookie('jwt');
        return res.status(403).json({ message: 'Sessão inválida ou expirada. Faça login novamente.' });
    }
};

export const authorizeAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction) => {
    if (!req.user || req.user.perfil !== 'ADMIN') {
        return res.status(403).json({ message: 'Proibido. Apenas administradores podem realizar esta ação.' });
    }
    next();
};

export const authorizeCuidador = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || req.user.perfil !== "CUIDADOR") {
        return res
            .status(403)
            .json({ message: "Acesso negado. Apenas cuidadores podem realizar esta ação." });
    }
    next();
};

export const authorizePaciente = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    if (!req.user || req.user.perfil !== "PACIENTE") {
        return res
            .status(403)
            .json({ message: "Acesso negado. Apenas pacientes podem realizar esta ação." });
    }
    next();
};