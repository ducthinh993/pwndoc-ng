# Audit Model Documentation

## Overview

The `backend/src/models/audit.js` file defines the central data model for the pwndoc-ng application. It represents security audit reports with comprehensive functionality for managing findings, sections, collaboration, and workflow states. This model handles complex nested structures and integrates with multiple other models to provide complete audit management capabilities.

## Table of Contents

1. [Schema Structure](#schema-structure)
2. [Nested Schemas](#nested-schemas)
3. [Model Relationships](#model-relationships)
4. [Static Methods](#static-methods)
5. [CRUD Operations](#crud-operations)
6. [Finding Management](#finding-management)
7. [Section Management](#section-management)
8. [Collaboration Features](#collaboration-features)
9. [Approval Workflow](#approval-workflow)
10. [Sorting System](#sorting-system)
11. [Usage Examples](#usage-examples)

---

## Schema Structure

### Main Audit Schema
```javascript
var AuditSchema = new Schema({
    name:               {type: String, required: true},
    auditType:          String,
    date:               String,
    date_start:         String,
    date_end:           String,
    summary:            String,
    company:            {type: Schema.Types.ObjectId, ref: 'Company'},
    client:             {type: Schema.Types.ObjectId, ref: 'Client'},
    collaborators:      [{type: Schema.Types.ObjectId, ref: 'User'}],
    reviewers:          [{type: Schema.Types.ObjectId, ref: 'User'}],
    language:           {type: String, required: true},
    scope:              [{_id: false, name: String, hosts: [Host]}],
    findings:           [Finding],
    template:           {type: Schema.Types.ObjectId, ref: 'Template'},
    creator:            {type: Schema.Types.ObjectId, ref: 'User'},
    sections:           [{field: String, name: String, text: String, customFields: [customField]}],
    customFields:       [customField],
    sortFindings:       [SortOption],
    state:              { type: String, enum: ['EDIT', 'REVIEW', 'APPROVED'], default: 'EDIT'},
    approvals:          [{type: Schema.Types.ObjectId, ref: 'User'}],
}, {timestamps: true});
```

### Key Fields
- **name**: Audit title (required)
- **auditType**: Type of audit being performed
- **date/date_start/date_end**: Audit timeline
- **summary**: Executive summary
- **language**: Report language (required)
- **state**: Workflow state (EDIT → REVIEW → APPROVED)
- **timestamps**: Automatic createdAt/updatedAt fields

---

## Nested Schemas

### Finding Schema
```javascript
var Finding = {
    id:                     Schema.Types.ObjectId,
    identifier:             Number, // Incremental ID for report
    title:                  String,
    vulnType:               String,
    description:            String,
    observation:            String,
    remediation:            String,
    remediationComplexity:  {type: Number, enum: [1,2,3]},
    priority:               {type: Number, enum: [1,2,3,4]},
    references:             [String],
    cvssv3:                 String,
    paragraphs:             [Paragraph],
    poc:                    String,
    scope:                  String,
    status:                 {type: Number, enum: [0,1], default: 1}, // 0: done, 1: redacting
    category:               String,
    customFields:           [customField]
}
```

### Paragraph Schema
```javascript
var Paragraph = {
    text:   String,
    images: [{image: String, caption: String}]
}
```

### Host Schema
```javascript
var Host = {
    hostname:   String,
    ip:         String,
    os:         String,
    services:   [Service]
}
```

### Service Schema
```javascript
var Service = {
    port:       Number,
    protocol:   {type: String, enum: ['tcp', 'udp']},
    name:       String,
    product:    String,
    version:    String
}
```

### Custom Field Schema
```javascript
var customField = {
    _id:        false,
    customField: {type: Schema.Types.Mixed, ref: 'CustomField'},
    text:       Schema.Types.Mixed
}
```

### Sort Option Schema
```javascript
var SortOption = {
    _id:        false,
    category:   String,
    sortValue:  String,
    sortOrder:  {type: String, enum: ['desc', 'asc']},
    sortAuto:   Boolean
}
```

---

## Model Relationships

### Referenced Models
- **User**: Creator, collaborators, reviewers, approvals
- **Company**: Associated company
- **Client**: Associated client
- **Template**: Report template
- **CustomField**: Custom field definitions
- **AuditType**: Audit type configuration
- **VulnerabilityCategory**: Finding categorization

### Population Examples
```javascript
// Full audit with all relationships
query.populate('template')
query.populate('creator', 'username firstname lastname email phone role')
query.populate('company')
query.populate('client')
query.populate('collaborators', 'username firstname lastname email phone role')
query.populate('reviewers', 'username firstname lastname role')
query.populate('approvals', 'username firstname lastname role')
query.populate('customFields.customField', 'label fieldType text')
```

---

## Static Methods

### Core CRUD Operations

#### `getAudits(isAdmin, userId, filters)`
Retrieve all audits with user access control:
```javascript
AuditSchema.statics.getAudits = (isAdmin, userId, filters) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.find(filters)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}, {reviewers: userId}])
        query.populate('creator', 'username')
        query.populate('collaborators', 'username')
        query.populate('reviewers', 'username firstname lastname')
        query.populate('approvals', 'username firstname lastname')
        query.populate('company', 'name')
        query.select('id name language creator collaborators company createdAt state')
        query.exec()
        .then((rows) => {
            resolve(rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `getAudit(isAdmin, auditId, userId)`
Retrieve single audit with full population:
```javascript
AuditSchema.statics.getAudit = (isAdmin, auditId, userId) => {
    return new Promise((resolve, reject) => {
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}, {reviewers: userId}])
        // Full population for report generation
        query.populate('template')
        query.populate('creator', 'username firstname lastname email phone role')
        // ... additional populations
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            resolve(row)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `create(audit, userId)`
Create new audit with automatic setup:
```javascript
AuditSchema.statics.create = (audit, userId) => {
    return new Promise((resolve, reject) => {
        audit.creator = userId
        audit.sections = []
        audit.customFields = []

        // Get audit type configuration
        var AuditType = mongoose.model('AuditType')
        AuditType.getByName(audit.auditType)
        .then((row) => {
            if (row) {
                // Setup sections and custom fields
                // Configure default sorting options
                // Set template based on language
                return new Audit(audit).save()
            }
            else
                throw({fn: 'NotFound', message: 'AuditType not found'})
        })
        .then((rows) => {
            resolve(rows)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `delete(isAdmin, auditId, userId)`
Delete audit with permission check:
```javascript
AuditSchema.statics.delete = (isAdmin, auditId, userId) => {
    return new Promise((resolve, reject) => {
        var query = Audit.findOneAndDelete({_id: auditId})
        if (!isAdmin)
            query.or([{creator: userId}])
        return query.exec()               
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            resolve(row)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

### General Information Management

#### `getGeneral(isAdmin, auditId, userId)`
Get audit general information:
```javascript
AuditSchema.statics.getGeneral = (isAdmin, auditId, userId) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId);
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}, {reviewers: userId}])
        query.populate('client')
        query.populate('company')
        query.select('name auditType date date_start date_end client collaborators language scope.name template customFields')
        query.lean().exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'});
            resolve(row)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `updateGeneral(isAdmin, auditId, userId, update)`
Update audit general information:
```javascript
AuditSchema.statics.updateGeneral = (isAdmin, auditId, userId, update) => {
    return new Promise(async(resolve, reject) => { 
        // Handle company creation if needed
        if (update.company && update.company.name) {
            var Company = mongoose.model("Company");
            try {
                update.company = await Company.create({name: update.company.name})
            } catch (error) {
                delete update.company
            }
        }
        
        var query = Audit.findByIdAndUpdate(auditId, update)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then(row => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            resolve("Audit General updated successfully")
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

---

## Finding Management

### Finding CRUD Operations

#### `createFinding(isAdmin, auditId, userId, finding)`
Create new finding with automatic identifier:
```javascript
AuditSchema.statics.createFinding = (isAdmin, auditId, userId, finding) => {
    return new Promise((resolve, reject) => { 
        Audit.getLastFindingIdentifier(auditId)
        .then(identifier => {
            finding.identifier = ++identifier
            
            var query = Audit.findByIdAndUpdate(auditId, {$push: {findings: finding}})
            if (!isAdmin)
                query.or([{creator: userId}, {collaborators: userId}])
            return query.exec()
        })
        .then(row => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            else {
                // Check if automatic sorting is enabled
                var sortOption = row.sortFindings.find(e => e.category === (finding.category || 'No Category'))
                if ((sortOption && sortOption.sortAuto) || !sortOption)
                    return Audit.updateSortFindings(isAdmin, auditId, userId, null)
                else
                    resolve("Audit Finding created successfully")
            }
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `getFinding(isAdmin, auditId, userId, findingId)`
Get specific finding:
```javascript
AuditSchema.statics.getFinding = (isAdmin, auditId, userId, findingId) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}, {reviewers: userId}])
        query.select('findings')
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})

            var finding = row.findings.id(findingId)
            if (finding === null) 
                throw({fn: 'NotFound', message: 'Finding not found'})
            else 
                resolve(finding)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `updateFinding(isAdmin, auditId, userId, findingId, newFinding)`
Update existing finding:
```javascript
AuditSchema.statics.updateFinding = (isAdmin, auditId, userId, findingId, newFinding) => {
    return new Promise((resolve, reject) => { 
        var sortAuto = true

        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})

            var finding = row.findings.id(findingId)
            if (finding === null)
                reject({fn: 'NotFound', message: 'Finding not found'})         
            else {
                // Check if automatic sorting is enabled
                var sortOption = row.sortFindings.find(e => e.category === (newFinding.category || 'No Category'))
                if (sortOption && !sortOption.sortAuto)
                    sortAuto = false

                Object.keys(newFinding).forEach((key) => {
                    finding[key] = newFinding[key]
                })
                return row.save({ validateBeforeSave: false })
            } 
        })
        .then(() => {
            if (sortAuto)
                return Audit.updateSortFindings(isAdmin, auditId, userId, null)
            else
                resolve("Audit Finding updated successfully")
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `deleteFinding(isAdmin, auditId, userId, findingId)`
Delete finding:
```javascript
AuditSchema.statics.deleteFinding = (isAdmin, auditId, userId, findingId) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.select('findings')
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})

            var finding = row.findings.id(findingId)
            if (finding === null) 
                reject({fn: 'NotFound', message: 'Finding not found'})
            else {
                row.findings.pull(findingId)
                return row.save()
            }
        })
        .then(() => {
            resolve("Audit Finding deleted successfully")
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

### Finding Identifier Management

#### `getLastFindingIdentifier(auditId)`
Get the highest finding identifier:
```javascript
AuditSchema.statics.getLastFindingIdentifier = (auditId) => {
    return new Promise((resolve, reject) => {
        var query = Audit.aggregate([
            { $match: {_id: new mongoose.Types.ObjectId(auditId)} },
            { $unwind: 'findings' },
            { $sort: {'findings.identifier': -1} }
        ])
        query.exec()
        .then(row => {
            if (!row || row.length === 0 || !row[0].findings.identifier)
                resolve(0)
            else
                resolve(row[0].findings.identifier);
        })
        .catch((err) => {
            reject(err)
        })
    })
};
```

---

## Section Management

### Section CRUD Operations

#### `createSection(isAdmin, auditId, userId, section)`
Create new section:
```javascript
AuditSchema.statics.createSection = (isAdmin, auditId, userId, section) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findOneAndUpdate(
            {_id: auditId, 'sections.field': {$ne: section.field}}, 
            {$push: {sections: section}}
        )
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Section already exists or Insufficient Privileges'})
            resolve('Audit Section created successfully')
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `getSection(isAdmin, auditId, userId, sectionId)`
Get specific section:
```javascript
AuditSchema.statics.getSection = (isAdmin, auditId, userId, sectionId) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}, {reviewers: userId}])
        query.select('sections')
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})

            var section = row.sections.id(sectionId);
            if (section === null) 
                throw({fn: 'NotFound', message: 'Section id not found'});
            else 
                resolve(section);
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `updateSection(isAdmin, auditId, userId, sectionId, newSection)`
Update existing section:
```javascript
AuditSchema.statics.updateSection = (isAdmin, auditId, userId, sectionId, newSection) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            
            var section = row.sections.id(sectionId)
            if (section === null)
                throw({fn: 'NotFound', message: 'Section not found'})          
            else {
                Object.keys(newSection).forEach((key) => {
                    section[key] = newSection[key]
                })
                return row.save()
            } 
        })
        .then(() => {
            resolve('Audit Section updated successfully')        
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `deleteSection(isAdmin, auditId, userId, sectionId)`
Delete section:
```javascript
AuditSchema.statics.deleteSection = (isAdmin, auditId, userId, sectionId) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.select('sections')
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})

            var section = row.sections.id(sectionId)
            if (section === null) 
                throw({fn: 'NotFound', message: 'Section not found'})
            else {
                row.sections.pull(sectionId)
                return row.save()
            }
        })
        .then(() => {
            resolve('Audit Section deleted successfully')
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

---

## Sorting System

### Advanced Finding Sorting

#### `updateSortFindings(isAdmin, auditId, userId, update)`
Update sort options and apply sorting:
```javascript
AuditSchema.statics.updateSortFindings = (isAdmin, auditId, userId, update) => {
    return new Promise((resolve, reject) => {
        var audit = {} 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then(row => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            else {
                audit = row
                if (update)
                    audit.sortFindings = update.sortFindings

                // Get vulnerability categories for sorting
                var VulnerabilityCategory = mongoose.model('VulnerabilityCategory')
                return VulnerabilityCategory.getAll()
            }            
        })
        .then(row => {
            var _ = require('lodash')
            var findings = []
            var categoriesOrder = row.map(e => e.name)
            categoriesOrder.push("undefined")

            // Group findings by category and sort each group
            var findingList = _
                .chain(audit.findings)
                .groupBy("category")
                .toPairs()
                .sort((a,b) => categoriesOrder.indexOf(a[0]) - categoriesOrder.indexOf(b[0]))
                .fromPairs()
                .map((value, key) => {
                    if (key === 'undefined') key = 'No Category'
                    var sortOption = audit.sortFindings.find(option => option.category === key)
                    if (!sortOption)
                        sortOption = row.find(e => e.name === key)
                    if (!sortOption)
                        sortOption = {sortValue: 'cvssScore', sortOrder: 'desc', sortAuto: true}

                    return {category: key, findings: value, sortOption: sortOption}
                })
                .value()

            // Sort findings within each category
            findingList.forEach(group => {
                var order = group.sortOption.sortOrder === 'asc' ? 1 : -1
                var tmpFindings = group.findings.sort((a,b) => {
                    // Get CVSS scores
                    var cvssA = CVSS31.calculateCVSSFromVector(a.cvssv3)
                    var cvssB = CVSS31.calculateCVSSFromVector(b.cvssv3)

                    // Get sort value
                    var left = a[group.sortOption.sortValue]
                    
                    // Handle CVSS score sorting
                    if (cvssA.success && group.sortOption.sortValue === 'cvssScore')
                        left = cvssA.baseMetricScore
                    else if (cvssA.success && group.sortOption.sortValue === 'cvssTemporalScore')
                        left = cvssA.temporalMetricScore
                    else if (cvssA.success && group.sortOption.sortValue === 'cvssEnvironmentalScore')
                        left = cvssA.environmentalMetricScore

                    // Handle custom field sorting
                    if (!left) {
                        left = a.customFields.find(e => e.customField.label === group.sortOption.sortValue)
                        if (left) left = left.text
                    }
                    
                    if (!left) left = 0
                    left = left.toString()
                    
                    // Same for right value
                    var right = b[group.sortOption.sortValue]
                    if (cvssB.success && group.sortOption.sortValue === 'cvssScore')
                        right = cvssB.baseMetricScore
                    else if (cvssB.success && group.sortOption.sortValue === 'cvssTemporalScore')
                        right = cvssB.temporalMetricScore
                    else if (cvssB.success && group.sortOption.sortValue === 'cvssEnvironmentalScore')
                        right = cvssB.environmentalMetricScore

                    if (!right) {
                        right = b.customFields.find(e => e.customField.label === group.sortOption.sortValue)
                        if (right) right = right.text
                    }
                    if (!right) right = 0
                    right = right.toString()
                    
                    return left.localeCompare(right, undefined, {numeric: true}) * order
                })
                findings = findings.concat(tmpFindings)
            })

            audit.findings = findings
            return audit.save()
        })
        .then(() => {
            resolve("Audit findings sorted successfully")
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `moveFindingPosition(isAdmin, auditId, userId, move)`
Manual finding position adjustment:
```javascript
AuditSchema.statics.moveFindingPosition = (isAdmin, auditId, userId, move) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            
            // Move finding from oldIndex to newIndex
            var tmp = row.findings[move.oldIndex]
            row.findings.splice(move.oldIndex, 1)
            row.findings.splice(move.newIndex, 0, tmp)

            row.markModified('findings')
            return row.save()
        })
        .then(() => {
            resolve('Audit Finding moved successfully') 
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

---

## Approval Workflow

### Approval Management

#### `updateApprovals(isAdmin, auditId, userId, update)`
Update approval status:
```javascript
AuditSchema.statics.updateApprovals = (isAdmin, auditId, userId, update) => {
    return new Promise(async (resolve, reject) => {
        var Settings = mongoose.model('Settings');
        var settings = await Settings.getAll();

        // Check if minimum reviewers threshold is met
        if (update.approvals.length >= settings.reviews.public.minReviewers) {
            update.state = "APPROVED";
        } else {
            update.state = "REVIEW";
        }
        
        var query = Audit.findByIdAndUpdate(auditId, update)
        query.nor([{creator: userId}, {collaborators: userId}]); // Exclude creators and collaborators
        if (!isAdmin)
            query.or([{reviewers: userId}]); // Only reviewers can approve
        
        query.exec()
        .then(row => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'});
            resolve("Audit approvals updated successfully");
        })
        .catch((err) => {
            reject(err)
        })
    });
}
```

### Workflow States
- **EDIT**: Initial state, audit is being created/modified
- **REVIEW**: Submitted for review, awaiting approvals
- **APPROVED**: Sufficient approvals received, audit is finalized

---

## Network Management

### Network Scope Operations

#### `getNetwork(isAdmin, auditId, userId)`
Get network scope information:
```javascript
AuditSchema.statics.getNetwork = (isAdmin, auditId, userId) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findById(auditId)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}, {reviewers: userId}])
        query.select('scope')
        query.exec()
        .then((row) => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            resolve(row)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

#### `updateNetwork(isAdmin, auditId, userId, scope)`
Update network scope:
```javascript
AuditSchema.statics.updateNetwork = (isAdmin, auditId, userId, scope) => {
    return new Promise((resolve, reject) => { 
        var query = Audit.findByIdAndUpdate(auditId, scope)
        if (!isAdmin)
            query.or([{creator: userId}, {collaborators: userId}])
        query.exec()
        .then(row => {
            if (!row)
                throw({fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'})
            resolve("Audit Network updated successfully")
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

---

## Automated Cleanup

### Outdated Audit Deletion

#### `deleteOutdatedReportAutomation(days)`
Delete audits older than specified days:
```javascript
AuditSchema.statics.deleteOutdatedReportAutomation = (days) => {
    return new Promise((resolve, reject) => {
        var deleteBefore = new Date(Date.now() - 86400000 * days); // 86400000 = 1 day
        var query = Audit.deleteMany({createdAt: {"$lte": deleteBefore}})
        query.exec()               
        .then((data) => {
            resolve(data)
        })
        .catch((err) => {
            reject(err)
        })
    })
}
```

---

## Usage Examples

### Creating an Audit
```javascript
const auditData = {
    name: "Security Assessment 2024",
    auditType: "Web Application",
    language: "en",
    date_start: "2024-01-01",
    date_end: "2024-01-15",
    summary: "Comprehensive security assessment"
};

Audit.create(auditData, userId)
    .then(result => {
        console.log("Audit created:", result);
    })
    .catch(err => {
        console.error("Error creating audit:", err);
    });
```

### Adding a Finding
```javascript
const findingData = {
    title: "SQL Injection Vulnerability",
    vulnType: "injection",
    description: "Application is vulnerable to SQL injection attacks",
    remediation: "Implement parameterized queries",
    cvssv3: "AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    priority: 1,
    remediationComplexity: 2,
    category: "Web Application",
    status: 1
};

Audit.createFinding(false, auditId, userId, findingData)
    .then(result => {
        console.log("Finding created:", result);
    })
    .catch(err => {
        console.error("Error creating finding:", err);
    });
```

### Retrieving Audits
```javascript
// Get all audits for a user
Audit.getAudits(false, userId, {})
    .then(audits => {
        console.log("User audits:", audits);
    })
    .catch(err => {
        console.error("Error retrieving audits:", err);
    });

// Get specific audit with full details
Audit.getAudit(false, auditId, userId)
    .then(audit => {
        console.log("Audit details:", audit);
    })
    .catch(err => {
        console.error("Error retrieving audit:", err);
    });
```

### Updating Sort Options
```javascript
const sortOptions = {
    sortFindings: [
        {
            category: "Web Application",
            sortValue: "cvssScore",
            sortOrder: "desc",
            sortAuto: true
        },
        {
            category: "Network",
            sortValue: "priority",
            sortOrder: "asc",
            sortAuto: false
        }
    ]
};

Audit.updateSortFindings(false, auditId, userId, sortOptions)
    .then(result => {
        console.log("Sort options updated:", result);
    })
    .catch(err => {
        console.error("Error updating sort options:", err);
    });
```

---

## Error Handling

### Common Error Types
```javascript
// Permission errors
{fn: 'NotFound', message: 'Audit not found or Insufficient Privileges'}

// Validation errors
{fn: 'BadParameters', message: 'Audit validation failed'}

// Cast errors (invalid ObjectId)
{fn: 'BadParameters', message: 'Bad Audit Id'}

// Finding not found
{fn: 'NotFound', message: 'Finding not found'}

// Section errors
{fn: 'NotFound', message: 'Section already exists'}
```

### Permission Checks
All methods include permission checks:
- **Admin users**: Full access to all audits
- **Creators**: Full access to their own audits
- **Collaborators**: Read/write access to assigned audits
- **Reviewers**: Read-only access and approval capabilities

---

## Integration Points

### CVSS Integration
```javascript
const CVSS31 = require('../lib/cvsscalc31');
var cvss = CVSS31.calculateCVSSFromVector(finding.cvssv3);
if (cvss.success) {
    var score = cvss.baseMetricScore;
}
```

### Custom Fields Integration
```javascript
// Custom fields are populated from CustomField model
query.populate('customFields.customField', 'label fieldType text')
```

### Template Integration
```javascript
// Template is set based on audit type and language
var auditTypeTemplate = row.templates.find(e => e.locale === audit.language)
if (auditTypeTemplate)
    audit.template = auditTypeTemplate.template
```

---

## Related Documentation

- **[User Model](./user.md)** - User authentication and roles
- **[Company Model](./company.md)** - Company information
- **[Client Model](./client.md)** - Client management
- **[Template Model](./template.md)** - Report templates
- **[Vulnerability Model](./vulnerability.md)** - Vulnerability database
- **[Custom Field Model](./custom-field.md)** - Custom field definitions
- **[CVSS Calculator](../lib/cvsscalc31.md)** - CVSS scoring system
- **[Audit Routes](../routes/audit.md)** - API endpoints

---

*This audit model serves as the core of the pwndoc-ng application, providing comprehensive functionality for managing security audit reports with collaborative editing, approval workflows, and advanced sorting capabilities.* 