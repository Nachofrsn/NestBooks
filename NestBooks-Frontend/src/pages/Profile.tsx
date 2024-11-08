"use client";

import axios from "axios";
import { useState, useEffect } from "react";

import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Header } from "@/components/ui/header";

import { url } from "@/utils/constants";

// @ts-ignore
import useAuthStore from "../store/authStore";

type User = {
  id: number;
  email: string;
  password: string;
  name: string;
};

type Book = {
  id: number;
  title: string;
  description: string;
  rating: string;
  cover_i: string;
  genres: string[];
  pages: string;
};

type UserBook = {
  book: Book;
  user: User;
  status: string;
  userId: number;
  bookId: number;
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("leido");
  const { user } = useAuthStore();
  const [userBooks, setUserBooks] = useState<UserBook[]>([]);
  const [pages, setPages] = useState(1);
  const [reviewBook, setReviewBook] = useState<Book | null>(null);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [changeStatusBook, setChangeStatusBook] = useState<UserBook | null>(
    null
  );

  useEffect(() => {
    fetchBooks();
  }, [activeTab, pages]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${url}/accountdetails`, {
        params: {
          user_id: user.id,
          type: activeTab,
          page: pages,
          limit: 6,
        },
      });
      setUserBooks(response.data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleReviewSubmit = async () => {
    try {
      const response = await axios.put(`${url}/bookreviews`, {
        userId: user.id,
        bookId: reviewBook?.id,
        review,
        rating,
      });

      if (response.status === 201) {
        toast.success("Reseña enviada con éxito");
      }

    } catch (e) {
      console.log("Error submitting review");
    }
    console.log("Submitting review:", {
      bookId: reviewBook?.id,
      review,
      rating,
      userId: user.id,
    });
    setReviewBook(null);
    setReview("");
    setRating(0);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!changeStatusBook) return;
    try {
      const response = await axios.post(
        "http://localhost:3001/api/bookdetails",
        {
          userId: user.id,
          bookId: changeStatusBook.bookId,
          status: newStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
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
    console.log("Changing status:", {
      bookId: changeStatusBook.book.id,
      newStatus,
    });
    setChangeStatusBook(null);
    await fetchBooks();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8 relative">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage
              src="/placeholder.svg?height=96&width=96"
              alt="Profile photo"
            />
            <AvatarFallback>
              {userBooks[0]?.user?.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-medium mb-4">
            {userBooks[0]?.user?.name}
          </h1>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(tab) => {
            setActiveTab(tab);
            setPages(1);
          }}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="leido" className="flex-1">
              Leído
            </TabsTrigger>
            <TabsTrigger value="quiero leer" className="flex-1">
              Quiero leer
            </TabsTrigger>
            <TabsTrigger value="leyendo" className="flex-1">
              Leyendo
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {userBooks.length > 0 ? (
                userBooks.map((ubook) => (
                  <Card
                    key={ubook.book.id}
                    className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer relative"
                  >
                    <div className="aspect-[2/3] relative">
                      <img
                        src={ubook.book.cover_i || "/placeholder.svg"}
                        alt={`Cover of ${ubook.book.title}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      {activeTab === "leido" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              className="absolute bottom-2 left-2 right-2 text-xs"
                              onClick={() => setReviewBook(ubook.book)}
                            >
                              Dejar reseña
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      )}
                      {activeTab !== "leido" && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2 text-xs"
                              onClick={() => setChangeStatusBook(ubook)}
                            >
                              Cambiar estado
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      )}
                    </div>
                  </Card>
                ))
              ) : (
                <p className="col-span-full text-center text-muted-foreground">
                  No hay libros con este estado
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Pagination className="mt-6 flex justify-center">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className="cursor-pointer"
              onClick={() => (pages === 1 ? null : setPages(pages - 1))}
              aria-disabled={pages === 1}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() =>
                userBooks.length === 6 ? null : setPages(pages + 1)
              }
              aria-disabled={userBooks.length === 6}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Review Modal */}
      <Dialog open={!!reviewBook} onOpenChange={() => setReviewBook(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dejar reseña para {reviewBook?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="review">Tu reseña</Label>
              <Textarea
                id="review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Escribe tu reseña aquí..."
              />
            </div>
            <div>
              <Label>Calificación</Label>
              <div className="flex gap-1 mt-2">
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
            </div>
            <Button onClick={handleReviewSubmit}>Enviar reseña</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Status Modal */}
      <Dialog
        open={!!changeStatusBook}
        onOpenChange={() => setChangeStatusBook(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Cambiar estado de {changeStatusBook?.book.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Button
              onClick={() => handleStatusChange("leido")}
              className="w-full"
              variant={
                changeStatusBook?.status === "leido" ? "secondary" : "outline"
              }
            >
              Leído
            </Button>
            <Button
              onClick={() => handleStatusChange("quiero leer")}
              className="w-full"
              variant={
                changeStatusBook?.status === "quiero leer"
                  ? "secondary"
                  : "outline"
              }
            >
              Quiero leer
            </Button>
            <Button
              onClick={() => handleStatusChange("leyendo")}
              className="w-full"
              variant={
                changeStatusBook?.status === "leyendo" ? "secondary" : "outline"
              }
            >
              Leyendo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
