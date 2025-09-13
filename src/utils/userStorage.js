// User data storage management - based on localStorage
// Compliant with FIT5032 frontend course requirements, using browser local storage

import passwordHash from './passwordHash.js';

/**
 * User data storage class
 * Manages user registration, login, session data persistence
 */
class UserStorage {
  constructor() {
    this.USERS_KEY = 'smart_meal_users';
    this.CURRENT_USER_KEY = 'smart_meal_current_user';
    this.SESSION_KEY = 'smart_meal_session';
  }

  /**
   * Get all user data
   * @returns {Array} Array of users
   */
  getAllUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Failed to get user data:', error);
      return [];
    }
  }

  /**
   * Save user data
   * @param {Array} users Array of users
   */
  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  /**
   * Find user by email
   * @param {string} email User email
   * @returns {Object|null} User object or null
   */
  findUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  /**
   * Register new user
   * @param {Object} userData User data
   * @returns {Promise<Object>} Registration result
   */
  async registerUser(userData) {
    const users = this.getAllUsers();
    
    // Check if email already exists
    if (this.findUserByEmail(userData.email)) {
      return {
        success: false,
        message: 'This email is already registered'
      };
    }

    try {
      // Hash password
      const passwordData = await passwordHash.createPasswordHash(userData.password);
      
      // Create new user object
      const newUser = {
        id: Date.now().toString(), // Simple ID generation
        email: userData.email,
        passwordHash: passwordData.hash,
        passwordSalt: passwordData.salt,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      users.push(newUser);
      this.saveUsers(users);

      return {
        success: true,
        message: 'Registration successful',
        user: { ...newUser, passwordHash: undefined, passwordSalt: undefined } // Don't return password data
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.'
      };
    }
  }

  /**
   * User login verification
   * @param {string} email Email
   * @param {string} password Password
   * @returns {Promise<Object>} Login result
   */
  async loginUser(email, password) {
    const user = this.findUserByEmail(email);
    
    if (!user) {
      return {
        success: false,
        message: 'User does not exist'
      };
    }

    try {
      // Verify password using hash
      const isPasswordValid = await passwordHash.verifyPassword(
        password, 
        user.passwordHash, 
        user.passwordSalt
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Incorrect password'
        };
      }

      // Update last login time
      user.lastLogin = new Date().toISOString();
      const users = this.getAllUsers();
      const userIndex = users.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = user;
        this.saveUsers(users);
      }

      return {
        success: true,
        message: 'Login successful',
        user: { ...user, passwordHash: undefined, passwordSalt: undefined } // Don't return password data
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  /**
   * Save current logged-in user session
   * @param {Object} user User object
   */
  saveCurrentUser(user) {
    try {
      const sessionData = {
        user: { ...user, password: undefined },
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expires in 24 hours
      };
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionData));
      localStorage.setItem(this.SESSION_KEY, 'active');
    } catch (error) {
      console.error('Failed to save user session:', error);
    }
  }

  /**
   * Get current logged-in user
   * @returns {Object|null} User object or null
   */
  getCurrentUser() {
    try {
      const sessionData = localStorage.getItem(this.CURRENT_USER_KEY);
      const sessionStatus = localStorage.getItem(this.SESSION_KEY);
      
      if (!sessionData || sessionStatus !== 'active') {
        return null;
      }

      const session = JSON.parse(sessionData);
      
      // Check if session has expired
      if (new Date() > new Date(session.expiresAt)) {
        this.logout();
        return null;
      }

      return session.user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  /**
   * Check if user is logged in
   * @returns {boolean} Login status
   */
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  /**
   * User logout
   */
  logout() {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  /**
   * Clear all user data (for development testing)
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.USERS_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
      localStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

  /**
   * Get user statistics
   * @returns {Object} Statistics information
   */
  getUserStats() {
    const users = this.getAllUsers();
    const roleStats = users.reduce((stats, user) => {
      stats[user.role] = (stats[user.role] || 0) + 1;
      return stats;
    }, {});

    return {
      totalUsers: users.length,
      roleDistribution: roleStats,
      currentUser: this.getCurrentUser()
    };
  }
}

// Create singleton instance
const userStorage = new UserStorage();

export default userStorage;