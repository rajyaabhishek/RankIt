"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { getVoteBackgroundColor, getVoteColor } from "@/lib/utils/vote-colors"
import { useUser } from "@clerk/nextjs"
import { ArrowDownCircle, ArrowUpCircle, Vote, Trophy, Target, Calendar, User, Crown, Star, Flame, TrendingUp, Eye, Zap, Plus, Heart } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface VoteItem {
  rankingId: string;
  itemId: number;
  itemName: string;
  rankingTitle: string;
  category: string;
  direction: "up" | "down";
  timestamp: string;
}

export default function MyVotes() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [votes, setVotes] = useState<VoteItem[]>([])
  const [votesByCategory, setVotesByCategory] = useState<Record<string, VoteItem[]>>({})
  const [votesByRanking, setVotesByRanking] = useState<Record<string, VoteItem[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/user/votes');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch votes');
        }
        
        setVotes(data.votes || []);
        setVotesByCategory(data.votesByCategory || {});
        setVotesByRanking(data.votesByRanking || {});
      } catch (error) {
        console.error('Error fetching user votes:', error);
        setError('Failed to load your voting history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserVotes();
  }, [isLoaded, isSignedIn]);

  // Get unique rankings
  const uniqueRankings = Object.keys(votesByRanking).map(rankingId => {
    const firstVote = votesByRanking[rankingId][0];
    return {
      rankingId,
      rankingTitle: firstVote?.rankingTitle || 'Unknown Ranking',
      category: firstVote?.category || 'Uncategorized',
      voteCount: votesByRanking[rankingId].length
    };
  });

  // Get the 5 most recent votes
  const recentVotes = [...votes].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ).slice(0, 5);

  if (!isLoaded || loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden bg-white border-2 border-gray-200">
            <CardHeader className="p-4 bg-gray-50 border-b border-gray-200">
              <Skeleton className="h-5 w-3/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/2 bg-gray-200" />
            </CardHeader>
            <CardFooter className="bg-white p-4 flex justify-between">
              <Skeleton className="h-4 w-1/4 bg-gray-200" />
              <Skeleton className="h-4 w-1/4 bg-gray-200" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="text-center py-20">
        <div className="relative mb-6">
          <User className="h-20 w-20 text-primary/50 mx-auto" />
          <Crown className="absolute -top-2 -right-2 h-8 w-8 text-yellow-300/50" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-yellow-300">Sign in to see your votes</h2>
        <p className="text-yellow-300/60 mb-6">Create an account or sign in to track your votes across rankings 🗳️</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 p-6 rounded-lg border-2 border-red-500/30 max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <Flame className="h-6 w-6 text-red-400" />
            <p className="text-red-400 font-semibold">Error Loading Votes</p>
          </div>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (votes.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="relative mb-6">
          <Vote className="h-20 w-20 text-primary/100 mx-auto" />

        </div>
        <h2 className="text-2xl font-bold mb-4 text-yellow-200">No votes yet</h2>
        <p className="text-yellow-300/60 mb-6">You haven't voted on any rankings yet 📭</p>
        <Button asChild className="bg-primary hover:bg-primary/80 text-black font-bold gap-2">
          <Link href="/rankings">
            <Trophy className="h-4 w-4" />
            Explore Rankings
          </Link>
        </Button>
      </div>
    );
  }

  const renderVoteCard = (vote: VoteItem, index: number, showCategory: boolean = true) => {
    return (
      <Card key={`${vote.rankingId}-${vote.itemId}-${index}`} className="overflow-hidden bg-white border border-gray-200 hover:border-yellow-bright/50 transition-colors">
        <CardHeader className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base text-navy-deep flex items-center gap-2">
              
                {vote?.itemName || 'Unknown Item'}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                From <Link href={`/rankings/${vote.rankingId}`} className="text-yellow-bright hover:text-yellow-600 font-medium">
                  {vote?.rankingTitle || 'Unknown Ranking'}
                </Link>
              </CardDescription>
            </div>
            <div className={`px-2.5 py-1 rounded-full flex items-center gap-1 ${
              vote.direction === 'up' 
                ? 'bg-green-500/10 text-green-600 border border-green-500/20'
                : 'bg-red-500/10 text-red-600 border border-red-500/20'
            }`}>
              {vote.direction === "up" ? (
                <ArrowUpCircle className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownCircle className="h-3.5 w-3.5" />
              )}
              <span className="text-xs font-medium">
                {vote.direction === "up" ? "UP" : "DOWN"}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardFooter className="bg-gray-50 p-3 flex justify-between items-center">
          {showCategory && (
            <Badge variant="outline" className="border-yellow-bright/30 text-yellow-bright bg-yellow-bright/5 font-medium flex items-center gap-1">
                <Target className="h-3 w-3 text-yellow-bright" />
              {vote?.category || 'Uncategorized'}
            </Badge>
          )}
          <div className="flex items-center gap-1.5 text-gray-500">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">{new Date(vote.timestamp).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container px-4 md:px-6 py-8">
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Vote className="h-10 w-10 text-yellow animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-bright to-navy bg-clip-text text-transparent">
              My Votes
            </h1>
            <Vote className="h-10 w-10 text-yellow animate-pulse" />
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-1 text-green-400">
              <Heart className="h-4 w-4" />
              <span className="text-sm font-semibold">Liked</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="h-4 w-4" />
              <span className="text-sm font-semibold">Rated</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-semibold">Viewed</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2"
            >
              <Vote className="h-4 w-4" />
              All ({votes.length})
            </TabsTrigger>
            <TabsTrigger 
              value="rankings" 
              className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Rankings ({uniqueRankings.length})
            </TabsTrigger>
            <TabsTrigger 
              value="categories" 
              className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Categories ({Object.keys(votesByCategory).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="text-center mb-4">
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">All Your Votes</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Heart className="h-4 w-4" />
                  <span className="text-sm font-medium">Complete History</span>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {votes.map((vote, index) => (
                <Link key={`${vote.rankingId}-${vote.itemId}-${index}`} href={`/rankings/${vote.rankingId}`}>
                  <Card className="overflow-hidden transition-all hover:scale-105 bg-white border-2 border-gray-200 hover:border-yellow-bright group h-full">
                    <div className="relative h-40 bg-gradient-to-br from-yellow/20 to-orange-400/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`text-6xl font-bold mb-2 ${
                          vote.direction === 'up' ? 'text-green-500/80' : 'text-red-500/80'
                        }`}>
                          {vote.direction === 'up' ? '↑' : '↓'}
                        </div>
                        <div className="text-sm text-navy/80 font-semibold">Vote</div>
                      </div>
                      {/* <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        vote.direction === 'up' 
                          ? 'bg-green-500/90 text-white' 
                          : 'bg-red-500/90 text-white'
                      }`}> */}
                        {/* {vote.direction === 'up' ? (
                          <ArrowUpCircle className="h-3 w-3" />
                        ) : (
                          <ArrowDownCircle className="h-3 w-3" />
                        )}
                        {vote.direction === 'up' ? 'UP' : 'DOWN'} */}
                      </div>
                    {/* </div> */}
                    <CardContent className="p-4 bg-gradient-to-r from-yellow/10 to-orange-400/10">
                      <h3 className="font-bold text-navy line-clamp-2 group-hover:text-yellow-bright transition-colors mb-2">
                        {vote.itemName}
                      </h3>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-1 text-yellow-bright">
                          <Trophy className="h-3 w-3" />
                          <span className="text-xs font-semibold line-clamp-1">{vote.rankingTitle}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-yellow-bright">
                            <Target className="h-3 w-3" />
                            <span className="text-xs font-semibold">{vote.category}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs">{new Date(vote.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rankings" className="mt-6">
            <div className="text-center mb-4">
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Trophy className="h-4 w-4" />
                  <span className="text-sm font-medium">By Ranking</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Organized View</span>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {uniqueRankings.map((ranking) => (
                <Link key={ranking.rankingId} href={`/rankings/${ranking.rankingId}`}>
                  <Card className="overflow-hidden transition-all hover:scale-105 bg-white border-2 border-gray-200 hover:border-yellow-bright group h-full">
                    <div className="relative h-40 bg-gradient-to-br from-yellow/20 to-orange-400/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-yellow/80 mb-2">#{ranking.voteCount}</div>
                        <div className="text-sm text-navy/80 font-semibold">Votes</div>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow/90 text-navy px-2 py-1 rounded-full text-xs font-bold">
                        <Trophy className="h-3 w-3" />
                        Ranking
                      </div>
                    </div>
                    <CardContent className="p-4 bg-gradient-to-r from-yellow/10 to-orange-400/10">
                      <h3 className="font-bold text-navy line-clamp-2 group-hover:text-yellow-bright transition-colors mb-2">
                        {ranking.rankingTitle}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-yellow-bright">
                            <Target className="h-3 w-3" />
                            <span className="text-xs font-semibold">{ranking.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-bright">
                          <Eye className="h-3 w-3" />
                          <span className="text-xs font-bold">View</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="mt-6">
            <div className="text-center mb-4">
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">By Category</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Grouped View</span>
                </div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(votesByCategory).map(([category, categoryVotes]) => (
                <Link key={category} href={`/categories/${category.toLowerCase()}`}>
                  <Card className="overflow-hidden transition-all hover:scale-105 bg-white border-2 border-gray-200 hover:border-yellow-bright group h-full">
                    <div className="relative h-40 bg-gradient-to-br from-yellow/20 to-orange-400/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-yellow/80 mb-2">#{categoryVotes.length}</div>
                        <div className="text-sm text-navy/80 font-semibold">Votes</div>
                      </div>
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow/90 text-navy px-2 py-1 rounded-full text-xs font-bold">
                        <Target className="h-3 w-3" />
                        Category
                      </div>
                    </div>
                    <CardContent className="p-4 bg-gradient-to-r from-yellow/10 to-orange-400/10">
                      <h3 className="font-bold text-navy line-clamp-2 group-hover:text-yellow-bright transition-colors mb-2">
                        {category}
                      </h3>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-green-600">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs font-semibold">
                              {categoryVotes.filter(v => v.direction === 'up').length}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-red-600">
                            <Heart className="h-3 w-3" />
                            <span className="text-xs font-semibold">
                              {categoryVotes.filter(v => v.direction === 'down').length}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-yellow-bright">
                          <Eye className="h-3 w-3" />
                          <span className="text-xs font-bold">View</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}