// Rating storage for recipes
import { ratingCache } from './cacheManager.js'

/**
 * Get all rating data
 * @returns {Object} Rating data object
 */
export function getAllRatings() {
  try {
    const ratings = localStorage.getItem('recipeRatings')
    return ratings ? JSON.parse(ratings) : {}
  } catch (error) {
    console.error('Failed to get rating data:', error)
    return {}
  }
}

/**
 * Get rating data for specified recipe
 * @param {string|number} recipeId - Recipe ID
 * @returns {Object} Recipe rating data
 */
export function getRecipeRatings(recipeId) {
  // First check cache
  const cached = ratingCache.get(recipeId)
  if (cached) {
    return cached
  }

  const allRatings = getAllRatings()
  const result = allRatings[recipeId] || {
    ratings: [], // User ratings
    averageRating: 0, // Average rating
    totalRatings: 0 // Total ratings
  }
  
  // Cache the result
  ratingCache.set(recipeId, result)
  return result
}

/**
 * Add user rating
 * @param {string|number} recipeId - Recipe ID
 * @param {number} rating - Rating (1-5)
 * @param {string} userId - User ID
 * @param {string} comment - Comment content (optional)
 * @returns {Object} Result { success, isUpdate, message, data }
 */
export function addRating(recipeId, rating, userId, comment = '') {
  try {
    // Enhanced validation
    if (!recipeId || !userId) {
      return { success: false, error: 'Recipe ID and User ID are required' }
    }
    
    // Validate rating is a number
    const numRating = Number(rating)
    if (isNaN(numRating) || !Number.isInteger(numRating)) {
      return { success: false, error: 'Rating must be a valid number' }
    }
    
    // Validate rating range
    if (numRating < 1 || numRating > 5) {
      return { success: false, error: 'Rating must be between 1-5' }
    }

    const allRatings = getAllRatings()
    const recipeRatings = getRecipeRatings(recipeId)
    
    // Check if user has already rated
    const existingRatingIndex = recipeRatings.ratings.findIndex(r => r.userId === userId)
    const isUpdate = existingRatingIndex >= 0
    
    // Prepare rating object (preserve existing replies if updating)
    const newRatingBase = {
      userId,
      rating: numRating,
      comment: comment || '',
      timestamp: new Date().toISOString()
    }

    if (isUpdate) {
      const existing = recipeRatings.ratings[existingRatingIndex] || {}
      const preservedReplies = Array.isArray(existing.replies) ? existing.replies : []
      recipeRatings.ratings[existingRatingIndex] = { ...newRatingBase, replies: preservedReplies }
    } else {
      recipeRatings.ratings.push({ ...newRatingBase, replies: [] })
    }
    
    // Recalculate average rating
    recipeRatings.totalRatings = recipeRatings.ratings.length
    recipeRatings.averageRating = recipeRatings.ratings.reduce((sum, r) => sum + r.rating, 0) / recipeRatings.totalRatings
    
    // Save to localStorage
    allRatings[recipeId] = recipeRatings
    localStorage.setItem('recipeRatings', JSON.stringify(allRatings))
    
    return { 
      success: true, 
      isUpdate,
      message: isUpdate ? 'Rating updated successfully!' : 'Rating submitted successfully!',
      data: {
        averageRating: recipeRatings.averageRating,
        totalRatings: recipeRatings.totalRatings
      }
    }
  } catch (error) {
    console.error('Failed to add rating:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

/**
 * Get user rating for specified recipe
 * @param {string|number} recipeId - Recipe ID
 * @param {string} userId - User ID
 * @returns {Object|null} User rating data or null
 */
export function getUserRating(recipeId, userId) {
  const recipeRatings = getRecipeRatings(recipeId)
  return recipeRatings.ratings.find(r => r.userId === userId) || null
}

/**
 * Remove user rating (admin/nutritionist can remove any rating)
 * @param {string|number} recipeId - Recipe ID
 * @param {string} userId - Target User ID
 * @param {boolean} isPrivileged - Whether this is a privileged operation
 * @returns {Object} Operation result with success status and message
 */
export function removeRating(recipeId, userId, isPrivileged = false) {
  try {
    const allRatings = getAllRatings()
    const recipeRatings = getRecipeRatings(recipeId)
    
    const ratingIndex = recipeRatings.ratings.findIndex(r => r.userId === userId)
    if (ratingIndex === -1) {
      return false // No rating found
    }
    
    // Remove rating
    recipeRatings.ratings.splice(ratingIndex, 1)
    
    // Recalculate average rating
    recipeRatings.totalRatings = recipeRatings.ratings.length
    recipeRatings.averageRating = recipeRatings.totalRatings > 0 
      ? recipeRatings.ratings.reduce((sum, r) => sum + r.rating, 0) / recipeRatings.totalRatings 
      : 0
    
    // Save to localStorage
    allRatings[recipeId] = recipeRatings
    localStorage.setItem('recipeRatings', JSON.stringify(allRatings))
    
    return true
  } catch (error) {
    console.error('Failed to remove rating:', error)
    return false
  }
}

/**
 * Add a reply to a user's review (nutritionist reply)
 * @param {string|number} recipeId - Recipe ID
 * @param {string} targetUserId - The userId of the review author to reply to
 * @param {string} replierUserId - The nutritionist's userId
 * @param {string} replierRole - The role of replier, default 'nutritionist'
 * @param {string} content - Reply content
 * @returns {Object} Result { success, message, data }
 */
export function addReply(recipeId, targetUserId, replierUserId, replierRole = 'nutritionist', content = '') {
  try {
    if (!recipeId || !targetUserId || !replierUserId) {
      return { success: false, error: 'Recipe ID, targetUserId and replierUserId are required' }
    }
    const replyText = String(content || '').trim()
    if (!replyText) {
      return { success: false, error: 'Reply content is required' }
    }

    const allRatings = getAllRatings()
    const recipeRatings = getRecipeRatings(recipeId)
    const targetIndex = recipeRatings.ratings.findIndex(r => r.userId === targetUserId)
    if (targetIndex === -1) {
      return { success: false, error: 'Target review not found' }
    }

    const targetReview = recipeRatings.ratings[targetIndex]
    const existingReplies = Array.isArray(targetReview.replies) ? targetReview.replies : []
    const newReply = {
      userId: replierUserId,
      role: replierRole || 'nutritionist',
      content: replyText,
      timestamp: new Date().toISOString()
    }

    targetReview.replies = [...existingReplies, newReply]

    // Persist
    recipeRatings.ratings[targetIndex] = targetReview
    allRatings[recipeId] = recipeRatings
    localStorage.setItem('recipeRatings', JSON.stringify(allRatings))

    return { success: true, message: 'Reply added successfully', data: { replies: targetReview.replies } }
  } catch (error) {
    console.error('Failed to add reply:', error)
    return { success: false, error: 'An unexpected error occurred while adding reply' }
  }
}

/**
 * Get top rated recipes (sorted by rating)
 * @param {number} limit - Return count limit
 * @returns {Array} Top rated recipe ID list
 */
export function getTopRatedRecipes(limit = 10) {
  const allRatings = getAllRatings()
  
  return Object.entries(allRatings)
    .filter(([_, data]) => data.totalRatings > 0)
    .sort(([_, a], [__, b]) => b.averageRating - a.averageRating)
    .slice(0, limit)
    .map(([recipeId, _]) => recipeId)
}