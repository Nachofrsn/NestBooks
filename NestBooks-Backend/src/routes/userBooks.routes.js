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
    res.status(500).json({ error: "Error updating book status" });
  }
});

router.get("/bookreviews/:id", async (req, res) => {
  const bookId = Number(req.params.id);

  const reviews = await prisma.userBook.findMany({
    where: { bookId },
    select: {
      review: true,
      rating: true,
      status: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });
  res.json(reviews);
});

router.put("/bookreviews", async (req, res) => {
  const { review, rating, bookId, userId } = req.body;
  try {
    const response = await prisma.userBook.update({
      where: { userId_bookId: { userId, bookId } },
      data: {
        review,
        rating,
      },
    });
    res.status(201).json(response);
  } catch (e) {
    res.status(404).json({ error: "Error saving review" });
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
        status: type,
      },
      include: {
        book: true,
        user: true,
      },
      take: limit,
      skip: skip,
    });

    return res.json(books);
  } catch (error) {
    console.error("Error fetching paginated books:");
    return res
      .status(500)
      .json({ error: "Error getting books with pagination." });
  }
});

export default router;
