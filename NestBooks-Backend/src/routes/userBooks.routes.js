import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.post("/bookdetails", async (req, res) => {
  const { userId, bookId, status } = req.body;
  try {
    const bookStatus = await prisma.userBook.upsert({
      where: { userId_bookId: { userId, bookId } },
      update: { status },
      create: { userId, bookId, status },
    });

    res.json({ message: "Estado del libro actualizado", bookStatus });
  } catch (e) {
    console.log("Error updating book status:", e);
    res.status(500).json({ error: "Error updating book status" });
  }
});

router.get("/accountdetails", async (req, res) => {
  const type = req.query.type;
  const user_id = req.query.user_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  const skip = (page - 1) * limit;

  try {
    const books = await prisma.userBook.findMany({
      where: { 
        userId: parseInt(user_id), 
        status: type 
      },
      include: { 
        book: true, 
        user: true 
      },
      take: limit, // Limita el número de resultados
      skip: skip,  // Salta los libros de páginas anteriores
    });

    return res.json(books);
  } catch (error) {
    console.error("Error fetching paginated books:", error);
    return res.status(500).json({ error: "Error getting books with pagination." });
  }
});



export default router;
