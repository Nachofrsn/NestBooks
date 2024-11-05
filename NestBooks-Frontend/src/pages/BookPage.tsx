"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Star } from "lucide-react";

import { Link, useLocation } from "react-router-dom";

export default function Component() {
  const [rating, setRating] = useState(0);
  const location = useLocation();
  const book = location.state.book;

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Navigation */}
      <nav className="container mx-auto flex justify-between mb-6">
        <Button variant="ghost">explorar</Button>
        <Link to="/profile">
          <Button variant="ghost">cuenta</Button>
        </Link>
      </nav>

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
                  estado
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>leído</DropdownMenuItem>
                <DropdownMenuItem>quiero leer</DropdownMenuItem>
                <DropdownMenuItem>leyendo</DropdownMenuItem>
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
