# Client Model Documentation

## Overview

The `backend/src/models/client.js` file defines the Client model for pwndoc-ng's client contact management system. This model handles the storage, retrieval, and management of client contact information, providing functionality for organizing client contacts, linking them to companies, and supporting bulk operations for data import/export.

## Table of Contents

1. [Schema Definition](#schema-definition)
2. [Static Methods](#static-methods)
3. [Usage Examples](#usage-examples)
4. [Integration](#integration)
5. [Company Integration](#company-integration)
6. [Bulk Operations](#bulk-operations)
7. [Data Import/Export](#data-importexport)
8. [Validation](#validation)
9. [Performance Considerations](#performance-considerations)

---

## Schema Definition

### ClientSchema Structure
```javascript
var ClientSchema = new Schema({
    email:      {type: String, required: true, unique: true},
    company:    {type: Schema.Types.ObjectId, ref: 'Company'},
    lastname:   String,
    firstname:  String,
    phone:      String,
    cell:       String,
    title:      String
}, {timestamps: true});
```

### Fields

#### email
- **Type**: String
- **Required**: Yes
- **Unique**: Yes
- **Description**: Primary contact email address
- **Purpose**: Unique identifier and primary communication channel
- **Example**: "john.doe@example.com"

#### company
- **Type**: ObjectId
- **Reference**: 'Company'
- **Required**: No
- **Description**: Reference to the company this client belongs to
- **Purpose**: Links client to their organization for audit context
- **Example**: "507f1f77bcf86cd799439011"

#### lastname
- **Type**: String
- **Required**: No
- **Description**: Client's last name/surname
- **Purpose**: Personal identification and formal communication
- **Example**: "Doe"

#### firstname
- **Type**: String
- **Required**: No
- **Description**: Client's first name/given name
- **Purpose**: Personal identification and informal communication
- **Example**: "John"

#### phone
- **Type**: String
- **Required**: No
- **Description**: Primary phone number
- **Purpose**: Voice communication channel
- **Example**: "+1-555-123-4567"

#### cell
- **Type**: String
- **Required**: No
- **Description**: Mobile/cell phone number
- **Purpose**: Mobile communication channel
- **Example**: "+1-555-987-6543"

#### title
- **Type**: String
- **Required**: No
- **Description**: Job title or position within the company
- **Purpose**: Professional context and hierarchy understanding
- **Example**: "Chief Technology Officer"

### Timestamps
- **createdAt**: Automatically generated creation timestamp
- **updatedAt**: Automatically generated last update timestamp

### Example Document
```javascript
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "john.doe@example.com",
  "company": "507f1f77bcf86cd799439012",
  "lastname": "Doe",
  "firstname": "John",
  "phone": "+1-555-123-4567",
  "cell": "+1-555-987-6543",
  "title": "Chief Technology Officer",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Static Methods

### getAll()
```javascript
ClientSchema.statics.getAll = () => Promise<Array>
```

**Purpose**: Retrieves all clients with their company information populated.

**Returns**: Promise resolving to array of client objects with populated company names.

**Response Format**:
```javascript
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "email": "john.doe@example.com",
    "lastname": "Doe",
    "firstname": "John",
    "phone": "+1-555-123-4567",
    "cell": "+1-555-987-6543",
    "title": "Chief Technology Officer",
    "company": {
      "name": "Example Corporation Ltd."
    }
  }
]
```

**Usage Example**:
```javascript
const Client = require('./models/client');

Client.getAll()
  .then(clients => {
    console.log('Available clients:', clients);
    clients.forEach(client => {
      console.log(`${client.firstname} ${client.lastname} (${client.email})`);
      if (client.company) {
        console.log(`  Company: ${client.company.name}`);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching clients:', error);
  });
```

### export()
```javascript
ClientSchema.statics.export = () => Promise<Array>
```

**Purpose**: Exports all clients for data backup or transfer (without MongoDB ObjectIds).

**Returns**: Promise resolving to array of client objects without `_id` fields.

**Response Format**:
```javascript
[
  {
    "email": "john.doe@example.com",
    "lastname": "Doe",
    "firstname": "John",
    "phone": "+1-555-123-4567",
    "cell": "+1-555-987-6543",
    "title": "Chief Technology Officer"
  }
]
```

**Usage Example**:
```javascript
Client.export()
  .then(clients => {
    console.log('Clients for export:', clients);
    // Save to file or send to external system
    fs.writeFileSync('clients_export.json', JSON.stringify(clients, null, 2));
  })
  .catch(error => {
    console.error('Error exporting clients:', error);
  });
```

### create()
```javascript
ClientSchema.statics.create = (clients) => Promise<Object>
```

**Purpose**: Creates multiple clients with automatic company creation/linking.

**Parameters**:
- `clients` (Array): Array of client data, where each element is `[clientData, companyName]`

**Format**:
```javascript
[
  [
    {
      email: "john.doe@example.com",
      lastname: "Doe",
      firstname: "John",
      phone: "+1-555-123-4567",
      title: "CTO"
    },
    "Example Corporation Ltd."  // Company name (optional)
  ]
]
```

**Returns**: Promise resolving to object with creation statistics.

**Response Format**:
```javascript
{
  "created": 3,           // Number of successfully created clients
  "duplicates": 1         // Number of duplicates (or array of error messages)
}
```

**Features**:
- Automatic company creation if company name is provided
- Automatic company linking using upsert operations
- Bulk insertion with duplicate handling

**Usage Example**:
```javascript
const newClients = [
  [
    {
      email: "jane.smith@techcorp.com",
      lastname: "Smith",
      firstname: "Jane",
      title: "CEO"
    },
    "Tech Corporation"
  ],
  [
    {
      email: "bob.johnson@example.com",
      lastname: "Johnson",
      firstname: "Bob",
      title: "IT Manager"
    },
    "Example Corporation Ltd."
  ]
];

Client.create(newClients)
  .then(result => {
    console.log(`Created ${result.created} clients`);
    if (result.duplicates > 0) {
      console.log(`${result.duplicates} duplicates found`);
    }
  })
  .catch(error => {
    if (error.fn === 'BadParameters') {
      console.error('All clients already exist');
    } else {
      console.error('Error creating clients:', error);
    }
  });
```

### update()
```javascript
ClientSchema.statics.update = (clientId, client, company) => Promise<Object>
```

**Purpose**: Updates an existing client with optional company creation/linking.

**Parameters**:
- `clientId` (String): MongoDB ObjectId of the client to update
- `client` (Object): Updated client data
- `company` (String, optional): Company name to link to client

**Returns**: Promise resolving to the original client document (before update).

**Features**:
- Automatic company creation if company name is provided
- Company linking using upsert operations
- Preserves existing company link if no company provided

**Usage Example**:
```javascript
const updates = {
  email: "john.doe.updated@example.com",
  title: "Senior Technology Officer",
  phone: "+1-555-999-8888"
};

Client.update('507f1f77bcf86cd799439011', updates, "New Company Name")
  .then(originalClient => {
    console.log('Client updated successfully');
    console.log('Original email:', originalClient.email);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Client not found');
    } else if (error.fn === 'BadParameters') {
      console.error('Client email already exists');
    } else {
      console.error('Error updating client:', error);
    }
  });
```

### deleteAll()
```javascript
ClientSchema.statics.deleteAll = () => Promise<String>
```

**Purpose**: Deletes all clients from the database.

**Returns**: Promise resolving to success message.

**Usage Example**:
```javascript
Client.deleteAll()
  .then(message => {
    console.log(message); // "All clients deleted successfully"
  })
  .catch(error => {
    console.error('Error deleting all clients:', error);
  });
```

### delete()
```javascript
ClientSchema.statics.delete = (clientId) => Promise<Object>
```

**Purpose**: Deletes a single client by its ID.

**Parameters**:
- `clientId` (String): MongoDB ObjectId of the client to delete

**Returns**: Promise resolving to the deleted client document.

**Error Handling**: Rejects with `NotFound` error if client doesn't exist.

**Usage Example**:
```javascript
Client.delete('507f1f77bcf86cd799439011')
  .then(deletedClient => {
    console.log('Client deleted:', deletedClient.email);
  })
  .catch(error => {
    if (error.fn === 'NotFound') {
      console.error('Client not found');
    } else {
      console.error('Error deleting client:', error);
    }
  });
```

---

## Usage Examples

### API Route Integration
```javascript
const Client = require('./models/client');
const Response = require('./lib/httpResponse');

// Get all clients
app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.getAll();
    Response.Ok(res, clients);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Create clients (bulk operation)
app.post('/api/clients', async (req, res) => {
  try {
    // Convert single client to array format
    let clientsData = req.body;
    if (!Array.isArray(clientsData)) {
      clientsData = [[clientsData, clientsData.companyName]];
    }
    
    const result = await Client.create(clientsData);
    Response.Created(res, result);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    const { companyName, ...clientData } = req.body;
    const updatedClient = await Client.update(req.params.id, clientData, companyName);
    Response.Ok(res, updatedClient);
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Delete client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    const deletedClient = await Client.delete(req.params.id);
    Response.Ok(res, { message: 'Client deleted', client: deletedClient });
  } catch (error) {
    Response.Internal(res, error);
  }
});

// Export clients
app.get('/api/clients/export', async (req, res) => {
  try {
    const clients = await Client.export();
    Response.SendFile(res, 'clients_export.json', JSON.stringify(clients, null, 2));
  } catch (error) {
    Response.Internal(res, error);
  }
});
```

### Client Management Service
```javascript
class ClientService {
  static async getAllClients() {
    return await Client.getAll();
  }
  
  static async createClient(clientData, companyName) {
    // Validate and sanitize input
    const sanitizedData = this.sanitizeClientData(clientData);
    
    // Create single client with company
    const clientArray = [[sanitizedData, companyName]];
    const result = await Client.create(clientArray);
    
    if (result.created === 1) {
      return { success: true, message: 'Client created successfully' };
    } else {
      throw new Error('Failed to create client');
    }
  }
  
  static async updateClient(clientId, updates, companyName) {
    // Validate input
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      throw new Error('Invalid client ID');
    }
    
    const sanitizedUpdates = this.sanitizeClientData(updates);
    return await Client.update(clientId, sanitizedUpdates, companyName);
  }
  
  static async deleteClient(clientId) {
    // Check for associated audits before deletion
    const Audit = require('./audit');
    const associatedAudits = await Audit.find({ client: clientId });
    
    if (associatedAudits.length > 0) {
      throw new Error('Cannot delete client with associated audits');
    }
    
    return await Client.delete(clientId);
  }
  
  static async importClients(clientsData) {
    // Validate and sanitize all clients
    const sanitizedClients = clientsData.map(item => [
      this.sanitizeClientData(item.client),
      item.companyName
    ]);
    
    return await Client.create(sanitizedClients);
  }
  
  static sanitizeClientData(data) {
    const sanitized = {};
    
    if (data.email) {
      sanitized.email = data.email.toString().toLowerCase().trim();
    }
    
    if (data.lastname) {
      sanitized.lastname = data.lastname.toString().trim();
    }
    
    if (data.firstname) {
      sanitized.firstname = data.firstname.toString().trim();
    }
    
    if (data.phone) {
      sanitized.phone = data.phone.toString().trim();
    }
    
    if (data.cell) {
      sanitized.cell = data.cell.toString().trim();
    }
    
    if (data.title) {
      sanitized.title = data.title.toString().trim();
    }
    
    return sanitized;
  }
}

module.exports = ClientService;
```

---

## Integration

### Audit Model Integration
```javascript
// In audit.js model
const Client = require('./client');

// Validate client exists before creating audit
AuditSchema.pre('save', async function() {
  if (this.client) {
    try {
      const clients = await Client.getAll();
      const clientExists = clients.some(c => c._id.toString() === this.client.toString());
      
      if (!clientExists) {
        throw new Error('Selected client does not exist');
      }
    } catch (error) {
      throw new Error('Invalid client selection');
    }
  }
});

// Get audit with client and company details
AuditSchema.methods.getWithClientDetails = async function() {
  const auditData = this.toObject();
  
  if (this.client) {
    const clients = await Client.getAll();
    const client = clients.find(c => c._id.toString() === this.client.toString());
    
    if (client) {
      auditData.clientDetails = {
        email: client.email,
        name: `${client.firstname} ${client.lastname}`,
        title: client.title,
        phone: client.phone,
        cell: client.cell,
        company: client.company
      };
    }
  }
  
  return auditData;
};
```

### Report Generation Integration
```javascript
// Include client information in reports
async function generateReportWithClientInfo(auditId) {
  const audit = await Audit.findById(auditId);
  
  if (audit.client) {
    const clients = await Client.getAll();
    const client = clients.find(c => c._id.toString() === audit.client.toString());
    
    if (client) {
      audit.clientInfo = {
        contactName: `${client.firstname} ${client.lastname}`,
        email: client.email,
        title: client.title,
        phone: client.phone,
        cell: client.cell,
        companyName: client.company ? client.company.name : null
      };
    }
  }
  
  return reportGenerator.generate(audit);
}
```

---

## Company Integration

### Automatic Company Creation
The Client model automatically creates and links companies during client creation and updates:

```javascript
// During client creation
for (var i = 0; i < clients.length; i++) {
    company = clients[i][1];  // Company name from input
    if (company) {
        var Company = mongoose.model("Company");
        var query = Company.findOneAndUpdate(
            {name: company}, 
            {}, 
            {upsert: true, new: true}
        );
        var companyRow = await query.exec();
        if (companyRow) clients[i][0].company = companyRow._id;
    }
}
```

### Company Linking Service
```javascript
class CompanyLinkingService {
  static async linkClientToCompany(clientId, companyName) {
    if (!companyName) return null;
    
    const Company = require('./company');
    
    // Find or create company
    const companies = await Company.getAll();
    let company = companies.find(c => c.name === companyName);
    
    if (!company) {
      const created = await Company.create([{
        name: companyName,
        shortName: null,
        logo: null
      }]);
      company = { _id: created._id };
    }
    
    // Update client with company reference
    const updatedClient = await Client.update(clientId, {
      company: company._id
    });
    
    return {
      client: updatedClient,
      company: company
    };
  }
  
  static async unlinkClientFromCompany(clientId) {
    return await Client.update(clientId, {
      company: null
    });
  }
}
```

---

## Bulk Operations

### Batch Client Creation with Company Management
```javascript
// Efficient bulk client creation with company handling
async function createMultipleClientsWithCompanies(clientsData) {
  try {
    // Prepare company creation/linking
    const companyNames = [...new Set(clientsData.map(item => item.companyName).filter(Boolean))];
    const Company = require('./company');
    
    // Pre-create all companies
    const companyPromises = companyNames.map(async (name) => {
      const companies = await Company.getAll();
      const existing = companies.find(c => c.name === name);
      
      if (existing) {
        return { name, id: existing._id };
      } else {
        const created = await Company.create([{ name, shortName: null, logo: null }]);
        return { name, id: created._id };
      }
    });
    
    const companyMap = {};
    const companyResults = await Promise.all(companyPromises);
    companyResults.forEach(result => {
      companyMap[result.name] = result.id;
    });
    
    // Prepare client data with company references
    const processedClients = clientsData.map(item => {
      const clientData = { ...item.client };
      const companyName = item.companyName;
      
      if (companyName && companyMap[companyName]) {
        clientData.company = companyMap[companyName];
      }
      
      return [clientData, companyName];
    });
    
    const result = await Client.create(processedClients);
    
    return {
      success: true,
      created: result.created,
      duplicates: result.duplicates,
      total: clientsData.length,
      companiesProcessed: companyNames.length
    };
  } catch (error) {
    throw error;
  }
}
```

---

## Data Import/Export

### CSV Import with Company Handling
```javascript
const csv = require('csv-parser');
const fs = require('fs');

async function importClientsFromCSV(filePath) {
  return new Promise((resolve, reject) => {
    const clients = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const clientData = {
          email: row.email,
          lastname: row.lastname,
          firstname: row.firstname,
          phone: row.phone,
          cell: row.cell,
          title: row.title
        };
        
        clients.push([clientData, row.companyName]);
      })
      .on('end', async () => {
        try {
          const result = await Client.create(clients);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}
```

### Export with Company Information
```javascript
// Export clients with company details
async function exportClientsWithCompanies() {
  try {
    const clients = await Client.getAll();
    
    const exportData = clients.map(client => ({
      email: client.email,
      lastname: client.lastname,
      firstname: client.firstname,
      phone: client.phone,
      cell: client.cell,
      title: client.title,
      companyName: client.company ? client.company.name : null
    }));
    
    return {
      exportDate: new Date().toISOString(),
      totalClients: exportData.length,
      clients: exportData
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
// Client validation middleware
function validateClientInput(req, res, next) {
  const { email, lastname, firstname, phone, cell, title } = req.body;
  
  // Validate email (required)
  if (!email || typeof email !== 'string') {
    return Response.BadParameters(res, 'Email is required');
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return Response.BadParameters(res, 'Invalid email format');
  }
  
  // Validate optional fields
  if (lastname && typeof lastname !== 'string') {
    return Response.BadParameters(res, 'Last name must be a string');
  }
  
  if (firstname && typeof firstname !== 'string') {
    return Response.BadParameters(res, 'First name must be a string');
  }
  
  if (phone && typeof phone !== 'string') {
    return Response.BadParameters(res, 'Phone must be a string');
  }
  
  if (cell && typeof cell !== 'string') {
    return Response.BadParameters(res, 'Cell phone must be a string');
  }
  
  if (title && typeof title !== 'string') {
    return Response.BadParameters(res, 'Title must be a string');
  }
  
  // Sanitize inputs
  req.body.email = email.toLowerCase().trim();
  if (lastname) req.body.lastname = lastname.trim();
  if (firstname) req.body.firstname = firstname.trim();
  if (phone) req.body.phone = phone.trim();
  if (cell) req.body.cell = cell.trim();
  if (title) req.body.title = title.trim();
  
  next();
}
```

### Enhanced Schema Validation
```javascript
// Enhanced schema with comprehensive validation
var ClientSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Invalid email format'
        }
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: 'Company'
    },
    lastname: {
        type: String,
        trim: true,
        maxlength: [100, 'Last name cannot exceed 100 characters']
    },
    firstname: {
        type: String,
        trim: true,
        maxlength: [100, 'First name cannot exceed 100 characters']
    },
    phone: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[\+\-\(\)\s\d]+$/.test(v);
            },
            message: 'Invalid phone number format'
        }
    },
    cell: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return !v || /^[\+\-\(\)\s\d]+$/.test(v);
            },
            message: 'Invalid cell phone number format'
        }
    },
    title: {
        type: String,
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
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
ClientSchema.index({ email: 1 });
ClientSchema.index({ company: 1 });
ClientSchema.index({ lastname: 1, firstname: 1 });
ClientSchema.index({ createdAt: -1 });
```

### Efficient Population
```javascript
// Optimized client retrieval with company details
ClientSchema.statics.getAllOptimized = function() {
    return this.find()
        .populate('company', 'name shortName logo')
        .select('email lastname firstname phone cell title')
        .lean()
        .exec();
};
```

### Caching Strategy
```javascript
// Client cache with company information
class ClientCache {
  constructor() {
    this.cache = new Map();
    this.ttl = 5 * 60 * 1000; // 5 minutes
  }
  
  async getClients() {
    const now = Date.now();
    const cached = this.cache.get('clients');
    
    if (cached && (now - cached.timestamp) < this.ttl) {
      return cached.data;
    }
    
    const clients = await Client.getAll();
    this.cache.set('clients', {
      data: clients,
      timestamp: now
    });
    
    return clients;
  }
  
  invalidate() {
    this.cache.delete('clients');
  }
}
```

---

## Testing

### Unit Tests
```javascript
const Client = require('./models/client');
const Company = require('./models/company');

describe('Client Model', () => {
  beforeEach(async () => {
    await Client.deleteAll();
    await Company.deleteAll();
  });
  
  describe('create()', () => {
    it('should create client with company', async () => {
      const clientData = [[{
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe',
        title: 'CEO'
      }, 'Test Company']];
      
      const result = await Client.create(clientData);
      expect(result.created).toBe(1);
      expect(result.duplicates).toBe(0);
      
      // Verify company was created
      const companies = await Company.getAll();
      expect(companies.length).toBe(1);
      expect(companies[0].name).toBe('Test Company');
    });
    
    it('should handle duplicate emails', async () => {
      const clientData = [[{
        email: 'duplicate@example.com',
        firstname: 'John',
        lastname: 'Doe'
      }]];
      
      await Client.create(clientData);
      const result = await Client.create(clientData);
      
      expect(result.created).toBe(0);
      expect(result.duplicates).toBeGreaterThan(0);
    });
  });
  
  describe('getAll()', () => {
    it('should return clients with populated company', async () => {
      const clientData = [[{
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe'
      }, 'Test Company']];
      
      await Client.create(clientData);
      const clients = await Client.getAll();
      
      expect(clients.length).toBe(1);
      expect(clients[0].company).toBeDefined();
      expect(clients[0].company.name).toBe('Test Company');
    });
  });
});
```

---

This Client model provides comprehensive functionality for managing client contacts in pwndoc-ng, with automatic company integration, bulk operations, and robust validation for efficient audit client management. 