# Password Policy Library Documentation

## Overview

The `backend/src/lib/passwordpolicy.js` file provides password validation functionality for pwndoc-ng. It ensures that user passwords meet security requirements by implementing configurable password strength policies.

## Table of Contents

1. [Password Policy Function](#password-policy-function)
2. [Password Requirements](#password-requirements)
3. [Usage Examples](#usage-examples)
4. [Integration](#integration)
5. [Security Considerations](#security-considerations)
6. [Enhancement Opportunities](#enhancement-opportunities)

---

## Password Policy Function

### strongPassword()
```javascript
function strongPassword(password)
```

**Parameters:**
- `password` (string): The password to validate

**Returns:**
- `boolean`: `true` if password meets policy requirements, `false` otherwise

**Implementation:**
```javascript
function strongPassword(password) {
    var regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
    return regExp.test(password);
}
```

### Module Export
```javascript
exports.strongPassword = strongPassword
```

---

## Password Requirements

### Current Policy
The password policy enforces the following requirements:

1. **Minimum Length**: At least 8 characters
2. **Numeric Character**: At least one digit (0-9)
3. **Lowercase Letter**: At least one lowercase letter (a-z)
4. **Uppercase Letter**: At least one uppercase letter (A-Z)

### Regular Expression Breakdown
```javascript
/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/
```

**Components:**
- `(?=.*\d)`: Positive lookahead for at least one digit
- `(?=.*[a-z])`: Positive lookahead for at least one lowercase letter
- `(?=.*[A-Z])`: Positive lookahead for at least one uppercase letter
- `.{8,}`: Minimum 8 characters of any type

### Password Validation Examples

#### Valid Passwords
```javascript
const passwordPolicy = require('./lib/passwordpolicy');

// Examples of valid passwords
console.log(passwordPolicy.strongPassword("Password123")); // true
console.log(passwordPolicy.strongPassword("MySecure1")); // true
console.log(passwordPolicy.strongPassword("Admin2024")); // true
console.log(passwordPolicy.strongPassword("Complex1Pass")); // true
```

#### Invalid Passwords
```javascript
// Examples of invalid passwords
console.log(passwordPolicy.strongPassword("password")); // false - no uppercase, no digit
console.log(passwordPolicy.strongPassword("PASSWORD123")); // false - no lowercase
console.log(passwordPolicy.strongPassword("Password")); // false - no digit
console.log(passwordPolicy.strongPassword("Pass1")); // false - too short
console.log(passwordPolicy.strongPassword("12345678")); // false - no letters
```

---

## Usage Examples

### User Registration Validation
```javascript
const passwordPolicy = require('./lib/passwordpolicy');
const Response = require('./lib/httpResponse');

app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Validate password strength
  if (!passwordPolicy.strongPassword(password)) {
    return Response.BadParameters(res, 
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"
    );
  }
  
  // Continue with user creation
  createUser({ username, email, password });
});
```

### Password Change Validation
```javascript
app.put('/api/users/:id/password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  // Validate new password strength
  if (!passwordPolicy.strongPassword(newPassword)) {
    return Response.BadParameters(res, {
      field: "newPassword",
      message: "New password does not meet security requirements"
    });
  }
  
  // Verify current password and update
  updateUserPassword(req.params.id, currentPassword, newPassword);
});
```

### Frontend Validation Integration
```javascript
// Frontend password validation
function validatePassword(password) {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password)
  };
  
  const isValid = Object.values(requirements).every(req => req);
  
  return {
    isValid,
    requirements,
    message: isValid ? "Password meets all requirements" : "Password requirements not met"
  };
}
```

---

## Integration

### User Model Integration
```javascript
const mongoose = require('mongoose');
const passwordPolicy = require('../lib/passwordpolicy');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: true,
    validate: {
      validator: passwordPolicy.strongPassword,
      message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit'
    }
  }
});
```

### Middleware Integration
```javascript
// Password validation middleware
function validatePasswordStrength(req, res, next) {
  const { password } = req.body;
  
  if (password && !passwordPolicy.strongPassword(password)) {
    return Response.BadParameters(res, {
      field: "password",
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit"
    });
  }
  
  next();
}

// Apply to relevant routes
app.post('/api/register', validatePasswordStrength, registerUser);
app.put('/api/users/:id/password', validatePasswordStrength, updatePassword);
```

### Authentication Integration
```javascript
const bcrypt = require('bcryptjs');
const passwordPolicy = require('./lib/passwordpolicy');

// User registration with password hashing
async function createUser(userData) {
  const { username, email, password } = userData;
  
  // Validate password strength
  if (!passwordPolicy.strongPassword(password)) {
    throw new Error('Password does not meet security requirements');
  }
  
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({
    username,
    email,
    password: hashedPassword
  });
  
  return await user.save();
}
```

---

## Security Considerations

### Password Storage
```javascript
// Always hash passwords before storage
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  // Validate before hashing
  if (!passwordPolicy.strongPassword(password)) {
    throw new Error('Password does not meet security requirements');
  }
  
  return await bcrypt.hash(password, 10);
}
```

### Password Transmission
```javascript
// Ensure HTTPS for password transmission
app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.get('Host')}${req.url}`);
  }
  next();
});
```

### Rate Limiting for Password Attempts
```javascript
const rateLimit = require('express-rate-limit');

const passwordResetLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset attempts, please try again later'
});

