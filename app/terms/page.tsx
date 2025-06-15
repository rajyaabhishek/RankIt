import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Page Title */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">The Rules of the Road (We've tried to make them painless)</p>
        <p className="text-sm text-muted-foreground mt-2">
          Last Updated: May 5, 2025. RankIt: Making rankings and voting fun since 2025!
        </p>
      </div>

      {/* Section 1 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. A Friendly Introduction</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Hello there! Welcome to <strong>RankIt</strong> ("us," "we," or "the company that really hopes you're having a nice day").
          </p>
          <p>
            These Terms of Service (or as we like to call them, "The Rules of the Road") govern your journey through our platform for creating, sharing, and voting on rankings of everything you love. We've tried to make them as painless as possible—kind of like choosing your favorite pizza topping when they're all amazing.
          </p>
          <p>
            Our Privacy Policy is also part of this agreement (it's like the sidekick to these Terms' superhero). Together they explain how we'll treat your information with the care it deserves.
          </p>
          <p>
            By using our service, you're nodding along to these terms. If you find yourself vigorously shaking your head instead, that's okay! Just please don't use our service, and maybe drop us a line at <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a> so we can see if there's another path forward. We're reasonable folks, we promise.
          </p>
        </CardContent>
      </Card>

      {/* Section 2 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Keeping in Touch</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            When you use RankIt, you're agreeing to receive newsletters and updates from us. Think of them less as "marketing materials" and more like "friendly letters from that friend who's really excited about the latest trending rankings."
          </p>
          <p>
            Not your cup of tea? No problem! You can unsubscribe faster than you can say "no more emails please" by clicking the unsubscribe link or emailing <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a>.
          </p>
        </CardContent>
      </Card>

      {/* Section 3 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Money Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            If you decide to purchase something from us (thank you, by the way!), we'll need some payment information. We promise we're not collecting card numbers for fun—we actually need them to process your payment.
          </p>
          <p>
            By providing your payment details, you're confirming that:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You have the legal right to use that payment method (borrowing your roommate's credit card without permission is a no-no)</li>
            <li>All the information you've given us is accurate (no need to pretend you live at "123 Fake Street")</li>
          </ul>
          <p>
            We work with trusted third-party payment processors who help make the money magic happen. When you submit your payment info, you're giving us permission to share it with these companies, subject to our Privacy Policy.
          </p>
          <p>
            We reserve the right to cancel orders for reasons including product availability, pricing errors, or suspected fraud. It's not that we don't trust you—we just need to keep things on the up-and-up.
          </p>
        </CardContent>
      </Card>

      {/* Section 4 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Subscriptions: The Gift That Keeps on Giving</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Some of our services require a subscription (think of it like a membership to your favorite club, but with fewer awkward holiday parties and more awesome rankings).
          </p>
          <p>
            Here's how it works:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You'll be billed in advance on a recurring basis</li>
            <li>Your subscription will automatically renew (like magic, except you get charged)</li>
            <li>You can cancel anytime through your account or by emailing <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a></li>
          </ul>
          <p>
            We need valid payment information to process your subscription. If your payment method fails, we may have to terminate your access to the service. Not to be dramatic, but please keep your payment info up to date!
          </p>
        </CardContent>
      </Card>

      {/* Section 5 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Free Trials: Try Before You Buy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            RankIt occasionally on its sole discretion offer free trials of our subscription services to some of our users. It's like test-driving a car, but with fewer salespeople hovering nearby and more voting on your favorite things.
          </p>
          <p>
            Important notes about free trials:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>We might ask for your billing info when you sign up</li>
            <li>If you provide billing info, you won't be charged until the trial ends</li>
            <li>If you don't cancel before the trial expires, we'll automatically start billing you</li>
            <li>We reserve the right to modify or cancel free trial offers at any time</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 6 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Fee Changes: The Only Constant is Change</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We may modify our subscription fees from time to time. When we do, the new rates will take effect at the end of your current billing cycle.
          </p>
          <p>
            Don't worry—we're not sneaky. We'll give you advance notice of any price changes so you can decide whether to continue your subscription. If you keep using the service after a price change, that signals your acceptance of the new fee.
          </p>
        </CardContent>
      </Card>

      {/* Section 7 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Refunds: Sometimes Things Just Don't Work Out</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We offer refunds within 14 days of purchase. Like returning a sweater that looked better online than it does on you—no hard feelings.
          </p>
        </CardContent>
      </Card>

      {/* Section 8 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Your Content: With Great Rankings Come Great Responsibilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our service lets you create rankings, vote on existing rankings, and share your opinions ("Content"). You're responsible for making sure your Content is legal and appropriate.
          </p>
          <p>
            By creating Content on RankIt, you're telling us:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You own it or have permission to use it</li>
            <li>Sharing it doesn't violate anyone else's rights</li>
            <li>Your rankings and votes are your genuine opinions</li>
          </ul>
          <div className="bg-muted p-4 rounded-lg border-l-4 border-primary">
            <p className="font-medium">
              Rankings, votes, and comments you create on RankIt become part of our community-driven platform. While you retain ownership of your original content, you grant us permission to display, share, and use it within the RankIt platform to provide our ranking and voting services.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section 9 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>9. Things You Definitely Shouldn't Do</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Please don't use our service to:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Break any laws (that should go without saying, but we're saying it anyway)</li>
            <li>Harm minors or expose them to inappropriate content (protect the children!)</li>
            <li>Send spam or create fake rankings (nobody likes spam, not even the people sending it)</li>
            <li>Impersonate others (unless you're auditioning for a role in a play)</li>
            <li>Manipulate voting results through fake accounts or automated voting</li>
            <li>Create offensive, discriminatory, or hateful rankings</li>
            <li>Engage in conduct that could restrict others' enjoyment of the service</li>
          </ul>
          <p>
            Also, please don't:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Overload our service or interfere with others' use</li>
            <li>Use bots or automated tools to manipulate rankings or votes</li>
            <li>Try to copy or monitor our service without permission</li>
            <li>Introduce viruses or other harmful code (that's just mean)</li>
            <li>Try to gain unauthorized access to our systems</li>
            <li>Attack our service via denial-of-service attacks</li>
            <li>Take actions that could damage our reputation or the integrity of our ranking system</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 10 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>10. Age Restrictions: Adults Only, Please</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Our service is only for individuals who are at least 18 years old. By using RankIt, you're confirming that you're an adult with the legal capacity to enter into this agreement. If you're under 18, we're sorry, but you'll need to wait to use our service.
          </p>
        </CardContent>
      </Card>

      {/* Section 11 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>11. Your Account: Guard It Like Your Top-Secret Ranking Algorithm</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            When you create an account with us:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You must be over 18</li>
            <li>You must provide accurate information</li>
            <li>You're responsible for maintaining the confidentiality of your password</li>
            <li>You're responsible for all activities that happen under your account, including all votes and rankings</li>
            <li>You can only create one account per person to maintain fair voting</li>
          </ul>
          <p>
            Please notify us immediately if someone has broken into your account. And please don't use offensive, vulgar, or obscene usernames—keep it classy!
          </p>
        </CardContent>
      </Card>

      {/* Section 12 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>12. Our Intellectual Property: We Made This!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            RankIt and all its original content, including our voting algorithms, ranking systems, and platform features, remain our exclusive property. Our service is protected by copyright, trademark, and other laws. Please don't use our trademarks without our written permission—we're rather attached to them.
          </p>
        </CardContent>
      </Card>

      {/* Section 13 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>13. Copyright Issues: Respecting Creative Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We respect intellectual property rights and expect you to do the same. If you believe someone has infringed on your copyright through our service, please email us at <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a> with "Copyright Infringement" in the subject line.
          </p>
          <p>
            Include detailed information about the alleged infringement as outlined in our DMCA procedure below.
          </p>
        </CardContent>
      </Card>

      {/* Section 14 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>14. DMCA Procedure: The Official Process</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            To submit a copyright infringement notification, provide our Copyright Agent with:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your electronic or physical signature</li>
            <li>A description of the copyrighted work you believe has been infringed</li>
            <li>The location of the allegedly infringing material on our service</li>
            <li>Your contact information</li>
            <li>A statement that you believe the use is not authorized</li>
            <li>A statement, under penalty of perjury, that your information is accurate and you're authorized to act on the copyright owner's behalf</li>
          </ul>
          <p>
            Contact our Copyright Agent at <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a>.
          </p>
        </CardContent>
      </Card>

      {/* Section 15 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>15. Feedback: We're All Ears</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We welcome your feedback, suggestions, and error reports! By providing feedback, you agree that:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>You're not claiming intellectual property rights to your feedback</li>
            <li>Your feedback doesn't contain confidential information</li>
            <li>We're not under confidentiality obligations regarding your feedback</li>
            <li>We may use your feedback for any purpose without compensation</li>
          </ul>
        </CardContent>
      </Card>

      {/* Section 16 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>16. Third-Party Links: Venturing Beyond Our Borders</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our service may contain links to third-party websites that we don't control. We're not responsible for their content or practices. Think of these links as us pointing to another store across the street—we can direct you there, but we can't control what happens once you're inside.
          </p>
          <p>
            We strongly encourage you to read the terms and privacy policies of any third-party sites you visit. It's like checking restaurant reviews before dining—always a good idea, and something our community would definitely rank!
          </p>
        </CardContent>
      </Card>

      {/* Section 17 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>17. Disclaimer of Warranty: The Legal Version of "As Is"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our services are provided "as is" and "as available" without warranties of any kind. We don't promise that our service will be error-free, secure, accurate, or uninterrupted. Rankings and voting results reflect community opinions and are not guaranteed to be accurate or complete.
          </p>
          <p>
            We disclaim all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement. It's like buying a mystery box—we hope it's awesome, but we can't make guarantees.
          </p>
          <p>
            This doesn't affect any warranties that can't be excluded under applicable law.
          </p>
        </CardContent>
      </Card>

      {/* Section 18 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>18. Limitation of Liability: Where We Draw the Line</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Except as prohibited by law, you agree to hold us harmless for indirect, punitive, special, incidental, or consequential damages, however they arise.
          </p>
          <p>
            If there is liability found on our part, it will be limited to the amount you paid for our products or services. Some states don't allow the exclusion of certain damages, so these limitations may not apply to you.
          </p>
        </CardContent>
      </Card>

      {/* Section 19 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>19. Account Termination: Parting Ways</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We may terminate your account immediately for any reason, including if you breach these Terms, manipulate voting results, or create inappropriate content.
          </p>
          <p>
            If you want to terminate your account, you can simply stop using our service or contact us at <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a>. Certain provisions of these Terms (like ownership and liability limitations) will survive termination.
          </p>
        </CardContent>
      </Card>

      {/* Section 20 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>20. Governing Law: The Rule Book</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            These Terms are governed by the laws of [Your Jurisdiction], regardless of conflict of law principles.
          </p>
        </CardContent>
      </Card>

      {/* Section 21 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>21. Changes to Our Service: Evolution in Action</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We reserve the right to modify or discontinue our service at any time without notice. We won't be liable if our service is unavailable for any period. Rankings and voting systems may be updated to improve user experience.
          </p>
        </CardContent>
      </Card>

      {/* Section 22 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>22. Amendments to Terms: The Shifting Sands</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            We may update these Terms at any time by posting the amended terms on our site. It's your responsibility to review these Terms periodically, like checking the weather before a picnic or checking trending rankings before a debate.
          </p>
          <p>
            By continuing to use our service after revisions become effective, you're agreeing to the changes. If you don't agree with the new terms, it's time to stop using our service.
          </p>
        </CardContent>
      </Card>

      {/* Section 23 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>23. Waiver and Severability: The Legal Safety Net</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            If we don't enforce a provision of these Terms, that doesn't mean we're waiving our right to do so in the future.
          </p>
          <p>
            If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will remain in effect. It's like removing one bad apple—the rest of the bunch is still good.
          </p>
        </CardContent>
      </Card>

      {/* Section 24 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>24. Acknowledgement: The Final Handshake</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            By using our service, you acknowledge that you've read these Terms and agree to be bound by them. No fine print tricks here—we want you to understand what you're agreeing to, just like we want you to understand how our ranking system works.
          </p>
        </CardContent>
      </Card>

      {/* Section 25 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>25. Contact Us: We're Here to Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Have questions, comments, or technical support needs? We'd love to hear from you!
          </p>
          <p>
            Email us at: <a href="mailto:contact@rankit.com" className="text-yellow-300 hover:underline">contact@rankit.com</a>
          </p>
          <Separator className="my-4" />
          <p className="text-center text-muted-foreground italic">
            Thanks for reading all the way to the end! You deserve a virtual high-five and a top ranking! ✋🏆
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsPage;