import { NextResponse } from 'next/server';
import { Ranking, connectToDatabase } from '@/lib/database/model/rankings';
import { categories } from '@/lib/categories';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all rankings from database
    const rankings = await Ranking.find({}).lean();
    
    if (!rankings || rankings.length === 0) {
      return NextResponse.json({
        success: true,
        categories: categories.map(cat => ({ ...cat, count: 0 }))
      });
    }
    
    // Calculate total votes by category (case-insensitive and flexible matching)
    const categoryStats: Record<string, { rankingCount: number; totalVotes: number }> = {};
    
    rankings.forEach((ranking: any) => {
      const dbCategory = ranking.category?.toLowerCase().trim() || 'uncategorized';
      
      // Calculate total votes for this ranking
      const rankingTotalVotes = ranking.items?.reduce((sum: number, item: any) => {
        return sum + (item.votes || 0);
      }, 0) || 0;
      
      if (!categoryStats[dbCategory]) {
        categoryStats[dbCategory] = { rankingCount: 0, totalVotes: 0 };
      }
      
      categoryStats[dbCategory].rankingCount += 1;
      categoryStats[dbCategory].totalVotes += rankingTotalVotes;
    });
    
    console.log('📊 Database categories found:', Object.keys(categoryStats));
    console.log('🔢 Category stats:', categoryStats);
    
    // Map to our predefined categories with flexible matching
    const categoriesWithCounts = categories.map(cat => {
      let totalVotes = 0;
      let rankingCount = 0;
      const catName = cat.name.toLowerCase();
      const catSlug = cat.slug.toLowerCase();
      
      // Try multiple matching strategies
      Object.keys(categoryStats).forEach(dbCat => {
        const dbCatLower = dbCat.toLowerCase();
        
        // Exact matches
        if (dbCatLower === catSlug || dbCatLower === catName) {
          totalVotes += categoryStats[dbCat].totalVotes;
          rankingCount += categoryStats[dbCat].rankingCount;
        }
        // Partial matches
        else if (
          dbCatLower.includes(catSlug) || 
          dbCatLower.includes(catName) ||
          catSlug.includes(dbCatLower) || 
          catName.includes(dbCatLower)
        ) {
          totalVotes += categoryStats[dbCat].totalVotes;
          rankingCount += categoryStats[dbCat].rankingCount;
        }
        // Special case mappings
        else if (
          (catSlug === 'entertainment' && (dbCatLower.includes('movie') || dbCatLower.includes('series') || dbCatLower.includes('tv'))) ||
          (catSlug === 'tech' && (dbCatLower.includes('smartphone') || dbCatLower.includes('laptop') || dbCatLower.includes('gadget'))) ||
          (catSlug === 'autos' && (dbCatLower.includes('car') || dbCatLower.includes('bike')))
        ) {
          totalVotes += categoryStats[dbCat].totalVotes;
          rankingCount += categoryStats[dbCat].rankingCount;
        }
      });
      
      return {
        ...cat,
        count: rankingCount, // Keep count for rankings count
        totalVotes: totalVotes // Add total votes for sorting
      };
    });
    
    // Also include any categories from database that don't match our predefined ones
    const unmatchedCategories: any[] = [];
    Object.keys(categoryStats).forEach(dbCat => {
      const isMatched = categoriesWithCounts.some(cat => {
        const catName = cat.name.toLowerCase();
        const catSlug = cat.slug.toLowerCase();
        const dbCatLower = dbCat.toLowerCase();
        
        return dbCatLower === catSlug || 
               dbCatLower === catName || 
               dbCatLower.includes(catSlug) || 
               dbCatLower.includes(catName) ||
               catSlug.includes(dbCatLower) || 
               catName.includes(dbCatLower);
      });
      
      if (!isMatched && categoryStats[dbCat].totalVotes > 0) {
        unmatchedCategories.push({
          name: dbCat.charAt(0).toUpperCase() + dbCat.slice(1),
          icon: '📂',
          slug: dbCat,
          description: `${dbCat} rankings`,
          color: 'from-gray-500 to-gray-600',
          count: categoryStats[dbCat].rankingCount,
          totalVotes: categoryStats[dbCat].totalVotes
        });
      }
    });
    
    // Sort by total votes (most popular by voting activity) and limit to top 6
    const allCategories = [...categoriesWithCounts, ...unmatchedCategories]
      .filter(cat => cat.totalVotes > 0) // Only categories with votes
      .sort((a, b) => b.totalVotes - a.totalVotes) // Sort by total votes
      .slice(0, 6); // Limit to top 6
    
    console.log('✅ Top 6 popular categories by votes:', allCategories.map(c => `${c.name}: ${c.totalVotes} votes (${c.count} rankings)`));
    
    return NextResponse.json({
      success: true,
      categories: allCategories,
      debug: {
        totalRankings: rankings.length,
        databaseCategories: Object.keys(categoryStats),
        categoryStats
      }
    });
    
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
} 