app.post('/api/reset-password', passwordResetLimit, resetPassword);
```

---

## Enhancement Opportunities

### Extended Password Policy
```javascript
// Enhanced password policy with additional requirements
function advancedPasswordPolicy(password) {
  const requirements = {
    length: password.length >= 12,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    digit: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    noSequential: !/123|abc|qwe/i.test(password),
    noRepeated: !/(.)\1{2,}/.test(password)
  };
  
  return {
    isValid: Object.values(requirements).every(req => req),
    requirements,
    score: Object.values(requirements).filter(req => req).length
  };
}
```

### Configurable Password Policies
```javascript
// Configurable password policy system
class PasswordPolicy {
  constructor(config = {}) {
    this.minLength = config.minLength || 8;
    this.requireUppercase = config.requireUppercase !== false;
    this.requireLowercase = config.requireLowercase !== false;
    this.requireDigit = config.requireDigit !== false;
    this.requireSpecial = config.requireSpecial || false;
    this.maxLength = config.maxLength || 128;
  }
  
  validate(password) {
    const tests = [];
    
    if (password.length < this.minLength) {
      tests.push(`Password must be at least ${this.minLength} characters long`);
    }
    
    if (password.length > this.maxLength) {
      tests.push(`Password must be no more than ${this.maxLength} characters long`);
    }
    
    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      tests.push('Password must contain at least one uppercase letter');
    }
    
    if (this.requireLowercase && !/[a-z]/.test(password)) {
      tests.push('Password must contain at least one lowercase letter');
    }
    
    if (this.requireDigit && !/\d/.test(password)) {
      tests.push('Password must contain at least one digit');
    }
    
    if (this.requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      tests.push('Password must contain at least one special character');
    }
    
    return {
      isValid: tests.length === 0,
      errors: tests
    };
  }
}
```

### Password Strength Scoring
```javascript
// Password strength scoring system
function getPasswordStrength(password) {
  let score = 0;
  const feedback = [];
  
  // Length scoring
  if (password.length >= 8) score += 2;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  
  // Character variety scoring
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 2;
  
  // Complexity bonuses
  if (!/(.)\1{2,}/.test(password)) score += 1; // No repeated characters
  if (!/123|abc|qwe/i.test(password)) score += 1; // No sequential characters
  
  // Determine strength level
  let strength;
  if (score >= 8) strength = 'Very Strong';
  else if (score >= 6) strength = 'Strong';
  else if (score >= 4) strength = 'Medium';
  else if (score >= 2) strength = 'Weak';
  else strength = 'Very Weak';
  
  return {
    score,
    strength,
    maxScore: 10,
    percentage: (score / 10) * 100
  };
}
```

### Common Password Checking
```javascript
// Check against common password lists
const commonPasswords = [
  'password', '123456', 'password123', 'admin', 'qwerty',
  'letmein', 'welcome', 'monkey', '1234567890'
];

