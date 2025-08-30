<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero-section text-white py-5">
      <div class="hero-overlay"></div>
      <div class="container position-relative">
        <div class="row align-items-center min-vh-75">
          <div class="col-lg-6">
            <div class="hero-content">
              <h1 class="display-3 fw-bold mb-4 hero-title">
                <i class="fas fa-leaf me-3 text-success"></i>
                Smart Meal Planner
              </h1>
              <div class="executive-summary">
                <p class="lead mb-4 fs-5">
                  Designed for busy professionals and health-conscious individuals who struggle with meal planning and grocery shopping. 
                  Our platform provides personalized weekly meal plans with smart recipe recommendations and automated shopping lists. 
                  Core features include recipe discovery, meal planning calendar, nutritional tracking, and ingredient substitution suggestions.
                </p>
              </div>
              <div class="d-flex gap-3 flex-wrap">
                <router-link to="/recipes" class="btn btn-success btn-lg px-4 py-3 rounded-pill">
                  <i class="fas fa-book me-2"></i>
                  Explore Recipes
                </router-link>
                <router-link to="/meal-plan" class="btn btn-outline-light btn-lg px-4 py-3 rounded-pill">
                  <i class="fas fa-calendar-week me-2"></i>
                  Plan Meals
                </router-link>
              </div>
            </div>
          </div>
          <div class="col-lg-6 text-center">
            <div class="hero-image">
              <div class="floating-elements">
                <div class="floating-icon floating-icon-1">
                  <i class="fas fa-apple-alt fa-3x text-success"></i>
                </div>
                <div class="floating-icon floating-icon-2">
                  <i class="fas fa-carrot fa-2x text-warning"></i>
                </div>
                <div class="floating-icon floating-icon-3">
                  <i class="fas fa-fish fa-2x text-info"></i>
                </div>
                <div class="main-icon">
                  <i class="fas fa-utensils fa-6x text-white opacity-75"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-5 bg-light">
      <div class="container">
        <div class="row text-center mb-5">
          <div class="col-12">
            <h2 class="display-5 fw-bold mb-4 text-success">Key Features</h2>
            <p class="lead text-muted fs-4">Everything you need for smart meal planning</p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-md-4">
            <FeatureCard
              title="Recipe Discovery"
              description="Browse through curated recipes with detailed ingredients, cooking steps, and nutritional information. Filter by cooking time, dietary preferences, and difficulty level."
              icon-class="fas fa-book"
            />
          </div>
          
          <div class="col-md-4">
            <FeatureCard
              title="Weekly Planning"
              description="Generate personalized weekly meal plans with smart recipe suggestions. Easily replace meals and adjust portions based on your preferences."
              icon-class="fas fa-calendar-week"
            />
          </div>
          
          <div class="col-md-4">
            <FeatureCard
              title="Responsive Design"
              description="Access your meal plans anywhere with our fully responsive design. Optimized for desktop, tablet, and mobile devices."
              icon-class="fas fa-mobile-alt"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section py-5">
      <div class="container">
        <div class="row">
          <div class="col-12 text-center">
            <div class="cta-content p-5 rounded-4">
              <h3 class="display-6 fw-bold text-white mb-4">Ready to Start Your Healthy Journey?</h3>
              <p class="lead text-white mb-4 opacity-90">
                Join thousands of users who have transformed their eating habits with our smart meal planning platform.
              </p>
              <router-link to="/auth" class="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold">
                <i class="fas fa-user-plus me-2"></i>
                Get Started Today
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FeatureCard from '@/components/FeatureCard.vue'

export default {
  name: 'Home',
  components: {
    FeatureCard
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 25%, #68a085 50%, #86c5b1 75%, #a4eadd 100%);
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(45, 90, 39, 0.8) 0%, rgba(104, 160, 133, 0.6) 100%);
  z-index: 1;
}

.container {
  z-index: 2;
}

.min-vh-75 {
  min-height: 75vh;
}

.hero-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease-out;
}

.hero-content {
  animation: fadeInLeft 1s ease-out 0.3s both;
}

.executive-summary {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  border-radius: 0.5rem;
  border-left: 4px solid #fff;
}

.floating-elements {
  position: relative;
  height: 400px;
  animation: fadeInRight 1s ease-out 0.6s both;
}

.floating-icon {
  position: absolute;
  animation: float 4s ease-in-out infinite;
}

.floating-icon-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.floating-icon-2 {
  top: 60%;
  right: 20%;
  animation-delay: 1s;
}

.floating-icon-3 {
  bottom: 30%;
  left: 20%;
  animation-delay: 2s;
}

.main-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}



.cta-section {
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #68a085 100%);
}

.cta-content {
  background: linear-gradient(135deg, rgba(45, 90, 39, 0.9) 0%, rgba(104, 160, 133, 0.8) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-success {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-success:hover {
  background: linear-gradient(135deg, #20c997 0%, #28a745 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
}

.btn-outline-light:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

.hero-image {
  animation: float 3s ease-in-out infinite;
}

@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    padding: 3rem 0;
  }
  
  .display-3 {
    font-size: 2.5rem;
  }
  
  .floating-elements {
    height: 300px;
  }
  
  .floating-icon {
    display: none;
  }
  
  .main-icon {
    position: static;
    transform: none;
  }
  
  .min-vh-75 {
    min-height: 60vh;
  }
  
  .tech-badge {
    font-size: 0.9rem;
  }
}
</style>