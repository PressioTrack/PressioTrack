import type { DadosSaude } from "./DadosSaude";

export type UserPerfil = 'ADMIN' | 'PACIENTE' | 'CUIDADOR';

export interface User {
  id: string | number;
  nome: string;
  email: string;
  perfil: UserPerfil;
  telefone: string;
  idade: number;
  dadosSaude?: DadosSaude;
}
