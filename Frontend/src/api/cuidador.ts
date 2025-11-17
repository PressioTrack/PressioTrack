import api from "../utils/api";

export const solicitarAssociacao = async (cuidadorEmail: string) => {
  const res = await api.post("/associacao/solicitar", { cuidadorEmail });
  return res.data;
};

export const confirmarAssociacao = async (token: string, cuidadorId: string) => {
  const res = await api.post("/associacao/confirmar", { token, cuidadorId: Number(cuidadorId) });
  return res.data;
};

export const getPacientesVinculados = async () => {
  const res = await api.get("/associacao/pacientes");
  return res.data;
};


export const getMedicoesPaciente = async (pacienteId: number) => {
  const res = await api.get(`/${pacienteId}`);
  return res.data;
};

export const gerarRelatorioPDF = async (pacienteId: number) => {
  const res = await api.get(`/${pacienteId}/pdf`, { responseType: "blob" });
  return res.data;
};

export const removerCuidador = async () => {
  const res = await api.delete("/associacao/remover");
  return res.data;
};