"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Flame, TrendingUp, Star, Crown, Zap, Award, Trophy, Eye } from "lucide-react"
import { categories, getCategoryCount, Category } from "@/lib/categories"
import { useEffect, useState } from "react"

interface CategoryWithCount extends Category {
  count: number;
}

export default function CategoriesPage() {
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const categoriesWithCounts = await Promise.all(
          categories.map(async (category) => ({
            ...category,
            count: await getCategoryCount(category.slug)
          }))
        );
        setCategoriesWithCounts(categoriesWithCounts);
      } catch (error) {
        console.error('Error fetching category counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  const renderCategoryGrid = (categoriesToRender: CategoryWithCount[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categoriesToRender.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="group h-full"
        >
         <div 
  className={`h-full rounded-xl border-2 border-gray-200 hover:border-yellow-bright transition-all p-4 flex flex-col items-center justify-center text-center hover:shadow-lg bg-gradient-to-br ${category.color}`}
>
            <span className="text-4xl mb-2">{category.icon}</span>
            <h3 className="font-semibold text-white group-hover:text-yellow-bright transition-colors">
              {category.name}
            </h3>
            <div className="mt-2 flex items-center gap-1 text-sm text-white/80">
              <Trophy className="h-4 w-4" />
              <span>{category.count} rankings</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-yellow-bright border-opacity-20 border-t-yellow-bright"></div>
          <Crown className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-yellow animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8">
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Target className="h-10 w-10 text-yellow animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-bright to-navy bg-clip-text text-transparent">
              Categories
            </h1>
            <Target className="h-10 w-10 text-yellow animate-pulse" />
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-1 text-green-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">Browse</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">Discover</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <Eye className="h-4 w-4" />
              <span className="text-sm font-semibold">Explore</span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 bg-white border border-gray-200">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              All ({categoriesWithCounts.length})
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2"
            >
              <Crown className="h-4 w-4" />
              Popular ({categoriesWithCounts.filter(c => c.count > 50).length})
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="data-[state=active]:bg-yellow-bright/10 data-[state=active]:text-yellow-bright text-gray-600 flex items-center gap-2"
            >
              <Flame className="h-4 w-4" />
              Trending ({categoriesWithCounts.filter(c => c.count > 100).length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-8">
            <div className="text-center mb-6">
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1 text-gray-600">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">All Categories</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Star className="h-4 w-4" />
                  <span className="text-sm font-medium">Complete List</span>
                </div>
              </div>
            </div>
            {renderCategoryGrid(categoriesWithCounts)}
          </TabsContent>
          
          <TabsContent value="popular" className="mt-8">
            <div className="text-center mb-6">
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Crown className="h-4 w-4" />
                  <span className="text-sm font-medium">Most Popular</span>
                </div>
                <div className="flex items-center gap-1 text-orange-500">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">Top Categories</span>
                </div>
              </div>
            </div>
            {renderCategoryGrid(
              categoriesWithCounts
                .filter(c => c.count > 50)
                .sort((a, b) => b.count - a.count)
            )}
          </TabsContent>
          
          <TabsContent value="trending" className="mt-8">
            <div className="text-center mb-6">
              <div className="flex justify-center gap-4">
                <div className="flex items-center gap-1 text-orange-500">
                  <Flame className="h-4 w-4 animate-bounce" />
                  <span className="text-sm font-medium">Hot Right Now</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-bright">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Buzzing</span>
                </div>
              </div>
            </div>
            {renderCategoryGrid(
              categoriesWithCounts
                .filter(c => c.count > 100)
                .sort((a, b) => b.count - a.count)
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

