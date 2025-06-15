import MyVotes from "@/components/my-votes"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Vote, Crown, Star } from "lucide-react"
import Link from "next/link"

export default function MyVotesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container px-4 md:px-6 py-0">
        <div className="flex flex-col gap-0">
          <div className="flex items-center justify-between">
          
          </div>
          
          <MyVotes />
        </div>
      </div>
    </div>
  )
}