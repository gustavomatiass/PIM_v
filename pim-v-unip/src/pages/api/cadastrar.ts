import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { verify } from "./jwt";
const prisma = new PrismaClient();
// Esse é um arquivo em TypeScript que define uma função de rota para criar um novo produto na base de dados.


class CadastrarProduto {
  // A função handlePost é assíncrona e espera receber uma solicitação (request) e uma resposta (response) do Next.js. Na primeira parte do código, ele verifica se um token de autorização foi enviado com a solicitação e se ele é válido (verificando com a função verify do JWT). Se o token não for enviado ou inválido, ele retorna uma resposta 401 (não autorizado) com uma mensagem de erro.
  async handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const payload = verify(token);
      if (!payload) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const user = await prisma.usuario.findUnique({
        where: {
          id: payload.id,
        },
      });
      console.log(user);
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const produto = await prisma.produto.create({
        data: {
          id: uuidv4(),
          nome: req.body.nome,
          desc: req.body.desc,
          linkImg: req.body.linkImg,
          quemCadastrouId: user.id,
        },
      });
      res.status(200).json(produto.id);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cp = new CadastrarProduto();
  cp.handlePost(req, res);
}
