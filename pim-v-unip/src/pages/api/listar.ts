import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { verify } from "./jwt";
const prisma = new PrismaClient();

class listarProdutos {
  async handleGet(req: NextApiRequest, res: NextApiResponse) {
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
      const user = await prisma.usuario.findFirst({
        where: {
          id: payload.id,
        },
      });
      if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const produtos = await prisma.produto.findMany({});
      res.status(200).json(produtos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const lp = new listarProdutos();
  lp.handleGet(req, res);
}
