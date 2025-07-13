# Company Model Documentation

## Overview

The `backend/src/models/company.js` file defines the Company model for pwndoc-ng's client company management system. This model handles the storage, retrieval, and management of company information, providing functionality for organizing audit clients, managing company details, and supporting bulk operations for data import/export.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Static Methods](#static-methods)
3. [Usage Examples](#usage-examples)
4. [Integration](#integration)
5. [Bulk Operations](#bulk-operations)
6. [Data Import/Export](#data-importexport)
7. [Validation](#validation)
8. [Performance Considerations](#performance-considerations)

---

## Schema Definition

### CompanySchema Structure
```javascript
var CompanySchema = new Schema({
    name: {type: String, required: true, unique: true},
    shortName: String,
    logo: String
}, {timestamps: true});
```

### Fields

#### name
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Description**: Full company name
- **Purpose**: Primary identifier and display name for the company
- **Example**: "Example Corporation Ltd."

#### shortName
- **Type**: String
- **Required**: No
- **Description**: Abbreviated or short version of the company name
- **Purpose**: Used for compact displays and references
- **Example**: "ExampleCorp"

#### logo
- **Type**: String
- **Required**: No
- **Description**: Company logo as base64 encoded string or file path
- **Purpose**: Visual branding for reports and documentation
- **Example**: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="

### Timestamps
- **createdAt**: Automatically generated creation timestamp
- **updatedAt**: Automatically generated last update timestamp

### Example Document
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Example Corporation Ltd.",
  "shortName": "ExampleCorp",
  "logo": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Static Methods

### getAll()
```javascript
CompanySchema.statics.getAll = () => Promise<Array>
```

**Purpose**: Retrieves all companies with their basic information.

**Returns**: Promise resolving to array of company objects with `name`, `shortName`, and `logo` fields.

**Response Format**:
```javascript
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Example Corporation Ltd.",
    "shortName": "ExampleCorp",
    "logo": "data:image/png;base64,..."
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Tech Solutions Inc.",
    "shortName": "TechSol",
    "logo": null
  }
]
```

**Usage Example**:
```javascript
const Company = require('./models/company');

Company.getAll()
  .then(companies => {
    console.log('Available companies:', companies);
    companies.forEach(company => {
      console.log(`${company.name} (${company.shortName || 'No short name'})`);
    });
  })
  .catch(error => {
    console.error('Error fetching companies:', error);
  });
```

### export()
```javascript
CompanySchema.statics.export = () => Promise<Array>
```

**Purpose**: Exports all companies for data backup or transfer (without `_id` field).

**Returns**: Promise resolving to array of company objects without MongoDB ObjectIds.

**Response Format**:
```javascript
[
  {
    "name": "Example Corporation Ltd.",
    "shortName": "ExampleCorp",
    "logo": "data:image/png;base64,..."
  },
  {
    "name": "Tech Solutions Inc.",
    "shortName": "TechSol",
    "logo": null
  }
]
```

**Usage Example**:
```javascript
Company.export()
  .then(companies => {
    console.log('Companies for export:', companies);
    // Save to file or send to external system
    fs.writeFileSync('companies_export.json', JSON.stringify(companies, null, 2));
  })
  .catch(error => {
    console.error('Error exporting companies:', error);
  });
```

### create()
```javascript
CompanySchema.statics.create = (companies) => Promise<Object>
```

**Purpose**: Creates multiple companies in a single operation with duplicate handling.

**Parameters**:
- `companies` (Array): Array of company objects to create

**Returns**: Promise resolving to object with creation statistics.

**Response Format**:
```javascript
{
  "created": 5,           // Number of successfully created companies
  "duplicates": 2         // Number of duplicates (or array of error messages)
}
```

**Error Handling**: 
- If all companies are duplicates: Rejects with `BadParameters` error
- If partial success: Returns statistics with duplicate information

**Usage Example**:
```javascript
const newCompanies = [
  {
    name: "New Company 1",
    shortName: "NewCo1",
    logo: null
  },
  {
    name: "New Company 2",
    shortName: "NewCo2",
    logo: "data:image/png;base64,..."
  }
];

Company.create(newCompanies)
  .then(result => {
    console.log(`Created ${result.created} companies`);
    if (result.duplicates > 0) {
      console.log(`${result.duplicates} duplicates found`);
    }
  })
  .catch(error => {
    if (error.fn === 'BadParameters') {
      console.error('All companies already exist');
    } else {
      console.error('Error creating companies:', error);
    }
  });
```

### update()
```javascript
CompanySchema.statics.update = (companyId, company) => Promise<Object>
```

**Purpose**: Updates an existing company.

**Parameters**:
- `companyId` (String): MongoDB ObjectId of the company to update
- `company` (Object): Updated company data

**Returns**: Promise resolving to the original company document (before update).

**Error Handling**:
- Rejects with `NotFound` error if company doesn't exist
- Rejects with `BadParameters` error if new name conflicts with existing company

**Usage Example**:
```javascript
const updates = {
  name: "Updated Company Name",
  shortName: "UpdatedCorp",
  logo: "data:image/png;base64,newlogo..."
};

Company.update('507f1f77bcf86cd799439011', updates)
  .then(originalCompany => {
    console.log('Company updated successfully');
    console.log('Original name:', originalCompany.name);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Company not found');
    } else if (error.fn === 'BadParameters') {
      console.error('Company name already exists');
    } else {
      console.error('Error updating company:', error);
    }
  });
```

### deleteAll()
```javascript
CompanySchema.statics.deleteAll = () => Promise<String>
```

**Purpose**: Deletes all companies from the database.

**Returns**: Promise resolving to success message.

**Usage Example**:
```javascript
Company.deleteAll()
  .then(message => {
    console.log(message); // "All companies deleted successfully"
  })
  .catch(error => {
    console.error('Error deleting all companies:', error);
  });
```

### delete()
```javascript
CompanySchema.statics.delete = (companyId) => Promise<Object>
```

**Purpose**: Deletes a single company by its ID.

**Parameters**:
- `companyId` (String): MongoDB ObjectId of the company to delete

**Returns**: Promise resolving to the deleted company document.

**Error Handling**: Rejects with `NotFound` error if company doesn't exist.

**Usage Example**:
```javascript
Company.delete('507f1f77bcf86cd799439011')
  .then(deletedCompany => {
    console.log('Company deleted:', deletedCompany.name);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Company not found');
    } else {
      console.error('Error deleting company:', error);
    }
  });
```

---

## Usage Examples

### API Route Integration
```javascript
const Company = require('./models/company');
const Response = require('./lib/httpResponse');

// Get all companies
app.get('/api/companies', async (req, res) => {
  try {
    const companies = await Company.getAll();
    Response.Ok(res, companies);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Create companies (bulk operation)
app.post('/api/companies', async (req, res) => {
  try {
    const companies = Array.isArray(req.body) ? req.body : [req.body];
    const result = await Company.create(companies);
    Response.Created(res, result);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Update company
app.put('/api/companies/:id', async (req, res) => {
  try {
    const updatedCompany = await Company.update(req.params.id, req.body);
    Response.Ok(res, updatedCompany);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Delete company
app.delete('/api/companies/:id', async (req, res) => {
  try {
    const deletedCompany = await Company.delete(req.params.id);
    Response.Ok(res, { message: 'Company deleted', company: deletedCompany });
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Export companies
app.get('/api/companies/export', async (req, res) => {
  try {
    const companies = await Company.export();
    Response.SendFile(res, 'companies_export.json', JSON.stringify(companies, null, 2));
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

### Company Management Service
```javascript
class CompanyService {
  static async getAllCompanies() {
    return await Company.getAll();
  }
  
  static async createCompany(companyData) {
    // Validate and sanitize input
    const sanitizedData = this.sanitizeCompanyData(companyData);
    
    // Create single company
    const result = await Company.create([sanitizedData]);
    
    if (result.created === 1) {
      return { success: true, message: 'Company created successfully' };
    } else {
      throw new Error('Failed to create company');
    }
  }
  
  static async updateCompany(companyId, updates) {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      throw new Error('Invalid company ID');
    }
    
    const sanitizedUpdates = this.sanitizeCompanyData(updates);
    return await Company.update(companyId, sanitizedUpdates);
  }
  
  static async deleteCompany(companyId) {
    // Check for associated clients before deletion
    const Client = require('./client');
    const associatedClients = await Client.find({ company: companyId });
    
    if (associatedClients.length > 0) {
      throw new Error('Cannot delete company with associated clients');
    }
    
    return await Company.delete(companyId);
  }
  
  static async importCompanies(companiesData) {
    // Validate and sanitize all companies
    const sanitizedCompanies = companiesData.map(company => 
      this.sanitizeCompanyData(company)
    );
    
    return await Company.create(sanitizedCompanies);
  }
  
  static sanitizeCompanyData(data) {
    const sanitized = {};
    
    if (data.name) {
      sanitized.name = data.name.toString().trim();
    }
    
    if (data.shortName) {
      sanitized.shortName = data.shortName.toString().trim();
    }
    
    if (data.logo) {
      sanitized.logo = data.logo.toString();
    }
    
    return sanitized;
  }
}

module.exports = CompanyService;
```

---

## Integration

### Client Model Integration
```javascript
// In client.js model
const Company = require('./company');

// Validate company exists before creating client
ClientSchema.pre('save', async function() {
  if (this.company) {
    try {
      const companies = await Company.getAll();
      const companyExists = companies.some(c => c._id.toString() === this.company.toString());
      
      if (!companyExists) {
        throw new Error('Selected company does not exist');
      }
    } catch (error) {
      throw new Error('Invalid company selection');
    }
  }
});

// Get clients with company details
ClientSchema.statics.getWithCompanyDetails = async function() {
  const clients = await this.find().populate('company', 'name shortName logo');
  return clients;
};
```

### Audit Model Integration
```javascript
// In audit.js model
const Company = require('./company');

// Add method to get audit with company details
AuditSchema.methods.getWithCompanyDetails = async function() {
  const auditData = this.toObject();
  
  if (this.client) {
    const Client = require('./client');
    const client = await Client.findById(this.client).populate('company');
    
    if (client && client.company) {
      auditData.companyDetails = {
        name: client.company.name,
        shortName: client.company.shortName,
        logo: client.company.logo
      };
    }
  }
  
  return auditData;
};
```

### Report Generation Integration
```javascript
// Include company information in reports
const reportGenerator = require('./lib/report-generator');

async function generateReportWithCompanyInfo(auditId) {
  const audit = await Audit.findById(auditId);
  
  if (audit.client) {
    const Client = require('./client');
    const client = await Client.findById(audit.client);
    
    if (client && client.company) {
      const company = await Company.getAll().then(companies => 
        companies.find(c => c._id.toString() === client.company.toString())
      );
      
      if (company) {
        audit.companyInfo = {
          name: company.name,
          shortName: company.shortName,
          logo: company.logo
        };
      }
    }
  }
  
  return reportGenerator.generate(audit);
}
```

---

## Bulk Operations

### Batch Company Creation
```javascript
// Efficient bulk company creation
async function createMultipleCompanies(companiesData) {
  try {
    // Validate all companies before creation
    const validatedCompanies = companiesData.map(company => {
      if (!company.name || !company.name.trim()) {
        throw new Error('Company name is required');
      }
      
      return {
        name: company.name.trim(),
        shortName: company.shortName ? company.shortName.trim() : null,
        logo: company.logo || null
      };
    });
    
    const result = await Company.create(validatedCompanies);
    
    return {
      success: true,
      created: result.created,
      duplicates: result.duplicates,
      total: companiesData.length
    };
  } catch (error) {
    throw error;
  }
}
```

### Batch Updates
```javascript
// Update multiple companies
async function updateMultipleCompanies(updates) {
  const results = [];
  
  for (const update of updates) {
    try {
      const result = await Company.update(update.id, update.data);
      results.push({ id: update.id, success: true, data: result });
    } catch (error) {
      results.push({ id: update.id, success: false, error: error.message });
    }
  }
  
  return results;
}
```

---

## Data Import/Export

### CSV Import
```javascript
const csv = require('csv-parser');
const fs = require('fs');

async function importCompaniesFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const companies = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        companies.push({
          name: row.name,
          shortName: row.shortName || null,
          logo: row.logo || null
        });
      })
      .on('end', async () => {
        try {
          const result = await Company.create(companies);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}
```

### JSON Export
```javascript
// Export companies to JSON
async function exportCompaniesToJSON(filePath) {
  try {
    const companies = await Company.export();
    
    const exportData = {
      exportDate: new Date().toISOString(),
      totalCompanies: companies.length,
      companies: companies
    };
    
    fs.writeFileSync(filePath, JSON.stringify(exportData, null, 2));
    
    return {
      success: true,
      exportedCount: companies.length,
      filePath: filePath
    };
  } catch (error) {
    throw error;
  }
}
```

---

## Validation

### Input Validation
```javascript
// Company validation middleware
function validateCompanyInput(req, res, next) {
  const { name, shortName, logo } = req.body;
  
  // Validate name
  if (!name || typeof name !== 'string' || !name.trim()) {
    return Response.BadParameters(res, 'Company name is required');
  }
  
  if (name.length > 200) {
    return Response.BadParameters(res, 'Company name cannot exceed 200 characters');
  }
  
  // Validate short name
  if (shortName && typeof shortName !== 'string') {
    return Response.BadParameters(res, 'Short name must be a string');
  }
  
  if (shortName && shortName.length > 50) {
    return Response.BadParameters(res, 'Short name cannot exceed 50 characters');
  }
  
  // Validate logo
  if (logo && typeof logo !== 'string') {
    return Response.BadParameters(res, 'Logo must be a string');
  }
  
  if (logo && !logo.startsWith('data:image/')) {
    return Response.BadParameters(res, 'Logo must be a valid base64 image');
  }
  
  // Sanitize inputs
  req.body.name = name.trim();
  if (shortName) req.body.shortName = shortName.trim();
  
  next();
}
```

### Schema Validation
```javascript
// Enhanced schema with validation
var CompanySchema = new Schema({
    name: {
        type: String,
        required: [true, 'Company name is required'],
        unique: true,
        trim: true,
        minlength: [2, 'Company name must be at least 2 characters'],
        maxlength: [200, 'Company name cannot exceed 200 characters']
    },
    shortName: {
        type: String,
        trim: true,
        maxlength: [50, 'Short name cannot exceed 50 characters']
    },
    logo: {
        type: String,
        validate: {
            validator: function(v) {
                return !v || v.startsWith('data:image/');
            },
            message: 'Logo must be a valid base64 image'
        }
    }
}, {
    timestamps: true
});
```

---

## Performance Considerations

### Database Optimization
```javascript
// Add indexes for performance
CompanySchema.index({ name: 1 });
CompanySchema.index({ shortName: 1 });
CompanySchema.index({ createdAt: -1 });
```

### Caching Strategy
```javascript
// Company cache for frequently accessed data
class CompanyCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 10 * 60 * 1000; // 10 minutes
  }
  
  async getCompanies() {
    const now = Date.now();
    const cached = this.cache.get('companies');
    
    if (cached && (now - cached.timestamp) < this.ttl) {
      return cached.data;
    }
    
    const companies = await Company.getAll();
    this.cache.set('companies', {
      data: companies,
      timestamp: now
    });
    
    return companies;
  }
  
  invalidate() {
    this.cache.delete('companies');
  }
}

const companyCache = new CompanyCache();
```

### Bulk Operation Optimization
```javascript
// Optimized bulk insert with validation
async function optimizedBulkInsert(companiesData) {
  // Pre-validate all data
  const validatedData = companiesData.map(company => {
    if (!company.name) throw new Error('Company name is required');
    return {
      name: company.name.trim(),
      shortName: company.shortName ? company.shortName.trim() : null,
      logo: company.logo || null
    };
  });
  
  // Use MongoDB bulk operations
  const bulkOps = validatedData.map(company => ({
    insertOne: {
      document: company
    }
  }));
  
  return await Company.bulkWrite(bulkOps, { ordered: false });
}
```

---

## Testing

### Unit Tests
```javascript
const Company = require('./models/company');

describe('Company Model', () => {
  describe('getAll()', () => {
    it('should return all companies', async () => {
      const companies = await Company.getAll();
      expect(Array.isArray(companies)).toBe(true);
    });
  });
  
  describe('create()', () => {
    it('should create multiple companies', async () => {
      const companiesData = [
        { name: 'Test Company 1', shortName: 'TC1' },
        { name: 'Test Company 2', shortName: 'TC2' }
      ];
      
      const result = await Company.create(companiesData);
      expect(result.created).toBe(2);
      expect(result.duplicates).toBe(0);
    });
    
    it('should handle duplicate company names', async () => {
      const companiesData = [
        { name: 'Duplicate Company', shortName: 'DC1' },
        { name: 'Duplicate Company', shortName: 'DC2' }
      ];
      
      const result = await Company.create(companiesData);
      expect(result.created).toBe(1);
      expect(result.duplicates).toBeGreaterThan(0);
    });
  });
  
  describe('update()', () => {
    it('should update company', async () => {
      const company = await Company.create([{ name: 'Original Company' }]);
      const companyId = company._id;
      
      const updates = { name: 'Updated Company' };
      const result = await Company.update(companyId, updates);
      
      expect(result.name).toBe('Original Company'); // Returns original document
    });
  });
  
  describe('delete()', () => {
    it('should delete company', async () => {
      const company = await Company.create([{ name: 'To Delete' }]);
      const companyId = company._id;
      
      const result = await Company.delete(companyId);
      expect(result.name).toBe('To Delete');
    });
  });
});
```

---

This Company model provides essential functionality for managing client companies in pwndoc-ng, supporting organizational structure, branding, and efficient data management for audit workflows. 