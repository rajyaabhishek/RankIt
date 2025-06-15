import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Target } from "lucide-react"

interface CategoryCardProps {
  category: {
    name: string
    icon: string
    count: number
    color?: string
    slug?: string
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-')
  
  return (
    <Link href={`/categories/${slug}`}>
      <Card className="category-card overflow-hidden bg-white border-2 border-gray-200 hover:border-yellow-bright hover:shadow-xl group cursor-pointer h-full">
        <CardContent className="p-6 flex flex-col items-center text-center relative aspect-square justify-center">
          <div className="text-4xl mb-3 transform group-hover:scale-125 transition-all duration-300 group-hover:rotate-6">
            {category.icon}
          </div>
          <h3 className="font-bold text-navy-deep text-sm group-hover:text-navy-900 transition-colors line-clamp-2 mb-2">
            {category.name}
          </h3>
          <div className="flex items-center gap-1 bg-yellow-bright/20 text-navy-deep px-2 py-1 rounded-full group-hover:bg-yellow-bright group-hover:text-white group-hover:shadow-md transition-all">
            <Target className="h-3 w-3" />
            <span className="text-xs font-bold">{category.count}</span>
          </div>
          
          {/* Decorative corner accent */}
          <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-bright rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute bottom-2 left-2 w-2 h-2 bg-navy-deep/20 rounded-full opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
        </CardContent>
      </Card>
    </Link>
  )
}

