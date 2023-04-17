import { NextApiRequest, NextApiResponse } from "next";
import { Component } from "react";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
interface Data {
  nome: string;
  email: string;
  senha: string;
}

const prisma = new PrismaClient();

class Register {
  async handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user = await prisma.usuario.create({
        data: {
          id: uuidv4(),
          nome: req.body.nome,
          email: req.body.email,
          senha: req.body.senha,
        },
      });
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    } finally {
      await prisma.$disconnect();
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const register = new Register();
  register.handlePost(req, res);
}
