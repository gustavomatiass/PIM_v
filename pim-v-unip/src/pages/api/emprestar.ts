import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verify } from "./jwt";
const prisma = new PrismaClient();

class Emprestar {
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
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const produto = await prisma.produto.findUnique({
        where: {
          id: req.body.id,
        },
      });

      if (!produto) {
        res.status(401).json({ message: "Produto não encontrado" });
      }
      const emprestimo = await prisma.produto.update({
        where: {
          id: req.body.id,
        },
        data: {
          emprestado: !produto?.emprestado,
        },
      });
      res.status(200).json({ message: "Produto emprestado/Devolvido com sucesso" });

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
  const dp = new Emprestar();
  dp.handlePost(req, res);
}
