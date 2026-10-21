export interface Agendamento {
  id: string;
  nome: string;
  telefone: string;
  procedimento: string;
  procedimentoPreco?: string;
  data: string;
  horario: string;
  observacoes?: string;
  criadoEm: string;
  status: 'confirmado' | 'pendente' | 'cancelado';
}

export interface ProcedimentoItem {
  id: string;
  nome: string;
  categoria: 'Cílios' | 'Sobrancelhas' | 'Unhas' | 'Facial' | 'Cabelo';
  preco: string;
  duracao: string;
  popular?: boolean;
}
