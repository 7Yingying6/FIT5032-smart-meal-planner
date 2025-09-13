<template>
  <div class="star-rating">
    <!-- Display mode: show average rating -->
    <div v-if="mode === 'display'" class="d-flex align-items-center">
      <div class="stars me-2">
        <i 
          v-for="star in 5" 
          :key="star"
          class="star"
          :class="getStarClass(star)"
        ></i>
      </div>
      <span class="rating-text text-muted small">
        {{ averageRating.toFixed(1) }} ({{ totalRatings }} {{ totalRatings === 1 ? 'review' : 'reviews' }})
      </span>
    </div>

    <!-- Interactive mode: allow user to rate -->
    <div v-else class="interactive-rating">
      <div class="mb-2">
        <label class="form-label small">Rate this recipe:</label>
      </div>
      <div class="d-flex align-items-center mb-2">
        <div class="stars me-2">
          <i 
            v-for="star in 5" 
            :key="star"
            class="star interactive"
            :class="getInteractiveStarClass(star)"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
          ></i>
        </div>
        <span v-if="currentRating > 0" class="rating-text text-muted small">
          {{ getRatingText(currentRating) }}
        </span>
      </div>
      
      <!-- Comment input -->
      <div v-if="showComment && currentRating > 0" class="mb-2">
        <textarea 
          v-model="comment"
          class="form-control form-control-sm"
          rows="2"
          placeholder="Share your thoughts about this recipe (optional)"
          maxlength="200"
        ></textarea>
        <small class="text-muted">{{ comment.length }}/200</small>
      </div>
      
      <!-- Submit button -->
      <div v-if="currentRating > 0" class="d-flex gap-2">
        <button 
          @click="submitRating" 
          class="btn btn-primary btn-sm"
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
          {{ isSubmitting ? 'Submitting...' : (existingRating ? 'Update Rating' : 'Submit Rating') }}
        </button>
        <button 
          v-if="existingRating" 
          @click="removeRating" 
          class="btn btn-outline-danger btn-sm"
          :disabled="isSubmitting"
        >
          Remove
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { addRating, getUserRating, removeRating as removeUserRating } from '@/utils/ratingStorage'
import userStorage from '@/utils/userStorage'

export default {
  name: 'StarRating',
  props: {
    recipeId: {
      type: [String, Number],
      required: true
    },
    averageRating: {
      type: Number,
      default: 0
    },
    totalRatings: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: 'display', // 'display' or 'interactive'
      validator: value => ['display', 'interactive'].includes(value)
    },
    showComment: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentRating: 0,
      hoverRating: 0,
      comment: '',
      isSubmitting: false,
      existingRating: null
    }
  },
  mounted() {
    if (this.mode === 'interactive') {
      this.loadUserRating()
    }
  },
  methods: {
    getStarClass(star) {
      const rating = this.averageRating
      if (star <= Math.floor(rating)) {
        return 'fas fa-star text-warning' // Full star
      } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
        return 'fas fa-star-half-alt text-warning' // Half star
      } else {
        return 'far fa-star text-muted' // Empty star
      }
    },
    getInteractiveStarClass(star) {
      const rating = this.hoverRating || this.currentRating
      if (star <= rating) {
        return 'fas fa-star text-warning'
      } else {
        return 'far fa-star text-muted'
      }
    },
    setRating(rating) {
      this.currentRating = rating
    },
    getRatingText(rating) {
      const texts = {
        1: 'Poor',
        2: 'Fair', 
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      }
      return texts[rating] || ''
    },
    async loadUserRating() {
      const user = userStorage.getCurrentUser()
      if (user) {
        this.existingRating = getUserRating(this.recipeId, user.id)
        if (this.existingRating) {
          this.currentRating = this.existingRating.rating
          this.comment = this.existingRating.comment || ''
        }
      }
    },
    async submitRating() {
      const user = userStorage.getCurrentUser()
      if (!user) {
        alert('Please log in to rate recipes')
        return
      }
      
      if (this.currentRating === 0) {
        alert('Please select a rating')
        return
      }
      
      this.isSubmitting = true
      
      try {
        const success = addRating(this.recipeId, this.currentRating, user.id, this.comment)
        if (success) {
          this.$emit('rating-updated', {
            recipeId: this.recipeId,
            rating: this.currentRating,
            comment: this.comment
          })
          
          // Update existing rating reference
          this.existingRating = {
            userId: user.id,
            rating: this.currentRating,
            comment: this.comment,
            timestamp: new Date().toISOString()
          }
          
          // Show success message
          this.showSuccessMessage()
        } else {
          alert('Failed to submit rating. Please try again.')
        }
      } catch (error) {
        console.error('Error submitting rating:', error)
        alert('An error occurred. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    async removeRating() {
      const user = userStorage.getCurrentUser()
      if (!user) return
      
      if (!confirm('Are you sure you want to remove your rating?')) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        const success = removeUserRating(this.recipeId, user.id)
        if (success) {
          this.currentRating = 0
          this.comment = ''
          this.existingRating = null
          
          this.$emit('rating-updated', {
            recipeId: this.recipeId,
            removed: true
          })
          
          this.showSuccessMessage('Rating removed successfully!')
        } else {
          alert('Failed to remove rating. Please try again.')
        }
      } catch (error) {
        console.error('Error removing rating:', error)
        alert('An error occurred. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    showSuccessMessage(message = 'Rating submitted successfully!') {
      // Simple success feedback - could be enhanced with toast notifications
      const originalText = message
      setTimeout(() => {
        // Could implement a toast notification system here
        console.log(originalText)
      }, 100)
    }
  }
}
</script>

<style scoped>
.star-rating {
  font-family: inherit;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.star.interactive {
  cursor: pointer;
  font-size: 1.3rem;
}

.star.interactive:hover {
  transform: scale(1.1);
}

.rating-text {
  font-size: 0.875rem;
  white-space: nowrap;
}

.interactive-rating {
  max-width: 400px;
}

.form-control:focus {
  border-color: #ffc107;
  box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
}

.btn-primary {
  background-color: #198754;
  border-color: #198754;
}

.btn-primary:hover {
  background-color: #157347;
  border-color: #146c43;
}

.spinner-border-sm {
  width: 0.875rem;
  height: 0.875rem;
}
</style>