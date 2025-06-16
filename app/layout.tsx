import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RankIt - Vote & Create Rankings",
  description: "Create rankings, vote on your favorites, and discover what's trending",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any', type: 'image/x-icon' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Global subscription success handler
                window.handleSubscriptionSuccess = async function(plan, billingCycle) {
                  try {
                    // Get the current user from Clerk
                    const user = window.Clerk?.user;
                    if (!user) {
                      console.error('No user found for subscription update');
                      return false;
                    }

                    // Calculate expiration date
                    const startDate = new Date();
                    const expirationDate = new Date();
                    
                    if (billingCycle === 'monthly') {
                      expirationDate.setMonth(expirationDate.getMonth() + 1);
                    } else if (billingCycle === 'yearly') {
                      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
                    }

                    // Update user metadata with premium subscription
                    await user.update({
                      unsafeMetadata: {
                        ...user.unsafeMetadata,
                        premium: {
                          status: 'active',
                          plan: billingCycle,
                          startedAt: startDate.toISOString(),
                          expiresAt: expirationDate.toISOString(),
                          lastPayment: new Date().toISOString()
                        }
                      }
                    });

                    // Reload user to get updated metadata
                    await user.reload();
                    

                    
                    // Show success notification
                    alert('🎉 Premium subscription activated successfully! Your premium features are now available.');
                    
                    return true;
                  } catch (error) {
                    console.error('Failed to update premium status via global handler:', error);
                    alert('Payment successful but there was an error activating your premium subscription. Please contact support.');
                    return false;
                  }
                };
              `,
            }}
          />
        </head>
        <body className={cn(inter.className, "bg-background text-foreground min-h-screen flex flex-col")}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
