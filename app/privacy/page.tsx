import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Lock, Database, Share, Settings, Trophy, Users } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center">
            <Shield className="h-8 w-8 text-yellow-300" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground mb-2">
          Your privacy matters to us
        </p>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h4 className="font-semibold">Account Information</h4>
          <p>
            When you create a RankIt account, we collect your name, email address, username, 
            and any profile information you choose to provide to personalize your ranking experience.
          </p>
          
          <h4 className="font-semibold">Ranking & Voting Activity</h4>
          <p>
            As a community-driven platform, we collect information about your engagement with rankings:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Rankings you create across all categories (food, movies, technology, travel, sports, music, books, gaming, etc.)</li>
            <li>Your votes on rankings and individual items</li>
            <li>Comments and discussions on rankings</li>
            <li>Items you add to existing rankings</li>
            <li>Categories you follow or show interest in</li>
            <li>Your voting patterns and preferences to improve recommendations</li>
          </ul>

          <h4 className="font-semibold">Usage & Interaction Data</h4>
          <p>
            To provide real-time updates and trending rankings, we track:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Time spent viewing different rankings and categories</li>
            <li>Search queries within the platform</li>
            <li>Interaction with trending content</li>
            <li>Device and browser information</li>
            <li>IP address and general location data for regional trends</li>
          </ul>

          <h4 className="font-semibold">Community Content</h4>
          <p>
            We store all content you contribute to our community, including rankings, votes, comments, 
            and any media you upload related to ranked items.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            How We Use Your Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>We use the information we collect to power RankIt's core features:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                Ranking Operations
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Process and display democratic voting results</li>
                <li>Calculate real-time ranking positions</li>
                <li>Generate trending rankings and categories</li>
                <li>Provide personalized ranking recommendations</li>
                <li>Enable fair and transparent voting systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Community Features
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Facilitate community discussions and engagement</li>
                <li>Show your voting history and created rankings</li>
                <li>Connect you with similar interests and preferences</li>
                <li>Send notifications about ranking updates</li>
                <li>Moderate content for community standards</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">Platform Improvement</h4>
            <p className="text-sm">
              We analyze usage patterns to improve our democratic voting algorithms, discover trending topics, 
              enhance category organization, and develop new features that serve our community better.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Information Sharing & Public Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-yellow-300 mb-2">Important: Public Nature of Rankings</h4>
            <p className="text-sm">
              RankIt is a community platform where rankings, votes, and usernames are publicly visible 
              by design. This transparency is essential for our democratic voting system and community trust.
            </p>
          </div>
          
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share 
            your information only in the following circumstances:
          </p>
          
          <div className="space-y-3">
            <div className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-semibold">Public Ranking Data</h4>
              <p className="text-sm text-muted-foreground">
                Your rankings, votes, comments, and username are publicly visible to enable community 
                engagement and transparent democratic voting across all categories.
              </p>
            </div>
            
            <div className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-semibold">Aggregated Analytics</h4>
              <p className="text-sm text-muted-foreground">
                We may share anonymized, aggregated data about voting trends and category popularity 
                for research or partnership purposes, without identifying individual users.
              </p>
            </div>
            
            <div className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-semibold">Service Providers</h4>
              <p className="text-sm text-muted-foreground">
                We share data with trusted service providers who help us operate the platform 
                (hosting, analytics, content delivery, fraud prevention).
              </p>
            </div>
            
            <div className="border-l-4 border-primary/20 pl-4">
              <h4 className="font-semibold">Legal Requirements</h4>
              <p className="text-sm text-muted-foreground">
                We may disclose information if required by law, to protect our rights and safety, 
                or to address violations of our community guidelines.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Data Security & Storage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We implement industry-standard security measures to protect your personal information 
            while maintaining the real-time, community-driven nature of our platform:
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full justify-start">
                🔐 Encrypted Data Transmission (HTTPS)
              </Badge>
              <Badge variant="secondary" className="w-full justify-start">
                🛡️ Secure Authentication (Clerk)
              </Badge>
              <Badge variant="secondary" className="w-full justify-start">
                🔒 Protected Database Access
              </Badge>
              <Badge variant="secondary" className="w-full justify-start">
                ⚡ Real-time Security Monitoring
              </Badge>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full justify-start">
                📱 Secure Payment Processing
              </Badge>
              <Badge variant="secondary" className="w-full justify-start">
                🚫 No Password Storage
              </Badge>
              <Badge variant="secondary" className="w-full justify-start">
                🔍 Anti-fraud Voting Protection
              </Badge>
              <Badge variant="secondary" className="w-full justify-start">
                📊 Secure Analytics Processing
              </Badge>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">
            While we strive to protect your information using advanced security measures, 
            no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Your Privacy Rights & Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You have the following rights regarding your personal information:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Access & Export</h4>
                <p className="text-sm text-muted-foreground">Download your ranking data, votes, and account information</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Profile Updates</h4>
                <p className="text-sm text-muted-foreground">Update or correct your account and profile information</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Account Deletion</h4>
                <p className="text-sm text-muted-foreground">Delete your account (public rankings may remain anonymized)</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm">Communication Preferences</h4>
                <p className="text-sm text-muted-foreground">Control notifications and marketing communications</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Privacy Settings</h4>
                <p className="text-sm text-muted-foreground">Manage visibility of your voting history and profile</p>
              </div>
              <div>
                <h4 className="font-semibold text-sm">Data Processing Objection</h4>
                <p className="text-sm text-muted-foreground">Object to certain data processing activities</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>Note on Public Content:</strong> Due to the collaborative nature of rankings, 
              some content may remain visible even after account deletion to maintain ranking integrity, 
              but will be anonymized and disassociated from your identity.
            </p>
          </div>
          
          <p className="text-sm">
            To exercise any of these rights, please contact us at contact@rankit.space
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cookies & Tracking Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We use cookies and similar technologies to enhance your ranking experience and provide real-time updates:
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium text-sm">Essential Cookies</span>
                <p className="text-xs text-muted-foreground">Authentication, voting functionality, and platform security</p>
              </div>
              <Badge variant="default" className="text-xs">Required</Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium text-sm">Analytics Cookies</span>
                <p className="text-xs text-muted-foreground">Trending analysis, voting patterns, and platform improvement</p>
              </div>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
            
            <div className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium text-sm">Preference Cookies</span>
                <p className="text-xs text-muted-foreground">Category preferences, display settings, and personalization</p>
              </div>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>

            <div className="flex items-center justify-between p-2 border rounded">
              <div>
                <span className="font-medium text-sm">Real-time Features</span>
                <p className="text-xs text-muted-foreground">Live voting updates, trending notifications, and dynamic rankings</p>
              </div>
              <Badge variant="secondary" className="text-xs">Optional</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Children's Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            RankIt is not intended for children under 13 years of age. We do not knowingly collect 
            personal information from children under 13. If you believe we have collected information 
            from a child under 13, please contact us immediately at contact@rankit.space.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Users between 13-17 years old may use RankIt with parental consent and should be aware 
            that their rankings and votes will be publicly visible as part of our community platform.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>International Users & Data Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            RankIt is accessible globally, and we may transfer your information to servers located 
            outside your country of residence. We ensure appropriate safeguards are in place to 
            protect your information during international transfers, in compliance with applicable 
            data protection laws.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Changes to This Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, 
            new features, or legal requirements. We will notify you of any material changes by:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
            <li>Posting the updated Privacy Policy on this page</li>
            <li>Updating the "Last updated" date</li>
            <li>Sending email notifications to registered users for significant changes</li>
            <li>Displaying in-app notifications about important policy updates</li>
          </ul>
          <p className="mt-2">
            Your continued use of RankIt after any changes indicates your acceptance of the updated Privacy Policy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, our data practices, or your privacy rights, please contact us:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> contact@rankit.space</p>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            We typically respond to privacy inquiries within 7 business days.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}