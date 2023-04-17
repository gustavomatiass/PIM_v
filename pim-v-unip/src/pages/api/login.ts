import { NextApiRequest, NextApiResponse } from "next";
import { Component } from "react";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

import { sign } from "./jwt";

const prisma = new PrismaClient();

class Login {
  async handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const user = await prisma.usuario.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      console.log(user.senha);
      console.log(req.body.senha);
      if (user.senha !== req.body.senha) {
        res.status(401).json({ message: "Invalid password" });
        return;
      }
      const token = sign({ id: user.id });
      res.status(200).json({ token });
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
