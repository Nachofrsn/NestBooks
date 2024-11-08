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

type BookStatus = "leido" | "quiero leer" | "leyendo";

export default function BookPage() {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<BookStatus | null>(null);
  const location = useLocation();
  const book = location.state?.book;
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (book && book.status) {
      setStatus(book.status as BookStatus);
    }
  }, [book]);

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
                  onClick={() => updateBookStatus("leido")}
                  disabled={status === "leido"}
                >
                  Leído
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("quiero leer")}
                  disabled={status === "quiero leer"}
                >
                  Quiero Leer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("leyendo")}
                  disabled={status === "leyendo"}
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

          {/* Right Column - Rating and Additional Content */}
          <div className="w-full lg:w-64 space-y-4">
            <div className="flex justify-center lg:justify-start gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    star <= rating
                      ? "bg-yellow-400"
                      : "bg-muted hover:bg-yellow-200"
                  }`}
                  aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= rating ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="h-48 bg-muted rounded-lg"></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
