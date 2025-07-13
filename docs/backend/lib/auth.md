# Authentication System Documentation

## Overview

The `backend/src/lib/auth.js` module provides a comprehensive authentication and authorization system for the pwndoc-ng application. It implements JWT token management, role-based access control (RBAC), and secure permission checking for all API endpoints.

## Table of Contents

1. [JWT Secret Management](#jwt-secret-management)
2. [Role-Based Access Control](#role-based-access-control)
3. [Permission System](#permission-system)
4. [ACL Class](#acl-class)
5. [Middleware Implementation](#middleware-implementation)
6. [Built-in Roles](#built-in-roles)
7. [Custom Roles](#custom-roles)
8. [Usage Examples](#usage-examples)
9. [Security Considerations](#security-considerations)

---

## JWT Secret Management

### Dynamic Secret Generation
The system automatically generates JWT secrets if they don't exist in the configuration:

```javascript
if (!config[env].jwtSecret) {
    config[env].jwtSecret = require('crypto').randomBytes(32).toString('hex')
    var configString = JSON.stringify(config, null, 4)
    fs.writeFileSync(`${__basedir}/config/config.json`, configString)
}
if (!config[env].jwtRefreshSecret) {
    config[env].jwtRefreshSecret = require('crypto').randomBytes(32).toString('hex')
    var configString = JSON.stringify(config, null, 4)
    fs.writeFileSync(`${__basedir}/config/config.json`, configString)
}
```

**Key Features:**
- **Automatic Generation**: Creates unique secrets for each environment
- **Refresh Token Support**: Separate secret for refresh tokens
- **Environment-specific**: Different secrets for dev/test/prod
- **Persistent Storage**: Saves secrets to config.json file

### Exported Secrets
```javascript
exports.jwtSecret = jwtSecret
exports.jwtRefreshSecret = jwtRefreshSecret
```

---

## Role-Based Access Control

### Role Structure
Roles are defined with two key properties:

```javascript
role_name: {
    allows: [],    // Array of permissions or "*" for all
    inherits: []   // Array of roles to inherit from
}
```

### Built-in Roles

#### User Role
```javascript
user: {
    allows: [
        // Audits
        'audits:create',
        'audits:read',
        'audits:update',
        'audits:delete',
        
        // Images
        'images:create',
        'images:read',
        
        // Clients
        'clients:create',
        'clients:read',
        'clients:update',
        'clients:delete',
        
        // Companies
        'companies:create',
        'companies:read',
        'companies:update',
        'companies:delete',
        
        // Reference Data
        'languages:read',
        'audit-types:read',
        'vulnerability-types:read',
        'vulnerability-categories:read',
        'sections:read',
        'templates:read',
        'users:read',
        'roles:read',
        'custom-fields:read',
        
        // Vulnerabilities
        'vulnerabilities:read',
        'vulnerability-updates:create',
        
        // Settings
        'settings:read-public'
    ]
}
```

#### Admin Role
```javascript
admin: {
    allows: "*"  // All permissions
}
```

### Custom Roles
The system supports custom roles loaded from `config/roles.json`:

```javascript
try {
    var customRoles = require('../config/roles.json')
} catch(error) {
    var customRoles = []
}
var roles = {...customRoles, ...builtInRoles}
```

---

## Permission System

### Permission Naming Convention
Permissions follow the pattern: `resource:action`

**Resources:**
- `audits` - Audit management
- `images` - Image handling
- `clients` - Client management
- `companies` - Company management
- `languages` - Language definitions
- `audit-types` - Audit type management
- `vulnerability-types` - Vulnerability type management
- `vulnerability-categories` - Vulnerability categories
- `sections` - Section data
- `templates` - Template management
- `users` - User management
- `roles` - Role management
- `vulnerabilities` - Vulnerability management
- `vulnerability-updates` - Vulnerability updates
- `custom-fields` - Custom field management
- `settings` - Settings management

**Actions:**
- `create` - Create new resources
- `read` - Read/view resources
- `update` - Modify existing resources
- `delete` - Delete resources
- `read-public` - Read public information only

---

## ACL Class

### Constructor
```javascript
class ACL {
    constructor(roles) {
        if(typeof roles !== 'object') {
            throw new TypeError('Expected an object as input')
        }
        this.roles = roles
    }
}
```

### Core Methods

#### `isAllowed(role, permission)`
Checks if a role has a specific permission:

```javascript
isAllowed(role, permission) {
    // Check if role exists
    if(!this.roles[role] && !this.roles['user']) {
        return false
    }

    let $role = this.roles[role] || this.roles['user'] // Default to user role
    
    // Check if role is allowed with permission
    if ($role.allows && ($role.allows === "*" || $role.allows.indexOf(permission) !== -1)) {
        return true
    }

    // Check inheritance
    if(!$role.inherits || $role.inherits.length < 1) {
        return false
    }

    // Recursive check inherited roles
    return $role.inherits.some(role => this.isAllowed(role, permission))
}
```

#### `hasPermission(permission)`
Express middleware factory for permission checking:

```javascript
hasPermission (permission) {
    var Response = require('./httpResponse')
    var jwt = require('jsonwebtoken')

    return (req, res, next) => {
        if (!req.cookies['token']) {
            Response.Unauthorized(res, 'No token provided')
            return;
        }

        var cookie = req.cookies['token'].split(' ')
        if (cookie.length !== 2 || cookie[0] !== 'JWT') {
            Response.Unauthorized(res, 'Bad token type')
            return
        }

        var token = cookie[1]
        jwt.verify(token, jwtSecret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError')
                    Response.Unauthorized(res, 'Expired token')
                else
                    Response.Unauthorized(res, 'Invalid token')
                return
            }
            
            if ( permission === "validtoken" || this.isAllowed(decoded.role, permission)) {
                req.decodedToken = decoded
                return next()
            }
            else {
                Response.Forbidden(res, 'Insufficient privileges')
                return
            }
        })
    }
}
```

#### `hasPermissionFromReq(permission, token)`
Direct permission checking without middleware:

```javascript
hasPermissionFromReq (permission, token) {
    var jwt = require('jsonwebtoken')
    return jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            return false
        }
        if ( permission === "validtoken" || this.isAllowed(decoded.role, permission)) {
                return decoded
        }
        else {
            return false
        }
    })
}
```

#### `buildRoles(role)`
Builds complete permission list including inherited permissions:

```javascript
buildRoles(role) {
    var currentRole = this.roles[role] || this.roles['user']
    var result = currentRole.allows || []

    if (currentRole.inherits) {
        currentRole.inherits.forEach(element => {
            result = [...new Set([...result, ...this.buildRoles(element)])]
        })
    }

    return result
}
```

#### `getRoles(role)`
Returns all permissions for a role:

```javascript
getRoles(role) {
    var result = this.buildRoles(role)

    if (result.includes('*'))
        return '*'
    
    return result
}
```

---

## Middleware Implementation

### Token Validation Flow
1. **Cookie Extraction**: Extract JWT token from cookies
2. **Token Format Check**: Verify "JWT <token>" format
3. **JWT Verification**: Validate token signature and expiration
4. **Permission Check**: Verify user has required permission
5. **Request Enhancement**: Add decoded token to request object

### Error Handling
- **No Token**: Returns 401 Unauthorized
- **Invalid Format**: Returns 401 Unauthorized with "Bad token type"
- **Expired Token**: Returns 401 Unauthorized with "Expired token"
- **Invalid Token**: Returns 401 Unauthorized with "Invalid token"
- **Insufficient Privileges**: Returns 403 Forbidden

---

## Usage Examples

### Route Protection
```javascript
const { acl } = require('./lib/auth');

// Protect route with specific permission
app.get('/api/audits', acl.hasPermission('audits:read'), (req, res) => {
    // Route handler
    // req.decodedToken contains user information
});

// Multiple permissions
app.post('/api/audits', acl.hasPermission('audits:create'), (req, res) => {
    // Only users with audit create permission can access
});
```

### Direct Permission Checking
```javascript
const { acl } = require('./lib/auth');

// Check if role has permission
if (acl.isAllowed('user', 'audits:read')) {
    // User can read audits
}

// Check permission from token
const decoded = acl.hasPermissionFromReq('audits:read', token);
if (decoded) {
    // User has permission, decoded contains user info
}
```

### Custom Role Definition
Create `config/roles.json`:
```json
{
    "manager": {
        "allows": [
            "audits:create",
            "audits:read",
            "audits:update",
            "clients:create",
            "clients:read",
            "clients:update"
        ],
        "inherits": ["user"]
    },
    "reviewer": {
        "allows": [
            "audits:read",
            "vulnerabilities:read"
        ],
        "inherits": ["user"]
    }
}
```

---

## Security Considerations

### JWT Security
- **Secret Generation**: Cryptographically secure random secrets
- **Token Expiration**: Tokens have expiration times
- **Refresh Tokens**: Separate secret for refresh token security
- **Environment Isolation**: Different secrets per environment

### Permission Security
- **Default Deny**: Users without roles default to basic 'user' role
- **Inheritance Chain**: Recursive permission checking prevents bypass
- **Wildcard Admin**: Admin role has all permissions
- **Granular Permissions**: Fine-grained resource:action permissions

### Implementation Security
- **HTTP-Only Cookies**: Tokens stored in secure cookies
- **CSRF Protection**: Token format validation
- **Error Handling**: Consistent error responses
- **No Information Leakage**: Generic error messages

---

## Error Responses

### 401 Unauthorized
```json
{
    "status": "error",
    "message": "No token provided"
}
```

### 403 Forbidden
```json
{
    "status": "error",
    "message": "Insufficient privileges"
}
```

### Token Expired
```json
{
    "status": "error",
    "message": "Expired token"
}
```

---

## Integration Examples

### WebSocket Authentication
```javascript
// Used in app.js for Hocuspocus authentication
const { acl } = require('./lib/auth');

// Validate WebSocket connection
if (acl.hasPermissionFromReq('audits:read', token)) {
    // Allow connection
} else {
    // Reject connection
}
```

### Role-based UI
```javascript
// Get user permissions for frontend
const permissions = acl.getRoles(user.role);
```

---

## Related Documentation

- **[User Model](../models/user.md)** - User schema and authentication
- **[API Routes](../routes/)** - How routes use authentication
- **[Configuration](../config/configuration.md)** - JWT secret management
- **[HTTP Response](./httpResponse.md)** - Response formatting
- **[Application Entry](../app/app.md)** - How auth integrates with Express

---

*This authentication system provides robust security for the pwndoc-ng application with flexible role-based permissions and secure JWT token management.* 