'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from 'lucide-react'

import { Link } from "react-router-dom"

const items = [
  { id: 1, title: "Mountain Landscape", category: "Nature", imageUrl: "/placeholder.svg?height=200&width=300" },
  { id: 2, title: "City Skyline", category: "Urban", imageUrl: "/placeholder.svg?height=200&width=300" },
  { id: 3, title: "Beach Sunset", category: "Nature", imageUrl: "/placeholder.svg?height=200&width=300" },
  { id: 4, title: "Modern Architecture", category: "Urban", imageUrl: "/placeholder.svg?height=200&width=300" },
  { id: 5, title: "Forest Trail", category: "Nature", imageUrl: "/placeholder.svg?height=200&width=300" },
  { id: 6, title: "Street Art", category: "Urban", imageUrl: "/placeholder.svg?height=200&width=300" },
]

export default function Component() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredItems = items.filter(item => 
    (filter === 'All' || item.category === filter) &&
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Nature">Nature</SelectItem>
            <SelectItem value="Urban">Urban</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle>{item.title}</CardTitle>
            </CardContent>
            <CardFooter>
              <Link to="/bookdetails">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}