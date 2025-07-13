# HTTP Response Library Documentation

## Overview

The `backend/src/lib/httpResponse.js` file provides standardized HTTP response formatting utilities for pwndoc-ng. It ensures consistent response structure across all API endpoints, making it easier to handle responses on the frontend and maintain API consistency.

## Table of Contents

1. [Response Structure](#response-structure)
2. [Success Responses (2xx)](#success-responses-2xx)
3. [Client Error Responses (4xx)](#client-error-responses-4xx)
4. [Server Error Responses (5xx)](#server-error-responses-5xx)
5. [File Responses](#file-responses)
6. [Usage Examples](#usage-examples)
7. [Integration](#integration)
8. [Best Practices](#best-practices)

---

## Response Structure

### Standard Response Format
All responses follow a consistent JSON structure:

```javascript
{
  "status": "success" | "error",
  "datas": <response_data>
}
```

**Fields:**
- `status`: Indicates whether the request was successful ("success") or failed ("error")
- `datas`: Contains the actual response data or error message

### Custom Response Function
```javascript
function Custom(res, status, code, message)
```

**Parameters:**
- `res` (Response): Express response object
- `status` (string): Response status ("success" or "error")
- `code` (number): HTTP status code
- `message` (any): Response data or error message

---

## Success Responses (2xx)

### Ok() - 200 OK
```javascript
function Ok(res, data)
```

**Usage:**
```javascript
const Response = require('./lib/httpResponse');

// Successful data retrieval
app.get('/api/users', (req, res) => {
  const users = getUsersFromDatabase();
  Response.Ok(res, users);
});
```

**Response Format:**
```javascript
{
  "status": "success",
  "datas": <user_data>
}
```

### Created() - 201 Created
```javascript
function Created(res, data)
```

**Usage:**
```javascript
// Resource creation
app.post('/api/users', (req, res) => {
  const newUser = createUser(req.body);
  Response.Created(res, newUser);
});
```

**Response Format:**
```javascript
{
  "status": "success",
  "datas": <created_resource>
}
```

### NoContent() - 204 No Content
```javascript
function NoContent(res, data)
```

**Usage:**
```javascript
// Resource deletion
app.delete('/api/users/:id', (req, res) => {
  deleteUser(req.params.id);
  Response.NoContent(res, {});
});
```

**Response Format:**
```javascript
{
  "status": "success",
  "datas": <optional_data>
}
```

---

## Client Error Responses (4xx)

### BadRequest() - 400 Bad Request
```javascript
function BadRequest(res, error)
```

**Usage:**
```javascript
// Invalid request data
app.post('/api/users', (req, res) => {
  if (!req.body.username) {
    return Response.BadRequest(res, "Username is required");
  }
});
```

**Response Format:**
```javascript
{
  "status": "error",
  "datas": "Username is required"
}
```

### Unauthorized() - 401 Unauthorized
```javascript
function Unauthorized(res, error)
```

**Usage:**
```javascript
// Authentication failure
app.get('/api/protected', (req, res) => {
  if (!req.user) {
    return Response.Unauthorized(res, "Authentication required");
  }
});
```

**Response Format:**
```javascript
{
  "status": "error",
  "datas": "Authentication required"
}
```

### Forbidden() - 403 Forbidden
```javascript
function Forbidden(res, error)
```

**Usage:**
```javascript
// Authorization failure
app.delete('/api/admin/users/:id', (req, res) => {
  if (!req.user.isAdmin) {
    return Response.Forbidden(res, "Admin access required");
  }
});
```

**Response Format:**
```javascript
{
  "status": "error",
  "datas": "Admin access required"
}
```

### NotFound() - 404 Not Found
```javascript
function NotFound(res, error)
```

**Usage:**
```javascript
// Resource not found
app.get('/api/users/:id', (req, res) => {
  const user = findUserById(req.params.id);
  if (!user) {
    return Response.NotFound(res, "User not found");
  }
});
```

**Response Format:**
```javascript
{
  "status": "error",
  "datas": "User not found"
}
```

### BadParameters() - 422 Unprocessable Entity
```javascript
function BadParameters(res, error)
```

**Usage:**
```javascript
// Validation errors
app.post('/api/users', (req, res) => {
  const validation = validateUserData(req.body);
  if (!validation.isValid) {
    return Response.BadParameters(res, validation.errors);
  }
});
```

**Response Format:**
```javascript
{
  "status": "error",
  "datas": ["Email format is invalid", "Password too short"]
}
```

---

## Server Error Responses (5xx)

### Internal() - 500 Internal Server Error
```javascript
function Internal(res, error)
```

**Advanced Error Handling:**
The `Internal` function provides sophisticated error handling with multiple fallback strategies:

1. **Function-based errors**: If `error.fn` exists, calls the corresponding function
2. **MongoDB errors**: Handles `error.errmsg` for database errors
3. **Standard errors**: Uses `error.message` for generic errors
4. **Fallback**: Generic "Internal Error" message

**Usage:**
```javascript
// Database error handling
app.get('/api/users', async (req, res) => {
  try {
    const users = await getUsersFromDatabase();
    Response.Ok(res, users);
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

**Error Processing Logic:**
```javascript
function Internal(res, error) {
  if (error.fn) {
    var fn = exports[error.fn];
    if (typeof(fn) === 'function') {
      fn(res, error.message);
    }
  } else if (error.errmsg) {
    // MongoDB error
    res.status(500).json({"status": "error", "datas": error.errmsg});
  } else if (error.message) {
    // Standard error
    res.status(500).json({"status": "error", "datas": error.message});
  } else {
    // Fallback
    res.status(500).json({"status": "error", "datas": "Internal Error"});
  }
}
```

---

## File Responses

### SendFile() - File Download
```javascript
function SendFile(res, filename, file)
```

**Parameters:**
- `res`: Express response object
- `filename`: Name for the downloaded file
- `file`: File buffer or data

**Usage:**
```javascript
// PDF report download
app.get('/api/reports/:id/download', (req, res) => {
  const report = generatePDFReport(req.params.id);
  const filename = `audit_report_${req.params.id}.pdf`;
  Response.SendFile(res, filename, report);
});
```

**Headers Set:**
```javascript
{
  "Content-Disposition": "attachment; filename=\"audit_report_123.pdf\""
}
```

### SendImage() - Image Response
```javascript
function SendImage(res, image)
```

**Parameters:**
- `res`: Express response object
- `image`: Image buffer

**Usage:**
```javascript
// Image serving
app.get('/api/images/:id', (req, res) => {
  const image = getImageFromDatabase(req.params.id);
  Response.SendImage(res, image);
});
```

**Headers Set:**
```javascript
{
  "Content-Type": "image/png",
  "Content-Length": <image_length>
}
```

---

## Usage Examples

### Basic CRUD Operations
```javascript
const Response = require('./lib/httpResponse');

// Create user
app.post('/api/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    Response.Created(res, user);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Get user
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return Response.NotFound(res, "User not found");
    }
    Response.Ok(res, user);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Update user
app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await updateUser(req.params.id, req.body);
    Response.Ok(res, user);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  try {
    await deleteUser(req.params.id);
    Response.NoContent(res, {});
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

### Authentication & Authorization
```javascript
// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return Response.BadRequest(res, "Username and password required");
    }
    
    const user = await authenticateUser(username, password);
    if (!user) {
      return Response.Unauthorized(res, "Invalid credentials");
    }
    
    const token = generateToken(user);
    Response.Ok(res, { token, user });
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Protected endpoint
app.get('/api/admin/stats', (req, res) => {
  if (!req.user) {
    return Response.Unauthorized(res, "Authentication required");
  }
  
  if (!req.user.isAdmin) {
    return Response.Forbidden(res, "Admin access required");
  }
  
  const stats = getSystemStats();
  Response.Ok(res, stats);
});
```

### Validation Examples
```javascript
// User registration with validation
app.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  // Validation
  const errors = [];
  if (!username) errors.push("Username is required");
  if (!email) errors.push("Email is required");
  if (!password) errors.push("Password is required");
  if (password && password.length < 6) errors.push("Password must be at least 6 characters");
  
  if (errors.length > 0) {
    return Response.BadParameters(res, errors);
  }
  
  try {
    const user = await createUser({ username, email, password });
    Response.Created(res, user);
  } catch (error) {
    if (error.code === 11000) {
      Response.BadRequest(res, "Username already exists");
    } else {
      Response.Internal(res, error);
    }
  }
});
```

---

## Integration

### Express.js Integration
```javascript
const express = require('express');
const Response = require('./lib/httpResponse');

const app = express();

// Middleware for error handling
app.use((err, req, res, next) => {
  Response.Internal(res, err);
});

// Global error handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
```

### Database Integration
```javascript
const mongoose = require('mongoose');
const Response = require('./lib/httpResponse');

// MongoDB error handling
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Model error handling
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    // Duplicate key error
    next(new Error('Username already exists'));
  } else {
    next(error);
  }
});
```

### Frontend Integration
```javascript
// Frontend API call handling
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(endpoint, options);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.datas;
    } else {
      throw new Error(data.datas);
    }
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}

// Usage
try {
  const users = await apiCall('/api/users');
  console.log('Users:', users);
} catch (error) {
  console.error('Failed to fetch users:', error.message);
}
```

---

## Best Practices

### Error Message Guidelines
1. **Clear Messages**: Use descriptive error messages
2. **User-Friendly**: Avoid technical jargon for client-facing messages
3. **Consistent Format**: Use consistent error message structure
4. **Localization**: Consider internationalization for error messages

### Response Consistency
```javascript
// Good: Consistent response structure
Response.Ok(res, {
  users: userList,
  total: userCount,
  page: currentPage
});

// Good: Consistent error handling
if (!user) {
  return Response.NotFound(res, "User not found");
}

// Avoid: Inconsistent response format
res.json({ success: true, data: users }); // Don't do this
```

### Error Logging
```javascript
// Enhanced error logging
function Internal(res, error) {
  console.error('Internal Server Error:', {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    url: res.req.url,
    method: res.req.method
  });
  
  // ... existing error handling logic
}
```

### Status Code Usage
- **200 OK**: Successful GET, PUT, PATCH
- **201 Created**: Successful POST with resource creation
- **204 No Content**: Successful DELETE
- **400 Bad Request**: Invalid request format
- **401 Unauthorized**: Authentication required
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side errors

---

## Performance Considerations

### Response Size Optimization
```javascript
// Efficient data serialization
Response.Ok(res, {
  users: users.map(user => ({
    id: user._id,
    username: user.username,
    email: user.email
    // Only include necessary fields
  }))
});
```

### Caching Headers
```javascript
// Add caching for static responses
function CachedOk(res, data, maxAge = 3600) {
  res.set('Cache-Control', `public, max-age=${maxAge}`);
  Response.Ok(res, data);
}
```

---

## Security Considerations

### Information Disclosure
```javascript
// Sanitize error messages for production
function sanitizeError(error) {
  if (process.env.NODE_ENV === 'production') {
    return 'Internal Server Error';
  }
  return error.message;
}
```

### Input Validation
```javascript
// Validate and sanitize input before processing
function validateInput(data) {
  // Implement input validation
  return {
    isValid: true,
    errors: []
  };
}
```

---

This HTTP response library provides a standardized, maintainable approach to API responses in pwndoc-ng, ensuring consistency across all endpoints and improving the overall developer experience. 