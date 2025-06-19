interface Params {
  g: number;
  p: number;
}

export const guardarParams = (g: number, p: number) => {
  const params = { g, p };
  localStorage.setItem("dhparams", JSON.stringify(params));
};

export class DiffieHelman {
  private minhaChavePrivada: number;
  private g: number;
  private p: number;

  constructor(g?: number, p?: number) {
    const armazenado = this.obterParams();
    if (armazenado) {
      this.g = armazenado.g;
      this.p = armazenado.p;
    } else {
      this.g = g ?? 2;
      this.p = p ?? 7919;
      guardarParams(this.g, this.p);
    }

    // Gera uma chave privada aleatória segura entre 2 e p-2
    this.minhaChavePrivada = Math.floor(Math.random() * (this.p - 2)) + 2;
  }

  obterParams(): Params | null {
    const params_ = localStorage.getItem("dhparams");
    return params_ ? JSON.parse(params_) : null;
  }

  obterMinhaChavePrivada(): number {
    return this.minhaChavePrivada;
  }

  obterChavePublica(): number {
    // chave pública = g^privada mod p
    return this.modPow(this.g, this.minhaChavePrivada, this.p);
  }

  gerarChaveSecreta(chavePublicaDoOutro: number): number {
    // chave secreta = (chavePublicaDoOutro)^minhaPrivada mod p
    return this.modPow(chavePublicaDoOutro, this.minhaChavePrivada, this.p);
  }

  private modPow(base: number, expoente: number, modulo: number): number {
    // Exponenciação modular eficiente (base^expoente mod modulo)
    let resultado = 1;
    base = base % modulo;

    while (expoente > 0) {
      if (expoente % 2 === 1) {
        resultado = (resultado * base) % modulo;
      }
      expoente = Math.floor(expoente / 2);
      base = (base * base) % modulo;
    }

    return resultado;
  }
}
