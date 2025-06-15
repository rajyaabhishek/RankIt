"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Trophy, Crown, Star, Flame, Calendar, User, Target, Zap, Eye, TrendingUp } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Remove direct API imports
// import { getRankingById, updateVote } from "@/app/api/rankings"

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
  _id: string; // Keep _id if your API uses it, often MongoDB does
}

export default function RankingsListPage() {
  // Change state to hold an array of rankings
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchRankings = async () => {
      
      try {
        console.log('Fetching all rankings...');
        setLoading(true);
        setError(null);
        
        // Fetch from the general /api/rankings endpoint
        const response = await fetch(`/api/rankings`);
        const data = await response.json();
        // console.log('Received API response:', JSON.stringify(data, null, 2)); // Optional: keep for debugging

        if (!response.ok || !data.success) {
          // Adjust error message if needed based on actual API response structure
          throw new Error(data.error || 'Failed to fetch rankings from API');
        }
        
        // Set the array of rankings
        // Assuming the API returns { success: true, rankings: [...] }
        setRankings(data.rankings as Ranking[]); 

      } catch (err) {
        console.error("Error fetching rankings:", err);
        setError(err instanceof Error ? err.message : 'Failed to load rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
    // Remove params.id from dependency array
  }, []); 


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8 flex items-center justify-center h-[50vh]">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright"></div>
            <Trophy className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-navy animate-pulse" />
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
              <p className="text-red-600 font-semibold">Error Loading Rankings</p>
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

  // Check if the rankings array is empty
  if (rankings.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-navy/50 mx-auto mb-4" />
            <p className="text-navy/60 text-lg">No rankings found 📭</p>
          </div>
        </div>
      </div>
    );
  }

  // Remove date formatting for single ranking
  // const formattedDate = (...) => { ... }

  // --- Adjust Rendering Logic for List View ---
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Enhanced header with icons */}
          <div className="text-center py-8">
            <div className="flex justify-center items-center gap-3 mb-4">
              <Crown className="h-10 w-10 text-yellow animate-pulse" />
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-bright to-navy bg-clip-text text-transparent">
                All Rankings
              </h1>
              <Crown className="h-10 w-10 text-yellow animate-pulse" />
            </div>
            <div className="flex justify-center gap-6">
              <div className="flex items-center gap-1 text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">Hot</span>
              </div>
              <div className="flex items-center gap-1 text-red-400">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-semibold">Fresh</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Eye className="h-4 w-4" />
                <span className="text-sm font-semibold">Popular</span>
              </div>
            </div>
          </div>

          {/* Enhanced grid with better styling */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rankings.map((ranking, index) => {
               // Safely parse date for each ranking
              const formattedDate = (() => {
                try {
                  return new Date(ranking.createdAt).toLocaleDateString();
                } catch (e) {
                  return 'Unknown date';
                }
              })();

              // Use ranking.id for the link, which matches what's in MongoDB
              const rankingId = ranking.id;
              
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

              const iconElements = [
                <Crown className="h-5 w-5 text-yellow" key="crown" />,
                <Star className="h-5 w-5 text-yellow" key="star" />,
                <Trophy className="h-5 w-5 text-yellow" key="trophy" />,
                <Flame className="h-5 w-5 text-red-400" key="flame" />,
                <Zap className="h-5 w-5 text-orange-400" key="zap" />
              ];
              const randomIcon = iconElements[index % iconElements.length];
              
              return (
                // Wrap each ranking in a Card and Link
                <Link key={rankingId} href={`/rankings/${rankingId}`} passHref>
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
                        <div className="flex items-center gap-1 text-yellow">
                          <Eye className="h-4 w-4" />
                          <span className="text-sm font-bold">View Ranking</span>
                        </div>
                        <div className="flex items-center gap-1 text-navy/60">
                          <Trophy className="h-4 w-4" />
                          <span className="text-xs">Ranking #{index + 1}</span>
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