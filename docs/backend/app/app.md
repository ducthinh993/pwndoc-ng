# Application Entry Point Documentation

## Overview

The `backend/src/app.js` file serves as the main entry point for the pwndoc-ng backend application. It configures the Express.js server with HTTPS, Socket.io for real-time communication, MongoDB connection, and initializes all core application components.

## Table of Contents

1. [Dependencies & Imports](#dependencies--imports)
2. [Server Configuration](#server-configuration)
3. [Database Connection](#database-connection)
4. [Socket.io Configuration](#socketio-configuration)
5. [Middleware Setup](#middleware-setup)
6. [Routes Initialization](#routes-initialization)
7. [Collaborative Editing](#collaborative-editing)
8. [API Documentation](#api-documentation)
9. [Server Startup](#server-startup)
10. [Code Examples](#code-examples)

---

## Dependencies & Imports

### Core Dependencies
```javascript
var fs = require('fs');                    // File system operations
var app = require('express')();            // Express application
var https = require('https').Server();     // HTTPS server
var io = require('socket.io')();           // Socket.io for WebSocket
var bodyParser = require('body-parser');   // Request body parsing
var cookieParser = require('cookie-parser'); // Cookie parsing
var mongoose = require('mongoose');         // MongoDB ODM
```

### Application-specific Imports
```javascript
var utils = require('./lib/utils');                        // Utility functions
const swaggerUi = require('swagger-ui-express');           // API documentation
const swaggerDocument = require('./config/swagger-output.json'); // Swagger config
const { cronJobs } = require('./lib/cron');                // Scheduled tasks
var hocus = require('@hocuspocus/server');                 // Collaborative editing
var acl = require('./lib/auth').acl;                       // Access control
```

---

## Server Configuration

### HTTPS Server Setup
```javascript
var https = require('https').Server({
  key: fs.readFileSync(__dirname+'/../ssl/server.key'),
  cert: fs.readFileSync(__dirname+'/../ssl/server.cert')
}, app);
```

**Key Features:**
- **SSL/TLS Encryption**: Uses server.key and server.cert from `/ssl/` directory
- **Secure Communications**: All HTTP traffic is encrypted
- **Certificate Management**: Certificates must be present in `backend/ssl/` folder

### Environment Configuration
```javascript
var env = process.env.NODE_ENV || 'dev';
var config = require('./config/config.json')[env];
global.__basedir = __dirname;
```

**Configuration Options:**
- **Environment**: `dev`, `test`, `prod` (default: `dev`)
- **Config File**: `backend/src/config/config.json`
- **Global Base Directory**: Set for file path resolution

---

## Database Connection

### MongoDB Connection
```javascript
mongoose.connect(`mongodb://${config.database.server}:${config.database.port}/${config.database.name}`, {});
```

**Connection Configuration:**
- **Server**: `config.database.server`
- **Port**: `config.database.port`
- **Database Name**: `config.database.name`
- **Promise Support**: Uses native promises
- **String Trimming**: Automatically trims all String fields

### Model Registration
All MongoDB models are imported and registered:
```javascript
require('./models/user');
require('./models/audit');
require('./models/client');
require('./models/company');
require('./models/template');
require('./models/vulnerability');
require('./models/vulnerability-update');
require('./models/language');
require('./models/audit-type');
require('./models/vulnerability-type');
require('./models/vulnerability-category');
require('./models/custom-section');
require('./models/custom-field');
require('./models/image');
require('./models/settings');
```

---

## Socket.io Configuration

### Real-time Communication Setup
```javascript
var io = require('socket.io')(https, {
  cors: {
    origin: "*"
  }
})
```

### Socket Event Handlers

#### User Join/Leave Management
```javascript
// User joins audit room
socket.on('join', (data) => {
  console.log(`user ${data.username} joined room ${data.room}`)
  socket.username = data.username;
  socket.color = '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  socket.join(data.room);
  io.to(data.room).emit('updateUsers');
});

// User leaves audit room
socket.on('leave', (data) => {
  console.log(`user ${data.username} left room ${data.room}`)
  socket.leave(data.room)
  io.to(data.room).emit('updateUsers');
})
```

#### User Activity Tracking
```javascript
// Update user list in room
socket.on('updateUsers', (data) => {
  var userList = [...new Set(utils.getSockets(io, data.room).map(s => {
    var user = {};
    user.username = s.username;
    user.color = s.color;
    user.menu = s.menu;
    if (s.finding) user.finding = s.finding;
    if (s.section) user.section = s.section;
    return user;
  }))];
  io.to(data.room).emit('roomUsers', userList);
})

// Menu/section tracking
socket.on('menu', (data) => {
  socket.menu = data.menu;
  (data.finding)? socket.finding = data.finding: delete socket.finding;
  (data.section)? socket.section = data.section: delete socket.section;
  io.to(data.room).emit('updateUsers');
})
```

**Socket Features:**
- **Room-based Communication**: Users join audit-specific rooms
- **User Presence**: Track online users with color coding
- **Activity Tracking**: Monitor which finding/section users are viewing
- **Real-time Updates**: Live user list updates

---

## Middleware Setup

### CORS Configuration
```javascript
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Expose-Headers', 'Content-Disposition')
  next();
});
```

### Body Parser Configuration
```javascript
app.use(bodyParser.json({limit: '100mb'}));
app.use(bodyParser.urlencoded({
  limit: '10mb',
  extended: false
}));
```

**Middleware Features:**
- **Large File Support**: 100MB JSON limit for file uploads
- **URL Encoding**: 10MB limit for form data
- **Cookie Support**: Cookie parsing for authentication
- **CORS Headers**: Cross-origin resource sharing

---

## Routes Initialization

### API Route Registration
```javascript
require('./routes/user')(app);
require('./routes/audit')(app, io);
require('./routes/client')(app);
require('./routes/company')(app);
require('./routes/vulnerability')(app);
require('./routes/template')(app);
require('./routes/data')(app);
require('./routes/image')(app);
require('./routes/settings')(app);
```

**Route Modules:**
- **User Management**: Authentication, authorization, user CRUD
- **Audit Management**: Audit lifecycle, findings, collaboration
- **Client Management**: Client information and associations
- **Company Management**: Company profiles and branding
- **Vulnerability Management**: Vulnerability database and scoring
- **Template Management**: Report templates and customization
- **Data Management**: Import/export, backup, bulk operations
- **Image Management**: File upload, storage, serving
- **Settings Management**: Application configuration

### Cron Jobs Initialization
```javascript
const { cronJobs } = require('./lib/cron');
cronJobs();
```

---

## Collaborative Editing

### Hocuspocus Server Configuration
```javascript
const serverHocus = hocus.Server.configure({
  port: process.env.COLLAB_WEBSOCKET_PORT || 8440,
  onUpgrade(data) {
    return new Promise(async (resolve, reject) => {
      const { request, socket, head } = data
      // JWT token validation logic
      // Audit permission checking
      // User authorization
    })
  }
})
```

**Collaborative Features:**
- **Real-time Editing**: Y.js-based collaborative document editing
- **Authentication**: JWT token validation for WebSocket connections
- **Authorization**: Audit-level permissions (creator, collaborators, reviewers)
- **Secure Access**: Token-based WebSocket authentication

### Authentication Flow
1. **Token Extraction**: Extract JWT from WebSocket headers
2. **Permission Check**: Verify user has audit read permissions
3. **Audit Validation**: Ensure user can access specific audit
4. **Role-based Access**: Different permissions for admin/collaborators/reviewers

---

## API Documentation

### Swagger UI Integration
```javascript
if(config.apidoc) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
```

**Documentation Features:**
- **Interactive API Explorer**: Swagger UI at `/api-docs`
- **Environment-based**: Only enabled when `config.apidoc` is true
- **Auto-generated**: Documentation from `swagger-output.json`

---

## Server Startup

### Default Route Handler
```javascript
app.get("*", function(req, res) {
    res.status(404).json({"status": "error", "data": "Route undefined"});
})
```

### Server Initialization
```javascript
https.listen(config.port, config.host)
module.exports = app;
```

**Startup Configuration:**
- **Port**: Defined in config file
- **Host**: Defined in config file
- **HTTPS Only**: No HTTP fallback
- **Module Export**: App exported for testing

---

## Code Examples

### Adding New Socket Event
```javascript
socket.on('customEvent', (data) => {
  // Process custom event
  console.log('Custom event received:', data);
  
  // Emit to specific room
  io.to(data.room).emit('customResponse', {
    user: socket.username,
    message: data.message
  });
});
```

### Adding New Middleware
```javascript
// Add before routes initialization
app.use('/api', (req, res, next) => {
  // Custom middleware logic
  console.log('API request:', req.method, req.url);
  next();
});
```

### Configuration Access
```javascript
// Access configuration in other modules
const config = require('./config/config.json')[process.env.NODE_ENV || 'dev'];
const dbUrl = `mongodb://${config.database.server}:${config.database.port}/${config.database.name}`;
```

---

## Implementation Guidelines

### For New Features
1. **Models**: Add model imports after existing model requires
2. **Routes**: Add route initialization after existing routes
3. **Socket Events**: Add new event handlers in socket.on('connection') block
4. **Middleware**: Add before routes initialization
5. **Configuration**: Update config.json for new settings

### Security Considerations
- **SSL Certificates**: Ensure valid certificates in `/ssl/` directory
- **JWT Validation**: All WebSocket connections require valid JWT tokens
- **CORS Policy**: Review origin restrictions for production
- **Input Validation**: Body parser limits prevent abuse

### Performance Optimization
- **Connection Pooling**: MongoDB connection reuse
- **Socket Rooms**: Efficient room-based communication
- **Middleware Order**: Critical middleware first
- **Error Handling**: Proper error responses

---

## Related Documentation

- **[Configuration System](../config/configuration.md)** - Environment and config management
- **[Database Models](../models/)** - MongoDB schema documentation
- **[API Routes](../routes/)** - API endpoint documentation
- **[Socket.io Implementation](../lib/socket.md)** - Real-time communication patterns
- **[Authentication System](../lib/auth.md)** - JWT and permission management

---

*This documentation provides complete guidance for understanding and modifying the main application entry point. Regular updates ensure it remains current with code changes.* 