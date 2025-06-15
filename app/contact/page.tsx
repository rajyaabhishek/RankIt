import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, MessageSquare, Users, Trophy, Star, Target, Heart, Headphones } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact RankIt</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Got questions about rankings? Want to suggest a new category? We'd love to hear from our community!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Community Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              As a community-driven platform, we value every voice in our ranking ecosystem. Whether you're a seasoned ranker or just getting started, our team is here to help you make the most of RankIt.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>contact@rankit.space</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Partnership & Business
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Interested in featuring your products or services in our rankings? Want to collaborate with our platform? Let's explore how we can work together to create meaningful rankings.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>contact@rankit.space</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">How We Can Help You</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Star className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Better Rankings</h3>
            <p className="text-muted-foreground">
              Get tips on creating engaging rankings that spark meaningful discussions and attract votes
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Platform Guidance</h3>
            <p className="text-muted-foreground">
              Learn how to navigate our voting system, discover trending categories, and maximize engagement
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="h-8 w-8 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Issues</h3>
            <p className="text-muted-foreground">
              Report inappropriate content, resolve voting disputes, or get help with community guidelines
            </p>
          </div>
        </div>
      </div>

      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="text-center">Get In Touch About</CardTitle>
          <CardDescription className="text-center">
            Common topics our community reaches out about
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { name: "New Category Suggestions", icon: "💡" },
              { name: "Voting System Questions", icon: "🗳️" },
              { name: "Technical Support", icon: "🔧" },
              { name: "Content Moderation", icon: "🛡️" },
              { name: "Feature Requests", icon: "⚡" },
              { name: "Trending Algorithm", icon: "📈" },
              { name: "Account Issues", icon: "👤" },
              { name: "Mobile App Support", icon: "📱" }
            ].map((topic, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {topic.icon} {topic.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5" />
              Technical Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Experiencing issues with real-time voting updates, ranking displays, or mobile functionality? Our tech team keeps the platform running smoothly 24/7.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>contact@rankit.space</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Response time: Usually within 4-6 hours
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Share Your Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Found your new favorite restaurant through our rankings? Settled a debate with friends? We love hearing how RankIt impacts real decisions and conversations.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>contact@rankit.space</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Join the Conversation</h2>
        <p className="text-muted-foreground mb-6">
          Beyond email, connect with our community and team across social platforms where the ranking discussions never stop.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="https://discord.com/channels/1383372620841484338/1383372621340737670" target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-sm hover:bg-primary/10 cursor-pointer transition-colors">
              <MessageSquare className="h-3 w-3 mr-1" />
              Discord Community
            </Badge>
          </a>
          <a href="https://www.reddit.com/r/rankitreddit/" target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-sm hover:bg-primary/10 cursor-pointer transition-colors">
              <Users className="h-3 w-3 mr-1" />
              Reddit: r/rankitreddit
            </Badge>
          </a>
          <a href="https://www.instagram.com/realrankit/" target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-sm hover:bg-primary/10 cursor-pointer transition-colors">
              <Heart className="h-3 w-3 mr-1" />
              Instagram: @realrankit
            </Badge>
          </a>
          <a href="https://twitter.com/rankitapp" target="_blank" rel="noopener noreferrer">
            <Badge variant="outline" className="text-sm hover:bg-primary/10 cursor-pointer transition-colors">
              <Trophy className="h-3 w-3 mr-1" />
              Twitter: @rankitapp
            </Badge>
          </a>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Remember: Whether you're here to discover new favorites, share your opinions, or settle debates with friends, 
          we're here to help you make the most of your RankIt experience! 🏆
        </p>
      </div>
    </div>
  )
}