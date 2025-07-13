# Audit Routes Documentation

## Overview

The `backend/src/routes/audit.js` file defines all API endpoints for audit management in the pwndoc-ng application. It provides comprehensive RESTful endpoints for audit lifecycle management, including CRUD operations, finding management, section management, collaboration features, and approval workflows.

## Table of Contents

1. [Dependencies & Setup](#dependencies--setup)
2. [Authentication & Authorization](#authentication--authorization)
3. [Audit List Management](#audit-list-management)
4. [Audit CRUD Operations](#audit-crud-operations)
5. [General Information Management](#general-information-management)
6. [Network Information Management](#network-information-management)
7. [Finding Management](#finding-management)
8. [Section Management](#section-management)
9. [Report Generation](#report-generation)
10. [Sorting & Positioning](#sorting--positioning)
11. [Approval Workflow](#approval-workflow)
12. [Real-time Features](#real-time-features)
13. [Error Handling](#error-handling)

---

## Dependencies & Setup

### Required Dependencies
```javascript
var Response = require('../lib/httpResponse');
var Audit = require('mongoose').model('Audit');
var acl = require('../lib/auth').acl;
var reportGenerator = require('../lib/report-generator');
var _ = require('lodash');
var utils = require('../lib/utils');
var Settings = require('mongoose').model('Settings');
```

### Module Export
```javascript
module.exports = function(app, io) {
    // Route definitions
}
```

**Key Features:**
- **Express App Integration**: All routes are mounted on the Express app
- **Socket.io Integration**: Real-time updates for collaborative features
- **Authentication**: JWT-based authentication using ACL middleware
- **Response Formatting**: Standardized response handling

---

## Authentication & Authorization

### Permission Requirements
All endpoints require specific permissions:
- `audits:read` - Read audit data
- `audits:create` - Create new audits
- `audits:update` - Modify existing audits
- `audits:delete` - Delete audits
- `audits:review` - Review and approve audits

### Role-based Access Control
```javascript
// Example permission check
app.get("/api/audits", acl.hasPermission('audits:read'), function(req, res) {
    // Admin users can read all audits
    var isAdmin = acl.isAllowed(req.decodedToken.role, 'audits:read-all');
    // Regular users can only read their own audits
    Audit.getAudits(isAdmin, req.decodedToken.id, filters)
});
```

### State-based Restrictions
```javascript
// Review system restrictions
var settings = await Settings.getAll();
var audit = await Audit.getAudit(isAdmin, auditId, userId);
if (settings.reviews.enabled && audit.state !== "EDIT") {
    Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
    return;
}
```

---

## Audit List Management

### GET /api/audits
**Description**: Retrieve all audits accessible to the user

**Parameters:**
- `findingTitle` (query, optional): Filter audits by finding title (regex search)

**Example Request:**
```bash
GET /api/audits?findingTitle=SQL%20Injection
```

**Implementation:**
```javascript
app.get("/api/audits", acl.hasPermission('audits:read'), function(req, res) {
    var getUsersRoom = function(room) {
        return utils.getSockets(io, room).map(s => s.username)
    }
    
    var filters = {};
    if (req.query.findingTitle) 
        filters['findings.title'] = new RegExp(utils.escapeRegex(req.query.findingTitle), 'i')
        
    Audit.getAudits(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.decodedToken.id, filters)
    .then(msg => {
        var result = []
        msg.forEach(audit => {
            var a = {}
            a._id = audit._id
            a.name = audit.name
            a.language = audit.language
            a.creator = audit.creator
            a.collaborators = audit.collaborators
            a.company = audit.company
            a.createdAt = audit.createdAt
            a.reviewers = audit.reviewers
            a.approvals = audit.approvals
            a.state = audit.state
            if (acl.isAllowed(req.decodedToken.role, 'audits:users-connected')){
                a.connected = getUsersRoom(audit._id.toString())
            }
            result.push(a)
        })
        Response.Ok(res, result)
    })
    .catch(err => Response.Internal(res, err))
});
```

**Response Format:**
```json
{
    "status": "success",
    "data": [
        {
            "_id": "60f7b1a5e4b0a12345678901",
            "name": "Security Assessment 2024",
            "language": "en",
            "creator": {
                "_id": "60f7b1a5e4b0a12345678902",
                "username": "auditor1"
            },
            "collaborators": [...],
            "company": {...},
            "createdAt": "2024-01-15T10:30:00.000Z",
            "reviewers": [...],
            "approvals": [...],
            "state": "EDIT",
            "connected": ["user1", "user2"]
        }
    ]
}
```

---

## Audit CRUD Operations

### POST /api/audits
**Description**: Create a new audit

**Required Parameters:**
- `name` (string): Audit name
- `language` (string): Report language
- `auditType` (string): Type of audit

**Example Request:**
```bash
POST /api/audits
Content-Type: application/json

{
    "name": "Security Assessment 2024",
    "language": "en",
    "auditType": "Web Application"
}
```

**Implementation:**
```javascript
app.post("/api/audits", acl.hasPermission('audits:create'), function(req, res) {
    if (!req.body.name || !req.body.language || !req.body.auditType) {
        Response.BadParameters(res, 'Missing some required parameters: name, language, auditType');
        return;
    }

    if (!utils.validFilename(req.body.language)) {
        Response.BadParameters(res, 'Invalid characters for language');
        return;
    }

    var audit = {};
    audit.name = req.body.name;
    audit.language = req.body.language;
    audit.auditType = req.body.auditType;

    Audit.create(audit, req.decodedToken.id)
    .then(inserted => Response.Created(res, {message: 'Audit created successfully', audit: inserted}))
    .catch(err => Response.Internal(res, err))
});
```

### GET /api/audits/:auditId
**Description**: Retrieve full audit details

**Parameters:**
- `auditId` (path): Audit ID

**Example Request:**
```bash
GET /api/audits/60f7b1a5e4b0a12345678901
```

**Implementation:**
```javascript
app.get("/api/audits/:auditId", acl.hasPermission('audits:read'), function(req, res) {
    Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
    .then(msg => Response.Ok(res, msg))
    .catch(err => Response.Internal(res, err))
});
```

### DELETE /api/audits/:auditId
**Description**: Delete an audit

**Parameters:**
- `auditId` (path): Audit ID

**Example Request:**
```bash
DELETE /api/audits/60f7b1a5e4b0a12345678901
```

**Implementation:**
```javascript
app.delete("/api/audits/:auditId", acl.hasPermission('audits:delete'), function(req, res) {
    Audit.delete(acl.isAllowed(req.decodedToken.role, 'audits:delete-all'), req.params.auditId, req.decodedToken.id)
    .then(msg => Response.Ok(res, msg))
    .catch(err => Response.Internal(res, err))
})
```

---

## General Information Management

### GET /api/audits/:auditId/general
**Description**: Get audit general information

**Parameters:**
- `auditId` (path): Audit ID

**Example Request:**
```bash
GET /api/audits/60f7b1a5e4b0a12345678901/general
```

**Implementation:**
```javascript
app.get("/api/audits/:auditId/general", acl.hasPermission('audits:read'), function(req, res) {
    Audit.getGeneral(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
    .then(msg => Response.Ok(res, msg))
    .catch(err => Response.Internal(res, err))
});
```

### PUT /api/audits/:auditId/general
**Description**: Update audit general information

**Parameters:**
- `auditId` (path): Audit ID
- `name` (optional): Audit name
- `date` (optional): Audit date
- `date_start` (optional): Start date
- `date_end` (optional): End date
- `client` (optional): Client ID
- `company` (optional): Company object or ID
- `collaborators` (optional): Array of collaborator IDs
- `reviewers` (optional): Array of reviewer IDs
- `language` (optional): Report language
- `scope` (optional): Scope array
- `template` (optional): Template ID
- `customFields` (optional): Custom fields array

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/general
Content-Type: application/json

{
    "name": "Updated Security Assessment 2024",
    "date_start": "2024-01-01",
    "date_end": "2024-01-15",
    "collaborators": [
        {"_id": "60f7b1a5e4b0a12345678902"}
    ],
    "reviewers": [
        {"_id": "60f7b1a5e4b0a12345678903"}
    ]
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/general", acl.hasPermission('audits:update'), async function(req, res) {
    var update = {};
    
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }

    // Validation for reviewers
    if (req.body.reviewers) {
        if (req.body.reviewers.some(element => !element._id)) {
            Response.BadParameters(res, "One or more reviewer is missing an _id");
            return;
        }
        // Prevent creator from being a reviewer
        if (req.body.reviewers.some(element => element._id === audit.creator._id)) {
            Response.BadParameters(res, "A user cannot simultaneously be a reviewer and a collaborator/creator");
            return;
        }
    }

    // Validation for collaborators
    if (req.body.collaborators) {
        if (req.body.collaborators.some(element => !element._id)) {
            Response.BadParameters(res, "One or more collaborator is missing an _id");
            return;
        }
        // Remove approvals from users becoming collaborators
        if (audit.approvals) {
            newApprovals = audit.approvals.filter((approval) => !req.body.collaborators.some((collaborator) => approval.toString() === collaborator._id));
            update.approvals = newApprovals;
        }
    }

    // Optional parameters
    if (req.body.name) update.name = req.body.name;
    if (req.body.date) update.date = req.body.date;
    if (req.body.date_start) update.date_start = req.body.date_start;
    if (req.body.date_end) update.date_end = req.body.date_end;
    if (req.body.client !== undefined) update.client = req.body.client
    if (req.body.company !== undefined) {
        update.company = {};
        if (req.body.company && req.body.company._id)
            update.company._id = req.body.company._id;
        else if (req.body.company && req.body.company.name)
            update.company.name = req.body.company.name
        else
            update.company = null
    }
    if (req.body.collaborators) update.collaborators = req.body.collaborators;
    if (req.body.reviewers) update.reviewers = req.body.reviewers;
    if (req.body.language && utils.validFilename(req.body.language)) update.language = req.body.language;
    if (req.body.scope && typeof(req.body.scope === "array")) {
        update.scope = req.body.scope.map(item => {return {name: item}});
    }
    if (req.body.template) update.template = req.body.template;
    if (req.body.customFields) update.customFields = req.body.customFields;
    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) update.approvals = [];

    Audit.updateGeneral(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, update)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

---

## Network Information Management

### GET /api/audits/:auditId/network
**Description**: Get audit network/scope information

**Parameters:**
- `auditId` (path): Audit ID

**Example Request:**
```bash
GET /api/audits/60f7b1a5e4b0a12345678901/network
```

### PUT /api/audits/:auditId/network
**Description**: Update audit network/scope information

**Parameters:**
- `auditId` (path): Audit ID
- `scope` (optional): Network scope array

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/network
Content-Type: application/json

{
    "scope": [
        {
            "name": "Web Application",
            "hosts": [
                {
                    "hostname": "app.example.com",
                    "ip": "192.168.1.100",
                    "os": "Linux",
                    "services": [
                        {
                            "port": 80,
                            "protocol": "tcp",
                            "name": "HTTP",
                            "product": "Apache",
                            "version": "2.4.41"
                        }
                    ]
                }
            ]
        }
    ]
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/network", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }

    var update = {};
    if (req.body.scope) update.scope = req.body.scope;
    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) update.approvals = [];

    Audit.updateNetwork(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, update)
    .then(msg => Response.Ok(res, msg))
    .catch(err => Response.Internal(res, err))
});
```

---

## Finding Management

### POST /api/audits/:auditId/findings
**Description**: Create a new finding

**Required Parameters:**
- `title` (string): Finding title

**Optional Parameters:**
- `vulnType` (string): Vulnerability type
- `description` (string): Finding description
- `observation` (string): Observation details
- `remediation` (string): Remediation guidance
- `remediationComplexity` (number): Complexity level (1-3)
- `priority` (number): Priority level (1-4)
- `references` (array): Reference links
- `cvssv3` (string): CVSS v3 vector
- `poc` (string): Proof of concept
- `scope` (string): Finding scope
- `status` (number): Status (0=done, 1=redacting)
- `category` (string): Finding category
- `customFields` (array): Custom field values

**Example Request:**
```bash
POST /api/audits/60f7b1a5e4b0a12345678901/findings
Content-Type: application/json

{
    "title": "SQL Injection Vulnerability",
    "vulnType": "injection",
    "description": "The application is vulnerable to SQL injection attacks",
    "remediation": "Implement parameterized queries and input validation",
    "cvssv3": "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
    "priority": 1,
    "remediationComplexity": 2,
    "category": "Web Application",
    "status": 1
}
```

**Implementation:**
```javascript
app.post("/api/audits/:auditId/findings", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }
    if (!req.body.title) {
        Response.BadParameters(res, 'Missing some required parameters: title');
        return;
    }

    var finding = {};
    finding.title = req.body.title;
    
    // Optional parameters
    if (req.body.vulnType) finding.vulnType = req.body.vulnType;
    if (req.body.description) finding.description = req.body.description;
    if (req.body.observation) finding.observation = req.body.observation;
    if (req.body.remediation) finding.remediation = req.body.remediation;
    if (req.body.remediationComplexity) finding.remediationComplexity = req.body.remediationComplexity;
    if (req.body.priority) finding.priority = req.body.priority;
    if (req.body.references) finding.references = req.body.references;
    if (req.body.cvssv3) finding.cvssv3 = req.body.cvssv3;
    if (req.body.poc) finding.poc = req.body.poc;
    if (req.body.scope) finding.scope = req.body.scope;
    if (req.body.status !== undefined) finding.status = req.body.status;
    if (req.body.category) finding.category = req.body.category
    if (req.body.customFields) finding.customFields = req.body.customFields

    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) {
        Audit.updateGeneral(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, { approvals: [] });
    }

    Audit.createFinding(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, finding)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

### GET /api/audits/:auditId/findings/:findingId
**Description**: Get specific finding details

**Parameters:**
- `auditId` (path): Audit ID
- `findingId` (path): Finding ID

**Example Request:**
```bash
GET /api/audits/60f7b1a5e4b0a12345678901/findings/60f7b1a5e4b0a12345678904
```

### PUT /api/audits/:auditId/findings/:findingId
**Description**: Update existing finding

**Parameters:**
- `auditId` (path): Audit ID
- `findingId` (path): Finding ID
- All finding fields (optional): Same as POST parameters

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/findings/60f7b1a5e4b0a12345678904
Content-Type: application/json

{
    "title": "Updated SQL Injection Vulnerability",
    "description": "Updated description with more details",
    "status": 0
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/findings/:findingId", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }
    
    var finding = {};
    // Optional parameters with lodash null checking
    if (req.body.title) finding.title = req.body.title;
    if (req.body.vulnType) finding.vulnType = req.body.vulnType;
    if (!_.isNil(req.body.description)) finding.description = req.body.description;
    if (!_.isNil(req.body.observation)) finding.observation = req.body.observation;
    if (!_.isNil(req.body.remediation)) finding.remediation = req.body.remediation;
    if (req.body.remediationComplexity) finding.remediationComplexity = req.body.remediationComplexity;
    if (req.body.priority) finding.priority = req.body.priority;
    if (req.body.references) finding.references = req.body.references;
    if (req.body.cvssv3) finding.cvssv3 = req.body.cvssv3;
    if (!_.isNil(req.body.poc)) finding.poc = req.body.poc;
    if (!_.isNil(req.body.scope)) finding.scope = req.body.scope;
    if (req.body.status !== undefined) finding.status = req.body.status;
    if (req.body.category) finding.category = req.body.category
    if (req.body.customFields) finding.customFields = req.body.customFields

    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) {
        Audit.updateGeneral(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, { approvals: [] });
    }

    Audit.updateFinding(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, req.params.findingId, finding)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');            
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

### DELETE /api/audits/:auditId/findings/:findingId
**Description**: Delete a finding

**Parameters:**
- `auditId` (path): Audit ID
- `findingId` (path): Finding ID

**Example Request:**
```bash
DELETE /api/audits/60f7b1a5e4b0a12345678901/findings/60f7b1a5e4b0a12345678904
```

**Implementation:**
```javascript
app.delete("/api/audits/:auditId/findings/:findingId", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }
    Audit.deleteFinding(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, req.params.findingId)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');            
        Response.Ok(res, msg);
    })
    .catch(err => Response.Internal(res, err))
});
```

---

## Section Management

### GET /api/audits/:auditId/sections/:sectionId
**Description**: Get specific section details

**Parameters:**
- `auditId` (path): Audit ID
- `sectionId` (path): Section ID

**Example Request:**
```bash
GET /api/audits/60f7b1a5e4b0a12345678901/sections/60f7b1a5e4b0a12345678905
```

### PUT /api/audits/:auditId/sections/:sectionId
**Description**: Update section content

**Required Parameters:**
- `customFields` (array): Custom field values

**Optional Parameters:**
- `text` (string): Section text (legacy support)

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/sections/60f7b1a5e4b0a12345678905
Content-Type: application/json

{
    "customFields": [
        {
            "customField": "60f7b1a5e4b0a12345678906",
            "text": "Updated section content"
        }
    ],
    "text": "Legacy text content"
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/sections/:sectionId", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }
    if (typeof req.body.customFields === 'undefined') {
        Response.BadParameters(res, 'Missing some required parameters: customFields');
        return;
    }
    var section = {};
    section.customFields = req.body.customFields;
    
    // For retrocompatibility with old section.text usage
    if (req.body.text) section.text = req.body.text; 

    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) {
        Audit.updateGeneral(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, { approvals: [] });
    }

    Audit.updateSection(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, req.params.sectionId, section)
    .then(msg => {
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

---

## Report Generation

### GET /api/audits/:auditId/generate
**Description**: Generate and download audit report

**Parameters:**
- `auditId` (path): Audit ID

**Example Request:**
```bash
GET /api/audits/60f7b1a5e4b0a12345678901/generate
```

**Implementation:**
```javascript
app.get("/api/audits/:auditId/generate", acl.hasPermission('audits:read'), function(req, res){
    Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
    .then(async audit => {
        var settings = await Settings.getAll();

        // Check if audit needs to be approved for export
        if (settings.reviews.enabled && settings.reviews.public.mandatoryReview && audit.state !== 'APPROVED') {
            Response.Forbidden(res, "Audit was not approved therefore cannot be exported.");
            return;
        }

        if (!audit.template)
            throw ({fn: 'BadParameters', message: 'Template not defined'})

        var reportDoc = await reportGenerator.generateDoc(audit);
        Response.SendFile(res, `${audit.name.replace(/[\\\/:*?"<>|]/g, "")}.${audit.template.ext || 'docx'}`, reportDoc);
    })
    .catch(err => {
        if (err.code === "ENOENT")
            Response.BadParameters(res, 'Template File not found')
        else
            Response.Internal(res, err)
    });
});
```

**Features:**
- **Template-based Generation**: Uses audit template for formatting
- **Approval Validation**: Enforces approval requirements if enabled
- **File Download**: Returns generated report as file attachment
- **Error Handling**: Comprehensive error handling for missing templates

---

## Sorting & Positioning

### PUT /api/audits/:auditId/sortfindings
**Description**: Update finding sort options and apply sorting

**Parameters:**
- `auditId` (path): Audit ID
- `sortFindings` (array): Sort configuration array

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/sortfindings
Content-Type: application/json

{
    "sortFindings": [
        {
            "category": "Web Application",
            "sortValue": "cvssScore",
            "sortOrder": "desc",
            "sortAuto": true
        },
        {
            "category": "Network",
            "sortValue": "priority",
            "sortOrder": "asc",
            "sortAuto": false
        }
    ]
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/sortfindings", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }
    var update = {};
    if (req.body.sortFindings) update.sortFindings = req.body.sortFindings;
    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) update.approvals = [];
    
    Audit.updateSortFindings(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, update)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

### PUT /api/audits/:auditId/movefinding
**Description**: Move finding to different position

**Required Parameters:**
- `oldIndex` (number): Current position
- `newIndex` (number): New position

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/movefinding
Content-Type: application/json

{
    "oldIndex": 2,
    "newIndex": 0
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/movefinding", acl.hasPermission('audits:update'), async function(req, res) {
    var settings = await Settings.getAll();
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);
    if (settings.reviews.enabled && audit.state !== "EDIT") {
        Response.Forbidden(res, "The audit is not in the EDIT state and therefore cannot be edited.");
        return;
    }
    if (typeof req.body.oldIndex === 'undefined' || typeof req.body.newIndex === 'undefined') {
        Response.BadParameters(res, 'Missing some required parameters: oldIndex, newIndex');
        return;
    }
    
    var move = {};
    move.oldIndex = req.body.oldIndex;
    move.newIndex = req.body.newIndex;

    if (settings.reviews.enabled && settings.reviews.private.removeApprovalsUponUpdate) {
        Audit.updateGeneral(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, { approvals: [] });
    }
    
    Audit.moveFindingPosition(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, move)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

---

## Approval Workflow

### PUT /api/audits/:auditId/toggleApproval
**Description**: Toggle reviewer approval for audit

**Parameters:**
- `auditId` (path): Audit ID

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/toggleApproval
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/toggleApproval", acl.hasPermission('audits:review'), async function(req, res) {
    const settings = await Settings.getAll();

    if (!settings.reviews.enabled) {
        Response.Forbidden(res, "Audit reviews are not enabled.");
        return;
    }

    Audit.findById(req.params.auditId)
    .then(audit => {
        if (audit.state !== "REVIEW" && audit.state !== "APPROVED") {
            Response.Forbidden(res, "The audit is not approvable in the current state.");
            return;
        }

        var hasApprovedBefore = false;
        var newApprovalsArray = [];
        if (audit.approvals) {
            audit.approvals.forEach((approval) => {
                if (approval._id.toString() === req.decodedToken.id) {
                    hasApprovedBefore = true;
                } else {
                    newApprovalsArray.push(approval);
                }
            });
        }

        // Add approval if not already approved
        if (!hasApprovedBefore) {
            newApprovalsArray.push({
                _id: req.decodedToken.id,
                role: req.decodedToken.role,
                username: req.decodedToken.username,
                firstname: req.decodedToken.firstname,
                lastname: req.decodedToken.lastname
            });
        }

        var update = { approvals : newApprovalsArray};
        Audit.updateApprovals(acl.isAllowed(req.decodedToken.role, 'audits:review-all'), req.params.auditId, req.decodedToken.id, update)
        .then(() => {
            io.to(req.params.auditId).emit('updateAudit');
            Response.Ok(res, "Approval updated successfully.")
        })
        .catch((err) => {
            Response.Internal(res, err);
        })
    })
    .catch((err) => {
        Response.Internal(res, err);
    })
});
```

### PUT /api/audits/:auditId/updateReadyForReview
**Description**: Update audit state between EDIT and REVIEW

**Parameters:**
- `auditId` (path): Audit ID
- `state` (string): New state ("EDIT" or "REVIEW")

**Example Request:**
```bash
PUT /api/audits/60f7b1a5e4b0a12345678901/updateReadyForReview
Content-Type: application/json

{
    "state": "REVIEW"
}
```

**Implementation:**
```javascript
app.put("/api/audits/:auditId/updateReadyForReview", acl.hasPermission('audits:update'), async function(req, res) {
    const settings = await Settings.getAll();

    if (!settings.reviews.enabled) {
        Response.Forbidden(res, "Audit reviews are not enabled.");
        return;
    }

    var update = {};
    var audit = await Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id);

    if (audit.state !== "EDIT" && audit.state !== "REVIEW") {
        Response.Forbidden(res, "The audit is not in the proper state for this action.");
        return;
    }

    if (req.body.state != undefined && (req.body.state === "EDIT" || req.body.state === "REVIEW")) 
        update.state = req.body.state;

    // Remove user's approval when setting back to EDIT
    if (update.state === "EDIT") {
        var newApprovalsArray = [];
        if (audit.approvals) {
            audit.approvals.forEach((approval) => {
                if (approval._id.toString() !== req.decodedToken.id) {
                    newApprovalsArray.push(approval);
                }
            });
            update.approvals = newApprovalsArray;
        }
    }

    Audit.updateGeneral(acl.isAllowed(req.decodedToken.role, 'audits:update-all'), req.params.auditId, req.decodedToken.id, update)
    .then(msg => {
        io.to(req.params.auditId).emit('updateAudit');
        Response.Ok(res, msg)
    })
    .catch(err => Response.Internal(res, err))
});
```

---

## Real-time Features

### Socket.io Integration
All audit modifications emit real-time updates:

```javascript
// Real-time audit updates
io.to(req.params.auditId).emit('updateAudit');
```

### Connected Users Tracking
```javascript
var getUsersRoom = function(room) {
    return utils.getSockets(io, room).map(s => s.username)
}

// Include connected users in audit list
if (acl.isAllowed(req.decodedToken.role, 'audits:users-connected')){
    a.connected = getUsersRoom(audit._id.toString())
}
```

**Features:**
- **Live Updates**: All audit changes trigger real-time updates
- **User Presence**: Track connected users per audit
- **Collaborative Editing**: Real-time synchronization across clients

---

## Error Handling

### Common Error Responses

#### 400 Bad Request
```json
{
    "status": "error",
    "message": "Missing some required parameters: name, language, auditType"
}
```

#### 401 Unauthorized
```json
{
    "status": "error",
    "message": "No token provided"
}
```

#### 403 Forbidden
```json
{
    "status": "error",
    "message": "The audit is not in the EDIT state and therefore cannot be edited."
}
```

#### 404 Not Found
```json
{
    "status": "error",
    "message": "Audit not found or Insufficient Privileges"
}
```

#### 500 Internal Server Error
```json
{
    "status": "error",
    "message": "Internal server error"
}
```

### Validation Rules

#### Audit Creation
- **name**: Required, string
- **language**: Required, valid filename characters
- **auditType**: Required, string

#### Finding Management
- **title**: Required for creation
- **cvssv3**: Must be valid CVSS vector format
- **priority**: Must be 1-4
- **remediationComplexity**: Must be 1-3
- **status**: Must be 0 or 1

#### Collaboration Rules
- **Reviewers**: Cannot be creators or collaborators
- **Collaborators**: Cannot be reviewers
- **Approvals**: Only reviewers can approve
- **State Changes**: Only possible between EDIT ↔ REVIEW

---

## Security Considerations

### Authentication
- **JWT Required**: All endpoints require valid JWT tokens
- **Role-based Access**: Different permissions for different roles
- **Audit-level Permissions**: Users can only access their own audits or those they collaborate on

### State Management
- **Review System**: Prevents editing of audits under review
- **Approval Workflow**: Enforces approval requirements
- **Permission Validation**: Continuous permission checks

### Input Validation
- **Parameter Validation**: Required parameters checked
- **Data Sanitization**: Input sanitized and validated
- **File Path Security**: Filename validation prevents path traversal

---

## Related Documentation

- **[Audit Model](../models/audit.md)** - Complete audit data model
- **[Authentication System](../lib/auth.md)** - JWT and permission system
- **[HTTP Response](../lib/httpResponse.md)** - Response formatting
- **[Report Generator](../lib/report-generator.md)** - Report generation system
- **[Settings Model](../models/settings.md)** - Application settings
- **[Socket.io Implementation](../app/app.md)** - Real-time features

---

*This audit routes module provides comprehensive API endpoints for managing security audits with robust authentication, validation, and real-time collaboration features.* 