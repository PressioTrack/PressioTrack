import api from "../utils/api";

export const login = async (email: string, senha: string) => {
  const res = await api.post("/login", { email, senha });
  return res.data;
};

export const logout = async () => {
  await api.post("/logout");
};

export const getPerfil = async () => {
  const res = await api.get("/perfil");
  return res.data;
};

export const Register = async (userData: {
  nome: string;
  email: string;
  senha: string;
  perfil?: string;
  telefone: string;
  idade: number;
}) => {
  const res = await api.post("/register", userData);
  return res.data;
};

export const forgot = async (email:string)=>{
  const res = await api.post("/forgot", { email });
  return res.data;
};
export const reset = async (token:string,senha:string)=>{
  const res = await api.post("/reset", {token, novaSenha: senha });
  return res.data;
};

