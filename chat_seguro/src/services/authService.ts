import type { Message } from "../models/types";

export const login = (email: string, password: string): Message => {
  return {
    tipo: "Login",
    emissor: email,
    destino: "LoginService",
    msg: "",
    aux1: password,
    token: "", // Token vazio será preenchido pelo servidor
  };
};

export const register = (
  email: string,
  password: string,
  name: string,
  course: string
): Message => {
  return {
    tipo: "Incricao",
    emissor: email,
    destino: "LoginService",
    msg: course,
    aux1: password,
    aux2: name,
    token: "",
  };
};
export const resumeSession = (email: string, deviceToken: string): Message => {
  return {
    tipo: "RetomarSessao",
    emissor: email,
    destino: "LoginService",
    msg: "",
    aux1: deviceToken,
  };
};
