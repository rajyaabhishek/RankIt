"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Heart, Crown, Star, Trophy, Target, Calendar, User, Zap, Flame, Eye, TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

interface LikedRanking {
  rankingId: string;
  rankingTitle: string;
  category: string;
  author: {
    name: string;
    image?: string;
  };
  timestamp: string;
}

export default function LikedRankingsPage() {
  const { isSignedIn, user } = useUser();
  const [likedRankings, setLikedRankings] = useState<LikedRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLikedRankings = async () => {
      if (!isSignedIn || !user?.id) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching liked rankings...');
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/user/likes');
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to fetch liked rankings');
        }
        
        setLikedRankings(data.likes || []);

      } catch (err) {
        console.error("Error fetching liked rankings:", err);
        setError(err instanceof Error ? err.message : 'Failed to load liked rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchLikedRankings();
  }, [isSignedIn, user?.id]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-red-400/50 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-navy mb-4">Sign In Required</h1>
            <p className="text-navy/60 text-lg mb-6">Please sign in to view your liked rankings.</p>
            <Link href="/auth/sign-in">
              <Button className="bg-yellow hover:bg-yellow/90 text-navy">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8 flex items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-400 border-opacity-20 border-t-red-400"></div>
            <Heart className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-red-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          <div className="bg-red-100 border-2 border-red-300 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-red-600" />
              <p className="text-red-600 font-semibold">Error Loading Liked Rankings</p>
            </div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button 
              variant="outline" 
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => window.location.reload()}
            >
              <Zap className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (likedRankings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/rankings">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Rankings
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-red-400/50 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-navy mb-4">No Liked Rankings Yet</h1>
            <p className="text-navy/60 text-lg mb-6">Start exploring rankings and like the ones you enjoy!</p>
            <Link href="/rankings">
              <Button className="bg-yellow hover:bg-yellow/90 text-navy gap-2">
                <Trophy className="h-4 w-4" />
                Explore Rankings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          

          {/* Enhanced header with icons */}
          <div className="text-center py-4">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Heart className="h-10 w-10 text-red-400 animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-red-400 to-pink-500 bg-clip-text text-transparent">
                Liked Rankings
              </h1>
            
              <Heart className="h-10 w-10 text-red-400 animate-pulse" />
            </div>
           
          </div>

          {/* Enhanced grid with better styling */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {likedRankings.map((like, index) => {
              const formattedDate = (() => {
                try {
                  return new Date(like.timestamp).toLocaleDateString();
                } catch (e) {
                  return 'Unknown date';
                }
              })();

              // Dynamic colors for variety
              const colors = [
                "from-red-500/20 to-pink-500/20",
                "from-blue-500/20 to-purple-500/20", 
                "from-green-500/20 to-blue-500/20",
                "from-yellow-500/20 to-red-500/20",
                "from-purple-500/20 to-pink-500/20",
                "from-indigo-500/20 to-blue-500/20"
              ];
              const colorClass = colors[index % colors.length];

              const iconElements = [
                <Crown className="h-5 w-5 text-yellow" key="crown" />,
                <Star className="h-5 w-5 text-yellow" key="star" />,
                <Trophy className="h-5 w-5 text-yellow" key="trophy" />,
                <Flame className="h-5 w-5 text-red-400" key="flame" />,
                <Zap className="h-5 w-5 text-orange-400" key="zap" />
              ];
              const randomIcon = iconElements[index % iconElements.length];
              
              return (
                <Link key={like.rankingId} href={`/rankings/${like.rankingId}`} passHref>
                  <Card className={`h-full flex flex-col hover:scale-105 transition-all duration-300 cursor-pointer bg-white border-2 border-gray-200 hover:border-red-400 group overflow-hidden`}>
                    <CardHeader className={`bg-gradient-to-r ${colorClass} border-b border-gray-200 relative`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 flex-1">
                          <CardTitle className="text-lg text-navy group-hover:text-red-400 transition-colors line-clamp-2">
                            {like.rankingTitle}
                          </CardTitle>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="secondary" 
                            className="bg-yellow/20 text-navy border-yellow gap-1"
                          >
                            <Target className="h-3 w-3" />
                            {like.category}
                          </Badge>
                          <Heart className="h-5 w-5 text-red-400 fill-current" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-r from-red-400/5 to-pink-400/5">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-8 w-8 border-2 border-red-400">
                          <AvatarImage src={like.author.image} alt={like.author.name} />
                          <AvatarFallback className="bg-red-400 text-white font-bold text-xs">
                            {like.author.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3 text-navy/60" />
                            <span className="text-sm font-semibold text-navy truncate">
                              {like.author.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-navy/50">
                            <Calendar className="h-3 w-3" />
                            <span>Liked on {formattedDate}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                        <div className="flex items-center gap-1 text-red-400">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-bold">View Ranking</span>
                        </div>
                        <div className="flex items-center gap-1 text-navy/60">
                          <Heart className="h-4 w-4 fill-current text-red-400" />
                          <span className="text-xs">Liked</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })} 
          </div>
        </div>
      </div>
    </div>
  );
} 