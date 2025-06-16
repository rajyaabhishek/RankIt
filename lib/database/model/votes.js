import mongoose from 'mongoose';
import { connectToDatabase } from './rankings';

// Ensure database connection is established before operations
async function ensureConnection() {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Database connection failed in votes model:', error);
    throw error;
  }
}

// Create the Vote schema
const VoteSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  rankingId: { type: String, required: true, index: true },
  itemId: { type: Number, required: true },
  direction: { type: String, enum: ['up', 'down'], required: true },
  timestamp: { type: Date, default: Date.now },
  rankingTitle: { type: String },
  itemName: { type: String },
  category: { type: String }
});

// Create a compound index for userId, rankingId, and itemId
VoteSchema.index({ userId: 1, rankingId: 1, itemId: 1 }, { unique: true });

// Create and export the Vote model
export const Vote = mongoose.models.Vote || mongoose.model('Vote', VoteSchema);

/**
 * Get all votes for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - Array of vote documents
 */
export async function getUserVotes(userId) {
  try {
    await ensureConnection();
    return Vote.find({ userId }).sort({ timestamp: -1 }).lean();
  } catch (error) {
    console.error('Error getting user votes:', error);
    throw error;
  }
}

/**
 * Get a specific vote by user, ranking and item
 * @param {string} userId - The user's ID
 * @param {string} rankingId - The ranking ID
 * @param {number} itemId - The item ID within the ranking
 * @returns {Promise<Object|null>} - Vote document or null if not found
 */
export async function getVote(userId, rankingId, itemId) {
  try {
    await ensureConnection();
    return Vote.findOne({ userId, rankingId, itemId }).lean();
  } catch (error) {
    console.error('Error getting vote:', error);
    throw error;
  }
}

/**
 * Get all votes for a specific ranking item
 * @param {string} rankingId - The ranking ID
 * @param {number} itemId - The item ID within the ranking
 * @returns {Promise<Array>} - Array of vote documents
 */
export async function getItemVotes(rankingId, itemId) {
  try {
    await connectToDatabase();
    return Vote.find({ rankingId, itemId }).lean();
  } catch (error) {
    console.error('Error getting item votes:', error);
    throw error;
  }
}

/**
 * Count votes for a specific ranking item by direction
 * @param {string} rankingId - The ranking ID
 * @param {number} itemId - The item ID within the ranking
 * @param {string} direction - 'up' or 'down'
 * @returns {Promise<number>} - Count of votes
 */
export async function countItemVotes(rankingId, itemId, direction) {
  try {
    await connectToDatabase();
    return Vote.countDocuments({ rankingId, itemId, direction });
  } catch (error) {
    console.error('Error counting votes:', error);
    throw error;
  }
}

/**
 * Calculate vote change based on previous and new vote direction
 * @param {Object|null} previousVote - The previous vote or null
 * @param {string|null} newDirection - The new vote direction or null
 * @returns {number} - Vote change value
 */
export function calculateVoteChange(previousVote, newDirection) {
  if (!previousVote && newDirection === 'up') return 1;
  if (!previousVote && newDirection === 'down') return -1;
  if (previousVote && previousVote.direction === 'up' && newDirection === null) return -1;
  if (previousVote && previousVote.direction === 'down' && newDirection === null) return 1;
  if (previousVote && previousVote.direction === 'up' && newDirection === 'down') return -2;
  if (previousVote && previousVote.direction === 'down' && newDirection === 'up') return 2;
  return 0;
}

/**
 * Update or create a vote
 * @param {string} userId - The user's ID
 * @param {string} rankingId - The ranking ID
 * @param {number} itemId - The item ID within the ranking
 * @param {string|null} direction - 'up', 'down', or null to remove vote
 * @param {Object} metadata - Additional metadata about the vote
 * @returns {Promise<Object>} - The updated or created vote document
 */
export async function upsertVote(
  userId, 
  rankingId, 
  itemId, 
  direction,
  metadata = {}
) {
  try {
    await ensureConnection();
    
    if (direction === null) {
      // If direction is null, remove the vote
      return Vote.deleteOne({ userId, rankingId, itemId });
    } else {
      // Otherwise, upsert the vote with category stored directly on the document
      return Vote.findOneAndUpdate(
        { userId, rankingId, itemId },
        { 
          direction, 
          timestamp: new Date(),
          rankingTitle: metadata.rankingTitle || '',
          itemName: metadata.itemName || '',
          category: metadata.category || 'Uncategorized' // Store category directly
        },
        { upsert: true, new: true }
      );
    }
  } catch (error) {
    console.error('Error upserting vote:', error);
    throw error;
  }
}

/**
 * Delete all votes for a specific user
 * @param {string} userId - The user's ID
 * @returns {Promise<Object>} - Result of delete operation
 */
export async function deleteUserVotes(userId) {
  try {
    await connectToDatabase();
    return Vote.deleteMany({ userId });
  } catch (error) {
    console.error('Error deleting user votes:', error);
    throw error;
  }
}

/**
 * Delete all votes for a specific ranking
 * @param {string} rankingId - The ranking ID
 * @returns {Promise<Object>} - Result of delete operation
 */
export async function deleteRankingVotes(rankingId) {
  try {
    await connectToDatabase();
    return Vote.deleteMany({ rankingId });
  } catch (error) {
    console.error('Error deleting ranking votes:', error);
    throw error;
  }
}

/**
 * Get total vote count for a ranking item
 * @param {string} rankingId - The ranking ID
 * @param {number} itemId - The item ID 
 * @returns {Promise<Object>} - Object with upvotes, downvotes, and total
 */
export async function getVoteSummary(rankingId, itemId) {
  try {
    await connectToDatabase();
    const upvotes = await Vote.countDocuments({ rankingId, itemId, direction: 'up' });
    const downvotes = await Vote.countDocuments({ rankingId, itemId, direction: 'down' });
    
    return {
      upvotes,
      downvotes,
      total: upvotes - downvotes
    };
  } catch (error) {
    console.error('Error getting vote summary:', error);
    throw error;
  }
}