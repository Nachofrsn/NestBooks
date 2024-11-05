'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit } from "lucide-react"

// Mock data for different book collections
const bookCollections = {
  leido: Array.from({ length: 6 }, (_, i) => ({
    id: `read-${i}`,
    cover: `/placeholder.svg?height=300&width=200`,
    title: `Book ${i + 1}`
  })),
  quieroLeer: Array.from({ length: 6 }, (_, i) => ({
    id: `want-${i}`,
    cover: `/placeholder.svg?height=300&width=200`,
    title: `Book ${i + 1}`
  })),
  leyendo: Array.from({ length: 6 }, (_, i) => ({
    id: `reading-${i}`,
    cover: `/placeholder.svg?height=300&width=200`,
    title: `Book ${i + 1}`
  }))
}

export default function Component() {
  const [activeTab, setActiveTab] = useState('leido')

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="container mx-auto flex justify-between p-4">
        <Button variant="ghost">explorar</Button>
        <Button variant="ghost">cuenta</Button>
      </nav>

      {/* Profile Section */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center mb-8 relative">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Profile photo" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <h1 className="text-xl font-medium mb-4">username</h1>
          <Button 
            variant="outline" 
            size="sm"
            className="absolute top-0 right-0 sm:right-4"
          >
            <Edit className="w-4 h-4 mr-2" />
            editar perfil
          </Button>
        </div>

        {/* Books Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="leido" className="flex-1">leído</TabsTrigger>
            <TabsTrigger value="quieroLeer" className="flex-1">quiero leer</TabsTrigger>
            <TabsTrigger value="leyendo" className="flex-1">leyendo</TabsTrigger>
          </TabsList>

          {/* Books Grid for each tab */}
          {Object.entries(bookCollections).map(([key, books]) => (
            <TabsContent 
              key={key} 
              value={key}
              className="mt-0"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {books.map((book) => (
                  <Card 
                    key={book.id}
                    className="overflow-hidden hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="aspect-[2/3] relative">
                      <img
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        className="object-cover w-full h-full rounded-lg"
                      />
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}