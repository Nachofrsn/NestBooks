import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Link, useNavigate } from "react-router-dom";
import { url } from "@/utils/constants";

interface Book {
  id: number;
  title: string;
  author: {
    name: string;
  }
  genre: string;
  description: string;
  cover_i: string;
}

export const ExplorePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [pages]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${url}/books`, {
        params: {
          page: pages,
          limit: 6,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error("Error fetching books");
    }
  };

  const handleNextPage = () => {
    setPages((prevPage) => prevPage + 1);
  };

  const handleNavigation = (i: number) => {
    navigate("/bookdetails", { state: { book: books[i] } });
  }

  return (
    books &&
    books.length > 0 && (
      <div className="min-h-screen bg-background p-4">
        <nav className="container mx-auto flex justify-between mb-6">
          <Button variant="ghost" onClick={handleNextPage}>
            explorar
          </Button>
          <Link to="/profile">
            <Button variant="ghost">cuenta</Button>
          </Link>
        </nav>
        <div className="grid grid-cols-3 gap-6 container mx-auto">
          {books.map((book, i) => (
            <Card key={book.id} className="p-6">
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-48 h-64 bg-muted rounded-lg flex items-center justify-center border">
                    <img src={book.cover_i} alt={book.title} className="w-48 h-64"/>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => handleNavigation(i)}>
                    Ver Detalles
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">{book.title}</h2>
                    <p className="text-muted-foreground"> {book.author.name
                  ? JSON.parse(book.author.name.replace(/'/g, '"')).join(", ")
                  : ""}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  );
};
