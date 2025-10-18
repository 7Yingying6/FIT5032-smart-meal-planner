<template>
  <div class="star-rating">
    <!-- Display mode: show average rating -->
    <div v-if="mode === 'display'" class="d-flex align-items-center">
      <div class="stars me-2">
        <Icon
          v-for="star in 5"
          :key="star"
          class="star"
          :icon="getStarIcon(star)"
          :class="getStarColorClass(star)"
        />
      </div>
      <span v-if="totalRatings > 0" class="rating-text text-muted small">
        {{ averageRating.toFixed(1) }} ({{ totalRatings }} {{ totalRatings === 1 ? 'review' : 'reviews' }})
      </span>
      <span v-else class="rating-text text-muted small fst-italic">
        <Icon icon="mdi:star-half-full" class="me-1" />No ratings yet - Be the first to rate!
      </span>
    </div>

    <!-- Interactive mode: allow user to rate -->
    <div v-else class="interactive-rating">
      <div class="mb-2">
        <label class="form-label small">Rate this recipe:</label>
      </div>
      <div class="d-flex align-items-center mb-2">
        <div class="stars me-2">
          <Icon
            v-for="star in 5"
            :key="star"
            class="star interactive"
            :icon="getInteractiveStarIcon(star)"
            :class="getInteractiveStarColorClass(star)"
            @click="setRating(star)"
            @mouseover="hoverRating = star"
            @mouseleave="hoverRating = 0"
          />
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
          v-if="canDeleteRating" 
          @click="removeRating" 
          class="btn btn-outline-danger btn-sm"
          :disabled="isSubmitting"
        >
          Remove
        </button>
      </div>
      
      <!-- Success message -->
      <div v-if="successMessage" class="alert alert-success alert-dismissible fade show mt-2" role="alert">
        <Icon icon="mdi:check-circle" class="me-2" />{{ successMessage }}
        <button type="button" class="btn-close" @click="successMessage = ''" aria-label="Close"></button>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show mt-2" role="alert">
        <Icon icon="mdi:alert" class="me-2" />{{ errorMessage }}
        <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
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
      existingRating: null,
      errorMessage: '',
      successMessage: ''
    }
  },
  computed: {
    canDeleteRating() {
      if (!this.existingRating) return false
      
      const user = userStorage.getCurrentUser()
      if (!user) return false
      
      // Users can only delete their own ratings
      return this.existingRating.userId === user.id
    }
  },
  mounted() {
    if (this.mode === 'interactive') {
      this.loadUserRating()
    }
  },
  methods: {
    getStarIcon(star) {
      const rating = this.averageRating
      if (star <= Math.floor(rating)) {
        return 'mdi:star' // Full star
      } else if (star === Math.ceil(rating) && rating % 1 !== 0) {
        return 'mdi:star-half-full' // Half star
      } else {
        return 'mdi:star-outline' // Empty star
      }
    },
    getStarColorClass(star) {
      const rating = this.averageRating
      if (star <= Math.floor(rating) || (star === Math.ceil(rating) && rating % 1 !== 0)) {
        return 'text-warning'
      }
      return 'text-muted'
    },
    getInteractiveStarIcon(star) {
      const rating = this.hoverRating || this.currentRating
      return star <= rating ? 'mdi:star' : 'mdi:star-outline'
    },
    getInteractiveStarColorClass(star) {
      const rating = this.hoverRating || this.currentRating
      return star <= rating ? 'text-warning' : 'text-muted'
    },
    setRating(rating) {
      // Clear any previous error messages
      this.errorMessage = ''
      
      // Check if user is logged in
      const user = userStorage.getCurrentUser()
      if (!user) {
        this.$router.push('/auth')
        return
      }
      
      // Validate rating range
      if (rating < 1 || rating > 5) {
        this.errorMessage = 'Please select a rating between 1 and 5 stars'
        return
      }
      
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
      // Clear previous messages
      this.errorMessage = ''
      this.successMessage = ''
      
      const user = userStorage.getCurrentUser()
      if (!user) {
        this.$router.push('/auth')
        return
      }
      
      // Client-side validation
      if (this.currentRating === 0) {
        this.errorMessage = 'Please select a rating'
        return
      }
      
      if (this.currentRating < 1 || this.currentRating > 5) {
        this.errorMessage = 'Rating must be between 1 and 5 stars'
        return
      }
      
      this.isSubmitting = true
      
      try {
        const result = addRating(this.recipeId, this.currentRating, user.id, this.comment)
        
        if (result.success) {
          // Update existing rating reference
          this.existingRating = {
            userId: user.id,
            rating: this.currentRating,
            comment: this.comment,
            timestamp: new Date().toISOString()
          }
          
          // Emit rating update event with new data
          this.$emit('rating-updated', {
            recipeId: this.recipeId,
            rating: this.currentRating,
            comment: this.comment,
            averageRating: result.data.averageRating,
            totalRatings: result.data.totalRatings,
            isUpdate: result.isUpdate
          })
          
          // Show success message
          this.showSuccessMessage(result.message)
        } else {
          this.errorMessage = result.error || 'Failed to submit rating. Please try again.'
        }
      } catch (error) {
        console.error('Error submitting rating:', error)
        console.trace('submitRating trace')
        this.errorMessage = 'An unexpected error occurred. Please try again.'
      } finally {
        this.isSubmitting = false
      }
    },
    async removeRating() {
      // Clear previous messages
      this.errorMessage = ''
      this.successMessage = ''
      
      const user = userStorage.getCurrentUser()
      if (!user) {
        this.$router.push('/auth')
        return
      }
      
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
          this.errorMessage = 'Failed to remove rating. Please try again.'
        }
      } catch (error) {
        console.error('Error removing rating:', error)
        this.errorMessage = 'An unexpected error occurred while removing rating.'
      } finally {
        this.isSubmitting = false
      }
    },
    showSuccessMessage(message = 'Rating submitted successfully!') {
      this.successMessage = message
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
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