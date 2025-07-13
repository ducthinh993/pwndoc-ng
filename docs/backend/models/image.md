# Image Model Documentation

## Overview

The `backend/src/models/image.js` file defines the Image model for pwndoc-ng's image management system. This model handles storage, retrieval, and management of images associated with audits, providing functionality for image uploads, references, and cleanup.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Static Methods](#static-methods)
3. [Usage Examples](#usage-examples)
4. [Integration](#integration)
5. [File Storage](#file-storage)
6. [Security Considerations](#security-considerations)
7. [Performance Considerations](#performance-considerations)

---

## Schema Definition

### ImageSchema Structure
```javascript
var ImageSchema = new Schema({
    auditId:    {type: Schema.Types.ObjectId, ref: 'Audit'},
    value:      {type: String, required: true, unique: true},
    name:       String
}, {timestamps: true})
```

### Fields

#### auditId
- **Type**: ObjectId
- **Reference**: 'Audit'
- **Required**: No
- **Description**: Reference to the audit this image belongs to
- **Purpose**: Associates images with specific audits for organization and access control

#### value
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Description**: The actual image data stored as a base64 encoded string or file path
- **Purpose**: Stores the image content or reference

#### name
- **Type**: String
- **Required**: No
- **Description**: Human-readable name or filename for the image
- **Purpose**: Provides a user-friendly identifier for the image

### Timestamps
- **createdAt**: Automatically generated creation timestamp
- **updatedAt**: Automatically generated last update timestamp

### Example Document
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "auditId": "507f1f77bcf86cd799439012",
  "value": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "name": "screenshot.png",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Static Methods

### getOne()
```javascript
ImageSchema.statics.getOne = (imageId) => Promise<Object>
```

**Purpose**: Retrieves a single image by its ID.

**Parameters**:
- `imageId` (String): MongoDB ObjectId of the image to retrieve

**Returns**: Promise resolving to image object with `auditId`, `value`, and `name` fields.

**Error Handling**: Rejects with `NotFound` error if image doesn't exist.

**Usage Example**:
```javascript
const Image = require('./models/image');

Image.getOne('507f1f77bcf86cd799439011')
  .then(image => {
    console.log('Image found:', image);
    console.log('Associated audit:', image.auditId);
    console.log('Image name:', image.name);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Image not found');
    } else {
      console.error('Error retrieving image:', error);
    }
  });
```

### create()
```javascript
ImageSchema.statics.create = (image) => Promise<Object>
```

**Purpose**: Creates a new image or returns existing image if duplicate value exists.

**Parameters**:
- `image` (Object): Image object containing `auditId`, `value`, and optional `name`

**Returns**: Promise resolving to object with `_id` field of created or existing image.

**Behavior**: 
- If image with same `value` exists, returns the existing image
- If image is new, creates and saves the new image
- Prevents duplicate image storage

**Usage Example**:
```javascript
const newImage = {
  auditId: '507f1f77bcf86cd799439012',
  value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  name: 'vulnerability-screenshot.png'
};

Image.create(newImage)
  .then(result => {
    console.log('Image created with ID:', result._id);
  })
  .catch(error => {
    console.error('Error creating image:', error);
  });
```

### delete()
```javascript
ImageSchema.statics.delete = (imageId) => Promise<Object>
```

**Purpose**: Deletes an image by its ID.

**Parameters**:
- `imageId` (String): MongoDB ObjectId of the image to delete

**Returns**: Promise resolving to the deleted image document.

**Error Handling**: Rejects with `NotFound` error if image doesn't exist.

**Usage Example**:
```javascript
Image.delete('507f1f77bcf86cd799439011')
  .then(deletedImage => {
    console.log('Image deleted:', deletedImage.name);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Image not found');
    } else {
      console.error('Error deleting image:', error);
    }
  });
```

---

## Usage Examples

### API Route Integration
```javascript
const Image = require('./models/image');
const Response = require('./lib/httpResponse');

// Get image
app.get('/api/images/:id', async (req, res) => {
  try {
    const image = await Image.getOne(req.params.id);
    
    // Send image data
    if (image.value.startsWith('data:image/')) {
      // Handle base64 encoded image
      const imageData = image.value.split(',')[1];
      const buffer = Buffer.from(imageData, 'base64');
      
      res.set({
        'Content-Type': 'image/png',
        'Content-Length': buffer.length,
        'Cache-Control': 'public, max-age=3600'
      });
      res.send(buffer);
    } else {
      Response.Ok(res, image);
    }
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Upload image
app.post('/api/images', async (req, res) => {
  try {
    const { auditId, value, name } = req.body;
    
    const image = await Image.create({
      auditId,
      value,
      name
    });
    
    Response.Created(res, image);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Delete image
app.delete('/api/images/:id', async (req, res) => {
  try {
    const deletedImage = await Image.delete(req.params.id);
    Response.Ok(res, { message: 'Image deleted', image: deletedImage });
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

### Image Upload Processing
```javascript
const multer = require('multer');
const sharp = require('sharp');

// Configure multer for image uploads
const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Process and store uploaded image
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return Response.BadRequest(res, 'No image file provided');
    }
    
    // Process image with sharp
    const processedImage = await sharp(req.file.buffer)
      .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
      .png()
      .toBuffer();
    
    // Convert to base64
    const base64Image = `data:image/png;base64,${processedImage.toString('base64')}`;
    
    // Save to database
    const image = await Image.create({
      auditId: req.body.auditId,
      value: base64Image,
      name: req.file.originalname
    });
    
    Response.Created(res, image);
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

---

## Integration

### Audit Model Integration
```javascript
// In audit.js model
const Image = require('./image');

// Clean up images when audit is deleted
AuditSchema.pre('remove', async function() {
  try {
    const images = await Image.find({ auditId: this._id });
    for (const image of images) {
      await Image.delete(image._id);
    }
  } catch (error) {
    console.error('Error cleaning up images:', error);
  }
});

// Get audit with images
AuditSchema.methods.getWithImages = async function() {
  const images = await Image.find({ auditId: this._id });
  return {
    ...this.toObject(),
    images
  };
};
```

### Rich Text Editor Integration
```javascript
// Handle image insertions in rich text content
class RichTextImageHandler {
  static async processImages(content, auditId) {
    const imageRegex = /<img[^>]*src="data:image\/[^;]+;base64,([^"]+)"[^>]*>/g;
    let match;
    const processedContent = content;
    
    while ((match = imageRegex.exec(content)) !== null) {
      const base64Data = match[1];
      const fullDataUrl = `data:image/png;base64,${base64Data}`;
      
      // Save image to database
      const image = await Image.create({
        auditId,
        value: fullDataUrl,
        name: `embedded-image-${Date.now()}.png`
      });
      
      // Replace with image reference
      processedContent = processedContent.replace(
        match[0],
        `<img src="/api/images/${image._id}" alt="Embedded image" />`
      );
    }
    
    return processedContent;
  }
}
```

### Report Generation Integration
```javascript
// Include images in report generation
const reportGenerator = require('./lib/report-generator');

async function generateReportWithImages(auditId) {
  const audit = await Audit.findById(auditId);
  const images = await Image.find({ auditId });
  
  // Process images for report
  const processedImages = images.map(image => ({
    id: image._id,
    name: image.name,
    data: image.value
  }));
  
  return reportGenerator.generate(audit, {
    images: processedImages
  });
}
```

---

## File Storage

### Storage Strategies

#### Database Storage (Current)
```javascript
// Store images as base64 in database
const imageData = {
  auditId: '507f1f77bcf86cd799439012',
  value: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
  name: 'screenshot.png'
};

// Advantages: Simple, atomic operations, backup included
// Disadvantages: Database size, memory usage, slower queries
```

#### File System Storage (Alternative)
```javascript
// Store images in file system with database references
const fs = require('fs');
const path = require('path');

class FileSystemImageStorage {
  static async store(imageBuffer, filename) {
    const storagePath = path.join(process.env.UPLOAD_DIR, 'images');
    const filePath = path.join(storagePath, filename);
    
    // Ensure directory exists
    await fs.promises.mkdir(storagePath, { recursive: true });
    
    // Write file
    await fs.promises.writeFile(filePath, imageBuffer);
    
    return {
      path: filePath,
      url: `/uploads/images/${filename}`
    };
  }
  
  static async delete(filePath) {
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
}
```

#### Cloud Storage Integration
```javascript
// AWS S3 integration example
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

class S3ImageStorage {
  static async upload(imageBuffer, filename, auditId) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: `images/${auditId}/${filename}`,
      Body: imageBuffer,
      ContentType: 'image/png',
      ACL: 'private'
    };
    
    const result = await s3.upload(params).promise();
    return {
      url: result.Location,
      key: result.Key
    };
  }
  
  static async delete(key) {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key
    };
    
    return await s3.deleteObject(params).promise();
  }
}
```

---

## Security Considerations

### Access Control
```javascript
// Middleware for image access control
async function checkImageAccess(req, res, next) {
  try {
    const image = await Image.getOne(req.params.id);
    
    if (image.auditId) {
      const audit = await Audit.findById(image.auditId);
      
      // Check if user has access to the audit
      if (!audit.collaborators.includes(req.user.id) && 
          audit.creator.toString() !== req.user.id) {
        return Response.Forbidden(res, 'Access denied to this image');
      }
    }
    
    req.image = image;
    next();
  } catch (error) {
    Response.Internal(res, error);
  }
}

// Apply to image routes
app.get('/api/images/:id', checkImageAccess, serveImage);
```

### Input Validation
```javascript
// Validate image uploads
function validateImageUpload(req, res, next) {
  const { auditId, value, name } = req.body;
  
  // Validate audit ID
  if (auditId && !mongoose.Types.ObjectId.isValid(auditId)) {
    return Response.BadParameters(res, 'Invalid audit ID');
  }
  
  // Validate image value
  if (!value || typeof value !== 'string') {
    return Response.BadParameters(res, 'Image value is required');
  }
  
  // Validate base64 image format
  if (!value.startsWith('data:image/')) {
    return Response.BadParameters(res, 'Invalid image format');
  }
  
  // Validate file size (base64 is ~33% larger than original)
  const base64Data = value.split(',')[1];
  const sizeInBytes = (base64Data.length * 3) / 4;
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (sizeInBytes > maxSize) {
    return Response.BadParameters(res, 'Image size exceeds 5MB limit');
  }
  
  next();
}
```

### Sanitization
```javascript
// Sanitize image metadata
function sanitizeImageMetadata(metadata) {
  const sanitized = {};
  
  if (metadata.name) {
    // Remove path characters and limit length
    sanitized.name = metadata.name
      .replace(/[/\\:*?"<>|]/g, '')
      .substring(0, 255);
  }
  
  if (metadata.auditId) {
    sanitized.auditId = metadata.auditId;
  }
  
  return sanitized;
}
```

---

## Performance Considerations

### Image Optimization
```javascript
const sharp = require('sharp');

// Optimize images before storage
async function optimizeImage(imageBuffer) {
  return await sharp(imageBuffer)
    .resize(1200, 800, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .png({ 
      quality: 80,
      compressionLevel: 9 
    })
    .toBuffer();
}
```

### Caching Strategy
```javascript
// Image caching middleware
const imageCache = new Map();

function cacheImage(req, res, next) {
  const imageId = req.params.id;
  
  if (imageCache.has(imageId)) {
    const cachedImage = imageCache.get(imageId);
    
    res.set({
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=3600',
      'ETag': cachedImage.etag
    });
    
    return res.send(cachedImage.buffer);
  }
  
  next();
}
```

### Database Optimization
```javascript
// Optimize image queries
ImageSchema.index({ auditId: 1 });
ImageSchema.index({ value: 1 });
ImageSchema.index({ createdAt: -1 });

// Efficient image cleanup
async function cleanupOrphanedImages() {
  const orphanedImages = await Image.aggregate([
    {
      $lookup: {
        from: 'audits',
        localField: 'auditId',
        foreignField: '_id',
        as: 'audit'
      }
    },
    {
      $match: {
        auditId: { $ne: null },
        audit: { $size: 0 }
      }
    }
  ]);
  
  for (const image of orphanedImages) {
    await Image.delete(image._id);
  }
}
```

---

## Testing

### Unit Tests
```javascript
const Image = require('./models/image');

describe('Image Model', () => {
  describe('getOne()', () => {
    it('should retrieve image by ID', async () => {
      const image = await Image.getOne('507f1f77bcf86cd799439011');
      expect(image).toHaveProperty('auditId');
      expect(image).toHaveProperty('value');
      expect(image).toHaveProperty('name');
    });
    
    it('should reject non-existent image', async () => {
      await expect(Image.getOne('507f1f77bcf86cd799439999'))
        .rejects.toMatchObject({
          fn: 'NotFound',
          message: 'Image not found'
        });
    });
  });
  
  describe('create()', () => {
    it('should create new image', async () => {
      const imageData = {
        auditId: '507f1f77bcf86cd799439012',
        value: 'data:image/png;base64,test',
        name: 'test.png'
      };
      
      const result = await Image.create(imageData);
      expect(result).toHaveProperty('_id');
    });
    
    it('should return existing image for duplicate value', async () => {
      const imageData = {
        value: 'data:image/png;base64,duplicate',
        name: 'duplicate.png'
      };
      
      const first = await Image.create(imageData);
      const second = await Image.create(imageData);
      
      expect(first._id).toEqual(second._id);
    });
  });
});
```

---

This Image model provides essential functionality for managing images in pwndoc-ng, supporting audit documentation with embedded images, screenshots, and visual evidence. 