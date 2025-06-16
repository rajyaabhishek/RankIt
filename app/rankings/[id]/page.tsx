"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, Flag, Heart, Share2, Star, Target, Calendar, User, Eye, Crown, Flame, Zap, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

interface RankingItem {
  id: number;
  name: string;
  description?: string;
  votes: number;
}

interface Ranking {
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
  _id: string;
}

export default function RankingPage({ params }: { params: any }) {
  // Extract ID from pathname instead of params
  const pathname = usePathname();
  const rankingId = pathname ? pathname.split('/').pop() : "";
  const { isSignedIn, user } = useUser();
  
  const [ranking, setRanking] = useState<Ranking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedItems, setVotedItems] = useState<Record<number, "up" | "down" | null>>({})
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  


  useEffect(() => {
    const fetchRanking = async () => {
      if (!rankingId) {
        console.log("Ranking ID not available yet, skipping fetch.");
        setError("Ranking ID is missing or invalid");
        setLoading(false);
        return;
      }
      
      try {
        console.log('Fetching ranking for ID:', rankingId);
        setLoading(true);
        setError(null);
        
        // Fetch the ranking details
        const rankingResponse = await fetch(`/api/rankings/${rankingId}`);
        const rankingData = await rankingResponse.json();

        if (!rankingResponse.ok || !rankingData.success) {
          throw new Error(rankingData.error || 'Failed to fetch ranking from API');
        }
        
        setRanking(rankingData.ranking as Ranking);

      } catch (err) {
        console.error("Error fetching ranking details:", err);
        setError(err instanceof Error ? err.message : 'Failed to load ranking');
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [rankingId]);

  // Fetch user votes when signed in
  useEffect(() => {
    const fetchUserVotes = async () => {
      if (!isSignedIn || !user?.id || !rankingId) return;
      
      try {
        const response = await fetch(`/api/user/votes?userId=${user.id}&rankingId=${rankingId}`);
        const data = await response.json();
        
        if (response.ok && data.votes) {
          const votesMap: Record<number, "up" | "down" | null> = {};
          data.votes.forEach((vote: any) => {
            votesMap[vote.itemId] = vote.direction;
          });
          setVotedItems(votesMap);
        }
      } catch (error) {
        console.error('Error fetching user votes:', error);
      }
    };

    fetchUserVotes();
  }, [isSignedIn, user?.id, rankingId]);

  // Fetch user like status when signed in
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!isSignedIn || !user?.id || !rankingId) return;
      
      try {
        const response = await fetch(`/api/user/likes?rankingId=${rankingId}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setIsFavorite(data.liked);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [isSignedIn, user?.id, rankingId]);

  const handleLike = async () => {
    if (!isSignedIn) {
      alert('Please sign in to like rankings.');
      return;
    }

    if (!rankingId || !ranking) {
      return;
    }

    setIsLikeLoading(true);
    const originalLikeState = isFavorite;
    
    // Optimistically update UI
    setIsFavorite(!isFavorite);

    try {
      const response = await fetch('/api/user/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rankingId,
          rankingTitle: ranking.title,
          category: ranking.category,
          author: ranking.author
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to toggle like');
      }

      // Update UI based on server response
      setIsFavorite(data.liked);
      
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      setIsFavorite(originalLikeState);
      setError('Failed to update like. Please try again.');
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleShare = async () => {
    if (!ranking) return;

    const shareData = {
      title: ranking.title,
      text: `Check out this ranking: ${ranking.title}`,
      url: window.location.href,
    };

    try {
      // Check if native sharing is supported
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        
        // Show a temporary success message
        const originalError = error;
        setError('Link copied to clipboard!');
        setTimeout(() => {
          setError(originalError);
        }, 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      
      // Final fallback - try to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        const originalError = error;
        setError('Link copied to clipboard!');
        setTimeout(() => {
          setError(originalError);
        }, 2000);
      } catch (clipboardErr) {
        console.error('Clipboard fallback failed:', clipboardErr);
        setError('Unable to share. Please copy the URL manually.');
      }
    }
  };

  const handleVote = async (itemId: number, direction: "up" | "down") => {
    if (!isSignedIn) {
      alert('Please sign in to vote.');
      return;
    }

    if (!rankingId) {
      setError("Cannot vote: Ranking ID is missing.");
      return;
    }

    const currentVote = votedItems[itemId];
    const newDirection = currentVote === direction ? null : direction;

    const originalVotes = { ...votedItems };
    setVotedItems((prev) => ({
      ...prev,
      [itemId]: newDirection,
    }));
    
    if (ranking) {
      setRanking(prevRanking => {
        if (!prevRanking) return prevRanking;
        return {
          ...prevRanking,
          items: prevRanking.items.map(item => {
            if (item.id === itemId) {
              let voteChange = 0;
              // Calculate vote change based on previous and new state
              if (currentVote === 'up' && newDirection !== 'up') voteChange--; // Remove upvote
              if (currentVote === 'down' && newDirection !== 'down') voteChange++; // Remove downvote
              if (currentVote !== 'up' && newDirection === 'up') voteChange++; // Add upvote
              if (currentVote !== 'down' && newDirection === 'down') voteChange--; // Add downvote
                            
              return { ...item, votes: Math.max(0, item.votes + voteChange) };
            }
            return item;
          })
        };
      });
    }

    try {
      const response = await fetch(`/api/rankings/${rankingId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userId: user?.id,
          itemId, 
          direction: newDirection 
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update vote via API');
      }

      console.log(`Vote updated successfully for item ${itemId}:`, result);

    } catch (error) {
      console.error("Error updating vote via API:", error);
      setVotedItems(originalVotes); 
      setError("Failed to update vote. Please try again.");
      
      // Revert ranking state on error
      if (ranking) {
        setRanking(prevRanking => {
          if (!prevRanking) return prevRanking;
          return {
            ...prevRanking,
            items: prevRanking.items.map(item => {
              if (item.id === itemId) {
                let voteChange = 0;
                if (originalVotes[itemId] === 'up' && votedItems[itemId] !== 'up') voteChange++;
                if (originalVotes[itemId] === 'down' && votedItems[itemId] !== 'down') voteChange--;
                if (originalVotes[itemId] !== 'up' && votedItems[itemId] === 'up') voteChange--;
                if (originalVotes[itemId] !== 'down' && votedItems[itemId] === 'down') voteChange++;
                              
                return { ...item, votes: Math.max(0, item.votes + voteChange) };
              }
              return item;
            })
          };
        });
      }
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8 flex items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright"></div>
            <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-yellow animate-pulse" />
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
              <p className="text-red-600 font-semibold">Error Loading Ranking</p>
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

  if (!ranking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-navy/50 mx-auto mb-4" />
            <p className="text-navy/60 text-lg">Ranking not found 📭</p>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      return new Date(ranking.createdAt).toLocaleDateString();
    } catch (e) {
      return 'Unknown date';
    }
  })();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8 max-w-4xl mx-auto">
          {/* Enhanced header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild className="hover:bg-yellow/20 text-navy">
                <Link href="/rankings">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-yellow animate-pulse" />
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-yellow-bright to-navy bg-clip-text text-transparent">
                  {ranking.title}
                </h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                disabled={isLikeLoading}
                className={`gap-2 transition-all ${isFavorite ? 'text-red-400 hover:text-red-300' : 'text-navy/60 hover:text-red-400'}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''} ${isLikeLoading ? 'animate-pulse' : ''}`} />
                {isLikeLoading ? 'Loading...' : (isFavorite ? 'Liked' : 'Like')}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleShare}
                className="gap-2 text-navy/60 hover:text-yellow"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-2 text-navy/60 hover:text-orange-400">
                <Flag className="h-4 w-4" />
                Report
              </Button>
            </div>
          </div>

          {/* Enhanced ranking info card */}
          <Card className="overflow-hidden bg-white border-2 border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-yellow">
                      <AvatarImage src={ranking.author.image} alt={ranking.author.name} />
                      <AvatarFallback className="bg-yellow text-navy font-bold">
                        {ranking.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-navy" />
                        <p className="font-semibold text-navy">{ranking.author.name}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-navy/60">
                        <Calendar className="h-3 w-3" />
                        <span>Created on {formattedDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-yellow/20 text-navy border-yellow gap-1">
                      <Target className="h-3 w-3" />
                      {ranking.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-navy/60">
                      <Eye className="h-4 w-4" />
                      <span>{ranking.items?.length || 0} items</span>
                    </div>
                  </div>
                </div>
                
                {ranking.description && (
                  <>
                    <Separator className="bg-gray-200" />
                    <p className="text-navy/80 leading-relaxed">{ranking.description}</p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced ranking items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow" />
                Ranking Items
              </h2>
            </div>
            
            {/* Ranking items list */}
            {(ranking?.items || []).length > 0 ? (
              (ranking?.items || [])
                .sort((a, b) => b.votes - a.votes)
                .map((item, index) => {
                  const position = index + 1;
                  const userVote = votedItems[item.id];
                  
                  return (
                    <Card key={item.id} className="overflow-hidden transition-all bg-white border-2 border-gray-200 hover:scale-105 hover:border-yellow group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          {/* Position indicator */}
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow/20 text-navy font-bold text-2xl border-2 border-yellow">
                            {position}
                          </div>
                          
                          {/* Item content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-navy mb-1 line-clamp-2">{item.name}</h3>
                            {item.description && (
                              <p className="text-navy/60 text-sm line-clamp-2 mb-2">{item.description}</p>
                            )}
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow" />
                                <span className="text-sm font-semibold text-navy">{item.votes} votes</span>
                              </div>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-col items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(item.id, "up")}
                              className={`transition-all hover:scale-110 ${
                                userVote === "up" 
                                  ? "text-green-600 bg-green-100 hover:bg-green-200" 
                                  : "text-navy/60 hover:text-green-600 hover:bg-green-50"
                              }`}
                              disabled={!isSignedIn}
                            >
                              <ArrowUpCircle className="h-6 w-6" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(item.id, "down")}
                              className={`transition-all hover:scale-110 ${
                                userVote === "down" 
                                  ? "text-red-600 bg-red-100 hover:bg-red-200" 
                                  : "text-navy/60 hover:text-red-600 hover:bg-red-50"
                              }`}
                              disabled={!isSignedIn}
                            >
                              <ArrowDownCircle className="h-6 w-6" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
            ) : (
              <div className="text-center py-8">
                <Star className="h-12 w-12 text-yellow/50 mx-auto mb-4" />
                <p className="text-navy/60">No items in this ranking yet.</p>
              </div>
            )}
          </div>



          {!isSignedIn && (
            <div className="text-center py-6">
              <Card className="bg-yellow/10 border-2 border-yellow">
                <CardContent className="p-6">
                  <Crown className="h-8 w-8 text-yellow mx-auto mb-4" />
                  <p className="text-navy mb-4 font-semibold">Sign in to vote on ranking items!</p>
                  <Button asChild className="bg-yellow hover:bg-yellow/80 text-navy">
                    <Link href="/sign-in">Sign In to Vote</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <hr className="border-t border-gray-200 mt-12" />
    </div>
  )
}