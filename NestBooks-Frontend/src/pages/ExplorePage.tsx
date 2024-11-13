import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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

  const handleNavigation = (book: Book) => {
    navigate("/bookdetails", { state: { book } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-grow">
            <Input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col gap-4 items-center sm:items-start">
                    <div className="w-32 h-48 sm:w-40 sm:h-56 bg-muted rounded-lg flex items-center justify-center border overflow-hidden">
                      <img
                        src={book.cover_i}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="w-full max-w-[12rem]"
                      onClick={() => handleNavigation(book)}
                    >
                      View Details
                    </Button>
                  </div>
                  <div className="flex-1">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold line-clamp-2">{book.title}</h2>
                      <p className="text-sm text-muted-foreground line-clamp-2">
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
          <h2 className="text-center text-lg font-semibold">No books found.</h2>
        )}
        <Pagination className="mt-8 flex justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                className="cursor-pointer" 
                onClick={() => pages === 1 ? null : setPages(pages - 1)}
                aria-disabled={pages === 1}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                className="cursor-pointer" 
                onClick={() => books.length < 6 ? null : setPages(pages + 1)}
                aria-disabled={books.length < 6}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};