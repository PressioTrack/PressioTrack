export interface Medicao {
  id: string | number;
  sistolica: number;
  diastolica: number;
  observacao?: string;
  status: "NORMAL" | "HIPERTENSÃO" | "BAIXA";
  dataMedicao: string;
}
