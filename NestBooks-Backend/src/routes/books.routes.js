import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/books", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const books = await prisma.books.findMany({
      include: {author: true},  
      skip,
      take: limit,
    });
    res.json(books);
  } catch (e) {
    console.log("Error saving books into db");
  }
});

export default router;
