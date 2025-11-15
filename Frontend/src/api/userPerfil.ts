import api from "../utils/api";

export const getPerfil = async () => {
  const res = await api.get("/perfil");
  return res.data;
};

export const updatePerfil = async (userData: {
  nome?: string;
  email?: string;
  telefone?: string;
  idade?: number;
  senha?: string;
  pressaoSistolicaNormal?: number;
  pressaoDiastolicaNormal?: number;
  naoSeiPressao?: boolean;
}) => {
  const res = await api.put("/atualizarPerfil", userData);
  return res.data;
};

