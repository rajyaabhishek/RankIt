export interface Category {
  name: string;
  icon: string;
  slug: string;
  description: string;
  color: string;
}

export const categories: Category[] = [
  { name: "Entertainment", icon: "🎬", slug: "entertainment", description: "Movies, TV shows, actors, and streaming content", color: "from-blue-500 to-purple-500" },
  { name: "Music", icon: "🎵", slug: "music", description: "Songs, albums, artists, and music genres", color: "from-purple-600 to-pink-500" },
  { name: "Books", icon: "📚", slug: "books", description: "Novels, authors, genres, and literary works", color: "from-amber-500 to-orange-500" },
  { name: "Food", icon: "🍽️", slug: "food", description: "Dishes, restaurants, cuisines, and culinary experiences", color: "from-red-500 to-orange-500" },
  { name: "Gaming", icon: "🎮", slug: "gaming", description: "Video games, consoles, and gaming culture", color: "from-indigo-500 to-purple-500" },
  { name: "Travel", icon: "✈️", slug: "travel", description: "Destinations, cities, and travel experiences", color: "from-green-500 to-blue-500" },
  { name: "Fashion", icon: "👗", slug: "fashion", description: "Style, trends, brands, and fashion statements", color: "from-pink-500 to-purple-500" },
  { name: "Tech", icon: "💻", slug: "tech", description: "Devices, apps, and technology innovations", color: "from-violet-500 to-purple-500" },
  { name: "Sports", icon: "⚽", slug: "sports", description: "Teams, players, and sporting events", color: "from-green-500 to-blue-500" },
  { name: "Animals", icon: "🐾", slug: "animals", description: "Pets, wildlife, and animal facts", color: "from-orange-500 to-red-500" },
  { name: "Autos", icon: "🚗", slug: "autos", description: "Cars, bikes, and automotive culture", color: "from-gray-500 to-blue-500" },
  { name: "Health", icon: "🏥", slug: "health", description: "Fitness, wellness, and medical topics", color: "from-green-500 to-emerald-500" },
  { name: "Comedy", icon: "😂", slug: "comedy", description: "Humor, jokes, and entertainment", color: "from-amber-500 to-orange-500" },
  { name: "Trends", icon: "🔥", slug: "trends", description: "Viral content, memes, and current trends", color: "from-orange-500 to-red-500" },
  { name: "Career", icon: "💼", slug: "career", description: "Jobs, education, and professional growth", color: "from-blue-500 to-indigo-500" },
  { name: "Lifestyle", icon: "✨", slug: "lifestyle", description: "Daily life, hobbies, and personal interests", color: "from-pink-500 to-purple-500" },
  { name: "Inspiration", icon: "💡", slug: "inspiration", description: "Quotes, stories, and motivational content", color: "from-blue-500 to-purple-500" },
  { name: "Hypotheticals", icon: "🤔", slug: "hypotheticals", description: "What-if scenarios and thought experiments", color: "from-purple-500 to-pink-500" },
  { name: "Society", icon: "🌍", slug: "society", description: "Social issues, culture, and community", color: "from-blue-500 to-indigo-500" },
  { name: "Art", icon: "🎨", slug: "art", description: "Visual arts, design, and creative expression", color: "from-purple-500 to-pink-500" }
];

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getCategoryCount = async (slug: string): Promise<number> => {
  try {
    const response = await fetch('/api/rankings');
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch rankings');
    
    return (data.rankings || []).filter((ranking: any) => 
      ranking.category.toLowerCase() === slug.toLowerCase()
    ).length;
  } catch (error) {
    console.error('Error fetching category count:', error);
    return 0;
  }
}; 