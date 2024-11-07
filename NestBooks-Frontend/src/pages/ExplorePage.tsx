import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { Link, useNavigate } from "react-router-dom";
import { url } from "@/utils/constants";
import { Header } from "@/components/ui/header";

interface Book {
  id: number;
  title: string;
  author: {
    name: string;
  };
  genre: string;
  description: string;
  cover_i: string;
}

export const ExplorePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
  }, [pages, filter]);

  useEffect(() => {
    const delayOnWriting = setTimeout(() => {
      fetchBooks();
    }, 300);

    return () => clearTimeout(delayOnWriting);
  }, [searchTerm]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${url}/books`, {
        params: {
          page: pages,
          limit: 6,
          search: searchTerm,
          filter,
        },
      });
      setBooks(response.data);
    } catch (e) {
      console.error("Error fetching books");
    } 
  };

  /*const handleNextPage = () => {
    setPages((prevPage) => prevPage + 1);
  };*/

  const handleNavigation = (i: number) => {
    navigate("/bookdetails", { state: { book: books[i] } });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <Header />
      <div className="flex space-x-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Buscar libros..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={(value) => setFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="fiction">Fiction</SelectItem>
            <SelectItem value="thriller">Thriller</SelectItem>
            <SelectItem value="crime">Crime</SelectItem>
            <SelectItem value="classics">Classics</SelectItem>
            <SelectItem value="horror">Horror</SelectItem>
            <SelectItem value="young-adult">Young-adult</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {books && books.length > 0 ? (
        <div className="grid grid-cols-3 gap-6 container mx-auto">
          {books.map((book, i) => (
            <Card key={book.id} className="p-6">
              <div className="flex gap-6">
                <div className="flex flex-col gap-2">
                  <div className="w-48 h-64 bg-muted rounded-lg flex items-center justify-center border">
                    <img
                      src={book.cover_i}
                      alt={book.title}
                      className="w-48 h-64"
                    />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigation(i)}
                  >
                    Ver Detalles
                  </Button>
                </div>
                <div className="flex-1">
                  <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">{book.title}</h2>
                    <p className="text-muted-foreground">
                      {book.author.name
                        ? JSON.parse(book.author.name.replace(/'/g, '"')).join(
                            ", "
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <h2>No se encontraron libros.</h2>
      )}
    </div>
  );
};
