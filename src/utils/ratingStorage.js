// Recipe rating data storage utility
// Manage recipe rating data using localStorage

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
  const allRatings = getAllRatings()
  return allRatings[recipeId] || {
    ratings: [], // User rating list
    averageRating: 0, // Average rating
    totalRatings: 0 // Total rating count
  }
}

/**
 * Add user rating
 * @param {string|number} recipeId - Recipe ID
 * @param {number} rating - Rating (1-5)
 * @param {string} userId - User ID
 * @param {string} comment - Comment content (optional)
 * @returns {boolean} Success status
 */
export function addRating(recipeId, rating, userId, comment = '') {
  try {
    // Validate rating range
    if (rating < 1 || rating > 5) {
      console.error('Rating must be between 1-5')
      return false
    }

    const allRatings = getAllRatings()
    const recipeRatings = getRecipeRatings(recipeId)
    
    // Check if user has already rated
    const existingRatingIndex = recipeRatings.ratings.findIndex(r => r.userId === userId)
    
    const newRating = {
      userId,
      rating,
      comment,
      timestamp: new Date().toISOString()
    }
    
    if (existingRatingIndex >= 0) {
      // Update existing rating
      recipeRatings.ratings[existingRatingIndex] = newRating
    } else {
      // Add new rating
      recipeRatings.ratings.push(newRating)
    }
    
    // Recalculate average rating
    recipeRatings.totalRatings = recipeRatings.ratings.length
    recipeRatings.averageRating = recipeRatings.ratings.reduce((sum, r) => sum + r.rating, 0) / recipeRatings.totalRatings
    
    // Save to localStorage
    allRatings[recipeId] = recipeRatings
    localStorage.setItem('recipeRatings', JSON.stringify(allRatings))
    
    return true
  } catch (error) {
    console.error('Failed to add rating:', error)
    return false
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
 * Remove user rating
 * @param {string|number} recipeId - Recipe ID
 * @param {string} userId - User ID
 * @returns {boolean} Success status
 */
export function removeRating(recipeId, userId) {
  try {
    const allRatings = getAllRatings()
    const recipeRatings = getRecipeRatings(recipeId)
    
    const ratingIndex = recipeRatings.ratings.findIndex(r => r.userId === userId)
    if (ratingIndex === -1) {
      return false // Rating not found
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