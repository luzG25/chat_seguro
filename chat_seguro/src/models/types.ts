export interface Message {
  tipo: string;
  emissor: string;
  destino: string;
  token?: string;
  data?: string;
  msg: string;
  aux1?: string;
  aux2?: string;
}

export interface Contact {
  email: string;
  nome: string;
  curso: string;
}

export interface UserSession {
  email: string;
  nome: string;
  token: string;
  deviceToken: string;
}
