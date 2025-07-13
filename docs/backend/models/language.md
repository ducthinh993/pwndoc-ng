# Language Model Documentation

## Overview

The `backend/src/models/language.js` file defines the Language model for pwndoc-ng's internationalization system. This model manages language definitions and locales, enabling the application to support multiple languages for vulnerabilities, custom data, and user interface elements.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Static Methods](#static-methods)
3. [Usage Examples](#usage-examples)
4. [Integration](#integration)
5. [Validation](#validation)
6. [Error Handling](#error-handling)
7. [Performance Considerations](#performance-considerations)

---

## Schema Definition

### LanguageSchema Structure
```javascript
var LanguageSchema = new Schema({
    language:   {type: String, unique: true},
    locale:     {type: String, unique: true}   
}, {timestamps: true});
```

### Fields

#### language
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Description**: Human-readable language name (e.g., "English", "French", "Spanish")
- **Example**: "English"

#### locale
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Description**: ISO language code identifier used in API calls and system references
- **Example**: "en", "fr", "es"

### Timestamps
- **createdAt**: Automatically generated creation timestamp
- **updatedAt**: Automatically generated last update timestamp

### Example Document
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "language": "English",
  "locale": "en",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Static Methods

### getAll()
```javascript
LanguageSchema.statics.getAll = () => Promise<Array>
```

**Purpose**: Retrieves all languages from the database.

**Returns**: Promise resolving to array of language objects (without `_id` field).

**Response Format**:
```javascript
[
  { language: "English", locale: "en" },
  { language: "French", locale: "fr" },
  { language: "Spanish", locale: "es" }
]
```

**Usage Example**:
```javascript
const Language = require('./models/language');

Language.getAll()
  .then(languages => {
    console.log('Available languages:', languages);
  })
  .catch(error => {
    console.error('Error fetching languages:', error);
  });
```

### create()
```javascript
LanguageSchema.statics.create = (language) => Promise<Object>
```

**Purpose**: Creates a new language entry.

**Parameters**:
- `language` (Object): Language object containing `language` and `locale` fields

**Returns**: Promise resolving to the created language document.

**Error Handling**: Rejects with `BadParameters` error if language already exists.

**Usage Example**:
```javascript
const newLanguage = {
  language: "German",
  locale: "de"
};

Language.create(newLanguage)
  .then(language => {
    console.log('Language created:', language);
  })
  .catch(error => {
    if (error.fn === 'BadParameters') {
      console.error('Language already exists');
    } else {
      console.error('Error creating language:', error);
    }
  });
```

### updateAll()
```javascript
LanguageSchema.statics.updateAll = (languages) => Promise<String>
```

**Purpose**: Replaces all existing languages with a new set of languages.

**Parameters**:
- `languages` (Array): Array of language objects to replace existing languages

**Returns**: Promise resolving to success message.

**Process**:
1. Deletes all existing languages
2. Inserts new languages from the provided array

**Usage Example**:
```javascript
const newLanguages = [
  { language: "English", locale: "en" },
  { language: "French", locale: "fr" },
  { language: "German", locale: "de" }
];

Language.updateAll(newLanguages)
  .then(message => {
    console.log(message); // "Languages updated successfully"
  })
  .catch(error => {
    console.error('Error updating languages:', error);
  });
```

### delete()
```javascript
LanguageSchema.statics.delete = (locale) => Promise<String>
```

**Purpose**: Deletes a language by its locale identifier.

**Parameters**:
- `locale` (String): The locale identifier of the language to delete

**Returns**: Promise resolving to success message.

**Error Handling**: Rejects with `NotFound` error if language doesn't exist.

**Usage Example**:
```javascript
Language.delete('de')
  .then(message => {
    console.log(message); // "Language deleted"
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Language not found');
    } else {
      console.error('Error deleting language:', error);
    }
  });
```

---

## Usage Examples

### API Route Integration
```javascript
const Language = require('./models/language');
const Response = require('./lib/httpResponse');

// Get all languages
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await Language.getAll();
    Response.Ok(res, languages);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Create new language
app.post('/api/languages', async (req, res) => {
  try {
    const language = await Language.create(req.body);
    Response.Created(res, language);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Update all languages
app.put('/api/languages', async (req, res) => {
  try {
    const message = await Language.updateAll(req.body);
    Response.Ok(res, { message });
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Delete language
app.delete('/api/languages/:locale', async (req, res) => {
  try {
    const message = await Language.delete(req.params.locale);
    Response.Ok(res, { message });
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

### Initialization Script
```javascript
// Initialize default languages
const defaultLanguages = [
  { language: "English", locale: "en" },
  { language: "French", locale: "fr" },
  { language: "Spanish", locale: "es" },
  { language: "German", locale: "de" }
];

async function initializeLanguages() {
  try {
    const existing = await Language.getAll();
    if (existing.length === 0) {
      await Language.updateAll(defaultLanguages);
      console.log('Default languages initialized');
    }
  } catch (error) {
    console.error('Error initializing languages:', error);
  }
}

// Call during application startup
initializeLanguages();
```

---

## Integration

### Vulnerability Model Integration
```javascript
// In vulnerability.js model
const Language = require('./language');

// Validate language locale exists
VulnerabilitySchema.pre('save', async function() {
  if (this.locale) {
    const languages = await Language.getAll();
    const validLocales = languages.map(lang => lang.locale);
    
    if (!validLocales.includes(this.locale)) {
      throw new Error(`Invalid locale: ${this.locale}`);
    }
  }
});
```

### Custom Data Integration
```javascript
// Language validation for custom data
async function validateLanguageSupport(data) {
  const languages = await Language.getAll();
  const supportedLocales = languages.map(lang => lang.locale);
  
  // Check if all required languages are supported
  const requiredLocales = Object.keys(data);
  const unsupportedLocales = requiredLocales.filter(
    locale => !supportedLocales.includes(locale)
  );
  
  if (unsupportedLocales.length > 0) {
    throw new Error(`Unsupported locales: ${unsupportedLocales.join(', ')}`);
  }
  
  return true;
}
```

### Translation System Integration
```javascript
// Translation management
class TranslationManager {
  constructor() {
    this.languages = [];
    this.loadLanguages();
  }
  
  async loadLanguages() {
    this.languages = await Language.getAll();
  }
  
  getSupportedLocales() {
    return this.languages.map(lang => lang.locale);
  }
  
  getLanguageName(locale) {
    const language = this.languages.find(lang => lang.locale === locale);
    return language ? language.language : null;
  }
  
  isLocaleSupported(locale) {
    return this.languages.some(lang => lang.locale === locale);
  }
}
```

---

## Validation

### Input Validation
```javascript
// Language validation middleware
function validateLanguage(req, res, next) {
  const { language, locale } = req.body;
  
  // Validate required fields
  if (!language || typeof language !== 'string') {
    return Response.BadParameters(res, 'Language name is required and must be a string');
  }
  
  if (!locale || typeof locale !== 'string') {
    return Response.BadParameters(res, 'Locale is required and must be a string');
  }
  
  // Validate locale format (basic check)
  if (!/^[a-z]{2}(-[A-Z]{2})?$/.test(locale)) {
    return Response.BadParameters(res, 'Invalid locale format. Use format: "en" or "en-US"');
  }
  
  // Validate language name (no special characters)
  if (!/^[\p{Letter}\s]+$/u.test(language)) {
    return Response.BadParameters(res, 'Language name should only contain letters and spaces');
  }
  
  next();
}

// Apply validation to routes
app.post('/api/languages', validateLanguage, createLanguage);
```

### Schema Validation
```javascript
// Enhanced schema with validation
var LanguageSchema = new Schema({
    language: {
        type: String,
        required: [true, 'Language name is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Language name must be at least 2 characters'],
        maxlength: [50, 'Language name cannot exceed 50 characters'],
        validate: {
            validator: function(v) {
                return /^[\p{Letter}\s]+$/u.test(v);
            },
            message: 'Language name should only contain letters and spaces'
        }
    },
    locale: {
        type: String,
        required: [true, 'Locale is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [2, 'Locale must be at least 2 characters'],
        maxlength: [5, 'Locale cannot exceed 5 characters'],
        validate: {
            validator: function(v) {
                return /^[a-z]{2}(-[a-z]{2})?$/.test(v);
            },
            message: 'Locale must be in format "en" or "en-us"'
        }
    }
}, {
    timestamps: true
});
```

---

## Error Handling

### Common Error Scenarios
```javascript
// Comprehensive error handling
async function handleLanguageOperations() {
  try {
    // Attempt to create language
    const language = await Language.create({
      language: "Italian",
      locale: "it"
    });
    
    console.log('Language created successfully:', language);
    
  } catch (error) {
    switch (error.fn) {
      case 'BadParameters':
        console.error('Language already exists:', error.message);
        break;
      case 'NotFound':
        console.error('Language not found:', error.message);
        break;
      default:
        if (error.name === 'ValidationError') {
          console.error('Validation error:', error.message);
        } else if (error.code === 11000) {
          console.error('Duplicate key error:', error.message);
        } else {
          console.error('Unexpected error:', error);
        }
    }
  }
}
```

### Error Response Mapping
```javascript
// Error handling in API routes
function handleLanguageError(error, res) {
  switch (error.fn) {
    case 'BadParameters':
      return Response.BadParameters(res, error.message);
    case 'NotFound':
      return Response.NotFound(res, error.message);
    default:
      return Response.Internal(res, error);
  }
}

// Usage in routes
app.post('/api/languages', async (req, res) => {
  try {
    const language = await Language.create(req.body);
    Response.Created(res, language);
  } catch (error) {
    handleLanguageError(error, res);
  }
});
```

---

## Performance Considerations

### Caching Strategy
```javascript
// Language cache for improved performance
class LanguageCache {
  constructor() {
    this.cache = new Map();
    this.lastUpdate = null;
    this.ttl = 5 * 60 * 1000; // 5 minutes TTL
  }
  
  async getLanguages() {
    const now = Date.now();
    
    if (this.lastUpdate && (now - this.lastUpdate) < this.ttl) {
      return this.cache.get('languages');
    }
    
    const languages = await Language.getAll();
    this.cache.set('languages', languages);
    this.lastUpdate = now;
    
    return languages;
  }
  
  invalidate() {
    this.cache.clear();
    this.lastUpdate = null;
  }
}

const languageCache = new LanguageCache();
```

### Database Indexing
```javascript
// Optimize database queries with indexes
LanguageSchema.index({ locale: 1 });
LanguageSchema.index({ language: 1 });
```

### Bulk Operations
```javascript
// Efficient bulk updates
async function bulkUpdateLanguages(languages) {
  const operations = languages.map(lang => ({
    updateOne: {
      filter: { locale: lang.locale },
      update: { $set: lang },
      upsert: true
    }
  }));
  
  return await Language.bulkWrite(operations);
}
```

---

## Security Considerations

### Input Sanitization
```javascript
// Sanitize language inputs
function sanitizeLanguageInput(input) {
  if (typeof input !== 'object') {
    throw new Error('Invalid input type');
  }
  
  const sanitized = {};
  
  if (input.language) {
    sanitized.language = input.language.toString().trim();
  }
  
  if (input.locale) {
    sanitized.locale = input.locale.toString().toLowerCase().trim();
  }
  
  return sanitized;
}
```

### Access Control
```javascript
// Middleware for language management permissions
function requireLanguagePermission(req, res, next) {
  if (!req.user || !req.user.permissions.includes('languages:manage')) {
    return Response.Forbidden(res, 'Insufficient permissions for language management');
  }
  next();
}

// Apply to administrative routes
app.post('/api/languages', requireLanguagePermission, createLanguage);
app.put('/api/languages', requireLanguagePermission, updateLanguages);
app.delete('/api/languages/:locale', requireLanguagePermission, deleteLanguage);
```

---

## Testing

### Unit Tests
```javascript
const Language = require('./models/language');

describe('Language Model', () => {
  describe('getAll()', () => {
    it('should return all languages', async () => {
      const languages = await Language.getAll();
      expect(Array.isArray(languages)).toBe(true);
      expect(languages.length).toBeGreaterThan(0);
    });
  });
  
  describe('create()', () => {
    it('should create a new language', async () => {
      const newLanguage = {
        language: 'Test Language',
        locale: 'test'
      };
      
      const created = await Language.create(newLanguage);
      expect(created.language).toBe(newLanguage.language);
      expect(created.locale).toBe(newLanguage.locale);
    });
    
    it('should reject duplicate languages', async () => {
      const duplicate = {
        language: 'English',
        locale: 'en'
      };
      
      await expect(Language.create(duplicate)).rejects.toMatchObject({
        fn: 'BadParameters',
        message: 'Language already exists'
      });
    });
  });
  
  describe('delete()', () => {
    it('should delete existing language', async () => {
      const result = await Language.delete('test');
      expect(result).toBe('Language deleted');
    });
    
    it('should reject non-existent language', async () => {
      await expect(Language.delete('nonexistent')).rejects.toMatchObject({
        fn: 'NotFound',
        message: 'Language not found'
      });
    });
  });
});
```

---

This Language model provides essential internationalization support for pwndoc-ng, enabling multi-language support for vulnerabilities, custom data, and user interface elements. 