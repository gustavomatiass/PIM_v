import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class Login {
  async handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        console.log(req.body)
      const user = await prisma.usuario.findUnique({
        where: {
          id: req.body.id,
        },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.status(200).json({ nome: user.nome });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const login = new Login();
  login.handlePost(req, res);
}
