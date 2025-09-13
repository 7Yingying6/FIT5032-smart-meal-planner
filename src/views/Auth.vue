<template>
  <div class="auth-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-primary text-white text-center py-4">
              <h2 class="mb-0">
                <i class="fas fa-user-circle me-3"></i>
                {{ isLogin ? 'Welcome Back' : 'Join Us Today' }}
              </h2>
              <p class="mb-0 mt-2 opacity-75">
                {{ isLogin ? 'Sign in to your account' : 'Create your account to get started' }}
              </p>
            </div>
            
            <div class="card-body p-4">
              <!-- Auth Mode Toggle -->
              <div class="text-center mb-4">
                <div class="btn-group" role="group">
                  <button 
                    @click="isLogin = true" 
                    :class="['btn', isLogin ? 'btn-primary' : 'btn-outline-primary']"
                  >
                    <i class="fas fa-sign-in-alt me-2"></i>Login
                  </button>
                  <button 
                    @click="isLogin = false" 
                    :class="['btn', !isLogin ? 'btn-primary' : 'btn-outline-primary']"
                  >
                    <i class="fas fa-user-plus me-2"></i>Register
                  </button>
                </div>
              </div>

              <!-- Auth Form -->
              <form @submit.prevent="handleSubmit" novalidate>
                <!-- Full Name (Register only) -->
                <div v-if="!isLogin" class="mb-3">
                  <label for="fullName" class="form-label">
                    <i class="fas fa-user me-2"></i>Full Name *
                  </label>
                  <input 
                    id="fullName"
                    v-model="form.fullName"
                    type="text" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.fullName, 'is-valid': form.fullName && !errors.fullName }"
                    placeholder="Enter your full name"
                    required
                  >
                  <div v-if="errors.fullName" class="invalid-feedback">
                    {{ errors.fullName }}
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label for="email" class="form-label">
                    <i class="fas fa-envelope me-2"></i>Email Address *
                  </label>
                  <input 
                    id="email"
                    v-model="form.email"
                    type="email" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.email, 'is-valid': form.email && !errors.email }"
                    placeholder="Enter your email address"
                    required
                  >
                  <div v-if="errors.email" class="invalid-feedback">
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Password -->
                <div class="mb-3">
                  <label for="password" class="form-label">
                    <i class="fas fa-lock me-2"></i>Password *
                  </label>
                  <div class="input-group">
                    <input 
                      id="password"
                      v-model="form.password"
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control"
                      :class="{ 'is-invalid': errors.password, 'is-valid': form.password && !errors.password }"
                      placeholder="Enter your password"
                      required
                    >
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                    </button>
                  </div>
                  <div v-if="errors.password" class="invalid-feedback d-block">
                    {{ errors.password }}
                  </div>
                  <div v-if="form.password && !errors.password" class="form-text">
                    <div class="password-strength">
                      <small class="text-muted">Password strength: </small>
                      <span :class="passwordStrengthClass">{{ passwordStrengthText }}</span>
                    </div>
                  </div>
                </div>

                <!-- Confirm Password (Register only) -->
                <div v-if="!isLogin" class="mb-3">
                  <label for="confirmPassword" class="form-label">
                    <i class="fas fa-lock me-2"></i>Confirm Password *
                  </label>
                  <input 
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    type="password" 
                    class="form-control"
                    :class="{ 'is-invalid': errors.confirmPassword, 'is-valid': form.confirmPassword && !errors.confirmPassword }"
                    placeholder="Confirm your password"
                    required
                  >
                  <div v-if="errors.confirmPassword" class="invalid-feedback">
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <!-- User Role Selection -->
                <div class="mb-4">
                  <label for="userRole" class="form-label">
                    <i class="fas fa-user-tag me-2"></i>User Role
                  </label>
                  <select 
                    id="userRole"
                    v-model="form.userRole"
                    class="form-select"
                    :class="{ 'is-invalid': errors.userRole, 'is-valid': form.userRole && !errors.userRole }"
                  >
                    <option value="">Select your role</option>
                    <option value="user">Regular User</option>
                    <option value="admin">Administrator</option>
                  </select>
                  <div v-if="errors.userRole" class="invalid-feedback">
                    {{ errors.userRole }}
                  </div>
                  <div class="form-text">
                    <small class="text-muted">
                      <i class="fas fa-info-circle me-1"></i>
                      Regular users can browse and save recipes. Administrators have additional management features.
                    </small>
                  </div>
                </div>

                <!-- Terms and Conditions (Register only) -->
                <div v-if="!isLogin" class="mb-4">
                  <div class="form-check">
                    <input 
                      id="agreeTerms"
                      v-model="form.agreeTerms"
                      type="checkbox" 
                      class="form-check-input"
                      :class="{ 'is-invalid': errors.agreeTerms }"
                      required
                    >
                    <label for="agreeTerms" class="form-check-label">
                      I agree to the 
                      <a href="#" class="text-primary text-decoration-none">Terms of Service</a> 
                      and 
                      <a href="#" class="text-primary text-decoration-none">Privacy Policy</a> *
                    </label>
                    <div v-if="errors.agreeTerms" class="invalid-feedback d-block">
                      {{ errors.agreeTerms }}
                    </div>
                  </div>
                </div>

                <!-- Remember Me (Login only) -->
                <div v-if="isLogin" class="mb-4">
                  <div class="form-check">
                    <input 
                      id="rememberMe"
                      v-model="form.rememberMe"
                      type="checkbox" 
                      class="form-check-input"
                    >
                    <label for="rememberMe" class="form-check-label">
                      Remember me for 30 days
                    </label>
                  </div>
                </div>

                <!-- Submit Button -->
                <div class="d-grid mb-3">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else :class="isLogin ? 'fas fa-sign-in-alt' : 'fas fa-user-plus'" class="me-2"></i>
                    {{ isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
                  </button>
                </div>

                <!-- Additional Links -->
                <div class="text-center">
                  <div v-if="isLogin" class="mb-2">
                    <a href="#" class="text-muted text-decoration-none small">
                      <i class="fas fa-key me-1"></i>Forgot your password?
                    </a>
                  </div>
                  <div class="text-muted small">
                    {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
                    <button 
                      type="button" 
                      @click="isLogin = !isLogin" 
                      class="btn btn-link btn-sm p-0 text-primary text-decoration-none"
                    >
                      {{ isLogin ? 'Sign up here' : 'Sign in here' }}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <!-- Demo Users & Quick Login -->
          <div class="card mt-4 border-info">
            <div class="card-header bg-info text-white">
              <h6 class="mb-0">
                <i class="fas fa-users me-2"></i>Demo Users - Quick Login
              </h6>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                <i class="fas fa-lightbulb me-1"></i>
                Try different user roles to see how the system adapts to different permissions and features.
              </p>
              
              <div class="row g-3 justify-content-center">
                 <!-- Student Demo User -->
                 <div class="col-md-5">
                   <div class="demo-user-card p-3 border rounded">
                     <div class="d-flex align-items-center mb-2">
                <i class="fas fa-graduation-cap text-primary me-2"></i>
                <strong>User</strong>
              </div>
              <div class="demo-credentials mb-2">
                <small class="text-muted">
                  <strong>Robby</strong><br>
                  robby@gmail.com<br>
                  Password: Robby20010922
                </small>
              </div>
                     <button 
                       @click="quickLogin('student')"
                       class="btn btn-outline-primary btn-sm w-100"
                       :disabled="isSubmitting"
                     >
                       <i class="fas fa-sign-in-alt me-1"></i>Quick Login
                     </button>
                   </div>
                 </div>
                 
                 <!-- Nutritionist Demo User -->
                 <div class="col-md-5">
                   <div class="demo-user-card p-3 border rounded">
                     <div class="d-flex align-items-center mb-2">
                       <i class="fas fa-user-md text-success me-2"></i>
                       <strong>Nutritionist</strong>
                     </div>
                     <div class="demo-credentials mb-2">
                <small class="text-muted">
                  <strong>Dr. Emily Chen</strong><br>
                  emily.chen@gmail.com<br>
                  Password: nutritionist123
                </small>
              </div>
                     <button 
                       @click="quickLogin('nutritionist')"
                       class="btn btn-outline-success btn-sm w-100"
                       :disabled="isSubmitting"
                     >
                       <i class="fas fa-sign-in-alt me-1"></i>Quick Login
                     </button>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userStorage from '@/utils/userStorage.js'
import passwordHash from '@/utils/passwordHash.js'

export default {
  name: 'Auth',
  data() {
    return {
      isLogin: true,
      showPassword: false,
      isSubmitting: false,
      form: {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userRole: '',
        agreeTerms: false,
        rememberMe: false
      },
      errors: {},
      // Demo users data
      demoUsers: {
        student: {
          firstName: 'Robby',
          lastName: '',
          email: 'robby@gmail.com',
          password: 'Robby20010922',
          role: 'student'
        },
        nutritionist: {
          firstName: 'Emily',
          lastName: 'Chen',
          email: 'emily.chen@gmail.com',
          password: 'nutritionist123',
          role: 'nutritionist'
        },
        administrator: {
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@fit.edu',
          password: 'admin123',
          role: 'administrator'
        }
      }
    }
  },
  computed: {
    passwordStrength() {
      const password = this.form.password
      if (!password) return 0
      
      let strength = 0
      if (password.length >= 8) strength++
      if (/[a-z]/.test(password)) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      
      return strength
    },
    passwordStrengthText() {
      const strength = this.passwordStrength
      if (strength <= 1) return 'Weak'
      if (strength <= 2) return 'Fair'
      if (strength <= 3) return 'Good'
      if (strength <= 4) return 'Strong'
      return 'Very Strong'
    },
    passwordStrengthClass() {
      const strength = this.passwordStrength
      if (strength <= 1) return 'text-danger'
      if (strength <= 2) return 'text-warning'
      if (strength <= 3) return 'text-info'
      return 'text-success'
    }
  },
  watch: {
    isLogin() {
      this.clearForm()
      this.clearErrors()
    },
    'form.email'() {
      if (this.errors.email) this.validateEmail()
    },
    'form.password'() {
      if (this.errors.password) this.validatePassword()
      if (this.form.confirmPassword && this.errors.confirmPassword) {
        this.validateConfirmPassword()
      }
    },
    'form.confirmPassword'() {
      if (this.errors.confirmPassword) this.validateConfirmPassword()
    },
    'form.fullName'() {
      if (this.errors.fullName) this.validateFullName()
    },
    'form.userRole'() {
      if (this.errors.userRole) this.validateUserRole()
    },
    'form.agreeTerms'() {
      if (this.errors.agreeTerms) this.validateAgreeTerms()
    }
  },
  methods: {
    validateEmail() {
      const email = this.form.email.trim()
      if (!email) {
        this.errors.email = 'Email is required'
        return false
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        this.errors.email = 'Please enter a valid email address'
        return false
      }
      delete this.errors.email
      return true
    },
    
    validatePassword() {
      const password = this.form.password
      if (!password) {
        this.errors.password = 'Password is required'
        return false
      }
      if (password.length < 8) {
        this.errors.password = 'Password must be at least 8 characters long'
        return false
      }
      
      // Enhanced password validation for registration
      if (!this.isLogin) {
        const strength = passwordHash.checkPasswordStrength(password)
        if (strength.score < 3) {
          this.errors.password = 'Password is too weak. Please include uppercase, lowercase, numbers, and special characters.'
          return false
        }
      }
      
      delete this.errors.password
      return true
    },
    
    validateConfirmPassword() {
      if (!this.isLogin) {
        const confirmPassword = this.form.confirmPassword
        if (!confirmPassword) {
          this.errors.confirmPassword = 'Please confirm your password'
          return false
        }
        if (confirmPassword !== this.form.password) {
          this.errors.confirmPassword = 'Passwords do not match'
          return false
        }
      }
      delete this.errors.confirmPassword
      return true
    },
    
    validateFullName() {
      if (!this.isLogin) {
        const fullName = this.form.fullName.trim()
        if (!fullName) {
          this.errors.fullName = 'Full name is required'
          return false
        }
        if (fullName.length < 2) {
          this.errors.fullName = 'Full name must be at least 2 characters long'
          return false
        }
      }
      delete this.errors.fullName
      return true
    },
    
    validateUserRole() {
      if (!this.form.userRole) {
        this.errors.userRole = 'Please select a user role'
        return false
      }
      delete this.errors.userRole
      return true
    },
    
    validateAgreeTerms() {
      if (!this.isLogin && !this.form.agreeTerms) {
        this.errors.agreeTerms = 'You must agree to the terms and conditions'
        return false
      }
      delete this.errors.agreeTerms
      return true
    },
    
    validateForm() {
      let isValid = true
      
      if (!this.validateEmail()) isValid = false
      if (!this.validatePassword()) isValid = false
      if (!this.validateUserRole()) isValid = false
      
      if (!this.isLogin) {
        if (!this.validateFullName()) isValid = false
        if (!this.validateConfirmPassword()) isValid = false
        if (!this.validateAgreeTerms()) isValid = false
      }
      
      return isValid
    },
    
    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }
      
      this.isSubmitting = true
      
      try {
        let result
        
        if (this.isLogin) {
          // Handle login
          result = await userStorage.loginUser(this.form.email, this.form.password)
        } else {
          // Handle registration
          const [firstName, ...lastNameParts] = this.form.fullName.trim().split(' ')
          const lastName = lastNameParts.join(' ') || ''
          
          const userData = {
            email: this.form.email,
            password: this.form.password,
            firstName: firstName,
            lastName: lastName,
            role: this.form.userRole
          }
          
          result = await userStorage.registerUser(userData)
        }
        
        if (result.success) {
          // Save user session
          userStorage.saveCurrentUser(result.user)
          
          // Show success message
          this.showSuccessMessage(result.message, result.user)
          
          // Redirect to home page
          this.$router.push('/')
        } else {
          // Show error message
          this.showErrorMessage(result.message)
        }
        
      } catch (error) {
        console.error('Authentication error:', error)
        this.showErrorMessage('An unexpected error occurred. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },
    
    clearForm() {
      this.form = {
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        userRole: '',
        agreeTerms: false,
        rememberMe: false
      }
    },
    
    clearErrors() {
      this.errors = {}
    },
    
    showSuccessMessage(message, user) {
      const welcomeText = user ? `Welcome ${user.firstName}!` : 'Welcome!'
      alert(`${message} ${welcomeText}`)
    },
    
    showErrorMessage(message) {
      alert(`Error: ${message}`)
    },
    
    checkPasswordStrength(password) {
      return passwordHash.checkPasswordStrength(password)
    },
    
    // Quick login method for demo users
    async quickLogin(userType) {
      try {
        this.isSubmitting = true
        this.clearErrors()
        
        const demoUser = this.demoUsers[userType]
        if (!demoUser) {
          this.showErrorMessage('Demo user not found')
          return
        }
        
        // Set form to login mode
        this.isLogin = true
        
        // Fill form with demo user credentials
        this.form.email = demoUser.email
        this.form.password = demoUser.password
        
        // Attempt login
        const result = await userStorage.loginUser(demoUser.email, demoUser.password)
        
        if (result.success) {
          this.showSuccessMessage('Login successful!', result.user)
          
          // Redirect to home page
          setTimeout(() => {
            this.$router.push('/')
          }, 1500)
        } else {
          this.showErrorMessage(result.message || 'Login failed')
        }
      } catch (error) {
        console.error('Quick login error:', error)
        this.showErrorMessage('An error occurred during login')
      } finally {
        this.isSubmitting = false
      }
    },
    
    // Pre-register demo users
    async preRegisterDemoUsers() {
      try {
        for (const [userType, userData] of Object.entries(this.demoUsers)) {
          // Check if user already exists
          const existingUsers = userStorage.getAllUsers()
          const userExists = existingUsers.some(user => user.email === userData.email)
          
          if (!userExists) {
            // Register the demo user
            await userStorage.registerUser(
              userData.firstName,
              userData.lastName,
              userData.email,
              userData.password,
              userData.role
            )
            console.log(`Demo user registered: ${userData.email}`)
          }
        }
      } catch (error) {
        console.error('Error pre-registering demo users:', error)
      }
    }
  },
  
  // Pre-register demo users when component mounts
  async mounted() {
    await this.preRegisterDemoUsers()
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
}

.card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-header {
  background: #007bff !important;
  border: none;
}

.btn-primary {
  background: #007bff;
  border: none;
}

.btn-primary:hover {
  background: #0056b3;
}

.btn-outline-primary:hover {
  /* Simplified hover effect */
}

.form-control {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control.is-valid {
  border-color: #28a745;
}

.form-control.is-invalid {
  border-color: #dc3545;
}

.form-select {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
}

.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.password-strength {
  margin-top: 0.25rem;
}

.input-group .btn {
  border-radius: 0 0.5rem 0.5rem 0;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Demo user cards styling */
.demo-user-card {
  background-color: #f8f9fa;
  transition: all 0.3s ease;
  border: 1px solid #dee2e6 !important;
}

.demo-user-card:hover {
  background-color: #e9ecef;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.demo-credentials {
  min-height: 60px;
}

.demo-user-card .btn {
  transition: all 0.2s ease;
}

.demo-user-card .btn:hover {
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }
  
  .card-body {
    padding: 2rem 1.5rem;
  }
}
</style>