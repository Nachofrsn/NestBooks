import dotenv from 'dotenv';

import express from "express";
import booksRoutes from "./routes/books.routes.js";
import usersRoutes from './routes/users.routes.js';
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true // Permitir el uso de credenciales (cookies)
}));

app.use("/api", booksRoutes);
app.use("/api", usersRoutes);

app.listen(3001, () => {
  console.log("server running");
});
