"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { UserButton, useClerk, useUser } from "@clerk/nextjs"
import { Bell, Menu, Search, Home, Grid3X3, Trophy, Plus, Vote, Zap, Star, Crown, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { usePremium } from "@/hooks/use-premium"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isLoaded, isSignedIn, user } = useUser()
  const { isPremium } = usePremium()
  const { openSignIn, openSignUp } = useClerk()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  // This ensures hydration mismatch is avoided
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render auth-dependent UI until client-side hydration is complete
  const showAuthUI = mounted && isLoaded

  const handleSignIn = () => {
    openSignIn()
  }

  const handleSignUp = () => {
    openSignUp()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  const navItems = [
    { href: "/", icon: Home, label: "Home", exact: true },
    { href: "/categories", icon: Grid3X3, label: "Categories" },
    { href: "/rankings", icon: Trophy, label: "Rankings" },
    { href: "/create", icon: Plus, label: "Create", premium: true },
    { href: "/premium", icon: Crown, label: "Premium" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-navy-deep/60 backdrop-blur-md border-b border-navy-800 shadow-xl">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden hover:bg-navy-700 text-yellow-bright">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-navy-deep border-r border-navy-700 p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="bg-gradient-navy p-6 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-yellow-bright rounded-lg flex items-center justify-center">
                    <span className="text-navy-deep font-bold text-xl">R</span>
                  </div>
                  <h2 className="text-xl font-bold text-yellow-bright">RankIt</h2>
                </div>
                <p className="text-gray-300 text-sm mt-2">Vote, rank, discover</p>
              </div>
              
              <nav className="px-6 pb-6">
                <div className="grid grid-cols-3 gap-2">
                  {navItems.map((item) => {
                    const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all font-medium ${
                          isActive 
                            ? "bg-yellow-bright text-navy-deep shadow-md" 
                            : "text-gray-300 hover:bg-navy-700 hover:text-yellow-bright"
                        }`}
                      >
                        <item.icon className="h-6 w-6 mb-1" />
                        <span className="text-xs">{item.label}</span>
                        {item.premium && !isPremium && (
                          <Crown className="h-3 w-3 text-amber-400 absolute top-1 right-1" />
                        )}
                        {item.href === "/premium" && isPremium && (
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse absolute top-1 right-1" />
                        )}
                      </Link>
                    )
                  })}
                  
                  {showAuthUI && isSignedIn && (
                    <>
                      <Link
                        href="/my-votes"
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all font-medium ${
                          pathname === "/my-votes"
                            ? "bg-yellow-bright text-navy-deep shadow-md"
                            : "text-gray-300 hover:bg-navy-700 hover:text-yellow-bright"
                        }`}
                      >
                        <Vote className="h-6 w-6 mb-1" />
                        <span className="text-xs">My Votes</span>
                      </Link>
                      <Link
                        href="/liked"
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all font-medium ${
                          pathname === "/liked"
                            ? "bg-yellow-bright text-navy-deep shadow-md"
                            : "text-gray-300 hover:bg-navy-700 hover:text-yellow-bright"
                        }`}
                      >
                        <Heart className="h-6 w-6 mb-1" />
                        <span className="text-xs">Liked</span>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-navy-yellow rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <Crown className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="font-bold text-2xl bg-gradient-to-r from-yellow-bright to-yellow-300 bg-clip-text text-transparent">
              RankIt
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="icon"
                  asChild
                  className={`relative h-12 w-12 font-medium transition-all ${
                    isActive
                      ? "bg-yellow-bright text-navy-deep hover:bg-yellow-300"
                      : "text-gray-300 hover:bg-navy-700 hover:text-yellow-bright"
                  }`}
                  title={item.premium && !isPremium ? `${item.label} (Premium Required)` : item.label}
                >
                  <Link href={item.href} className="flex items-center justify-center">
                    <item.icon className="h-6 w-6" />
                    {item.premium && !isPremium && (
                      <Crown className="h-3 w-3 text-amber-400 absolute -top-1 -right-1" />
                    )}
                    {item.href === "/premium" && isPremium && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse absolute -top-1 -right-1" />
                    )}
                  </Link>
                </Button>
              )
            })}
            
            {showAuthUI && isSignedIn && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className={`h-12 w-12 font-medium transition-all ${
                    pathname === "/my-votes"
                      ? "bg-yellow-bright text-navy-deep hover:bg-yellow-300"
                      : "text-gray-300 hover:bg-navy-700 hover:text-yellow-bright"
                  }`}
                  title="My Votes"
                >
                  <Link href="/my-votes" className="flex items-center justify-center">
                    <Vote className="h-6 w-6" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className={`h-12 w-12 font-medium transition-all ${
                    pathname === "/liked"
                      ? "bg-yellow-bright text-navy-deep hover:bg-yellow-300"
                      : "text-gray-300 hover:bg-navy-700 hover:text-yellow-bright"
                  }`}
                  title="Liked Rankings"
                >
                  <Link href="/liked" className="flex items-center justify-center">
                    <Heart className="h-6 w-6" />
                  </Link>
                </Button>
              </>
            )}
          </nav>
          
          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="search" 
                  placeholder="Search rankings..." 
                  className="pl-10 pr-4 w-64 bg-white/10 border-navy-600 text-white placeholder:text-gray-400 focus:border-yellow-bright focus:ring-yellow-bright focus:bg-white/20 transition-all" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            
            {/* Auth Section */}
            <div className="flex items-center space-x-3">
              {showAuthUI ? (
                isSignedIn ? (
                  <div className="flex items-center space-x-3">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "w-9 h-9 border-2 border-yellow-bright shadow-md hover:shadow-lg transition-all",
                        },
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      onClick={handleSignIn}
                      className="text-gray-300 hover:text-yellow-bright hover:bg-navy-700 font-medium"
                    >
                      Sign In
                    </Button>
                    <Button
                      onClick={handleSignUp}
                      className="bg-yellow-bright hover:bg-yellow-300 text-navy-deep font-medium px-6 py-2 shadow-md hover:shadow-lg transition-all"
                    >
                      Sign Up
                    </Button>
                  </div>
                )
              ) : (
                <div className="w-9 h-9 bg-navy-700 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

