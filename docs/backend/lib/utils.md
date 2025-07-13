# Utils Library Documentation

## Overview

The `backend/src/lib/utils.js` file provides a collection of utility functions for pwndoc-ng. These functions handle common tasks such as filename validation, XML escaping, string formatting, UUID generation, object manipulation, and socket management.

## Table of Contents

1. [Filename Validation](#filename-validation)
2. [XML Processing](#xml-processing)
3. [String Formatting](#string-formatting)
4. [UUID Generation](#uuid-generation)
5. [Object Manipulation](#object-manipulation)
6. [Socket Management](#socket-management)
7. [Usage Examples](#usage-examples)
8. [Integration](#integration)
9. [Security Considerations](#security-considerations)

---

## Filename Validation

### validFilename()
```javascript
function validFilename(filename)
```

**Purpose**: Validates filenames to ensure they contain only allowed characters for template creation.

**Parameters:**
- `filename` (string): The filename to validate

**Returns:**
- `boolean`: `true` if filename is valid, `false` otherwise

**Implementation:**
```javascript
function validFilename(filename) {
  const regex = /^[\p{Letter}\p{Mark}0-9 \[\]'()_-]+$/iu;
  return (regex.test(filename));
}
```

**Allowed Characters:**
- Unicode letters (`\p{Letter}`)
- Unicode marks (`\p{Mark}`)
- Numbers (0-9)
- Spaces
- Square brackets `[` `]`
- Apostrophes `'`
- Parentheses `(` `)`
- Underscores `_`
- Hyphens `-`

**Usage Example:**
```javascript
const utils = require('./lib/utils');

console.log(utils.validFilename("Report_Template")); // true
console.log(utils.validFilename("Audit [2024]")); // true
console.log(utils.validFilename("Template's Name")); // true
console.log(utils.validFilename("Invalid<>File")); // false
```

### validExtension()
```javascript
function validExtension(ext)
```

**Purpose**: Validates file extensions to ensure they contain only alphabetic characters.

**Parameters:**
- `ext` (string): The file extension to validate

**Returns:**
- `boolean`: `true` if extension is valid, `false` otherwise

**Implementation:**
```javascript
function validExtension(ext) {
  const regex = /^[a-zA-Z]+$/;
  return (regex.test(ext));
}
```

**Usage Example:**
```javascript
console.log(utils.validExtension("docx")); // true
console.log(utils.validExtension("pdf")); // true
console.log(utils.validExtension("txt")); // true
console.log(utils.validExtension("123")); // false
console.log(utils.validExtension("d0cx")); // false
```

---

## XML Processing

### escapeXMLEntities()
```javascript
function escapeXMLEntities(input)
```

**Purpose**: Escapes XML special characters when using `{@RawXML}` in template generation.

**Parameters:**
- `input` (string): The string to escape

**Returns:**
- `string`: The escaped string with XML entities

**Implementation:**
```javascript
function escapeXMLEntities(input) {
    var XML_CHAR_MAP = { '<': '&lt;', '>': '&gt;', '&': '&amp;'};
    var standardEncode = input.replace(/[<>&]/g, function (ch) { return XML_CHAR_MAP[ch]; });
    return standardEncode;
}
```

**Character Mapping:**
- `<` → `&lt;`
- `>` → `&gt;`
- `&` → `&amp;`

**Usage Example:**
```javascript
const rawXML = '<script>alert("XSS")</script>';
const escaped = utils.escapeXMLEntities(rawXML);
console.log(escaped); // &lt;script&gt;alert("XSS")&lt;/script&gt;

// Template usage
const templateData = {
  content: utils.escapeXMLEntities(userInput)
};
```

---

## String Formatting

### lPad()
```javascript
function lPad(number)
```

**Purpose**: Converts numbers to 3-digit format with leading zeros for values under 100.

**Parameters:**
- `number` (number): The number to format

**Returns:**
- `string`: The formatted number as a string

**Implementation:**
```javascript
function lPad(number) {
    if (number <= 99) { number = ("00" + number).slice(-3); }
    return `${number}`;
}
```

**Usage Example:**
```javascript
console.log(utils.lPad(1));   // "001"
console.log(utils.lPad(25));  // "025"
console.log(utils.lPad(99));  // "099"
console.log(utils.lPad(100)); // "100"
console.log(utils.lPad(999)); // "999"

// Common use case: Finding numbering
const findingNumber = utils.lPad(finding.identifier);
```

### escapeRegex()
```javascript
function escapeRegex(regex)
```

**Purpose**: Escapes special regular expression characters in strings.

**Parameters:**
- `regex` (string): The string containing regex characters to escape

**Returns:**
- `string`: The escaped string safe for use in regular expressions

**Implementation:**
```javascript
function escapeRegex(regex) {
    return regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
```

**Escaped Characters:**
- `-` `/` `\` `^` `$` `*` `+` `?` `.` `(` `)` `|` `[` `]` `{` `}`

**Usage Example:**
```javascript
const userInput = "user@example.com";
const escapedInput = utils.escapeRegex(userInput);
const regex = new RegExp(escapedInput, 'i');

// Safe search in text
const text = "Contact: user@example.com";
console.log(regex.test(text)); // true
```

---

## UUID Generation

### generateUUID()
```javascript
function generateUUID()
```

**Purpose**: Generates a cryptographically secure UUID using random bytes.

**Returns:**
- `string`: A 64-character hexadecimal UUID

**Implementation:**
```javascript
function generateUUID() {
    return require('crypto').randomBytes(32).toString('hex')
}
```

**Usage Example:**
```javascript
const uniqueId = utils.generateUUID();
console.log(uniqueId); // "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456"

// Common use cases
const auditId = utils.generateUUID();
const sessionId = utils.generateUUID();
const tempFileId = utils.generateUUID();
```

---

## Object Manipulation

### getObjectPaths()
```javascript
function getObjectPaths(obj, prefix = '')
```

**Purpose**: Extracts all paths from a nested object structure, useful for template variable discovery.

**Parameters:**
- `obj` (object): The object to extract paths from
- `prefix` (string, optional): Prefix for nested paths

**Returns:**
- `array`: Array of string paths representing object structure

**Implementation:**
```javascript
var getObjectPaths = (obj, prefix = '') =>
  Object.keys(obj).reduce((res, el) => {
    if( Array.isArray(obj[el]) ) {
      return [...res, prefix + el];
    } else if( typeof obj[el] === 'object' && obj[el] !== null ) {
      return [...res, ...getObjectPaths(obj[el], prefix + el + '.')];
    }
    return [...res, prefix + el];
  }, [])
```

**Usage Example:**
```javascript
const auditData = {
  general: {
    title: "Security Audit",
    date: "2024-01-01",
    client: {
      name: "Example Corp",
      contact: "john@example.com"
    }
  },
  findings: [
    { title: "SQL Injection", severity: "High" }
  ]
};

const paths = utils.getObjectPaths(auditData);
console.log(paths);
// Output: [
//   "general.title",
//   "general.date", 
//   "general.client.name",
//   "general.client.contact",
//   "findings"
// ]
```

**Template Integration:**
```javascript
// Template variable discovery
function getAvailableVariables(templateData) {
  const paths = utils.getObjectPaths(templateData);
  return paths.map(path => `{${path}}`);
}

const availableVars = getAvailableVariables(auditData);
// ["{general.title}", "{general.date}", "{general.client.name}", ...]
```

---

## Socket Management

### getSockets()
```javascript
function getSockets(io, room)
```

**Purpose**: Retrieves all socket connections in a specific Socket.IO room.

**Parameters:**
- `io` (Socket.IO Server): The Socket.IO server instance
- `room` (string): The room name to search for connected sockets

**Returns:**
- `array`: Array of socket objects connected to the specified room

**Implementation:**
```javascript
function getSockets(io, room) {
  var result = []
  io.sockets.sockets.forEach((data) => {
    if (data.rooms.has(room)) {
      result.push(data)
    }
  })
  return result
}
```

**Usage Example:**
```javascript
// Get all sockets connected to an audit room
const auditRoom = `audit_${auditId}`;
const connectedSockets = utils.getSockets(io, auditRoom);

console.log(`${connectedSockets.length} users connected to audit`);

// Send message to all connected users
connectedSockets.forEach(socket => {
  socket.emit('audit_update', {
    type: 'finding_added',
    data: newFinding
  });
});
```

**Real-time Collaboration:**
```javascript
// Collaborative editing notifications
function notifyCollaborators(io, auditId, userId, action) {
  const room = `audit_${auditId}`;
  const sockets = utils.getSockets(io, room);
  
  sockets.forEach(socket => {
    if (socket.userId !== userId) {
      socket.emit('collaborator_action', {
        userId,
        action,
        timestamp: new Date()
      });
    }
  });
}
```

---

## Usage Examples

### File Upload Validation
```javascript
const utils = require('./lib/utils');

app.post('/api/templates/upload', (req, res) => {
  const { filename } = req.body;
  const fileExtension = filename.split('.').pop();
  
  // Validate filename and extension
  if (!utils.validFilename(filename)) {
    return res.status(400).json({
      error: 'Invalid filename. Only letters, numbers, spaces, and basic punctuation allowed.'
    });
  }
  
  if (!utils.validExtension(fileExtension)) {
    return res.status(400).json({
      error: 'Invalid file extension. Only alphabetic characters allowed.'
    });
  }
  
  // Process file upload
  processFileUpload(req, res);
});
```

### Template Variable Processing
```javascript
// Template variable replacement
function processTemplate(templateContent, data) {
  const paths = utils.getObjectPaths(data);
  let processedContent = templateContent;
  
  paths.forEach(path => {
    const placeholder = `{${path}}`;
    const value = getNestedValue(data, path);
    
    if (typeof value === 'string') {
      // Escape XML entities for safe template processing
      const safeValue = utils.escapeXMLEntities(value);
      processedContent = processedContent.replace(
        new RegExp(utils.escapeRegex(placeholder), 'g'),
        safeValue
      );
    }
  });
  
  return processedContent;
}
```

### Finding Numbering System
```javascript
// Generate finding identifiers
function generateFindingIdentifiers(findings) {
  return findings.map((finding, index) => ({
    ...finding,
    identifier: utils.lPad(index + 1),
    displayId: `F-${utils.lPad(index + 1)}`
  }));
}

const findings = [
  { title: "SQL Injection", severity: "High" },
  { title: "XSS Vulnerability", severity: "Medium" }
];

const numberedFindings = generateFindingIdentifiers(findings);
// [
//   { title: "SQL Injection", severity: "High", identifier: "001", displayId: "F-001" },
//   { title: "XSS Vulnerability", severity: "Medium", identifier: "002", displayId: "F-002" }
// ]
```

---

## Integration

### Template Engine Integration
```javascript
// Template processing with utilities
const templateProcessor = {
  process: (template, data) => {
    // Get available variables
    const availableVars = utils.getObjectPaths(data);
    
    // Process template variables
    let content = template;
    availableVars.forEach(path => {
      const value = getNestedValue(data, path);
      const placeholder = `{${path}}`;
      
      if (typeof value === 'string') {
        content = content.replace(
          new RegExp(utils.escapeRegex(placeholder), 'g'),
          utils.escapeXMLEntities(value)
        );
      }
    });
    
    return content;
  }
};
```

### Real-time Collaboration
```javascript
// Socket.IO integration for collaborative editing
io.on('connection', (socket) => {
  socket.on('join_audit', (auditId) => {
    socket.join(`audit_${auditId}`);
    
    // Notify other users
    const connectedSockets = utils.getSockets(io, `audit_${auditId}`);
    connectedSockets.forEach(s => {
      if (s.id !== socket.id) {
        s.emit('user_joined', {
          userId: socket.userId,
          timestamp: new Date()
        });
      }
    });
  });
  
  socket.on('edit_finding', (data) => {
    const { auditId, findingId, content } = data;
    
    // Update finding
    updateFinding(findingId, content);
    
    // Notify collaborators
    const room = `audit_${auditId}`;
    const connectedSockets = utils.getSockets(io, room);
    connectedSockets.forEach(s => {
      if (s.id !== socket.id) {
        s.emit('finding_updated', {
          findingId,
          content,
          updatedBy: socket.userId
        });
      }
    });
  });
});
```

---

## Security Considerations

### Input Validation
```javascript
// Secure filename validation
function validateUploadedFile(filename, content) {
  // Validate filename
  if (!utils.validFilename(filename)) {
    throw new Error('Invalid filename contains forbidden characters');
  }
  
  // Validate extension
  const extension = filename.split('.').pop();
  if (!utils.validExtension(extension)) {
    throw new Error('Invalid file extension');
  }
  
  // Additional security checks
  if (filename.includes('..') || filename.includes('/')) {
    throw new Error('Path traversal attempt detected');
  }
  
  return true;
}
```

### XML Injection Prevention
```javascript
// Safe XML processing
function safeXMLProcessing(userInput) {
  // Always escape user input when inserting into XML
  const escapedInput = utils.escapeXMLEntities(userInput);
  
  // Additional sanitization for specific contexts
  const sanitized = escapedInput
    .replace(/\x00/g, '') // Remove null bytes
    .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ''); // Remove control characters
  
  return sanitized;
}
```

### UUID Security
```javascript
// Secure session management
function createSecureSession(userId) {
  const sessionId = utils.generateUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
  return {
    sessionId,
    userId,
    expiresAt,
    isValid: () => new Date() < expiresAt
  };
}
```

---

## Performance Considerations

### Efficient Object Path Extraction
```javascript
// Optimized for large objects
function getObjectPathsOptimized(obj, prefix = '', cache = new Map()) {
  const cacheKey = `${prefix}${JSON.stringify(obj)}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  
  const paths = utils.getObjectPaths(obj, prefix);
  cache.set(cacheKey, paths);
  
  return paths;
}
```

### Socket Management Optimization
```javascript
// Efficient socket filtering
function getSocketsByRoom(io, room) {
  // Use Set for O(1) lookup instead of forEach
  const roomSockets = io.sockets.adapter.rooms.get(room);
  if (!roomSockets) return [];
  
  return Array.from(roomSockets).map(socketId => 
    io.sockets.sockets.get(socketId)
  ).filter(Boolean);
}
```

---

## Error Handling

### Robust Utility Functions
```javascript
// Enhanced error handling
const safeUtils = {
  validFilename: (filename) => {
    try {
      return typeof filename === 'string' && utils.validFilename(filename);
    } catch (error) {
      console.error('Filename validation error:', error);
      return false;
    }
  },
  
  escapeXMLEntities: (input) => {
    try {
      return typeof input === 'string' ? utils.escapeXMLEntities(input) : '';
    } catch (error) {
      console.error('XML escaping error:', error);
      return '';
    }
  },
  
  getObjectPaths: (obj) => {
    try {
      return typeof obj === 'object' && obj !== null ? utils.getObjectPaths(obj) : [];
    } catch (error) {
      console.error('Object path extraction error:', error);
      return [];
    }
  }
};
```

---

## Testing

### Unit Tests
```javascript
const utils = require('./lib/utils');

describe('Utils Library Tests', () => {
  describe('validFilename', () => {
    it('should accept valid filenames', () => {
      expect(utils.validFilename('Report_Template')).toBe(true);
      expect(utils.validFilename('Audit [2024]')).toBe(true);
      expect(utils.validFilename("Template's Name")).toBe(true);
    });
    
    it('should reject invalid filenames', () => {
      expect(utils.validFilename('Invalid<>File')).toBe(false);
      expect(utils.validFilename('Bad/Path')).toBe(false);
    });
  });
  
  describe('lPad', () => {
    it('should pad numbers correctly', () => {
      expect(utils.lPad(1)).toBe('001');
      expect(utils.lPad(25)).toBe('025');
      expect(utils.lPad(100)).toBe('100');
    });
  });
  
  describe('escapeXMLEntities', () => {
    it('should escape XML entities', () => {
      expect(utils.escapeXMLEntities('<test>')).toBe('&lt;test&gt;');
      expect(utils.escapeXMLEntities('A & B')).toBe('A &amp; B');
    });
  });
});
```

---

This utilities library provides essential helper functions for pwndoc-ng, supporting secure file handling, XML processing, string manipulation, object analysis, and real-time collaboration features. 