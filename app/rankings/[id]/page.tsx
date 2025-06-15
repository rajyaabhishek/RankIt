"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowDownCircle, ArrowLeft, ArrowUpCircle, Flag, Heart, Share2, Crown, Star, Trophy, Target, Calendar, User, Zap, Flame, Eye, Medal, Award, Edit3, Plus, Trash2, Save, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { usePremium } from "@/hooks/use-premium"

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
  const { isPremium } = usePremium();
  
  const [ranking, setRanking] = useState<Ranking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [votedItems, setVotedItems] = useState<Record<number, "up" | "down" | null>>({})
  const [isFavorite, setIsFavorite] = useState(false)
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  
  // Edit mode states
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedItems, setEditedItems] = useState<RankingItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");

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

  // Edit mode functions
  const canEditRanking = isSignedIn && isPremium && ranking && user?.username === ranking.author.name;

  const enterEditMode = () => {
    if (!ranking) return;
    setEditedItems([...ranking.items]);
    setIsEditMode(true);
  };

  const exitEditMode = () => {
    setIsEditMode(false);
    setEditedItems([]);
    setNewItemName("");
    setNewItemDescription("");
  };

  const addNewItem = () => {
    if (!newItemName.trim()) return;
    
    const newItem: RankingItem = {
      id: Date.now(), // Temporary ID - will be replaced by backend
      name: newItemName.trim(),
      description: newItemDescription.trim() || undefined,
      votes: 0
    };
    
    setEditedItems([...editedItems, newItem]);
    setNewItemName("");
    setNewItemDescription("");
  };

  const removeItem = (itemId: number) => {
    setEditedItems(editedItems.filter(item => item.id !== itemId));
  };

  const updateItemName = (itemId: number, newName: string) => {
    setEditedItems(editedItems.map(item => 
      item.id === itemId ? { ...item, name: newName } : item
    ));
  };

  const updateItemDescription = (itemId: number, newDescription: string) => {
    setEditedItems(editedItems.map(item => 
      item.id === itemId ? { ...item, description: newDescription } : item
    ));
  };

  const saveChanges = async () => {
    if (!ranking || !rankingId) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/rankings/${rankingId}/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: editedItems.map(item => ({
            name: item.name,
            description: item.description,
            votes: item.votes // Keep existing votes
          }))
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update ranking');
      }

      // Update the ranking state with new data
      setRanking(result.ranking);
      exitEditMode();
      alert('Ranking updated successfully! 🎉');

    } catch (error) {
      console.error('Error updating ranking:', error);
      alert('Failed to update ranking. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

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
              {canEditRanking && (
                <>
                  {!isEditMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={enterEditMode}
                      className="gap-2 border-yellow text-navy hover:bg-yellow/10"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit Ranking
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={saveChanges}
                        disabled={isUpdating}
                        className="gap-2 border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Save className="h-4 w-4" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exitEditMode}
                        disabled={isUpdating}
                        className="gap-2 border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </>
              )}
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
                {isEditMode && (
                  <Badge variant="secondary" className="ml-2 bg-yellow/20 text-navy">
                    Edit Mode
                  </Badge>
                )}
              </h2>
              
              {isEditMode && (
                <div className="text-sm text-navy/60">
                  {editedItems.length} item{editedItems.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            {/* Add new item form (only in edit mode) */}
            {isEditMode && (
              <Card className="border-2 border-dashed border-yellow/50 bg-yellow/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Plus className="h-5 w-5 text-yellow" />
                    <h3 className="font-bold text-navy">Add New Item</h3>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-item-name" className="text-navy font-semibold">Name *</Label>
                      <Input
                        id="new-item-name"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="Enter item name..."
                        className="border-2 border-gray-200 focus:border-yellow"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-item-description" className="text-navy font-semibold">Description</Label>
                      <Input
                        id="new-item-description"
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        placeholder="Enter description (optional)..."
                        className="border-2 border-gray-200 focus:border-yellow"
                      />
                    </div>
                    <Button
                      onClick={addNewItem}
                      disabled={!newItemName.trim()}
                      className="bg-yellow hover:bg-yellow/80 text-navy self-start"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Ranking items list */}
            {(isEditMode ? editedItems : ranking?.items || []).length > 0 ? (
              (isEditMode ? editedItems : ranking?.items || [])
                .sort((a, b) => b.votes - a.votes)
                .map((item, index) => {
                  const position = index + 1;
                  const userVote = votedItems[item.id];
                  
                  return (
                    <Card key={item.id} className={`overflow-hidden transition-all bg-white border-2 ${
                      isEditMode ? 'border-yellow/30' : 'border-gray-200 hover:scale-105 hover:border-yellow'
                    } group`}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-6">
                          {/* Position indicator */}
                          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow/20 text-navy font-bold text-2xl border-2 border-yellow">
                            {position}
                          </div>
                          
                          {/* Item content */}
                          <div className="flex-1 min-w-0">
                            {isEditMode ? (
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-navy font-semibold text-sm">Name</Label>
                                  <Input
                                    value={item.name}
                                    onChange={(e) => updateItemName(item.id, e.target.value)}
                                    className="mt-1 border-2 border-gray-200 focus:border-yellow"
                                  />
                                </div>
                                <div>
                                  <Label className="text-navy font-semibold text-sm">Description</Label>
                                  <Input
                                    value={item.description || ''}
                                    onChange={(e) => updateItemDescription(item.id, e.target.value)}
                                    placeholder="Optional description..."
                                    className="mt-1 border-2 border-gray-200 focus:border-yellow"
                                  />
                                </div>
                                <div className="flex items-center gap-1 text-sm text-navy/60">
                                  <Star className="h-4 w-4 text-yellow" />
                                  <span>{item.votes} votes (preserved)</span>
                                </div>
                              </div>
                            ) : (
                              <>
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
                              </>
                            )}
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-col items-center gap-2">
                            {isEditMode ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            ) : (
                              <>
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
                              </>
                            )}
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

          {/* Premium upgrade notice for non-premium users who own the ranking */}
          {isSignedIn && !isPremium && ranking && user?.username === ranking.author.name && (
            <div className="text-center py-6">
              <Card className="bg-gradient-to-br from-yellow/10 to-orange-400/10 border-2 border-yellow">
                <CardContent className="p-6">
                  <Crown className="h-8 w-8 text-yellow mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-navy mb-2">Want to Edit Your Ranking?</h3>
                  <p className="text-navy/80 mb-4">
                    Upgrade to Premium to add, remove, and edit items in your rankings!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button asChild className="bg-yellow hover:bg-yellow/80 text-navy">
                      <Link href="/premium">
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </Link>
                    </Button>
                    <Button variant="outline" className="border-yellow text-navy hover:bg-yellow/10">
                      Learn More About Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

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