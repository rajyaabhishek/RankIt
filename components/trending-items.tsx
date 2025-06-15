"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, Crown, Trophy, Star, Flame, Eye } from "lucide-react"

interface TrendingItemsProps {
  region: "global" | "local"
}

interface TrendingItem {
  id: string;
  name: string;
  category: string;
  votes: number;
  change: number;
  rankingId: string;
}

export default function TrendingItems({ region }: TrendingItemsProps) {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/rankings');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch rankings');
        }

        // Get all rankings and their items
        const allItems = (data.rankings || []).flatMap((ranking: any) => 
          (ranking.items || []).map((item: any) => ({
            id: item.id,
            name: item.name,
            category: ranking.category,
            votes: item.votes,
            change: item.votes - (item.previousVotes || 0), // Calculate change from previous votes
            rankingId: ranking._id
          }))
        );

        // Sort by votes and get top items
        const sortedItems = allItems
          .sort((a: TrendingItem, b: TrendingItem) => b.votes - a.votes)
          .slice(0, 6);

        setTrendingItems(sortedItems);
      } catch (error) {
        console.error('Error fetching trending items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingItems();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-2 border-gray-200/20 animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200/20 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200/20 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {trendingItems.map((item) => (
        <Link key={item.id} href={`/rankings/${item.rankingId}`}>
          <Card className="bg-white/5 border-2 border-gray-200/20 hover:border-yellow-bright/50 transition-all group">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-yellow-bright transition-colors truncate">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-400">{item.category}</span>
                    <div className="flex items-center gap-1 text-yellow-bright">
                      <Trophy className="h-3 w-3" />
                      <span className="text-sm font-medium">{item.votes}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
                  item.change > 0 
                    ? 'text-green-400 bg-green-400/10' 
                    : item.change < 0 
                    ? 'text-red-400 bg-red-400/10'
                    : 'text-gray-400 bg-gray-400/10'
                }`}>
                  {item.change > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : item.change < 0 ? (
                    <TrendingDown className="h-3 w-3" />
                  ) : (
                    <Eye className="h-3 w-3" />
                  )}
                  <span>{Math.abs(item.change)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

