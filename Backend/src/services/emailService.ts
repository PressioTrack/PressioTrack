import * as nodemailer from 'nodemailer';

interface EmailUser {
    email: string;
    nome?: string; 
}

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.seuprovedor.com'; 
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'; 
export const ADMIN_CONTACT_EMAIL = process.env.ADMIN_CONTACT_EMAIL || 'pressiotrack@gmail.com'; 


const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465, 
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

export const sendPasswordResetEmail = async (toEmail: string, token: string) => {
    const resetLink = `${FRONTEND_URL}/reset?token=${token}`;

    await transporter.sendMail({
        from: `"PressioTrack" <${EMAIL_USER}>`,
        to: toEmail,
        subject: "Redefinição de Senha Solicitada",
        html: `
            <p>Você solicitou uma redefinição de senha.</p>
            <p>Clique no link abaixo para redefinir sua senha. Este link expira em 1 hora:</p>
            <p><a href="${resetLink}">Redefinir Senha</a></p>
            <p>Se você não solicitou isso, ignore este email.</p>
        `,
    });
    console.log(`Email de redefinição enviado para: ${toEmail}`);
};

