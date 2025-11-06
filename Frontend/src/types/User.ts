export type UserProfile = 'ADMIN' | 'PACIENTE' | 'CUIDADOR';

export interface User {
  id: string | number;
  nome: string;
  email: string;
  perfil: UserProfile;
  telefone: string;
}
