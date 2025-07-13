# Backend Development Documentation

This document provides comprehensive guidance for developing and maintaining the pwndoc-ng backend application. The backend is built using Node.js with Express.js and MongoDB, providing a robust API for cybersecurity audit management.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Development Setup](#development-setup)
5. [Database Design](#database-design)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Design Patterns](#api-design-patterns)
8. [Real-time Features](#real-time-features)
9. [Security Implementation](#security-implementation)
10. [Testing Strategy](#testing-strategy)
11. [Performance Optimization](#performance-optimization)
12. [Development Guidelines](#development-guidelines)

---

## Architecture Overview

The pwndoc-ng backend follows a layered architecture pattern with clear separation of concerns:

### **Application Architecture**
- **Express.js Server**: HTTP server with HTTPS support
- **MongoDB Database**: Document-based data storage with Mongoose ODM
- **Socket.io**: Real-time WebSocket communication
- **Hocuspocus Server**: Collaborative editing server
- **JWT Authentication**: Stateless authentication system
- **Role-based Access Control**: Granular permission system

### **Core Design Principles**
- **RESTful API Design**: Standard HTTP methods and status codes
- **Modular Structure**: Organized by functional domains
- **Security First**: HTTPS, JWT tokens, input validation
- **Real-time Collaboration**: WebSocket-based live editing
- **Scalable Permissions**: Role-based access control (RBAC)

---

## Technology Stack

### **Core Technologies**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL document database
- **Mongoose**: MongoDB object modeling for Node.js

### **Authentication & Security**
- **JWT (jsonwebtoken)**: Token-based authentication
- **bcrypt**: Password hashing
- **OTPAuth**: Two-factor authentication (TOTP)
- **QRCode**: QR code generation for 2FA setup

### **Real-time Features**
- **Socket.io**: WebSocket communication
- **Hocuspocus**: Collaborative editing server
- **Y.js**: Conflict-free replicated data types (CRDTs)

### **Document Processing**
- **Docxtemplater**: DOCX template processing
- **PizZip**: ZIP file manipulation
- **html2ooxml**: HTML to Office XML conversion
- **image-size**: Image dimension detection

### **Utilities & Tools**
- **Lodash**: Utility library
- **CVSS Calculator**: CVSS v3.1 scoring implementation
- **Swagger**: API documentation generation
- **Cron**: Scheduled task management

---

## Project Structure

```
backend/
├── src/
│   ├── app.js                  # Main application entry point
│   ├── config/
│   │   ├── config.json         # Environment configuration
│   │   ├── swagger-output.json # Generated API documentation
│   │   └── roles.json          # Custom role definitions
│   ├── lib/                    # Core library modules
│   │   ├── auth.js            # Authentication & authorization
│   │   ├── chart-generator.js  # Chart generation utilities
│   │   ├── cron.js            # Scheduled tasks
│   │   ├── cvsscalc31.js      # CVSS v3.1 calculator
│   │   ├── html2ooxml.js      # HTML to OOXML conversion
│   │   ├── httpResponse.js    # HTTP response utilities
│   │   ├── passwordpolicy.js  # Password validation
│   │   ├── report-generator.js # Report generation engine
│   │   └── utils.js           # General utilities
│   ├── models/                # Data models (Mongoose schemas)
│   │   ├── audit.js           # Audit data model
│   │   ├── audit-type.js      # Audit type configuration
│   │   ├── client.js          # Client information
│   │   ├── company.js         # Company information
│   │   ├── custom-field.js    # Dynamic custom fields
│   │   ├── custom-section.js  # Custom report sections
│   │   ├── image.js           # Image storage
│   │   ├── language.js        # Language configuration
│   │   ├── settings.js        # Application settings
│   │   ├── template.js        # Report templates
│   │   ├── user.js            # User accounts
│   │   ├── vulnerability-*.js # Vulnerability management
│   │   └── vulnerability.js   # Main vulnerability model
│   ├── routes/                # API route definitions
│   │   ├── audit.js           # Audit management endpoints
│   │   ├── client.js          # Client management
│   │   ├── company.js         # Company management
│   │   ├── data.js            # Reference data management
│   │   ├── image.js           # Image handling
│   │   ├── settings.js        # Application settings
│   │   ├── template.js        # Template management
│   │   ├── user.js            # User management
│   │   └── vulnerability.js   # Vulnerability management
│   └── translate/             # Internationalization
│       ├── index.js           # Translation loader
│       ├── en.json            # English translations
│       ├── fr.json            # French translations
│       ├── es.json            # Spanish translations
│       ├── nl.json            # Dutch translations
│       └── ru.json            # Russian translations
├── tests/                     # Test suites
├── ssl/                       # SSL certificates
├── swagger.js                 # Swagger documentation generator
├── package.json               # Dependencies and scripts
└── Dockerfile                 # Container configuration
```

---

## Development Setup

### **Prerequisites**
- Node.js (>= 14.0.0)
- MongoDB (>= 4.4)
- npm or yarn

### **Environment Configuration**
```json
// config/config.json
{
  "dev": {
    "host": "0.0.0.0",
    "port": 5252,
    "database": {
      "server": "pwndoc-ng-mongo",
      "port": 27017,
      "name": "pwndoc"
    },
    "jwtSecret": "auto-generated",
    "jwtRefreshSecret": "auto-generated"
  },
  "prod": {
    "host": "0.0.0.0", 
    "port": 8443,
    "database": {
      "server": "pwndoc-ng-mongo",
      "port": 27017,
      "name": "pwndoc"
    }
  }
}
```

### **Installation**
```bash
# Clone and navigate to backend
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test
```

### **Development Scripts**
```bash
# Start server with nodemon
npm run dev

# Generate API documentation
npm run swagger

# Run test suite
npm test

# Production build
npm start
```

---

## Database Design

### **MongoDB Collections**

#### **Users Collection**
```javascript
{
  username: String,          // Unique username
  password: String,          // Bcrypt hashed password
  firstname: String,         // User's first name
  lastname: String,          // User's last name
  email: String,            // Email address (optional)
  phone: String,            // Phone number (optional)
  role: String,             // User role (user, admin, etc.)
  totpEnabled: Boolean,     // 2FA enabled flag
  totpSecret: String,       // TOTP secret for 2FA
  enabled: Boolean,         // Account enabled flag
  refreshTokens: [Object],  // Active refresh tokens
  createdAt: Date,          // Account creation date
  updatedAt: Date           // Last update date
}
```

#### **Audits Collection**
```javascript
{
  name: String,              // Audit name
  auditType: String,         // Type of audit
  date: String,              // Audit date
  date_start: String,        // Start date
  date_end: String,          // End date
  summary: String,           // Executive summary
  company: ObjectId,         // Reference to Company
  client: ObjectId,          // Reference to Client
  collaborators: [ObjectId], // Array of User references
  reviewers: [ObjectId],     // Array of reviewer User references
  language: String,          // Audit language
  scope: [Object],           // Audit scope and targets
  findings: [Object],        // Security findings
  template: ObjectId,        // Report template reference
  creator: ObjectId,         // Audit creator reference
  sections: [Object],        // Custom sections
  customFields: [Object],    // Custom field values
  sortFindings: [Object],    // Finding sort configuration
  state: String,             // EDIT, REVIEW, APPROVED
  approvals: [ObjectId],     // Approver User references
  createdAt: Date,
  updatedAt: Date
}
```

#### **Findings Structure**
```javascript
{
  id: ObjectId,               // Finding identifier
  identifier: Number,         // Incremental ID for report
  title: String,              // Finding title
  vulnType: String,          // Vulnerability type
  description: String,        // Technical description
  observation: String,        // What was observed
  remediation: String,        // How to fix
  remediationComplexity: Number, // 1-3 complexity rating
  priority: Number,           // 1-4 priority rating
  references: [String],       // External references
  cvssv3: String,            // CVSS v3 vector string
  paragraphs: [Object],      // Rich content paragraphs
  poc: String,               // Proof of concept
  scope: String,             // Finding scope
  status: Number,            // 0: done, 1: redacting
  category: String,          // Finding category
  customFields: [Object]     // Custom field values
}
```

### **Indexing Strategy**
```javascript
// User indexes
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { sparse: true })

// Audit indexes
db.audits.createIndex({ "creator": 1 })
db.audits.createIndex({ "collaborators": 1 })
db.audits.createIndex({ "state": 1 })
db.audits.createIndex({ "createdAt": -1 })

// Vulnerability indexes
db.vulnerabilities.createIndex({ "details.title": 1 })
db.vulnerabilities.createIndex({ "category": 1 })
```

---

## Authentication & Authorization

### **JWT Token System**
```javascript
// JWT Configuration
const jwtSecret = config[env].jwtSecret;
const jwtRefreshSecret = config[env].jwtRefreshSecret;

// Token Generation
const token = jwt.sign({
  id: user._id,
  username: user.username,
  firstname: user.firstname,
  lastname: user.lastname,
  role: user.role,
  roles: userPermissions
}, jwtSecret, { expiresIn: '15m' });
```

### **Role-Based Access Control**
```javascript
// Built-in Roles
const builtInRoles = {
  user: {
    allows: [
      'audits:create', 'audits:read', 'audits:update', 'audits:delete',
      'vulnerabilities:read', 'companies:read', 'clients:read'
    ]
  },
  admin: {
    allows: "*"  // All permissions
  }
};

// Permission Check Middleware
app.get('/api/audits', acl.hasPermission('audits:read'), (req, res) => {
  // Route handler
});
```

### **Two-Factor Authentication**
```javascript
// TOTP Configuration
const totpConfig = {
  issuer: 'PwnDoc',
  algorithm: 'SHA1',
  digits: 6,
  period: 30
};

// TOTP Validation
const checkTotpToken = (token, secret) => {
  const totp = new OTPAuth.TOTP({...totpConfig, secret});
  const delta = totp.validate({ token, window: 5 });
  return delta !== null && Math.abs(delta) <= 2;
};
```

### **Session Management**
```javascript
// Refresh Token System
const refreshToken = jwt.sign({
  sessionId: sessionId,
  userId: user._id
}, jwtRefreshSecret);

// Token Refresh Endpoint
app.get('/api/users/refreshtoken', (req, res) => {
  // Validate refresh token and issue new access token
});
```

---

## API Design Patterns

### **Standard Response Format**
```javascript
// lib/httpResponse.js
class Response {
  static Ok(res, data) {
    res.status(200).json({
      status: 'success',
      datas: data
    });
  }
  
  static Created(res, data) {
    res.status(201).json({
      status: 'success',
      datas: data
    });
  }
  
  static BadParameters(res, message) {
    res.status(400).json({
      status: 'error',
      datas: message
    });
  }
  
  static Internal(res, error) {
    res.status(500).json({
      status: 'error',
      datas: 'Internal Server Error'
    });
  }
}
```

### **Route Structure Pattern**
```javascript
// routes/example.js
module.exports = function(app) {
  const Response = require('../lib/httpResponse');
  const acl = require('../lib/auth').acl;
  const Model = require('mongoose').model('Model');

  // GET /api/resource
  app.get('/api/resource', acl.hasPermission('resource:read'), (req, res) => {
    Model.getAll()
      .then(data => Response.Ok(res, data))
      .catch(err => Response.Internal(res, err));
  });

  // POST /api/resource
  app.post('/api/resource', acl.hasPermission('resource:create'), (req, res) => {
    // Validation
    if (!req.body.name) {
      Response.BadParameters(res, 'Missing required parameter: name');
      return;
    }

    // Create resource
    Model.create(req.body)
      .then(data => Response.Created(res, data))
      .catch(err => Response.Internal(res, err));
  });
};
```

### **Model Pattern**
```javascript
// models/example.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  name: { type: String, required: true },
  description: String
}, { timestamps: true });

// Static Methods
ExampleSchema.statics.getAll = function() {
  return this.find().exec();
};

ExampleSchema.statics.create = function(data) {
  return new this(data).save();
};

// Instance Methods
ExampleSchema.methods.toJSON = function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description
  };
};

module.exports = mongoose.model('Example', ExampleSchema);
```

---

## Real-time Features

### **Socket.io Configuration**
```javascript
// app.js - Socket.io setup
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  // User joins audit room
  socket.on('join', (data) => {
    socket.username = data.username;
    socket.color = generateRandomColor();
    socket.join(data.room);
    io.to(data.room).emit('updateUsers');
  });

  // User leaves audit room  
  socket.on('leave', (data) => {
    socket.leave(data.room);
    io.to(data.room).emit('updateUsers');
  });

  // Update user activity
  socket.on('menu', (data) => {
    socket.menu = data.menu;
    socket.finding = data.finding;
    socket.section = data.section;
    io.to(data.room).emit('updateUsers');
  });
});
```

### **Collaborative Editing Server**
```javascript
// Hocuspocus Server Configuration
const hocusServer = hocus.Server.configure({
  port: process.env.COLLAB_WEBSOCKET_PORT || 8440,
  
  // Authentication for collaborative editing
  onUpgrade(data) {
    return new Promise(async (resolve, reject) => {
      const { request } = data;
      
      // Extract JWT token from headers
      const token = extractTokenFromHeaders(request.rawHeaders);
      
      if (acl.hasPermissionFromReq('audits:read', token)) {
        const auditId = request.url.split('/')[2];
        const decodedToken = acl.hasPermissionFromReq('audits:read', token);
        
        // Verify user has access to this audit
        const audit = await Audit.findById(auditId);
        if (hasAuditAccess(audit, decodedToken)) {
          resolve();
        } else {
          reject();
        }
      } else {
        reject();
      }
    });
  }
});
```

### **Real-time Audit Updates**
```javascript
// Emit updates to connected users
app.put('/api/audits/:auditId/general', (req, res) => {
  Audit.updateGeneral(auditId, updateData)
    .then(result => {
      // Notify all users in the audit room
      io.to(req.params.auditId).emit('updateAudit');
      Response.Ok(res, result);
    })
    .catch(err => Response.Internal(res, err));
});
```

---

## Security Implementation

### **Input Validation**
```javascript
// Parameter validation example
app.post('/api/users', (req, res) => {
  // Type validation
  if (typeof req.body.username !== 'string') {
    Response.BadParameters(res, 'Username must be a string');
    return;
  }

  // Required field validation
  if (!req.body.username || !req.body.password) {
    Response.BadParameters(res, 'Missing required parameters');
    return;
  }

  // Format validation
  if (!utils.validFilename(req.body.username)) {
    Response.BadParameters(res, 'Invalid username format');
    return;
  }
});
```

### **Password Security**
```javascript
// lib/passwordpolicy.js
const strongPassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return password.length >= minLength && 
         hasUpperCase && 
         hasLowerCase && 
         hasNumbers && 
         hasSpecialChar;
};

// Password hashing
const bcrypt = require('bcrypt');
const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};
```

### **HTTPS Configuration**
```javascript
// app.js - HTTPS server setup
const fs = require('fs');
const https = require('https');

const server = https.createServer({
  key: fs.readFileSync(__dirname + '/../ssl/server.key'),
  cert: fs.readFileSync(__dirname + '/../ssl/server.cert')
}, app);

server.listen(config.port, config.host);
```

### **CORS Configuration**
```javascript
// Cross-origin resource sharing
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://frontend-domain.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});
```

---

## Testing Strategy

### **Test Structure**
```
tests/
├── audit.test.js           # Audit functionality tests
├── client.test.js          # Client management tests
├── company.test.js         # Company management tests
├── configs.test.js         # Configuration tests
├── data.test.js           # Reference data tests
├── index.test.js          # General application tests
├── lib.test.js            # Library function tests
├── role.test.js           # Role and permission tests
├── settings.test.js       # Settings management tests
├── template.test.js       # Template management tests
├── unauthenticated.test.js # Public endpoint tests
├── user.test.js           # User management tests
└── vulnerability.test.js   # Vulnerability management tests
```

### **Test Example**
```javascript
// tests/user.test.js
const request = require('supertest');
const app = require('../src/app');

describe('User Management', () => {
  beforeEach(async () => {
    // Setup test data
  });

  test('should create user with valid data', async () => {
    const userData = {
      username: 'testuser',
      password: 'Test123!@#',
      firstname: 'Test',
      lastname: 'User'
    };

    const response = await request(app)
      .post('/api/users')
      .send([userData])
      .expect(201);

    expect(response.body.status).toBe('success');
  });

  test('should reject user with weak password', async () => {
    const userData = {
      username: 'testuser',
      password: 'weak',
      firstname: 'Test',
      lastname: 'User'
    };

    await request(app)
      .post('/api/users')
      .send([userData])
      .expect(400);
  });
});
```

---

## Performance Optimization

### **Database Optimization**
```javascript
// Efficient queries with projection
const getAuditsOptimized = () => {
  return Audit.find()
    .select('name language creator collaborators state createdAt')
    .populate('creator', 'username firstname lastname')
    .lean() // Returns plain JavaScript objects
    .exec();
};

// Pagination for large datasets
const getAuditsPaginated = (page = 1, limit = 25) => {
  const skip = (page - 1) * limit;
  return Audit.find()
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .exec();
};
```

### **Caching Strategy**
```javascript
// In-memory caching for frequently accessed data
const cache = new Map();

const getCachedSettings = async () => {
  if (cache.has('settings')) {
    return cache.get('settings');
  }
  
  const settings = await Settings.getAll();
  cache.set('settings', settings);
  setTimeout(() => cache.delete('settings'), 300000); // 5 min TTL
  
  return settings;
};
```

### **Response Compression**
```javascript
// Gzip compression middleware
const compression = require('compression');
app.use(compression());

// Large payload handling
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
```

---

## Development Guidelines

### **Code Standards**
```javascript
// Use consistent async/await patterns
const createAudit = async (auditData, userId) => {
  try {
    const audit = new Audit(auditData);
    audit.creator = userId;
    return await audit.save();
  } catch (error) {
    throw error;
  }
};

// Proper error handling
const handleDatabaseError = (error) => {
  if (error.code === 11000) {
    return { fn: 'BadParameters', message: 'Duplicate entry' };
  }
  return { fn: 'Internal', message: 'Database error' };
};
```

### **API Versioning**
```javascript
// Version routing
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);

// Backward compatibility
app.use('/api', v1Routes); // Default to v1
```

### **Environment Configuration**
```javascript
// config/config.js
const config = {
  development: {
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 27017,
      name: process.env.DB_NAME || 'pwndoc_dev'
    },
    jwtExpiry: '15m',
    logLevel: 'debug'
  },
  production: {
    database: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      name: process.env.DB_NAME
    },
    jwtExpiry: '15m',
    logLevel: 'error'
  }
};
```

### **Error Logging**
```javascript
// Centralized error logging
const logger = require('winston');

const logError = (error, req) => {
  logger.error({
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
};
```

### **Documentation Standards**
```javascript
// Swagger/OpenAPI documentation
/**
 * @swagger
 * /api/audits:
 *   get:
 *     tags: [Audit]
 *     summary: Get all audits
 *     parameters:
 *       - name: findingTitle
 *         in: query
 *         type: string
 *         description: Filter by finding title
 *     responses:
 *       200:
 *         description: List of audits
 *       401:
 *         description: Unauthorized
 */
```

---

## Related Documentation

This backend development guide is part of a comprehensive documentation suite. Below are related documents organized by category:

### **📁 Architecture & Design**
- [`/docs/architecture/system-overview.md`](../architecture/system-overview.md) - High-level system architecture, technology stack, and deployment patterns
- [`/docs/architecture/database-schema.md`](../architecture/database-schema.md) - Complete MongoDB schema documentation with relationships and indexing strategies

### **📁 API Documentation**
- [`/docs/development/api-integration.md`](api-integration.md) - Comprehensive backend API reference with all 70+ endpoints, parameters, and authentication requirements
- [`/docs/debug.md`](../debug.md) - API debugging techniques and troubleshooting guide

### **📁 Development Guides**
- [`/docs/development/frontend.md`](frontend.md) - Vue 3 + Quasar frontend development guide with component architecture
- [`/docs/development/documentation-structure.md`](documentation-structure.md) - Complete documentation organization and structure guidelines

### **📁 User & Administration**
- [`/docs/roles.md`](../roles.md) - User roles, permissions, and access control system
- [`/docs/audits.md`](../audits.md) - Audit management workflows and collaboration features
- [`/docs/vulnerabilities.md`](../vulnerabilities.md) - Vulnerability management and CVSS scoring
- [`/docs/data.md`](../data.md) - Data management, import/export, and backup procedures

### **📁 Templates & Reporting**
- [`/docs/docxtemplate.md`](../docxtemplate.md) - DOCX template system for report generation

### **📁 Installation & Deployment**
- [`/docs/installation.md`](../installation.md) - System installation and setup procedures
- [`/docs/README.md`](../README.md) - Quick start guide and overview

### **📁 Project Structure Reference**
For a complete understanding of the backend codebase structure:

```
backend/
├── src/
│   ├── app.js                 # Main application entry point
│   ├── config/               # Configuration files
│   ├── lib/                  # Core business logic libraries
│   ├── models/               # MongoDB data models (14 collections)
│   ├── routes/               # API route handlers (9 route files)
│   └── translate/            # Internationalization support
├── tests/                    # Test suites (11 test files)
├── ssl/                      # SSL certificates
├── docker-compose.*.yml      # Docker deployment configurations
├── Dockerfile.*             # Container build files
└── package.json             # Dependencies and scripts
```

### **📁 Future Documentation**
Planned documentation that will complement this backend guide:

- **Security Documentation** (`/docs/security/`) - Security policies, vulnerability management, and compliance
- **Operations Documentation** (`/docs/operations/`) - Monitoring, logging, backup procedures, and disaster recovery
- **Configuration Documentation** (`/docs/configuration/`) - Environment variables, database configuration, and deployment settings
- **Testing Documentation** (`/docs/development/testing.md`) - Test strategies, coverage requirements, and CI/CD integration

---

This backend development guide provides the foundation for understanding, maintaining, and extending the pwndoc-ng backend application. Regular updates ensure it remains current with the evolving codebase and best practices. 