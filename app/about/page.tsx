import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, Star, Target, Heart, Zap } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About RankIt</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The ultimate platform for creating, sharing, and voting on rankings of everything you love
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe everyone has opinions worth sharing. RankIt empowers users to create meaningful rankings 
              across diverse categories - from food and entertainment to technology and lifestyle. Our platform 
              fosters community engagement through democratic voting and thoughtful discussions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Founded by passionate enthusiasts who love debating the best of everything, RankIt was born from 
              countless discussions about which pizza is truly the best or which movie deserves the top spot. 
              We turned those conversations into a platform where everyone's voice matters.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Makes Us Special</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary/0 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-muted-foreground">
              Every ranking is shaped by our vibrant community of users who vote and engage with content
            </p>
          </div>

          <div className="text-center">
            <div className="bg-primary/0 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fair & Transparent</h3>
            <p className="text-muted-foreground">
              Our voting system ensures every voice is heard equally, creating truly democratic rankings
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/0 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Always Fresh</h3>
            <p className="text-muted-foreground">
              Real-time voting updates and trending rankings keep the content dynamic and engaging
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-center">Featured Categories</CardTitle>
          <CardDescription className="text-center">
            Explore rankings across diverse categories that matter to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { name: "Food & Restaurants", icon: "🍔" },
              { name: "Movies & Entertainment", icon: "🎬" },
              { name: "Technology", icon: "📱" },
              { name: "Travel & Hotels", icon: "🏨" },
              { name: "Sports", icon: "⚽" },
              { name: "Music", icon: "🎵" },
              { name: "Books", icon: "📚" },
              { name: "Gaming", icon: "🎮" }
            ].map((category, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {category.icon} {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
        <p className="text-muted-foreground mb-6">
          Whether you're here to discover new favorites, share your opinions, or settle debates with friends, 
          RankIt is your platform for all things ranked and rated.
        </p>
        <div className="flex justify-center gap-4">
          <Badge variant="outline" className="text-sm">
            <Star className="h-3 w-3 mr-1" />
            Create Rankings
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Users className="h-3 w-3 mr-1" />
            Vote & Engage
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Trophy className="h-3 w-3 mr-1" />
            Discover Trends
          </Badge>
        </div>
      </div>
    </div>
  )
} 