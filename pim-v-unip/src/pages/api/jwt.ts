import jwt from "jsonwebtoken";
// Esse código exporta duas funções que permitem gerar e verificar tokens JWT (JSON Web Tokens).
const secret = process.env.JWT ?? "";
// A primeira função sign(payload: any): string recebe um objeto payload como argumento e retorna uma string que representa um token JWT, assinado com a chave secreta secret. O token gerado pode ser usado para autenticar um usuário em uma aplicação.
export function sign(payload: any): string {
  return jwt.sign(payload, secret);
}
// A segunda função verify(token: string): any recebe uma string token como argumento e retorna o objeto payload originalmente usado para gerar o token, caso o token seja válido e assinado com a mesma chave secreta secret. Se o token não for válido, a função retorna false.
export function verify(token: string): any {
  return jwt.verify(token, secret);
}
