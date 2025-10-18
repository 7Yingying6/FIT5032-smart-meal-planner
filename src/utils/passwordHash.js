// Password hashing helpers using the Web Crypto API
// Compliant with FIT5032 frontend course requirements

/**
 * Password hashing class using Web Crypto API
 * Provides secure password hashing and verification
 */
class PasswordHash {
  constructor() {
    this.algorithm = 'SHA-256';
    this.iterations = 100000; // PBKDF2 iterations
    this.keyLength = 256; // Key length in bits
  }

  /**
   * Generate a random salt
   * @returns {Uint8Array} Random salt
   */
  generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
  }

  /**
   * Convert array buffer to hex string
   * @param {ArrayBuffer} buffer Array buffer
   * @returns {string} Hex string
   */
  bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Convert hex string to array buffer
   * @param {string} hex Hex string
   * @returns {Uint8Array} Array buffer
   */
  hexToBuffer(hex) {
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
    }
    return bytes;
  }

  /**
   * Hash password using PBKDF2
   * @param {string} password Plain text password
   * @param {Uint8Array} salt Salt for hashing
   * @returns {Promise<string>} Hashed password as hex string
   */
  async hashPassword(password, salt) {
    try {
      // Convert the password to ArrayBuffer
      const encoder = new TextEncoder();
      const passwordBuffer = encoder.encode(password);

      // Import the password as key material
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );

      // Derive a key using PBKDF2
      const derivedKey = await crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: this.iterations,
          hash: this.algorithm
        },
        keyMaterial,
        this.keyLength
      );

      return this.bufferToHex(derivedKey);
    } catch (error) {
      console.error('Password hashing failed:', error);
      // Fallback simple hash (for compatibility)
      return this.simpleHash(password + this.bufferToHex(salt));
    }
  }

  /**
   * Simple hash function as fallback
   * @param {string} input Input string
   * @returns {string} Simple hash
   */
  simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Hash password with automatic salt generation
   * @param {string} password Plain text password
   * @returns {Promise<Object>} Object containing hash and salt
   */
  async createPasswordHash(password) {
    const salt = this.generateSalt();
    const hash = await this.hashPassword(password, salt);
    
    return {
      hash: hash,
      salt: this.bufferToHex(salt)
    };
  }

  /**
   * Verify password against stored hash
   * @param {string} password Plain text password
   * @param {string} storedHash Stored password hash
   * @param {string} storedSalt Stored salt as hex string
   * @returns {Promise<boolean>} True if password matches
   */
  async verifyPassword(password, storedHash, storedSalt) {
    try {
      const salt = this.hexToBuffer(storedSalt);
      const hash = await this.hashPassword(password, salt);
      return hash === storedHash;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  }

  /**
   * Check password strength
   * @param {string} password Password to check
   * @returns {Object} Password strength analysis
   */
  checkPasswordStrength(password) {
    const analysis = {
      length: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      score: 0,
      level: 'weak'
    };

    // Calculate score
    if (analysis.length) analysis.score += 2;
    if (analysis.hasUpperCase) analysis.score += 1;
    if (analysis.hasLowerCase) analysis.score += 1;
    if (analysis.hasNumbers) analysis.score += 1;
    if (analysis.hasSpecialChars) analysis.score += 2;
    if (password.length >= 12) analysis.score += 1;

    // Determine level
    if (analysis.score >= 6) {
      analysis.level = 'strong';
    } else if (analysis.score >= 4) {
      analysis.level = 'medium';
    }

    return analysis;
  }

  /**
   * Generate secure random password
   * @param {number} length Password length (default: 12)
   * @returns {string} Generated password
   */
  generateSecurePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    return Array.from(array, byte => charset[byte % charset.length]).join('');
  }
}

// Create singleton instance
const passwordHash = new PasswordHash();

export default passwordHash;