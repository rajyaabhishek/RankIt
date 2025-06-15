"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react"

export default function FeaturedRankings() {
  // This would come from an API in a real app
  const featuredRankings = [
    {
      id: 1,
      title: "Best Smartphones of 2023",
      category: "Smartphones",
      items: [
        { id: 1, name: "iPhone 15 Pro", votes: 1243 },
        { id: 2, name: "Samsung Galaxy S23", votes: 1156 },
        { id: 3, name: "Google Pixel 8", votes: 987 },
      ],
    },
    {
      id: 2,
      title: "Top Netflix Series",
      category: "Series",
      items: [
        { id: 1, name: "Stranger Things", votes: 2341 },
        { id: 2, name: "Wednesday", votes: 2156 },
        { id: 3, name: "Squid Game", votes: 1987 },
      ],
    },
    {
      id: 3,
      title: "Best Fast Food Chains",
      category: "Food",
      items: [
        { id: 1, name: "In-N-Out Burger", votes: 1843 },
        { id: 2, name: "Chick-fil-A", votes: 1756 },
        { id: 3, name: "Five Guys", votes: 1587 },
      ],
    },
  ]

  const [votedItems, setVotedItems] = useState<Record<string, "up" | "down" | null>>({})

  const handleVote = (rankingId: number, itemId: number, direction: "up" | "down") => {
    const key = `${rankingId}-${itemId}`
    setVotedItems((prev) => ({
      ...prev,
      [key]: prev[key] === direction ? null : direction,
    }))
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredRankings.map((ranking) => (
        <Card key={ranking.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <Link href={`/rankings/${ranking.id}`}>
                    <h3 className="font-semibold text-lg hover:underline">{ranking.title}</h3>
                  </Link>
                  <Badge variant="outline" className="mt-1">
                    {ranking.category}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="divide-y">
              {ranking.items.map((item, index) => {
                const voteKey = `${ranking.id}-${item.id}`
                const userVote = votedItems[voteKey]

                return (
                  <div key={item.id} className="p-4 flex items-center gap-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary to-yellow-400 text-black rounded-lg font-bold text-lg flex items-center justify-center">
                      #{index + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.votes + (userVote === "up" ? 1 : userVote === "down" ? -1 : 0)} votes
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={userVote === "up" ? "text-green-500" : ""}
                        onClick={() => handleVote(ranking.id, item.id, "up")}
                      >
                        <ArrowUpCircle className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={userVote === "down" ? "text-red-500" : ""}
                        onClick={() => handleVote(ranking.id, item.id, "down")}
                      >
                        <ArrowDownCircle className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="p-3 bg-muted/50 flex justify-center">
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/rankings/${ranking.id}`}>View full ranking</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

