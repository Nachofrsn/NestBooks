import { Router } from "express";
import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const router = Router();
const prisma = new PrismaClient();

function generateToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "La contraseña es requerida." });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "Usuario registrado con exito", user });
  } catch (e) {
    res.status(400).json({ message: "Error al registrar el usuario" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = generateToken(user);
  res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" }); // Asegúrate de tener `httpOnly`
  res.json({ message: "Inicio de sesión exitoso", user });
});


router.get("/protected", (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Token no encontrado" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Acceso autorizado", user: decoded });
  } catch (e) {
    res.status(403).json({ message: "Token inválido" });
  }
});

router.get("/session", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No estás autenticado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: "Sesión activa", user: decoded });
  } catch (e) {
    res.status(403).json({ message: "Token inválido" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Sesion cerrada" });
});

export default router;
