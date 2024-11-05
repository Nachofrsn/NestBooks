import express from "express";
import booksRoutes from "./routes/books.routes.js";
import usersRoutes from './routes/users.routes.js';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

// Configuración de CORS para permitir tu frontend
app.use(cors({
  origin: "http://localhost:5173", // Cambia esto por la URL de tu frontend
  credentials: true // Permitir el uso de credenciales (cookies)
}));

app.use("/api", booksRoutes);
app.use("/api", usersRoutes);

app.listen(3000, () => {
  console.log("server running");
});
