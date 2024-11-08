"use client";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star } from "lucide-react";
// @ts-ignore
import useAuthStore from "../store/authStore";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Header } from "@/components/ui/header";

import axios from "axios";

import { url } from "../utils/constants";

type BookStatus = "quiero leer" | "leyendo";

type User = {
  id: number;
  email: string;
  password: string;
  name: string;
};

type UserBook = {
  user: User;
  status: string;
  userId: number;
  bookId: number;
  review: string;
  rating: number;
};

export default function BookPage() {
  const [status, setStatus] = useState<BookStatus | null>(null);
  const [bookReviews, setBookReviews] = useState<UserBook[]>([]);

  const location = useLocation();
  const book = location.state?.book;

  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (book && book.status) {
      setStatus(book.status);
    }
    fetchBookReviews();
  }, [book]);

  const fetchBookReviews = async () => {
    try {
      const response = await axios.get(`${url}/bookreviews/${book.id}`);
      setBookReviews(response.data);
    } catch (error) {
      console.error("Error fetching book reviews");
    }
  };

  const updateBookStatus = async (newStatus: BookStatus) => {
    if (!user) {
      toast.error("Debes iniciar sesión para cambiar el estado");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/bookdetails",
        {
          userId: user.id,
          bookId: book.id,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setStatus(newStatus);
        toast.success(
          `El estado del libro ha sido actualizado a: ${newStatus}`
        );
      } else {
        throw new Error("No se pudo actualizar el estado del libro.");
      }
    } catch (error) {
      toast.error("Error al actualizar el estado del libro.");
      console.error(error);
    }
  };

  if (!book) {
    return <div className="text-center p-4">No se encontró el libro</div>;
  }

  const validBookReviews = bookReviews.filter(
    (review) => review.review && review.review !== "null"
  );

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <Header />
      <Card className="container mx-auto p-4 sm:p-6 mt-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Cover and Status */}
          <div className="flex flex-col items-center lg:items-start gap-4 w-full lg:w-auto">
            <div className="w-48 h-64 bg-muted rounded-lg flex items-center justify-center border overflow-hidden">
              <img
                src={book.cover_i}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full max-w-[12rem]">
                  Estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("quiero leer")}
                  disabled={
                    status === "quiero leer" ||
                    bookReviews[0]?.status === "leido"
                  }
                >
                  Quiero Leer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("leyendo")}
                  disabled={
                    status === "leyendo" || bookReviews[0]?.status === "leido"
                  }
                >
                  Leyendo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Middle Column - Book Details */}
          <div className="flex-1 space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold">{book.title}</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              {book.author.name
                ? JSON.parse(book.author.name.replace(/'/g, '"')).join(", ")
                : ""}
            </p>
            <div className="inline-block bg-muted px-2 py-1 rounded-md text-xs sm:text-sm">
              {book.genres
                ? JSON.parse(book.genres.replace(/'/g, '"')).join(", ")
                : ""}
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              {book.description}
            </p>
          </div>
        </div>
      </Card>
      {/* Bottom Column - Rating */}
      <div className="max-w-2xl mt-4">
        {validBookReviews.length > 0 ? (
          validBookReviews.map((review, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-background rounded-lg shadow-sm mb-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">
                    {review.user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-sm">{review.user.name}</h3>
                </div>
              </div>
              <div className="flex-1 mx-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {review.review}
                </p>
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground">
            No hay reseñas para este libro.
          </div>
        )}
      </div>
    </div>
  );
}
