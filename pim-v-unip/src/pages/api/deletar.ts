import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verify } from "./jwt";
const prisma = new PrismaClient();
// Esse código define uma rota de API em Next.js para deletar um produto usando o Prisma como ORM para interagir com um banco de dados.
class deletarProduto {
  async handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token);
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
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const produto = await prisma.produto.delete({
        where: {
          id: req.body.id,
        },
      });

      res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dp = new deletarProduto();
  dp.handlePost(req, res);
}
