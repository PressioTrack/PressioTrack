import api from "../utils/api";

export const createMedicao = async (medicaoData: {
  sistolica: number;
  diastolica: number;
  status?: string;
  observacao: string;
}) => {
  const res = await api.post("/inserir", medicaoData);
  return res.data;
};

export const getMedicoes = async () => {
  const res = await api.get("/buscar");
  return res.data;
};

export const getMedicaoById = async (id: number) => {
  const res = await api.get(`/buscarUnica/${id}`);
  return res.data;
};

export const updateMedicao = async (
  id: number,
  medicaoData: {
    sistolica: number;
    diastolica: number;
    status?: string;
    observacao: string;
  }
) => {
  const res = await api.put(`/atualizar/${id}`, medicaoData);
  return res.data;
};

export const deleteMedicao = async (id: number) => {
  const res = await api.delete(`/deletar/${id}`);
  return res.data;
};
