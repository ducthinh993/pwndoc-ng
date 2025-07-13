# Template Model Documentation

## Overview

The `backend/src/models/template.js` file defines the Template model for pwndoc-ng's document template management system. This model handles the storage, retrieval, and management of document templates used for generating audit reports, providing functionality for template upload, customization, and version control.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Static Methods](#static-methods)
3. [Usage Examples](#usage-examples)
4. [Integration](#integration)
5. [Template Processing](#template-processing)
6. [File Handling](#file-handling)
7. [Security Considerations](#security-considerations)
8. [Performance Considerations](#performance-considerations)

---

## Schema Definition

### TemplateSchema Structure
```javascript
var TemplateSchema = new Schema({
    name:      {type: String, required: true, unique: true},
    ext:      {type: String, required: true, unique: false}
}, {timestamps: true});
```

### Fields

#### name
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Description**: Human-readable name for the template
- **Purpose**: Identifies the template for users and provides a friendly display name
- **Example**: "Standard Security Audit Report"

#### ext
- **Type**: String
- **Required**: Yes
- **Unique**: No
- **Description**: File extension of the template (typically "docx")
- **Purpose**: Indicates the template file format and processing method
- **Example**: "docx"

### Timestamps
- **createdAt**: Automatically generated creation timestamp
- **updatedAt**: Automatically generated last update timestamp

### Example Document
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Standard Security Audit Report",
  "ext": "docx",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Static Methods

### getAll()
```javascript
TemplateSchema.statics.getAll = () => Promise<Array>
```

**Purpose**: Retrieves all templates from the database.

**Returns**: Promise resolving to array of template objects with `name` and `ext` fields.

**Response Format**:
```javascript
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Standard Security Audit Report",
    "ext": "docx"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Penetration Testing Report",
    "ext": "docx"
  }
]
```

**Usage Example**:
```javascript
const Template = require('./models/template');

Template.getAll()
  .then(templates => {
    console.log('Available templates:', templates);
    templates.forEach(template => {
      console.log(`${template.name} (${template.ext})`);
    });
  })
  .catch(error => {
    console.error('Error fetching templates:', error);
  });
```

### getOne()
```javascript
TemplateSchema.statics.getOne = (templateId) => Promise<Object>
```

**Purpose**: Retrieves a single template by its ID.

**Parameters**:
- `templateId` (String): MongoDB ObjectId of the template to retrieve

**Returns**: Promise resolving to template object with `name` and `ext` fields.

**Usage Example**:
```javascript
Template.getOne('507f1f77bcf86cd799439011')
  .then(template => {
    console.log('Template found:', template);
    console.log('Name:', template.name);
    console.log('Extension:', template.ext);
  })
  .catch(error => {
    console.error('Error retrieving template:', error);
  });
```

### create()
```javascript
TemplateSchema.statics.create = (template) => Promise<Object>
```

**Purpose**: Creates a new template.

**Parameters**:
- `template` (Object): Template object containing `name` and `ext` fields

**Returns**: Promise resolving to object with `_id`, `name`, and `ext` fields.

**Error Handling**: Rejects with `BadParameters` error if template name already exists.

**Usage Example**:
```javascript
const newTemplate = {
  name: "Custom Audit Report",
  ext: "docx"
};

Template.create(newTemplate)
  .then(template => {
    console.log('Template created:', template);
    console.log('ID:', template._id);
  })
  .catch(error => {
    if (error.fn === 'BadParameters') {
      console.error('Template name already exists');
    } else {
      console.error('Error creating template:', error);
    }
  });
```

### update()
```javascript
TemplateSchema.statics.update = (templateId, template) => Promise<Object>
```

**Purpose**: Updates an existing template.

**Parameters**:
- `templateId` (String): MongoDB ObjectId of the template to update
- `template` (Object): Updated template data

**Returns**: Promise resolving to the updated template document.

**Error Handling**: 
- Rejects with `NotFound` error if template doesn't exist
- Rejects with `BadParameters` error if new name conflicts with existing template

**Usage Example**:
```javascript
const updates = {
  name: "Updated Security Audit Report"
};

Template.update('507f1f77bcf86cd799439011', updates)
  .then(updatedTemplate => {
    console.log('Template updated:', updatedTemplate);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Template not found');
    } else if (error.fn === 'BadParameters') {
      console.error('Template name already exists');
    } else {
      console.error('Error updating template:', error);
    }
  });
```

### delete()
```javascript
TemplateSchema.statics.delete = (templateId) => Promise<Object>
```

**Purpose**: Deletes a template by its ID.

**Parameters**:
- `templateId` (String): MongoDB ObjectId of the template to delete

**Returns**: Promise resolving to the deleted template document.

**Error Handling**: Rejects with `NotFound` error if template doesn't exist.

**Usage Example**:
```javascript
Template.delete('507f1f77bcf86cd799439011')
  .then(deletedTemplate => {
    console.log('Template deleted:', deletedTemplate.name);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Template not found');
    } else {
      console.error('Error deleting template:', error);
    }
  });
```

---

## Usage Examples

### API Route Integration
```javascript
const Template = require('./models/template');
const Response = require('./lib/httpResponse');
const multer = require('multer');
const fs = require('fs');

// Configure multer for template uploads
const templateUpload = multer({
  dest: './uploads/templates/',
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only DOCX files
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only DOCX files are allowed'), false);
    }
  }
});

// Get all templates
app.get('/api/templates', async (req, res) => {
  try {
    const templates = await Template.getAll();
    Response.Ok(res, templates);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Get single template
app.get('/api/templates/:id', async (req, res) => {
  try {
    const template = await Template.getOne(req.params.id);
    if (!template) {
      return Response.NotFound(res, 'Template not found');
    }
    Response.Ok(res, template);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Upload new template
app.post('/api/templates', templateUpload.single('template'), async (req, res) => {
  try {
    if (!req.file) {
      return Response.BadRequest(res, 'No template file provided');
    }
    
    const { name } = req.body;
    if (!name) {
      return Response.BadRequest(res, 'Template name is required');
    }
    
    // Create template record
    const template = await Template.create({
      name: name,
      ext: 'docx'
    });
    
    // Move uploaded file to permanent location
    const templatePath = `./templates/${template._id}.docx`;
    await fs.promises.rename(req.file.path, templatePath);
    
    Response.Created(res, template);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Update template
app.put('/api/templates/:id', async (req, res) => {
  try {
    const updatedTemplate = await Template.update(req.params.id, req.body);
    Response.Ok(res, updatedTemplate);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Delete template
app.delete('/api/templates/:id', async (req, res) => {
  try {
    const deletedTemplate = await Template.delete(req.params.id);
    
    // Clean up template file
    const templatePath = `./templates/${req.params.id}.docx`;
    try {
      await fs.promises.unlink(templatePath);
    } catch (fileError) {
      console.error('Error deleting template file:', fileError);
    }
    
    Response.Ok(res, { message: 'Template deleted', template: deletedTemplate });
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

### Template Management Service
```javascript
const fs = require('fs');
const path = require('path');

class TemplateService {
  constructor() {
    this.templatesDir = './templates';
    this.ensureTemplatesDirectory();
  }
  
  ensureTemplatesDirectory() {
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }
  }
  
  async getAllTemplates() {
    const templates = await Template.getAll();
    return templates.map(template => ({
      ...template.toObject(),
      filePath: this.getTemplatePath(template._id),
      exists: this.templateFileExists(template._id)
    }));
  }
  
  async createTemplate(templateData, fileBuffer) {
    // Create database record
    const template = await Template.create(templateData);
    
    // Save file
    const filePath = this.getTemplatePath(template._id);
    await fs.promises.writeFile(filePath, fileBuffer);
    
    return template;
  }
  
  async updateTemplate(templateId, updates, fileBuffer = null) {
    // Update database record
    const template = await Template.update(templateId, updates);
    
    // Update file if provided
    if (fileBuffer) {
      const filePath = this.getTemplatePath(templateId);
      await fs.promises.writeFile(filePath, fileBuffer);
    }
    
    return template;
  }
  
  async deleteTemplate(templateId) {
    // Delete database record
    const template = await Template.delete(templateId);
    
    // Delete file
    const filePath = this.getTemplatePath(templateId);
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error('Error deleting template file:', error);
    }
    
    return template;
  }
  
  getTemplatePath(templateId) {
    return path.join(this.templatesDir, `${templateId}.docx`);
  }
  
  templateFileExists(templateId) {
    return fs.existsSync(this.getTemplatePath(templateId));
  }
  
  async getTemplateBuffer(templateId) {
    const filePath = this.getTemplatePath(templateId);
    return await fs.promises.readFile(filePath);
  }
}

const templateService = new TemplateService();
module.exports = templateService;
```

---

## Integration

### Report Generation Integration
```javascript
const reportGenerator = require('./lib/report-generator');

// Generate report using template
async function generateReport(auditId, templateId) {
  try {
    // Get template information
    const template = await Template.getOne(templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Get audit data
    const audit = await Audit.findById(auditId);
    if (!audit) {
      throw new Error('Audit not found');
    }
    
    // Generate report
    const report = await reportGenerator.generate(audit, template);
    
    return {
      filename: `${audit.name}_report.${template.ext}`,
      buffer: report
    };
  } catch (error) {
    throw error;
  }
}
```

### Audit Model Integration
```javascript
// In audit.js model
const Template = require('./template');

// Validate template exists before creating audit
AuditSchema.pre('save', async function() {
  if (this.template) {
    try {
      const template = await Template.getOne(this.template);
      if (!template) {
        throw new Error('Selected template does not exist');
      }
    } catch (error) {
      throw new Error('Invalid template selection');
    }
  }
});

// Add method to get audit with template details
AuditSchema.methods.getWithTemplate = async function() {
  const auditData = this.toObject();
  
  if (this.template) {
    try {
      const template = await Template.getOne(this.template);
      auditData.templateDetails = template;
    } catch (error) {
      auditData.templateDetails = null;
    }
  }
  
  return auditData;
};
```

### File Upload Validation
```javascript
const utils = require('./lib/utils');

// Validate template uploads
function validateTemplateUpload(req, res, next) {
  const { name } = req.body;
  const file = req.file;
  
  // Validate name
  if (!name || !utils.validFilename(name)) {
    return Response.BadParameters(res, 'Invalid template name');
  }
  
  // Validate file
  if (!file) {
    return Response.BadRequest(res, 'Template file is required');
  }
  
  // Validate file type
  if (file.mimetype !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    return Response.BadParameters(res, 'Only DOCX files are supported');
  }
  
  // Validate file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return Response.BadParameters(res, 'Template file size cannot exceed 10MB');
  }
  
  next();
}
```

---

## Template Processing

### Variable Replacement
```javascript
// Template variable processing
class TemplateProcessor {
  static async processTemplate(templateId, auditData) {
    // Get template file
    const templateBuffer = await templateService.getTemplateBuffer(templateId);
    
    // Process template variables
    const processedTemplate = await this.replaceVariables(templateBuffer, auditData);
    
    return processedTemplate;
  }
  
  static async replaceVariables(templateBuffer, data) {
    // Implementation depends on template engine
    // This is a simplified example
    
    let templateContent = templateBuffer.toString();
    
    // Replace simple variables
    Object.keys(data).forEach(key => {
      const placeholder = `{${key}}`;
      const value = data[key] || '';
      templateContent = templateContent.replace(new RegExp(placeholder, 'g'), value);
    });
    
    return Buffer.from(templateContent);
  }
  
  static getAvailableVariables(auditData) {
    const utils = require('./lib/utils');
    const paths = utils.getObjectPaths(auditData);
    
    return paths.map(path => ({
      variable: `{${path}}`,
      description: this.getVariableDescription(path),
      example: this.getVariableExample(path)
    }));
  }
  
  static getVariableDescription(path) {
    const descriptions = {
      'audit.name': 'Audit name or title',
      'audit.date': 'Audit date',
      'client.name': 'Client company name',
      'findings.length': 'Number of findings',
      // Add more descriptions as needed
    };
    
    return descriptions[path] || `Value from ${path}`;
  }
  
  static getVariableExample(path) {
    const examples = {
      'audit.name': 'Security Assessment 2024',
      'audit.date': '2024-01-15',
      'client.name': 'Example Corporation',
      'findings.length': '12',
      // Add more examples as needed
    };
    
    return examples[path] || 'Example value';
  }
}
```

### Template Validation
```javascript
// Validate template structure
async function validateTemplateStructure(templateId) {
  try {
    const templateBuffer = await templateService.getTemplateBuffer(templateId);
    
    // Basic DOCX validation
    const isValidDocx = templateBuffer.slice(0, 4).toString() === 'PK';
    if (!isValidDocx) {
      throw new Error('Invalid DOCX file format');
    }
    
    // Check for required elements
    const templateContent = templateBuffer.toString();
    const hasRequiredElements = templateContent.includes('document.xml');
    
    if (!hasRequiredElements) {
      throw new Error('Template missing required document structure');
    }
    
    return {
      valid: true,
      message: 'Template structure is valid'
    };
  } catch (error) {
    return {
      valid: false,
      message: error.message
    };
  }
}
```

---

## File Handling

### Template File Storage
```javascript
const path = require('path');
const fs = require('fs');

class TemplateFileManager {
  constructor() {
    this.baseDir = process.env.TEMPLATE_DIR || './templates';
    this.ensureDirectory();
  }
  
  ensureDirectory() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }
  
  getFilePath(templateId) {
    return path.join(this.baseDir, `${templateId}.docx`);
  }
  
  async saveFile(templateId, buffer) {
    const filePath = this.getFilePath(templateId);
    await fs.promises.writeFile(filePath, buffer);
    return filePath;
  }
  
  async getFile(templateId) {
    const filePath = this.getFilePath(templateId);
    return await fs.promises.readFile(filePath);
  }
  
  async deleteFile(templateId) {
    const filePath = this.getFilePath(templateId);
    try {
      await fs.promises.unlink(filePath);
      return true;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return false; // File doesn't exist
      }
      throw error;
    }
  }
  
  fileExists(templateId) {
    const filePath = this.getFilePath(templateId);
    return fs.existsSync(filePath);
  }
  
  async getFileStats(templateId) {
    const filePath = this.getFilePath(templateId);
    try {
      return await fs.promises.stat(filePath);
    } catch (error) {
      return null;
    }
  }
}
```

### Backup and Recovery
```javascript
// Template backup system
class TemplateBackup {
  constructor() {
    this.backupDir = './backups/templates';
    this.ensureBackupDirectory();
  }
  
  ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }
  
  async createBackup(templateId) {
    const originalPath = templateService.getTemplatePath(templateId);
    const backupName = `${templateId}_${Date.now()}.docx`;
    const backupPath = path.join(this.backupDir, backupName);
    
    await fs.promises.copyFile(originalPath, backupPath);
    
    return {
      backupPath,
      backupName,
      timestamp: new Date()
    };
  }
  
  async restoreBackup(templateId, backupName) {
    const backupPath = path.join(this.backupDir, backupName);
    const originalPath = templateService.getTemplatePath(templateId);
    
    await fs.promises.copyFile(backupPath, originalPath);
    
    return {
      restored: true,
      timestamp: new Date()
    };
  }
  
  async listBackups(templateId) {
    const files = await fs.promises.readdir(this.backupDir);
    const templateBackups = files.filter(file => file.startsWith(templateId));
    
    return templateBackups.map(file => ({
      name: file,
      path: path.join(this.backupDir, file),
      timestamp: this.extractTimestamp(file)
    }));
  }
  
  extractTimestamp(filename) {
    const match = filename.match(/_(\d+)\.docx$/);
    return match ? new Date(parseInt(match[1])) : null;
  }
}
```

---

## Security Considerations

### Access Control
```javascript
// Template access control middleware
async function checkTemplateAccess(req, res, next) {
  const templateId = req.params.id;
  
  // Check if user has template management permissions
  if (!req.user.permissions.includes('templates:manage')) {
    return Response.Forbidden(res, 'Insufficient permissions for template management');
  }
  
  // For specific operations, check template ownership or admin rights
  if (req.method === 'DELETE' && !req.user.permissions.includes('templates:delete')) {
    return Response.Forbidden(res, 'Insufficient permissions to delete templates');
  }
  
  next();
}
```

### Input Validation
```javascript
// Comprehensive template validation
function validateTemplateInput(req, res, next) {
  const { name, ext } = req.body;
  
  // Validate name
  if (!name || typeof name !== 'string') {
    return Response.BadParameters(res, 'Template name is required');
  }
  
  if (!utils.validFilename(name)) {
    return Response.BadParameters(res, 'Invalid template name');
  }
  
  if (name.length < 3 || name.length > 100) {
    return Response.BadParameters(res, 'Template name must be between 3 and 100 characters');
  }
  
  // Validate extension
  if (ext && !utils.validExtension(ext)) {
    return Response.BadParameters(res, 'Invalid file extension');
  }
  
  // Sanitize input
  req.body.name = name.trim();
  if (ext) {
    req.body.ext = ext.toLowerCase().trim();
  }
  
  next();
}
```

### File Security
```javascript
// Secure file handling
function secureFileHandling(req, res, next) {
  const file = req.file;
  
  if (file) {
    // Validate file type by content, not just extension
    const fileSignature = file.buffer.slice(0, 4);
    const isValidDocx = fileSignature.toString() === 'PK\x03\x04';
    
    if (!isValidDocx) {
      return Response.BadParameters(res, 'Invalid DOCX file format');
    }
    
    // Scan for malicious content (simplified example)
    const content = file.buffer.toString();
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /onload=/i,
      /onerror=/i
    ];
    
    const hasSuspiciousContent = suspiciousPatterns.some(pattern => 
      pattern.test(content)
    );
    
    if (hasSuspiciousContent) {
      return Response.BadParameters(res, 'File contains suspicious content');
    }
  }
  
  next();
}
```

---

## Performance Considerations

### Template Caching
```javascript
// Template caching strategy
class TemplateCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 30 * 60 * 1000; // 30 minutes
  }
  
  async getTemplate(templateId) {
    const cacheKey = `template_${templateId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.ttl) {
      return cached.data;
    }
    
    // Fetch from database
    const template = await Template.getOne(templateId);
    
    // Cache the result
    this.cache.set(cacheKey, {
      data: template,
      timestamp: Date.now()
    });
    
    return template;
  }
  
  invalidate(templateId) {
    this.cache.delete(`template_${templateId}`);
  }
  
  clear() {
    this.cache.clear();
  }
}

const templateCache = new TemplateCache();
```

### Database Optimization
```javascript
// Template schema indexes
TemplateSchema.index({ name: 1 });
TemplateSchema.index({ ext: 1 });
TemplateSchema.index({ createdAt: -1 });
```

---

## Testing

### Unit Tests
```javascript
const Template = require('./models/template');

describe('Template Model', () => {
  describe('getAll()', () => {
    it('should return all templates', async () => {
      const templates = await Template.getAll();
      expect(Array.isArray(templates)).toBe(true);
    });
  });
  
  describe('create()', () => {
    it('should create a new template', async () => {
      const templateData = {
        name: 'Test Template',
        ext: 'docx'
      };
      
      const template = await Template.create(templateData);
      expect(template).toHaveProperty('_id');
      expect(template.name).toBe(templateData.name);
      expect(template.ext).toBe(templateData.ext);
    });
    
    it('should reject duplicate template names', async () => {
      const templateData = {
        name: 'Duplicate Template',
        ext: 'docx'
      };
      
      await Template.create(templateData);
      
      await expect(Template.create(templateData)).rejects.toMatchObject({
        fn: 'BadParameters',
        message: 'Template name already exists'
      });
    });
  });
  
  describe('update()', () => {
    it('should update template', async () => {
      const template = await Template.create({
        name: 'Original Template',
        ext: 'docx'
      });
      
      const updates = { name: 'Updated Template' };
      const updated = await Template.update(template._id, updates);
      
      expect(updated.name).toBe(updates.name);
    });
    
    it('should reject non-existent template', async () => {
      await expect(Template.update('507f1f77bcf86cd799439999', { name: 'Test' }))
        .rejects.toMatchObject({
          fn: 'NotFound',
          message: 'Template not found'
        });
    });
  });
});
```

---

This Template model provides essential functionality for managing document templates in pwndoc-ng, enabling customizable report generation and template-based document creation for audit reports. 