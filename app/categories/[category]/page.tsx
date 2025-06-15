"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, SlidersHorizontal, Target, Trophy, Crown, Star, Flame, TrendingUp, Calendar, Heart, Eye, Zap, Plus, User } from "lucide-react"
import { useEffect, useState } from "react"
import { getCategoryBySlug, Category } from "@/lib/categories"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface RankingItem {
  id: number;
  name: string;
  votes: number;
}

interface Ranking {
  _id: string;
  id: string;
  title: string;
  description: string;
  category: string;
  author: {
    name: string;
    image?: string;
  };
  createdAt: string;
  items: RankingItem[];
  totalVotes: number;
  itemCount: number;
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const [category, setCategory] = useState<string>("")
  const [categoryInfo, setCategoryInfo] = useState<Category | null>(null)
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unwrapParams = async () => {
      const unwrappedParams = await params
      setCategory(unwrappedParams.category)
      const info = getCategoryBySlug(unwrappedParams.category)
      setCategoryInfo(info || null)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    const fetchRankings = async () => {
      if (!category) return
      
      try {
        setLoading(true)
        const response = await fetch('/api/rankings')
        const data = await response.json()
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch rankings')
        }
        
        // Filter rankings by category
        const categoryRankings = (data.rankings || []).filter((ranking: Ranking) => 
          ranking.category.toLowerCase() === category.toLowerCase()
        )
        
        // Calculate total votes and item count for each ranking
        const enrichedRankings = categoryRankings.map((ranking: Ranking) => ({
          ...ranking,
          totalVotes: ranking.items?.reduce((sum, item) => sum + item.votes, 0) || 0,
          itemCount: ranking.items?.length || 0
        }))
        
        setRankings(enrichedRankings)
      } catch (error) {
        console.error('Error fetching rankings:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRankings()
  }, [category])

  const renderRankingCard = (ranking: Ranking, index: number) => {
    // Safely parse date for each ranking
    const formattedDate = (() => {
      try {
        return new Date(ranking.createdAt).toLocaleDateString();
      } catch (e) {
        return 'Unknown date';
      }
    })();

    // Use ranking._id for the link, which matches what's in MongoDB
    const rankingId = ranking._id;
    
    // Dynamic colors for variety
    const colors = [
      "from-red-500/20 to-orange-500/20",
      "from-blue-500/20 to-purple-500/20", 
      "from-green-500/20 to-blue-500/20",
      "from-yellow-500/20 to-red-500/20",
      "from-purple-500/20 to-pink-500/20",
      "from-indigo-500/20 to-blue-500/20"
    ];
    const colorClass = colors[index % colors.length];

    return (
      <Link key={rankingId} href={`/rankings/${rankingId}`}>
        <Card className={`h-full flex flex-col hover:scale-105 transition-all duration-300 cursor-pointer bg-white border-2 border-gray-200 hover:border-yellow group overflow-hidden`}>
          <CardHeader className={`bg-gradient-to-r ${colorClass} border-b border-gray-200 relative`}>
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 flex-1">
                <CardTitle className="text-lg text-navy group-hover:text-yellow transition-colors line-clamp-2">
                  {ranking.title}
                </CardTitle>
              </div>
              <Badge 
                variant="secondary" 
                className="bg-yellow/20 text-navy border-yellow gap-1"
              >
                <Target className="h-3 w-3" />
                {ranking.category}
              </Badge>
            </div>
            <CardDescription className="text-navy/70 line-clamp-2">
              {ranking.description}
            </CardDescription> 
          </CardHeader>
          <CardContent className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-r from-yellow/10 to-orange-400/10">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-8 w-8 border-2 border-yellow">
                <AvatarImage src={ranking.author.image} alt={ranking.author.name} />
                <AvatarFallback className="bg-yellow text-navy font-bold text-xs">
                  {ranking.author.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-navy/60" />
                  <span className="text-sm font-semibold text-navy truncate">
                    {ranking.author.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-navy/50">
                  <Calendar className="h-3 w-3" />
                  <span>{formattedDate}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-green-600">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs font-semibold">{ranking.totalVotes}</span>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <Star className="h-3 w-3" />
                  <span className="text-xs font-semibold">{ranking.itemCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow">
                <Eye className="h-3 w-3" />
                <span className="text-xs font-bold">View Ranking</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  };

  if (loading || !categoryInfo) {
    return (
      <div className="min-h-screen bg-navy">
        <div className="container px-4 md:px-6 py-8 flex items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright"></div>
            <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-yellow animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Enhanced header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="hover:bg-yellow/20 text-yellow">
                <Link href="/categories">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-4xl">{categoryInfo.icon}</div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow to-white bg-clip-text">
                    {categoryInfo.name}
                  </h1>
                  <p className="text-white/60 text-sm">{categoryInfo.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-yellow">
              <Trophy className="h-5 w-5" />
              <span className="text-sm font-semibold">{rankings.length} Rankings</span>
            </div>
          </div>

          {rankings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                <Crown className="h-20 w-20 text-yellow/50 mx-auto" />
                <Star className="absolute -top-2 -right-2 h-8 w-8 text-yellow/50" />
              </div>
              <p className="text-white/60 text-lg mb-6">No rankings found for {categoryInfo.name} 📭</p>
              <Button asChild className="bg-yellow hover:bg-yellow/80 text-navy font-bold gap-2">
                <Link href="/create">
                  <Plus className="h-4 w-4" />
                  Create a Ranking
                </Link>
              </Button>
            </div>
          ) :
            <Tabs defaultValue="popular" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white border border-gray-200 rounded-md p-1 h-10">
                <TabsTrigger 
                  value="popular" 
                  className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2 justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all"
                >
                  <Crown className="h-4 w-4" />
                  Popular ({rankings.filter(r => r.totalVotes > 100).length})
                </TabsTrigger>
                <TabsTrigger 
                  value="recent" 
                  className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2 justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all"
                >
                  <Calendar className="h-4 w-4" />
                  Recent ({rankings.filter(r => {
                    const createdDate = new Date(r.createdAt);
                    const now = new Date();
                    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
                    return daysDiff <= 7;
                  }).length})
                </TabsTrigger>
                <TabsTrigger 
                  value="trending" 
                  className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2 justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all"
                >
                  <Flame className="h-4 w-4" />
                  Trending ({rankings.filter(r => {
                    const createdDate = new Date(r.createdAt);
                    const now = new Date();
                    const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24);
                    return daysDiff <= 3 && r.totalVotes > 50;
                  }).length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="popular" className="mt-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-1 text-yellow">
                      <Crown className="h-4 w-4" />
                      <span className="text-sm font-semibold">Most Voted</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-semibold">Top Rated</span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rankings
                    .sort((a, b) => b.totalVotes - a.totalVotes)
                    .map((ranking, index) => renderRankingCard(ranking, index))}
                </div>
              </TabsContent>
              
              <TabsContent value="recent" className="mt-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm font-semibold">Latest First</span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-400">
                      <Star className="h-4 w-4" />
                      <span className="text-sm font-semibold">Fresh Content</span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rankings
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((ranking, index) => renderRankingCard(ranking, index))}
                </div>
              </TabsContent>
              
              <TabsContent value="trending" className="mt-8">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-1 text-orange-400">
                      <Flame className="h-4 w-4 animate-bounce" />
                      <span className="text-sm font-semibold">Hot Right Now</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow">
                      <Zap className="h-4 w-4" />
                      <span className="text-sm font-semibold">Buzzing</span>
                    </div>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {rankings
                    .filter(ranking => {
                      const createdDate = new Date(ranking.createdAt)
                      const now = new Date()
                      const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)
                      return daysDiff <= 7 // Rankings from last 7 days
                    })
                    .sort((a, b) => b.totalVotes - a.totalVotes)
                    .map((ranking, index) => renderRankingCard(ranking, index))}
                </div>
              </TabsContent>
            </Tabs>
          }
        </div>
      </div>
    </div>
  )
}