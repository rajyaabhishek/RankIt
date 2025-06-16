import mongoose from 'mongoose';
import { connectToDatabase } from './rankings';

// Ensure database connection is established before operations
async function ensureConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed in likes model:', error);
    throw error;
  }
}

// Create the Like schema
const LikeSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  rankingId: { type: String, required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  rankingTitle: { type: String },
  category: { type: String },
  author: {
    name: { type: String },
    image: { type: String }
  }
});

// Create a compound index for userId and rankingId
LikeSchema.index({ userId: 1, rankingId: 1 }, { unique: true });

// Create and export the Like model
export const Like = mongoose.models.Like || mongoose.model('Like', LikeSchema);

/**
 * Get all likes for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of like documents
 */
export async function getUserLikes(userId) {
  try {
    await ensureConnection();
    return Like.find({ userId }).sort({ timestamp: -1 }).lean();
  } catch (error) {
    console.error('Error getting user likes:', error);
    throw error;
  }
}

/**
 * Check if a user has liked a specific ranking
 * @param {string} userId - The user's ID
 * @param {string} rankingId - The ranking ID
 * @returns {Promise<boolean>} - True if liked, false otherwise
 */
export async function isRankingLiked(userId, rankingId) {
  try {
    await ensureConnection();
    const like = await Like.findOne({ userId, rankingId }).lean();
    return !!like;
  } catch (error) {
    console.error('Error checking if ranking is liked:', error);
    throw error;
  }
}

/**
 * Toggle like on a ranking
 * @param {string} userId - The user's ID
 * @param {string} rankingId - The ranking ID
 * @param {Object} metadata - Additional metadata about the ranking
 * @returns {Promise<Object>} - The operation result
 */
export async function toggleLike(userId, rankingId, metadata = {}) {
  try {
    await ensureConnection();
    
    const existingLike = await Like.findOne({ userId, rankingId });
    
    if (existingLike) {
      // Remove like
      await Like.deleteOne({ userId, rankingId });
      return { liked: false, message: 'Like removed' };
    } else {
      // Add like
      await Like.create({
        userId,
        rankingId,
        timestamp: new Date(),
        rankingTitle: metadata.rankingTitle || '',
        category: metadata.category || 'Uncategorized',
        author: metadata.author || {}
      });
      return { liked: true, message: 'Like added' };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

/**
 * Get like count for a specific ranking
 * @param {string} rankingId - The ranking ID
 * @returns {Promise<number>} - Number of likes
 */
export async function getRankingLikeCount(rankingId) {
  try {
    await connectToDatabase();
    return Like.countDocuments({ rankingId });
  } catch (error) {
    console.error('Error getting ranking like count:', error);
    throw error;
  }
}

/**
 * Delete all likes for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - Result of delete operation
 */
export async function deleteUserLikes(userId) {
  try {
    await connectToDatabase();
    return Like.deleteMany({ userId });
  } catch (error) {
    console.error('Error deleting user likes:', error);
    throw error;
  }
}

/**
 * Delete all likes for a specific ranking
 * @param {string} rankingId - The ranking ID
 * @returns {Promise<Object>} - Result of delete operation
 */
export async function deleteRankingLikes(rankingId) {
  try {
    await connectToDatabase();
    return Like.deleteMany({ rankingId });
  } catch (error) {
    console.error('Error deleting ranking likes:', error);
    throw error;
  }
} 