function isCommonPassword(password) {
  return commonPasswords.some(common => 
    password.toLowerCase().includes(common.toLowerCase())
  );
}

function enhancedPasswordValidation(password) {
  const basicValidation = passwordPolicy.strongPassword(password);
  const isCommon = isCommonPassword(password);
  
  return {
    isValid: basicValidation && !isCommon,
    meetsBasicRequirements: basicValidation,
    isCommonPassword: isCommon,
    strength: getPasswordStrength(password)
  };
}
```

---

## Error Messages and Internationalization

### Localized Error Messages
```javascript
const errorMessages = {
  en: {
    passwordTooShort: 'Password must be at least 8 characters long',
    passwordNoUppercase: 'Password must contain at least one uppercase letter',
    passwordNoLowercase: 'Password must contain at least one lowercase letter',
    passwordNoDigit: 'Password must contain at least one digit',
    passwordCommon: 'Password is too common, please choose a different one'
  },
  fr: {
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordNoUppercase: 'Le mot de passe doit contenir au moins une lettre majuscule',
    passwordNoLowercase: 'Le mot de passe doit contenir au moins une lettre minuscule',
    passwordNoDigit: 'Le mot de passe doit contenir au moins un chiffre',
    passwordCommon: 'Le mot de passe est trop commun, veuillez en choisir un autre'
  }
};

function getPasswordErrorMessage(errorKey, language = 'en') {
  return errorMessages[language]?.[errorKey] || errorMessages.en[errorKey];
}
```

---

## Testing

### Unit Tests for Password Policy
```javascript
const passwordPolicy = require('./lib/passwordpolicy');

describe('Password Policy Tests', () => {
  describe('strongPassword', () => {
    it('should accept valid passwords', () => {
      expect(passwordPolicy.strongPassword('Password123')).toBe(true);
      expect(passwordPolicy.strongPassword('MySecure1')).toBe(true);
      expect(passwordPolicy.strongPassword('Admin2024')).toBe(true);
    });
    
    it('should reject passwords without uppercase', () => {
      expect(passwordPolicy.strongPassword('password123')).toBe(false);
    });
    
    it('should reject passwords without lowercase', () => {
      expect(passwordPolicy.strongPassword('PASSWORD123')).toBe(false);
    });
    
    it('should reject passwords without digits', () => {
      expect(passwordPolicy.strongPassword('Password')).toBe(false);
    });
    
    it('should reject passwords that are too short', () => {
      expect(passwordPolicy.strongPassword('Pass1')).toBe(false);
    });
  });
});
```

---

## Performance Considerations

### Regular Expression Optimization
The current implementation uses an efficient regular expression that performs all checks in a single pass. For high-volume applications, consider:

```javascript
// Cached regex for better performance
const PASSWORD_REGEX = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

function strongPassword(password) {
  return PASSWORD_REGEX.test(password);
}
```

### Async Validation for Large Applications
```javascript
// Async validation for non-blocking operations
async function validatePasswordAsync(password) {
  return new Promise((resolve) => {
    // Use setImmediate for non-blocking validation
    setImmediate(() => {
      resolve(passwordPolicy.strongPassword(password));
    });
  });
}
```

---

This password policy library provides essential security validation for user passwords in pwndoc-ng, ensuring that user accounts are protected with strong authentication credentials while maintaining simplicity and performance. 