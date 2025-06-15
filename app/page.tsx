"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser, SignUpButton } from "@clerk/nextjs"
import { ArrowDownCircle, ArrowUpCircle, Plus, Trophy, Star, Flame, TrendingUp, Users, Eye, Zap, Heart, Target, Crown, Medal, Award, Grid3X3, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
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

interface Category {
  name: string;
  icon: string;
  count: number;
  slug: string;
  description?: string;
  color?: string;
  totalVotes?: number;
}

export default function Home() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [featuredRankings, setFeaturedRankings] = useState<Ranking[]>([])
  const [popularRankings, setPopularRankings] = useState<Ranking[]>([])
  const [trendingRankings, setTrendingRankings] = useState<Ranking[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [votedItems, setVotedItems] = useState<Record<string, "up" | "down" | null>>({})
  const [userVotes, setUserVotes] = useState<any[]>([])
  const showVoting = isSignedIn && !loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch rankings
        const rankingsResponse = await fetch('/api/rankings')
        const rankingsData = await rankingsResponse.json()
        
        if (!rankingsResponse.ok) {
          throw new Error(rankingsData.error || 'Failed to fetch rankings')
        }
        
        const allRankings = rankingsData.rankings || []
        
        // Set featured rankings (latest 6)
        setFeaturedRankings(allRankings.slice(0, 6))
        
        // Sort by total votes for popular rankings
        const sortedByVotes = [...allRankings].sort((a: Ranking, b: Ranking) => {
          const totalVotesA = a.items?.reduce((sum: number, item: RankingItem) => sum + item.votes, 0) || 0
          const totalVotesB = b.items?.reduce((sum: number, item: RankingItem) => sum + item.votes, 0) || 0
          return totalVotesB - totalVotesA
        })
        setPopularRankings(sortedByVotes.slice(0, 6))
        
        // Get trending (recent rankings with high activity)
        const recentRankings = allRankings.filter((ranking: Ranking) => {
          const createdDate = new Date(ranking.createdAt)
          const now = new Date()
          const daysDiff = (now.getTime() - createdDate.getTime()) / (1000 * 3600 * 24)
          return daysDiff <= 7 // Rankings from last 7 days
        }).sort((a: Ranking, b: Ranking) => {
          const totalVotesA = a.items?.reduce((sum: number, item: RankingItem) => sum + item.votes, 0) || 0
          const totalVotesB = b.items?.reduce((sum: number, item: RankingItem) => sum + item.votes, 0) || 0
          return totalVotesB - totalVotesA
        })
        setTrendingRankings(recentRankings.slice(0, 4))
        
        // Fetch categories with proper matching logic from API
        const categoriesResponse = await fetch('/api/categories')
        const categoriesData = await categoriesResponse.json()
        
        if (categoriesResponse.ok && categoriesData.success) {
          setCategories(categoriesData.categories)
          
          // Debug logging
          console.log('🏷️ Categories loaded:', categoriesData.categories.length)
          console.log('📊 Debug info:', categoriesData.debug)
        } else {
          console.error('Failed to load categories:', categoriesData.error)
          setCategories([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Fetch user votes when user is signed in
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!isLoaded || !isSignedIn || !user?.id) return;
      
      try {
        const response = await fetch(`/api/user/votes?userId=${user.id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch votes');
        }
        
        // Convert votes to the format used by the UI
        const votesMap: Record<string, "up" | "down" | null> = {};
        data.votes.forEach((vote: any) => {
          votesMap[`${vote.rankingId}-${vote.itemId}`] = vote.direction;
        });
        
        setVotedItems(votesMap);
        setUserVotes(data.votes || []);
      } catch (error) {
        console.error('Error fetching user votes:', error);
      }
    };
    
    fetchUserVotes();
  }, [isLoaded, isSignedIn, user?.id]);

  // Update the handleVote function to properly track votes
  const handleVote = async (rankingId: string, itemId: number, direction: "up" | "down") => {
    if (!isSignedIn) {
      alert('Please sign in to vote.');
      return
    }
    
    const key = `${rankingId}-${itemId}`
    const currentVote = votedItems[key]
    const newDirection = currentVote === direction ? null : direction
    
    // Optimistically update UI
    setVotedItems(prev => ({
      ...prev,
      [key]: newDirection
    }))
    
    // Update the ranking item votes in state
    const updateRankings = (prevRankings: Ranking[]) => 
      prevRankings.map(ranking => {
        if (ranking._id === rankingId) {
          return {
            ...ranking,
            items: ranking.items.map(item => {
              if (item.id === itemId) {
                let voteChange = 0
                if (currentVote === 'up' && newDirection !== 'up') voteChange--
                if (currentVote === 'down' && newDirection !== 'down') voteChange++
                if (currentVote !== 'up' && newDirection === 'up') voteChange++
                if (currentVote !== 'down' && newDirection === 'down') voteChange--
                
                return { ...item, votes: Math.max(0, item.votes + voteChange) }
              }
              return item
            })
          }
        }
        return ranking
      })
    
    setFeaturedRankings(updateRankings)
    setPopularRankings(updateRankings)
    setTrendingRankings(updateRankings)
    
    // Send vote to server
    try {
      const response = await fetch(`/api/rankings/${rankingId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          itemId,
          direction: newDirection,
        }),
      })
      
      if (!response.ok) {
        // Revert optimistic update on error
        setVotedItems(prev => ({
          ...prev,
          [key]: currentVote
        }))
        console.error('Failed to submit vote')
        alert('Failed to submit vote. Please try again.')
      } else {
        // Update user votes if successful
        const data = await response.json();
        if (newDirection) {
          // Add to user votes
          setUserVotes(prev => [
            ...prev.filter(v => !(v.rankingId === rankingId && v.itemId === itemId)),
            {
              rankingId,
              itemId,
              itemName: featuredRankings.find(r => r._id === rankingId)?.items.find(i => i.id === itemId)?.name || '',
              rankingTitle: featuredRankings.find(r => r._id === rankingId)?.title || '',
              category: featuredRankings.find(r => r._id === rankingId)?.category || '',
              direction: newDirection,
              votedAt: new Date().toISOString()
            }
          ]);
        } else {
          // Remove from user votes
          setUserVotes(prev => prev.filter(v => !(v.rankingId === rankingId && v.itemId === itemId)));
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setVotedItems(prev => ({
        ...prev,
        [key]: currentVote
      }))
      console.error('Error submitting vote:', error)
      alert('Failed to submit vote. Please try again.')
    }
  }

  const renderRankingCard = (ranking: Ranking, isCompact: boolean = false) => (
    <Card className="overflow-hidden transition-all hover:scale-105 bg-white border-2 border-gray-200 hover:border-yellow-bright group h-full">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-navy-deep group-hover:text-yellow-bright transition-colors line-clamp-2">
            {ranking.title}
          </h3>
          <Badge variant="outline" className="border-yellow-bright/50 text-yellow-bright bg-yellow-bright/10 shrink-0">
            {ranking.category}
          </Badge>
        </div>
        <div className="space-y-3">
          {ranking.items.slice(0, 3).map((item, idx) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-navy-deep line-clamp-1">{item.name}</span>
              </div>
              {showVoting && isSignedIn ? (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVote(ranking._id, item.id, "up");
                    }}
                    className={`h-6 w-6 p-0 ${
                      votedItems[`${ranking._id}-${item.id}`] === "up" 
                        ? "text-green-600" 
                        : "text-navy/40 hover:text-green-600"
                    }`}
                  >
                    <ArrowUpCircle className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-semibold text-navy min-w-[2rem] text-center">
                    {item.votes}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      handleVote(ranking._id, item.id, "down");
                    }}
                    className={`h-6 w-6 p-0 ${
                      votedItems[`${ranking._id}-${item.id}`] === "down" 
                        ? "text-red-600" 
                        : "text-navy/40 hover:text-red-600"
                    }`}
                  >
                    <ArrowDownCircle className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Heart className="h-3 w-3" />
                  <span className="text-xs font-semibold">{item.votes}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright mx-auto mb-4"></div>
            <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-yellow animate-pulse" />
          </div>
          <p className="text-navy-deep text-lg">Loading amazing rankings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Keep Dark for Impact */}
      <div className="relative bg-navy-deep py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-yellow-bright via-white to-yellow-bright bg-clip-text text-transparent mb-6">
              Create & Discover Rankings
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Vote, Rank & Discover.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isLoaded && isSignedIn ? (
                <Button asChild size="lg" className="bg-yellow-bright hover:bg-yellow-300 text-navy-deep font-bold">
                  <Link href="/create">
                    <Plus className="h-5 w-5 mr-2" />
                    Create Ranking
                  </Link>
                </Button>
              ) : (
                <SignUpButton mode="modal">
                  <Button size="lg" className="bg-yellow-bright hover:bg-yellow-300 text-navy-deep font-bold">
                    <Crown className="h-5 w-5 mr-2" />
                    Get Started
                  </Button>
                </SignUpButton>
              )}
              <Button variant="outline" size="lg" asChild className="border-yellow-bright text-yellow-bright hover:bg-yellow-bright/20">
                <Link href="/rankings">
                  <Eye className="h-5 w-5 mr-2" />
                  Explore Rankings
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Preview - Light Background */}
      <div className="bg-gray-50 py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-8 w-8 text-yellow-bright" />
              <h2 className="text-3xl font-bold text-navy-deep">Most Voted Categories</h2>
            </div>
           
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="group h-full"
                >
                  <div className="h-full bg-white rounded-xl border-2 border-gray-200 hover:border-yellow-bright transition-all p-4 flex flex-col items-center justify-center text-center hover:shadow-lg">
                    <span className="text-4xl mb-2">{category.icon}</span>
                    <h3 className="font-semibold text-navy-deep group-hover:text-yellow-bright transition-colors">
                      {category.name}
                    </h3>
                    <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>{category.count} rankings</span>
                      </div>

                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No categories with votes yet. Start voting to see popular categories!</p>
            </div>
          )}
          
          <div className="text-center mt-8">
            <Button variant="outline" asChild className="border-navy-deep text-navy-deep hover:bg-navy-deep hover:text-white">
              <Link href="/categories">
                View All Categories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Trending Rankings - Light Background */}
      {trendingRankings.length > 0 && (
        <div className="bg-gray-50 py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Flame className="h-8 w-8 text-orange-500 animate" />
                <h2 className="text-3xl font-bold text-navy-deep">Trending This Week</h2>
              </div>
            
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {trendingRankings.map((ranking) => (
                <Link key={ranking._id} href={`/rankings/${ranking._id}`}>
                  {renderRankingCard(ranking, true)}
                </Link>
              ))}
            </div>
            
            <div className="text-center">
              <Button variant="outline" asChild className="border-navy-deep text-navy-deep hover:bg-navy-deep hover:text-white">
                <Link href="/rankings">
                  View All Rankings
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Rankings */}
      <div className="container px-4 md:px-6 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-yellow-bright" />
            <h2 className="text-3xl font-bold text-navy-deep">Featured Rankings</h2>
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRankings.map((ranking) => (
            <Link key={ranking._id} href={`/rankings/${ranking._id}`}>
              {renderRankingCard(ranking)}
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Rankings */}
      <div className="bg-gray-50 py-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-bright" />
              <h2 className="text-3xl font-bold text-navy-deep">Most Popular</h2>
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRankings.map((ranking) => (
              <Link key={ranking._id} href={`/rankings/${ranking._id}`}>
                {renderRankingCard(ranking)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section - Keep Dark for Impact */}
      <div className="bg-navy-deep border-t-4 border-yellow-bright">
        <div className="container px-4 md:px-6 py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Crown className="h-16 w-16 text-yellow-bright mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Create Your Own Ranking?
            </h2>
            <p className="text-white/90 text-lg mb-8">
              Join thousands of users creating and voting on rankings. Share your opinions and discover new perspectives!
            </p>
            {isLoaded && isSignedIn ? (
              <Button asChild size="lg" className="bg-yellow-bright hover:bg-yellow-300 text-navy-deep font-bold">
                <Link href="/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Ranking
                </Link>
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className="bg-yellow-bright hover:bg-yellow-300 text-navy-deep font-bold">
                  <Crown className="h-5 w-5 mr-2" />
                  Join Our Community
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
