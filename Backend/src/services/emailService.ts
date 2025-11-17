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

export const sendHypertensionAlertEmail = async (
    toEmail: string,
    nome: string | undefined,
    sistolica: number,
    diastolica: number
) => {
    await transporter.sendMail({
        from: `"PressioTrack" <${EMAIL_USER}>`,
        to: toEmail,
        subject: "⚠ Alerta de Hipertensão Detectada",
        html: `
            <h2 style="color:#d32f2f;">⚠ Alerta de Hipertensão</h2>

            <p>Olá <strong>${nome || "usuário"}</strong>,</p>

            <p>Foi detectado um registro de pressão arterial acima dos limites considerados seguros:</p>

            <p style="font-size: 20px; margin: 15px 0;">
                <strong>${sistolica}/${diastolica} mmHg</strong>
            </p>

            <p>
                Recomendamos monitorar suas próximas medições e buscar aconselhamento profissional se necessário.
            </p>

            <p style="margin-top: 20px; font-size: 12px; opacity: 0.8;">
                PressioTrack – Monitoramento de Pressão Arterial
            </p>
        `,
    });

    console.log(`Email de alerta de hipertensão enviado para: ${toEmail}`);
};

export const sendCaregiverAssociationEmail = async ({
  cuidadorEmail,
  cuidadorNome,
  cuidadorId,
  pacienteId,
  pacienteNome,
  token
}: {
  cuidadorEmail: string,
  cuidadorNome?: string,
  cuidadorId: number,
  pacienteId: number,
  pacienteNome: string,
  token: string
}) => {

const link = `${process.env.FRONTEND_URL}/associacao/confirmar?token=${token}&cuidadorId=${cuidadorId}`;

  await transporter.sendMail({
    from: `"PressioTrack" <${EMAIL_USER}>`,
    to: cuidadorEmail,
    subject: `Pedido de associação - ${pacienteNome}`,
    html: `
      <h2>Associação de Paciente</h2>

      <p>Olá <strong>${cuidadorNome}</strong>,</p>

      <p>O paciente <strong>${pacienteNome}</strong> deseja vinculá-lo como cuidador.</p>

      <p>Clique no link para confirmar:</p>

      <p><a href="${link}">Confirmar associação</a></p>

      <p>Este link expira em 24 horas.</p>
    `
  });

  console.log(`Email de associação enviado para cuidador: ${cuidadorEmail}`);
};

