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

// Definir los estados posibles
type BookStatus = "leído" | "quiero leer" | "leyendo";

export default function Component() {
  const [rating, setRating] = useState(0);
  const [status, setStatus] = useState<BookStatus | null>(null); // Inicializamos como null
  const location = useLocation();
  const book = location.state?.book; // Usamos el operador de encadenamiento opcional

  const navigate = useNavigate();

  const { user } = useAuthStore();

  // Verificar si el libro tiene un estado asignado al cargarse
  useEffect(() => {
    if (book && book.status) {
      setStatus(book.status as BookStatus); // Asignar el estado del libro si existe
    }
  }, [book]);

  // Función para manejar el cambio de estado del libro
  const updateBookStatus = async (newStatus: BookStatus) => {
    if (!user) {
      toast.error("Debes iniciar sesión para cambiar el estado");
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3001/api/bookdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id, 
          bookId: book.id, 
          status: newStatus, 
        }),
      });
  
      if (response.ok) {
        setStatus(newStatus);
        toast.success(`El estado del libro ha sido actualizado a: ${newStatus}`);
      } else {
        throw new Error("No se pudo actualizar el estado del libro.");
      }
    } catch (error) {
      toast.error("Error al actualizar el estado del libro.");
      console.error(error);
    }
  };
  
  

  if (!book) {
    return <div>No se encontró el libro</div>;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Navigation */}
      <Header />

      <Card className="container mx-auto p-6">
        <div className="flex gap-6">
          {/* Left Column - Cover and Status */}
          <div className="flex flex-col gap-2">
            <div className="w-48 h-64 bg-muted rounded-lg flex items-center justify-center border">
              <img src={book.cover_i} alt={book.title} className="w-48 h-64" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  Estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("leído")}
                  disabled={status === "leído"} // Deshabilitar si ya está en ese estado
                >
                  Leído
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("quiero leer")}
                  disabled={status === "quiero leer"} // Deshabilitar si ya está en ese estado
                >
                  Quiero Leer
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateBookStatus("leyendo")}
                  disabled={status === "leyendo"} // Deshabilitar si ya está en ese estado
                >
                  Leyendo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Middle Column - Book Details */}
          <div className="flex-1">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">{book.title}</h2>
              <p className="text-muted-foreground">
                {book.author.name
                  ? JSON.parse(book.author.name.replace(/'/g, '"')).join(", ")
                  : ""}
              </p>
              <div className="inline-block bg-muted px-2 py-1 rounded-md text-sm">
                {book.genres
                  ? JSON.parse(book.genres.replace(/'/g, '"')).join(", ")
                  : ""}
              </div>
              <p className="text-muted-foreground">{book.description}</p>
            </div>
          </div>

          {/* Right Column - Rating and Additional Content */}
          <div className="w-64 space-y-4">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    star <= rating ? "bg-yellow-400" : "bg-muted hover:bg-yellow-200"
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
