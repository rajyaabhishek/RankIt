"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Crown, Star, Zap, Target, Palette, Wand2, Sparkles, FileText, Lock, Trophy, Share2 } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { usePremium } from "@/hooks/use-premium"

import PremiumUpgradeModal from "@/components/premium-upgrade-modal"
import { categories } from "@/lib/categories"

export default function CreateRankingPage() {
  const router = useRouter()
  const { isSignedIn, user } = useUser()
  const { isPremium, isLoading: premiumLoading } = usePremium()
  const [isLoading, setIsLoading] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [items, setItems] = useState([
    { id: 1, name: "", description: "" },
    { id: 2, name: "", description: "" },
    { id: 3, name: "", description: "" },
  ])

  const handleAddItem = () => {
    const newId = Math.max(...items.map((item) => item.id), 0) + 1
    setItems([...items, { id: newId, name: "", description: "" }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length > 2) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const handleItemChange = (id: number, field: "name" | "description", value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is signed in
    if (!isSignedIn) {
      alert('Please sign in to create rankings.');
      return;
    }

    // Check premium status
    if (!isPremium) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);

    try {
      // Get form data
      const form = e.target as HTMLFormElement;
      const formData = new FormData(form);
      
      // Construct the payload with author information from Clerk
      const payload = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category'),
        items: items.map(item => ({
          name: item.name,
          description: item.description
        })),
        author: {
          name: user?.username || "Anonymous",
          image: user?.imageUrl || "https://randomuser.me/api/portraits/lego/1.jpg"
        }
      };
      
      // Call the API endpoint
      const response = await fetch('/api/rankings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create ranking');
      }
      
      // Redirect to the newly created ranking
      router.push(`/rankings/${result.ranking._id}`);
      
    } catch (error) {
      console.error('Error creating ranking:', error);
      alert('Failed to create ranking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Show loading state while checking premium status
  if (premiumLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Zap className="h-8 w-8 text-yellow animate-spin mx-auto mb-4" />
          <p className="text-navy">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 md:px-6 py-8">
        <div className="text-center py-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Plus className="h-10 w-10 text-yellow animate-pulse" />
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-yellow-bright to-navy bg-clip-text text-transparent">
              Create Ranking
            </h1>
            <Plus className="h-10 w-10 text-yellow animate-pulse" />
          </div>
          <div className="flex justify-center gap-6">
            <div className="flex items-center gap-1 text-green-400">
              <Trophy className="h-4 w-4" />
              <span className="text-sm font-semibold">Rank</span>
            </div>
            <div className="flex items-center gap-1 text-orange-500">
              <Star className="h-4 w-4" />
              <span className="text-sm font-semibold">Rate</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400">
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-semibold">Share</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 max-w-4xl mx-auto">


          {/* Enhanced header */}
          <div className="flex items-center justify-between">
            
            
            {/* Premium status indicator */}
            {!isPremium && (
              <div className="flex items-center gap-2 text-navy/60 text-sm">
                <Lock className="h-4 w-4" />
                Premium Required
              </div>
            )}
           
          </div>

          {/* Premium restriction overlay */}
          {!isPremium && (
            <Card className="overflow-hidden bg-white border-2 border-yellow">
              <CardHeader className="bg-yellow/20 border-b border-yellow">
                <CardTitle className="flex items-center gap-2 text-navy">
                  <Crown className="h-5 w-5" />
                  Premium Feature
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <Sparkles className="h-16 w-16 text-yellow animate-pulse mx-auto" />
                    <Star className="absolute -top-1 -right-1 h-6 w-6 text-yellow animate-bounce" />
                  </div>
                  <h3 className="text-xl font-bold text-navy">
                    Create Unlimited Rankings
                  </h3>
                  <p className="text-navy/70 max-w-md mx-auto">
                    Unlock the ability to create unlimited custom rankings with premium features like advanced customization, priority support, and more!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button 
                      onClick={() => setShowUpgradeModal(true)}
                      className="bg-yellow hover:bg-yellow/80 text-navy font-bold"
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                    <Button 
                      variant="outline" 
                      asChild
                      className="border-yellow/50 text-yellow hover:bg-yellow/20"
                    >
                      <Link href="/premium">
                        View Plans
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form - only show if premium */}
          {isPremium && (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Enhanced ranking details card */}
              <Card className="overflow-hidden bg-white border-2 border-gray-200 hover:border-yellow transition-all">
                <CardHeader className="bg-yellow/10 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-navy">
                    <FileText className="h-5 w-5 text-yellow" />
                    Ranking Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="grid gap-3">
                    <Label htmlFor="title" className="flex items-center gap-2 text-navy font-semibold">
                      <Star className="h-4 w-4" />
                      Title
                    </Label>
                    <Input 
                      id="title" 
                      name="title" 
                      placeholder="Best Smartphones of 2024 🚀" 
                      required 
                      className="border-2 border-gray-200 text-navy placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="description" className="flex items-center gap-2 text-navy font-semibold">
                      <Palette className="h-4 w-4" />
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="A comprehensive ranking of the best smartphones released this year... 📱✨"
                      rows={3}
                      className="border-2 border-gray-200 text-navy placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category" className="flex items-center gap-2 text-navy font-semibold">
                      <Target className="h-4 w-4" />
                      Category
                    </Label>
                    <Select required name="category">
                      <SelectTrigger id="category" className="border-2 border-gray-200 text-navy focus:border-yellow focus:ring-2 focus:ring-yellow/20">
                        <SelectValue placeholder="Select a category 🎯" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-2 border-gray-200">
                        {categories.map((category) => (
                          <SelectItem 
                            key={category.slug} 
                            value={category.slug} 
                            className="text-navy hover:bg-yellow/20"
                          >
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced items card */}
              <Card className="overflow-hidden bg-white border-2 border-gray-200 hover:border-yellow transition-all">
                <CardHeader className="bg-yellow/10 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-navy">
                    <Crown className="h-5 w-5 text-yellow" />
                    Items to Rank
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {items.map((item, index) => {
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
                      <div key={item.id} className={`grid gap-4 p-6 border-2 border-gray-200 rounded-lg relative bg-gradient-to-r ${colorClass} hover:border-yellow transition-all group`}>
                        <div className="absolute -top-3 -left-3 flex items-center justify-center w-8 h-8 bg-gradient-to-r from-yellow to-orange-400 text-navy rounded-full text-sm font-bold shadow-lg">
                          {index + 1}
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor={`item-name-${item.id}`} className="flex items-center gap-2 text-navy font-semibold">
                            <Star className="h-4 w-4" />
                            Name
                          </Label>
                          <Input
                            id={`item-name-${item.id}`}
                            value={item.name}
                            onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                            placeholder="Item name ✨"
                            required
                            className="border-2 border-gray-200 text-navy placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor={`item-description-${item.id}`} className="flex items-center gap-2 text-navy font-semibold">
                            <Palette className="h-4 w-4" />
                            Description (Optional)
                          </Label>
                          <Textarea
                            id={`item-description-${item.id}`}
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                            placeholder="Brief description of this item... 💫"
                            rows={2}
                            className="border-2 border-gray-200 text-navy placeholder:text-gray-400 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                          />
                        </div>
                        {items.length > 2 && (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="absolute -top-2 -right-2 h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white shadow-lg"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    )
                  })}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full border-2 border-yellow/50 text-yellow hover:bg-yellow/20 border-dashed gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Another Item
                  </Button>
                </CardContent>
                <CardFooter className="bg-yellow/10 border-t border-gray-200 p-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-yellow hover:bg-yellow/80 text-navy font-bold gap-2 py-6 text-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Zap className="h-5 w-5 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Crown className="h-5 w-5" />
                        Create Ranking
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          )}
        </div>
      </div>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal 
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="create rankings"
      />
    </div>
  )
}

