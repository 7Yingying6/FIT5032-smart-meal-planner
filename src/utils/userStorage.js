// User data storage management - based on localStorage
// Compliant with FIT5032 frontend course requirements, using browser local/session storage

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

  

  getAllUsers() {
    try {
      const users = localStorage.getItem(this.USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Failed to get user data:', error);
      return [];
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  findUserByEmail(email) {
    const users = this.getAllUsers();
    return users.find(user => user.email === email) || null;
  }

  

  async registerUser(userData) {
    const users = this.getAllUsers();

    if (this.findUserByEmail(userData.email)) {
      return { success: false, message: 'This email is already registered' };
    }

    try {
      const passwordData = await passwordHash.createPasswordHash(userData.password);
      const newUser = {
        id: Date.now().toString(),
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
        user: { ...newUser, passwordHash: undefined, passwordSalt: undefined }
      };
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  }

 

  async loginUser(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return { success: false, message: 'User does not exist' };
    }

    try {
      const isPasswordValid = await passwordHash.verifyPassword(
        password,
        user.passwordHash,
        user.passwordSalt
      );
      if (!isPasswordValid) {
        return { success: false, message: 'Incorrect password' };
      }

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
        user: { ...user, passwordHash: undefined, passwordSalt: undefined }
      };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  }

 

  /**
   * Save current logged-in user session
   * @param {Object} user User object
   * @param {boolean} rememberMe Whether to persist login
   */
  saveCurrentUser(user, rememberMe = false) {
    try {
      const now = Date.now();
      const expiresMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000; // 30 days with "remember me"; otherwise 24 hours
      const sessionData = {
        user: { ...user, password: undefined },
        loginTime: new Date(now).toISOString(),
        expiresAt: new Date(now + expiresMs).toISOString()
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionData));
      storage.setItem(this.SESSION_KEY, 'active');
    } catch (error) {
      console.error('Failed to save user session:', error);
    }
  }

  getCurrentUser() {
    try {
      // Prefer reading from sessionStorage first, then fallback to localStorage
      let sessionData = sessionStorage.getItem(this.CURRENT_USER_KEY);
      let sessionStatus = sessionStorage.getItem(this.SESSION_KEY);

      if (!sessionData || sessionStatus !== 'active') {
        sessionData = localStorage.getItem(this.CURRENT_USER_KEY);
        sessionStatus = localStorage.getItem(this.SESSION_KEY);
      }

      if (!sessionData || sessionStatus !== 'active') return null;

      const session = JSON.parse(sessionData);
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

  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }



  logout() {
    try {
      localStorage.removeItem(this.CURRENT_USER_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      sessionStorage.removeItem(this.CURRENT_USER_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }



  clearAllData() {
    try {
      localStorage.removeItem(this.USERS_KEY);
      localStorage.removeItem(this.CURRENT_USER_KEY);
      localStorage.removeItem(this.SESSION_KEY);
      sessionStorage.removeItem(this.CURRENT_USER_KEY);
      sessionStorage.removeItem(this.SESSION_KEY);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }

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
