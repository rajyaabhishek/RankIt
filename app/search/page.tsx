"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Search, Trophy, Target, Users, Eye, Heart, Star } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useEffect, useState, Suspense } from "react"
import { categories, Category } from "@/lib/categories"

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
  totalVotes?: number;
  itemCount?: number;
}

interface CategoryWithCount extends Category {
  count: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Get rankings from API
        const response = await fetch('/api/rankings');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch rankings');
        }
        
        // Filter rankings based on search query
        const filteredRankings = (data.rankings || []).filter((ranking: Ranking) => 
          ranking.title.toLowerCase().includes(query.toLowerCase()) ||
          ranking.description.toLowerCase().includes(query.toLowerCase())
        );
        
        setRankings(filteredRankings);
        
        // Filter categories based on search query
        const filteredCategories = categories
          .filter(category => 
            category.name.toLowerCase().includes(query.toLowerCase()) ||
            category.description.toLowerCase().includes(query.toLowerCase())
          )
          .map(category => ({
            ...category,
            count: filteredRankings.filter((ranking: Ranking) => 
              ranking.category.toLowerCase() === category.slug.toLowerCase()
            ).length
          }));
        
        setCategories(filteredCategories);
      } catch (error) {
        console.error('Error searching rankings:', error);
        setError(error instanceof Error ? error.message : "Failed to load search results")
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const renderRankingCard = (ranking: Ranking) => (
    <Link key={ranking._id} href={`/rankings/${ranking._id}`}>
                  <Card className="overflow-hidden transition-all hover:scale-105 bg-white border-2 border-gray-200 hover:border-yellow-bright group">
        <CardHeader>
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-navy line-clamp-2 group-hover:text-yellow transition-colors">
                {ranking.title}
              </CardTitle>
              <CardDescription className="text-navy/60 line-clamp-2">
                {ranking.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 bg-yellow/20 text-navy px-2 py-1 rounded-full text-xs font-bold">
              <Target className="h-3 w-3" />
              {ranking.category}
            </div>
          </div>
        </CardHeader>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-xs text-navy/60">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>by {ranking.author.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{new Date(ranking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container px-4 md:px-6 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="icon" asChild className="hover:bg-yellow/20 text-navy">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-navy">Search Results</h1>
          </div>
          <div className="flex items-center justify-center h-[50vh]">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright"></div>
              <Search className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-navy animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
          </div>
          <div className="bg-destructive/15 p-4 rounded-md">
            <p className="text-destructive">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  const hasResults = rankings.length > 0 || categories.length > 0

  // Function to safely click on tab triggers
  const switchToTab = (tabValue: string) => {
    const tabElement = document.querySelector(`[data-value="${tabValue}"]`) as HTMLElement | null;
    if (tabElement) {
      tabElement.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-yellow/20 text-navy">
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text">Search Results</h1>
              {query && (
                <p className="text/60">
                  Showing results for "<span className="text-yellow font-semibold">{query}</span>"
                </p>
              )}
            </div>
          </div>

          {/* Results */}
          {!query ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-yellow/50 mx-auto mb-4" />
              <p className="text-white/60 text-lg">Enter a search query to find rankings</p>
            </div>
          ) : rankings.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-16 w-16 text-yellow/50 mx-auto mb-4" />
              <p className="text-white/60 text-lg mb-4">No rankings found for "{query}"</p>
              <Button asChild className="bg-yellow hover:bg-yellow/80 text-navy font-bold">
                <Link href="/create">Create a Ranking</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-white border-2 border-gray-200">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-yellow data-[state=active]:text-navy text-navy flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  All Results ({rankings.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-8">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rankings.map(renderRankingCard)}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright mx-auto mb-4"></div>
          <p className="text-white">Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
