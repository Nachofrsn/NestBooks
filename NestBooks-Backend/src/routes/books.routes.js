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

export default router;
