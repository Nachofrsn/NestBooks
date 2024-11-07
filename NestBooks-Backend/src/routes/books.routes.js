import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/books", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = req.query.filter;
    const search = req.query.search ? req.query.search.toLowerCase() : "";

    let whereCondition = {};

    if (filter !== "all" && search === "") {
      whereCondition.genres = {
        contains: filter.toLowerCase(),
      };
    } else if (filter !== "all" && search !== "") {
      whereCondition = {
        AND: [
          { genres: { contains: filter.toLowerCase() } },
          { title: { contains: search } },
        ],
      };
    } else if (filter === "all" && search !== "") {
      whereCondition.title = { contains: search };
    }

    const books = await prisma.books.findMany({
      include: { author: true },
      skip,
      take: limit,
      where: whereCondition,
    });

    res.json(books);
  } catch (e) {
    console.log("Error fetching books from db:", e);
    res.status(500).json({ error: "Error fetching books" });
  }
});

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


router.get("/user/books", async (req, res) => {
  const { userId, status } = req.query;
  try {
    const books = await prisma.userBook.findMany({
      where: {
        userId: parseInt(userId),
        status: status,
      },
      include: {
        book: true,
      },
    });
    res.json(books);
  } catch (e) {
    res.status(500).json({ error: "Error fetching books" });
  }
});

router.post('/userBooks', async (req, res) => {
  const { userId, status } = req.body;

  try {
    const books = await prisma.userBook.findMany({
      where: {
        userId: userId,
        status: status,
      },
      include: {
        book: true,
      },
    });

    res.json({ books: books.map((userBook) => userBook.book) });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los libros.' });
  }
});

export default router;
