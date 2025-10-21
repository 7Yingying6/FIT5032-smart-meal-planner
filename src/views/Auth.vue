<template>
  <div class="auth-page">
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-lg border-0">
            <div class="card-header bg-white text-dark text-center py-4">
              <h2 class="mb-0">
                <Icon icon="mdi:account-circle" class="me-3 text-primary" />
                {{ isLogin ? 'Welcome Back' : 'Join Us Today' }}
              </h2>
              <p class="mb-0 mt-2 text-muted">
                {{ isLogin ? 'Sign in to your account' : 'Create your account to get started' }}
              </p>
            </div>
            
            <div class="card-body p-4">
              <!-- Auth Mode Toggle -->
              <!-- Toggle between sign-in and register -->
              <div class="text-center mb-4">
                <div class="btn-group" role="group">
                  <button 
                    @click="isLogin = true" 
                    :class="['btn', isLogin ? 'btn-primary' : 'btn-outline-primary']"
                  >
                    <Icon icon="mdi:login" class="me-2" />Login
                  </button>
                  <button 
                    @click="isLogin = false" 
                    :class="['btn', !isLogin ? 'btn-primary' : 'btn-outline-primary']"
                  >
                    <Icon icon="mdi:account-plus" class="me-2" />Register
                  </button>
                </div>
              </div>

              <!-- Auth form -->
              <form @submit.prevent="handleSubmit" novalidate>
                <!-- Full name (register only) -->
                <div v-if="!isLogin" class="mb-3">
                  <label for="fullName" class="form-label">
                    <Icon icon="mdi:account" class="me-2" />Full Name *
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

                <!-- Email address -->
                <div class="mb-3">
                  <label for="email" class="form-label">
                    <Icon icon="mdi:email" class="me-2" />Email Address *
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

                <!-- Password field -->
                <div class="mb-3">
                  <label for="password" class="form-label">
                    <Icon icon="mdi:lock" class="me-2" />Password *
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
                      <Icon :icon="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" />
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

                <!-- Confirm password (register only) -->
                <div v-if="!isLogin" class="mb-3">
                  <label for="confirmPassword" class="form-label">
                    <Icon icon="mdi:lock" class="me-2" />Confirm Password *
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

                <!-- Choose a role -->
                <div class="mb-4">
                  <label for="userRole" class="form-label">
                    <Icon icon="mdi:account-badge-outline" class="me-2" />User Role
                  </label>
                  <select 
                    id="userRole"
                    v-model="form.userRole"
                    class="form-select"
                    :class="{ 'is-invalid': errors.userRole, 'is-valid': form.userRole && !errors.userRole }"
                  >
                    <option value="">Select your role</option>
                    <option value="user">Regular User</option>
                    <option value="nutritionist">Nutritionist</option>
                  </select>
                  <div v-if="errors.userRole" class="invalid-feedback">
                    {{ errors.userRole }}
                  </div>
                  <div class="form-text">
                    <small class="text-muted">
                      <Icon icon="mdi:information-outline" class="me-1" />
                      Regular users can browse and save recipes. Nutritionists have additional management features.
                    </small>
                  </div>
                </div>

                <!-- Terms & privacy (register only) -->
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

                <!-- Remember me (login only) -->
                <div v-if="isLogin" class="mb-4">
                  <div class="form-check">
                    <input 
                      id="rememberMe"
                      v-model="form.rememberMe"
                      type="checkbox" 
                      class="form-check-input"
                    >
                    <label for="rememberMe" class="form-check-label">
                      Remember me for 7 days
                    </label>
                  </div>
                </div>

                <!-- Submit button -->
                <div class="d-grid mb-3">
                  <button 
                    type="submit" 
                    class="btn btn-primary btn-lg"
                    :disabled="isSubmitting"
                  >
                    <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else :class="isLogin ? 'mdi:login' : 'mdi:account-plus'" class="me-2"></i>
                    {{ isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
                  </button>
                </div>

                <!-- OAuth providers -->
                <div class="d-grid mb-3">
                  <button 
                    type="button" 
                    class="btn btn-outline-secondary btn-lg"
                    @click="loginWithGoogle"
                    aria-label="Sign in with Google"
                  >
                    <Icon icon="mdi:google" class="me-2" />Continue with Google
                  </button>
                </div>

                <!-- Password reset and switch -->
                <div class="text-center">
                  <div v-if="isLogin" class="mb-2">
                    <a href="#" class="text-muted text-decoration-none small">
                      <Icon icon="mdi:key-outline" class="me-1" />Forgot your password?
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

          <!-- Demo users & quick login -->
          <div class="card mt-4 border-info">
            <div class="card-header bg-info text-white">
              <h6 class="mb-0">
                <Icon icon="mdi:account-group" class="me-2" />Demo Users - Quick Login
              </h6>
            </div>
            <div class="card-body">
              <p class="text-muted small mb-3">
                <Icon icon="mdi:lightbulb-on-outline" class="me-1" />
                Try different user roles to see how the system adapts to different permissions and features.
              </p>
              
              <div class="row g-3 justify-content-center">
                 <!-- Student demo user -->
                 <div class="col-md-5">
                   <div class="demo-user-card p-3 border rounded">
                     <div class="d-flex align-items-center mb-2">
                <Icon icon="mdi:school" class="text-primary me-2" />
                <strong>User</strong>
              </div>
              <div class="demo-credentials mb-2">
                <small class="text-muted">
                  <strong>Robby (Demo)</strong><br>
                  Use Quick Login to sign in
                </small>
              </div>
                     <button 
                       @click="quickLogin('student')"
                       class="btn btn-outline-primary btn-sm w-100"
                       :disabled="isSubmitting"
                     >
                       <Icon icon="mdi:login" class="me-1" />Quick Login
                     </button>
                   </div>
                 </div>
                 
                 <!-- Nutritionist demo user -->
                 <div class="col-md-5">
                   <div class="demo-user-card p-3 border rounded">
                     <div class="d-flex align-items-center mb-2">
                       <Icon icon="mdi:stethoscope" class="text-success me-2" />
                       <strong>Nutritionist</strong>
                     </div>
                     <div class="demo-credentials mb-2">
                <small class="text-muted">
                  <strong>Dr. Emily Chen (Demo)</strong><br>
                  Use Quick Login to sign in
                </small>
              </div>
                     <button 
                       @click="quickLogin('nutritionist')"
                       class="btn btn-outline-success btn-sm w-100"
                       :disabled="isSubmitting"
                     >
                       <Icon icon="mdi:login" class="me-1" />Quick Login
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

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app, { db, hasValidConfig } from '@/firebase.js'
import { doc, setDoc, getDoc } from 'firebase/firestore'
const auth = hasValidConfig && app ? getAuth(app) : null;
const provider = hasValidConfig && app ? new GoogleAuthProvider() : null;

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
      // Demo users
      demoUsers: {
        student: {
          firstName: 'Robby',
          lastName: '',
          role: 'student'
        },
        nutritionist: {
          firstName: 'Emily',
          lastName: 'Chen',
          role: 'nutritionist'
        },
        administrator: {
          firstName: 'Admin',
          lastName: 'User',
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
      if (!this.validateForm()) return;
  
      this.isSubmitting = true;
  
      try {
        if (!auth) {
          this.showErrorMessage('Firebase is not configured in development. Please set environment variables or use Quick Login after configuring demo accounts.');
          return;
        }
        let firebaseResult;
        let userCredential;
  
        if (this.isLogin) {
          userCredential = await signInWithEmailAndPassword(auth, this.form.email, this.form.password);
          firebaseResult = { success: true, message: 'Login successful' };
        } else {
          userCredential = await createUserWithEmailAndPassword(auth, this.form.email, this.form.password);
          firebaseResult = { success: true, message: 'Registration successful' };
          // Write Firestore user profile (initial registration)
          const uid = userCredential?.user?.uid;
          const [firstName, ...lastNameParts] = (this.form.fullName || '').trim().split(' ');
          const profile = {
            email: this.form.email,
            firstName: firstName || 'User',
            lastName: lastNameParts.join(' '),
            role: this.form.userRole || 'user',
            createdAt: new Date().toISOString()
          }
          await setDoc(doc(db, 'users', uid), profile, { merge: true })
        }
  
        if (firebaseResult.success) {
          const uid = userCredential?.user?.uid || auth.currentUser?.uid || Date.now().toString();
          // After login, read Firestore user profile to ensure role is obtained
          let roleFromDb = 'user'
          try {
            const snap = await getDoc(doc(db, 'users', uid))
            if (snap.exists()) {
              roleFromDb = snap.data()?.role || roleFromDb
            }
          } catch (e) {
            console.warn('Failed to load user profile from Firestore, fallback to form role:', e)
          }
          const [firstName, ...lastNameParts] = (this.form.fullName || '').trim().split(' ');
          const userData = {
            id: uid,
            email: this.form.email,
            firstName: firstName || 'User',
            lastName: lastNameParts.join(' '),
            role: roleFromDb
          };
  
          userStorage.saveCurrentUser(userData, this.form.rememberMe);
  
          this.showSuccessMessage(firebaseResult.message, userData);
          setTimeout(() => {
            this.$router.push('/');
          }, 1000);
        }
  
      } catch (err) {
        console.error('Firebase Auth Error:', err);
        this.showErrorMessage(err.message || 'Firebase authentication failed');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    clearErrors() {
      this.errors = {}
    },
    
    showSuccessMessage(message, user) {
      const welcomeText = user ? `Welcome ${user.firstName}!` : 'Welcome!'
      alert(`${message} ${welcomeText}`)
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
      };
      this.showPassword = false;
    },
    
    showErrorMessage(message) {
      alert(`Error: ${message}`)
    },
    
    checkPasswordStrength(password) {
      return passwordHash.checkPasswordStrength(password)
    },

    // Google OAuth login
    async loginWithGoogle() {
      try {
        if (!auth || !provider) {
          this.showErrorMessage('Firebase is not configured in development. Please set environment variables or use Quick Login after configuring demo accounts.');
          return;
        }

        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('Google sign-in successful:', user);

        // Save basic Google profile to localStorage as requested
        localStorage.setItem('user', JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          uid: user.uid,
        }));

        // Ensure Firestore profile exists and read role
        const uid = user.uid;
        let roleFromDb = 'user';
        try {
          const snap = await getDoc(doc(db, 'users', uid));
          if (!snap.exists()) {
            const [firstName, ...lastNameParts] = (user.displayName || 'User').split(' ');
            await setDoc(doc(db, 'users', uid), {
              email: user.email,
              firstName: firstName || 'User',
              lastName: lastNameParts.join(' '),
              role: roleFromDb,
              createdAt: new Date().toISOString()
            }, { merge: true });
          } else {
            roleFromDb = snap.data()?.role || roleFromDb;
          }
        } catch (e) {
          console.warn('Failed to sync Firestore profile for Google user:', e);
        }

        const [firstName, ...lastNameParts] = (user.displayName || 'User').split(' ');
        const userData = {
          id: uid,
          email: user.email,
          firstName: firstName || 'User',
          lastName: lastNameParts.join(' '),
          role: roleFromDb
        };

        // Use existing userStorage for app-wide session consistency
        userStorage.saveCurrentUser(userData, true);
        this.showSuccessMessage('Login successful', userData);

        const redirect = this.$route?.query?.redirect || '/';
        this.$router.push(redirect);
      } catch (error) {
        console.error('Google sign-in failed:', error);
        this.showErrorMessage(error.message || 'Google sign-in failed');
      }
    },

    // Quick login for demo users
    async quickLogin(userType) {
      try {
        this.isSubmitting = true;
        this.clearErrors();
  
        const demoUser = this.demoUsers[userType];
        if (!demoUser) {
          this.showErrorMessage('Demo user not found');
          return;
        }
  
        const envMap = {
          student: {
            email: import.meta.env.VITE_DEMO_STUDENT_EMAIL,
            password: import.meta.env.VITE_DEMO_STUDENT_PASSWORD
          },
          nutritionist: {
            email: import.meta.env.VITE_DEMO_NUTRITIONIST_EMAIL,
            password: import.meta.env.VITE_DEMO_NUTRITIONIST_PASSWORD
          },
          administrator: {
            email: import.meta.env.VITE_DEMO_ADMIN_EMAIL,
            password: import.meta.env.VITE_DEMO_ADMIN_PASSWORD
          }
        };
        const creds = envMap[userType];
        if (!creds?.email || !creds?.password) {
          this.showErrorMessage('Demo credentials not configured.');
          return;
        }
  
        const credential = await signInWithEmailAndPassword(auth, creds.email, creds.password);
        const uid = credential?.user?.uid || auth.currentUser?.uid || Date.now().toString();
        // Get role from Firestore; if missing, use demoUser.role (student is treated as 'user')
        let roleFromDb = demoUser.role === 'student' ? 'user' : demoUser.role
        try {
          const snap = await getDoc(doc(db, 'users', uid))
          if (snap.exists()) {
            roleFromDb = snap.data()?.role || roleFromDb
          }
        } catch (e) {
          console.warn('Failed to load demo user profile from Firestore:', e)
        }
        const userData = {
          id: uid,
          email: creds.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          role: roleFromDb
        };
  
        userStorage.saveCurrentUser(userData, true);
  
        this.showSuccessMessage('Quick login successful!', userData);
  
        setTimeout(() => {
          this.$router.push('/');
        }, 1200);
  
      } catch (error) {
        console.error('Quick login error:', error);
        this.showErrorMessage('Quick login failed. Please check Firebase credentials.');
      } finally {
        this.isSubmitting = false;
      }
    },
    
    // Pre-register demo users
    async preRegisterDemoUsers() {
      // Skip local pre-register; use Firebase Auth demo accounts
      console.log('Skipping local pre-register; using Firebase Auth demo accounts');
    }
  },
  
  // No mounted hook; we rely on Firebase demo accounts
}
</script>

<style scoped>
.auth-page {
  background: #f7f7f8; /* simpler neutral background */
  display: flex;
  align-items: center;
}

.card {
  border-radius: 1rem;
  overflow: hidden;
}

.card-header {
  background: #ffffff !important; /* plain header */
  color: #0f172a; /* dark text for contrast */
  border-bottom: 1px solid #e9ecef; /* subtle divider */
}

.btn-primary {
  background: var(--bs-primary);
  border: none;
}

.btn-primary:hover {
  background: #1ea34c; /* darker green hover */
}

.form-control {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
}

.form-control:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
}

.form-control.is-valid {
  border-color: var(--bs-success);
}

.form-control.is-invalid {
  border-color: var(--bs-danger);
}

.form-select {
  border-radius: 0.5rem;
  border: 2px solid #e9ecef;
}

.form-select:focus {
  border-color: var(--bs-primary);
  box-shadow: 0 0 0 0.2rem rgba(var(--bs-primary-rgb), 0.25);
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

/* Demo user cards */
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