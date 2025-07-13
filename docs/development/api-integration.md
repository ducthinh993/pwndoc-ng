# Backend API Integration Documentation

This document provides a comprehensive reference for all backend API endpoints available in the pwndoc-ng application. This documentation is crucial for frontend refactoring and integration.

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [User Management](#user-management)
3. [Audit Management](#audit-management)
4. [Vulnerability Management](#vulnerability-management)
5. [Data Management](#data-management)
6. [Settings Management](#settings-management)
7. [Company Management](#company-management)
8. [Client Management](#client-management)
9. [Template Management](#template-management)
10. [Image Management](#image-management)
11. [Response Structure](#response-structure)
12. [Error Handling](#error-handling)

## Authentication & Authorization

### Base URL
All API endpoints are prefixed with `/api`

### Authentication
The application uses JWT tokens for authentication. Tokens are set as HTTP-only cookies:
- `token`: JWT access token
- `refreshToken`: Refresh token for token renewal

### Permissions
All endpoints require specific ACL permissions. The permission system follows the pattern: `resource:action`

---

## User Management

### Check Token Validity
**GET** `/api/users/checktoken`
- **Permission:** `validtoken`
- **Description:** Validates the current JWT token
- **Response:** Token information

### Refresh Token
**GET** `/api/users/refreshtoken`
- **Permission:** None (public endpoint)
- **Description:** Refreshes the JWT token using refresh token
- **Response:** New token and refresh token

### User Authentication
**POST** `/api/users/token`
- **Permission:** None (public endpoint)
- **Required Parameters:**
  - `username` (string): User's username
  - `password` (string): User's password
- **Optional Parameters:**
  - `totpToken` (string): TOTP token for 2FA
- **Description:** Authenticate user and return JWT token
- **Response:** JWT token and user information

### Check First User Setup
**GET** `/api/users/init`
- **Permission:** None (public endpoint)
- **Description:** Check if this is the first user setup
- **Response:** Boolean indicating if initialization is needed

### Get All Users
**GET** `/api/users`
- **Permission:** `users:read`
- **Description:** Get list of all users
- **Response:** Array of user objects

### Get Users for Export
**GET** `/api/users/export`
- **Permission:** `users:read-all`
- **Description:** Get users data for export
- **Response:** Exportable user data

### Get All Reviewers
**GET** `/api/users/reviewers`
- **Permission:** `users:read`
- **Description:** Get users who can review audits
- **Response:** Array of reviewer user objects

### Get Current User
**GET** `/api/users/me`
- **Permission:** `validtoken`
- **Description:** Get current user's information
- **Response:** Current user object

### Get User by Username
**GET** `/api/users/:username`
- **Permission:** `users:read`
- **Parameters:**
  - `username` (URL param): Username to retrieve
- **Description:** Get specific user by username
- **Response:** User object

### Create Users
**POST** `/api/users`
- **Permission:** `users:create`
- **Required Parameters (array of objects):**
  - `username` (string): User's username
  - `password` (string): User's password (must meet password policy)
  - `firstname` (string): User's first name
  - `lastname` (string): User's last name
- **Optional Parameters:**
  - `role` (string): User role (default: 'user')
  - `email` (string): User's email
  - `phone` (string): User's phone number
- **Description:** Create multiple users
- **Response:** Created user objects

### Create First User
**POST** `/api/users/init`
- **Permission:** None (public endpoint)
- **Required Parameters:**
  - `username` (string): Admin username
  - `password` (string): Admin password
  - `firstname` (string): Admin first name
  - `lastname` (string): Admin last name
- **Description:** Create the first admin user
- **Response:** Created admin user and tokens

### Update User
**PUT** `/api/users/:id`
- **Permission:** `users:update`
- **Parameters:**
  - `id` (URL param): User ID to update
- **Optional Parameters:**
  - `username` (string): New username
  - `password` (string): New password
  - `firstname` (string): New first name
  - `lastname` (string): New last name
  - `email` (string): New email
  - `phone` (string): New phone
  - `role` (string): New role
  - `totpEnabled` (boolean): Enable/disable TOTP
  - `enabled` (boolean): Enable/disable user
- **Description:** Update user information
- **Response:** Updated user object

### Update Current User Password
**PUT** `/api/users/me/password`
- **Permission:** `validtoken`
- **Required Parameters:**
  - `oldPassword` (string): Current password
  - `newPassword` (string): New password
- **Description:** Update current user's password
- **Response:** Success message

### Get TOTP QR Code
**GET** `/api/users/totp`
- **Permission:** `validtoken`
- **Description:** Get TOTP QR code for 2FA setup
- **Response:** QR code URL

### Setup TOTP
**POST** `/api/users/totp`
- **Permission:** `validtoken`
- **Required Parameters:**
  - `totpToken` (string): TOTP token to verify
  - `totpSecret` (string): TOTP secret from QR code
- **Description:** Setup TOTP 2FA
- **Response:** Success message

### Cancel TOTP
**DELETE** `/api/users/totp`
- **Permission:** `validtoken`
- **Required Parameters:**
  - `totpToken` (string): TOTP token to verify
- **Description:** Cancel TOTP 2FA
- **Response:** Success message

---

## Audit Management

### Get Audits List
**GET** `/api/audits`
- **Permission:** `audits:read`
- **Optional Query Parameters:**
  - `findingTitle` (string): Filter by finding title (regex)
- **Description:** Get list of audits accessible to current user
- **Response:** Array of audit objects with basic information

### Get Audit Details
**GET** `/api/audits/:auditId`
- **Permission:** `audits:read`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Description:** Get complete audit information
- **Response:** Full audit object

### Create Audit
**POST** `/api/audits`
- **Permission:** `audits:create`
- **Required Parameters:**
  - `name` (string): Audit name
  - `language` (string): Audit language
  - `auditType` (string): Type of audit
- **Description:** Create new audit
- **Response:** Created audit object

### Delete Audit
**DELETE** `/api/audits/:auditId`
- **Permission:** `audits:delete`
- **Parameters:**
  - `auditId` (URL param): Audit ID to delete
- **Description:** Delete audit
- **Response:** Success message

### Get Audit General Information
**GET** `/api/audits/:auditId/general`
- **Permission:** `audits:read`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Description:** Get audit general information
- **Response:** Audit general data

### Update Audit General Information
**PUT** `/api/audits/:auditId/general`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Optional Parameters:**
  - `name` (string): Audit name
  - `date` (string): Audit date
  - `date_start` (string): Audit start date
  - `date_end` (string): Audit end date
  - `client` (object): Client information
  - `company` (object): Company information
  - `collaborators` (array): Collaborator users
  - `reviewers` (array): Reviewer users
  - `language` (string): Audit language
  - `scope` (array): Audit scope
  - `template` (object): Report template
  - `customFields` (array): Custom field values
- **Description:** Update audit general information
- **Response:** Success message

### Get Audit Network Information
**GET** `/api/audits/:auditId/network`
- **Permission:** `audits:read`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Description:** Get audit network information
- **Response:** Audit network data

### Update Audit Network Information
**PUT** `/api/audits/:auditId/network`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Optional Parameters:**
  - `scope` (array): Network scope
- **Description:** Update audit network information
- **Response:** Success message

### Add Finding to Audit
**POST** `/api/audits/:auditId/findings`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Required Parameters:**
  - `title` (string): Finding title
- **Optional Parameters:**
  - `vulnType` (string): Vulnerability type
  - `description` (string): Finding description
  - `observation` (string): Finding observation
  - `remediation` (string): Remediation steps
  - `remediationComplexity` (number): Remediation complexity
  - `priority` (number): Finding priority
  - `references` (array): Reference links
  - `cvssv3` (string): CVSS v3 vector
  - `poc` (string): Proof of concept
  - `scope` (array): Finding scope
  - `status` (number): Finding status
  - `category` (string): Finding category
  - `customFields` (array): Custom field values
- **Description:** Add new finding to audit
- **Response:** Created finding object

### Get Audit Finding
**GET** `/api/audits/:auditId/findings/:findingId`
- **Permission:** `audits:read`
- **Parameters:**
  - `auditId` (URL param): Audit ID
  - `findingId` (URL param): Finding ID
- **Description:** Get specific finding from audit
- **Response:** Finding object

### Update Audit Finding
**PUT** `/api/audits/:auditId/findings/:findingId`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
  - `findingId` (URL param): Finding ID
- **Optional Parameters:**
  - `title` (string): Finding title
  - `vulnType` (string): Vulnerability type
  - `description` (string): Finding description
  - `observation` (string): Finding observation
  - `remediation` (string): Remediation steps
  - `remediationComplexity` (number): Remediation complexity
  - `priority` (number): Finding priority
  - `references` (array): Reference links
  - `cvssv3` (string): CVSS v3 vector
  - `poc` (string): Proof of concept
  - `scope` (array): Finding scope
  - `status` (number): Finding status
  - `category` (string): Finding category
  - `customFields` (array): Custom field values
- **Description:** Update audit finding
- **Response:** Updated finding object

### Delete Audit Finding
**DELETE** `/api/audits/:auditId/findings/:findingId`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
  - `findingId` (URL param): Finding ID
- **Description:** Delete finding from audit
- **Response:** Success message

### Get Audit Section
**GET** `/api/audits/:auditId/sections/:sectionId`
- **Permission:** `audits:read`
- **Parameters:**
  - `auditId` (URL param): Audit ID
  - `sectionId` (URL param): Section ID
- **Description:** Get specific section from audit
- **Response:** Section object

### Update Audit Section
**PUT** `/api/audits/:auditId/sections/:sectionId`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
  - `sectionId` (URL param): Section ID
- **Required Parameters:**
  - `customFields` (array): Custom field values
- **Optional Parameters:**
  - `text` (string): Section text (for compatibility)
- **Description:** Update audit section
- **Response:** Success message

### Generate Audit Report
**GET** `/api/audits/:auditId/generate`
- **Permission:** `audits:read`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Description:** Generate and download audit report
- **Response:** File download (DOCX/PDF)

### Update Audit Findings Sort Order
**PUT** `/api/audits/:auditId/sortfindings`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Optional Parameters:**
  - `sortFindings` (string): Sort method
- **Description:** Update findings sort order
- **Response:** Success message

### Move Finding Position
**PUT** `/api/audits/:auditId/movefinding`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Required Parameters:**
  - `oldIndex` (number): Current position
  - `newIndex` (number): New position
- **Description:** Move finding to new position
- **Response:** Success message

### Toggle Audit Approval
**PUT** `/api/audits/:auditId/toggleApproval`
- **Permission:** `audits:review`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Description:** Give or remove approval for audit
- **Response:** Success message

### Update Audit Review State
**PUT** `/api/audits/:auditId/updateReadyForReview`
- **Permission:** `audits:update`
- **Parameters:**
  - `auditId` (URL param): Audit ID
- **Required Parameters:**
  - `state` (string): New state ("EDIT" or "REVIEW")
- **Description:** Update audit review state
- **Response:** Success message

---

## Vulnerability Management

### Get Vulnerabilities List
**GET** `/api/vulnerabilities`
- **Permission:** `vulnerabilities:read`
- **Description:** Get list of all vulnerabilities
- **Response:** Array of vulnerability objects

### Get Vulnerabilities for Export
**GET** `/api/vulnerabilities/export`
- **Permission:** `vulnerabilities:read`
- **Description:** Get vulnerabilities data for export
- **Response:** Exportable vulnerability data

### Get Vulnerabilities by Language
**GET** `/api/vulnerabilities/:locale`
- **Permission:** `vulnerabilities:read`
- **Parameters:**
  - `locale` (URL param): Language locale
- **Description:** Get vulnerabilities filtered by language
- **Response:** Array of vulnerability objects

### Create Vulnerabilities
**POST** `/api/vulnerabilities`
- **Permission:** `vulnerabilities:create`
- **Required Parameters (array of objects):**
  - `details` (array): Array of vulnerability details
    - `locale` (string): Language locale
    - `title` (string): Vulnerability title
- **Optional Parameters:**
  - `cvssv3` (string): CVSS v3 vector
  - `priority` (number): Priority level
  - `remediationComplexity` (number): Remediation complexity
  - `category` (string): Vulnerability category
  - `details` (array): Detailed information per locale
    - `vulnType` (string): Vulnerability type
    - `description` (string): Description
    - `observation` (string): Observation
    - `remediation` (string): Remediation steps
    - `references` (array): Reference links
    - `customFields` (array): Custom field values
- **Description:** Create multiple vulnerabilities
- **Response:** Created vulnerability objects

### Update Vulnerability
**PUT** `/api/vulnerabilities/:vulnerabilityId`
- **Permission:** `vulnerabilities:update`
- **Parameters:**
  - `vulnerabilityId` (URL param): Vulnerability ID
- **Required Parameters:**
  - `details` (array): Array of vulnerability details with locale and title
- **Optional Parameters:**
  - `cvssv3` (string): CVSS v3 vector
  - `priority` (number): Priority level
  - `remediationComplexity` (number): Remediation complexity
  - `category` (string): Vulnerability category
- **Description:** Update vulnerability
- **Response:** Updated vulnerability object

### Delete Vulnerability
**DELETE** `/api/vulnerabilities/:vulnerabilityId`
- **Permission:** `vulnerabilities:delete`
- **Parameters:**
  - `vulnerabilityId` (URL param): Vulnerability ID
- **Description:** Delete vulnerability
- **Response:** Success message

### Delete All Vulnerabilities
**DELETE** `/api/vulnerabilities`
- **Permission:** `vulnerabilities:delete-all`
- **Description:** Delete all vulnerabilities
- **Response:** Success message

### Create Vulnerability from Finding
**POST** `/api/vulnerabilities/finding/:locale`
- **Permission:** `vulnerability-updates:create`
- **Parameters:**
  - `locale` (URL param): Language locale
- **Required Parameters:**
  - `title` (string): Vulnerability title
- **Optional Parameters:**
  - `cvssv3` (string): CVSS v3 vector
  - `priority` (number): Priority level
  - `remediationComplexity` (number): Remediation complexity
  - `references` (array): Reference links
  - `vulnType` (string): Vulnerability type
  - `description` (string): Description
  - `observation` (string): Observation
  - `remediation` (string): Remediation steps
  - `category` (string): Vulnerability category
  - `customFields` (array): Custom field values
- **Description:** Create or update vulnerability from finding
- **Response:** Created/updated vulnerability

### Get Vulnerability Updates
**GET** `/api/vulnerabilities/updates/:vulnId`
- **Permission:** `vulnerabilities:update`
- **Parameters:**
  - `vulnId` (URL param): Vulnerability ID
- **Description:** Get vulnerability updates
- **Response:** Array of vulnerability updates

### Merge Vulnerabilities
**PUT** `/api/vulnerabilities/merge/:vulnId`
- **Permission:** `vulnerabilities:update`
- **Parameters:**
  - `vulnId` (URL param): Target vulnerability ID
- **Required Parameters:**
  - `vulnId` (string): Source vulnerability ID
  - `locale` (string): Locale to merge
- **Description:** Merge vulnerability locale from another vulnerability
- **Response:** Success message

---

## Data Management

### Roles Management

#### Get Roles List
**GET** `/api/data/roles`
- **Permission:** `roles:read`
- **Description:** Get list of all available roles
- **Response:** Array of role names

### Languages Management

#### Get Languages List
**GET** `/api/data/languages`
- **Permission:** `languages:read`
- **Description:** Get list of all languages
- **Response:** Array of language objects

#### Create Language
**POST** `/api/data/languages`
- **Permission:** `languages:create`
- **Required Parameters:**
  - `locale` (string): Language locale code
  - `language` (string): Language name
- **Description:** Create new language
- **Response:** Created language object

#### Update Languages
**PUT** `/api/data/languages`
- **Permission:** `languages:update`
- **Required Parameters (array of objects):**
  - `locale` (string): Language locale code
  - `language` (string): Language name
- **Description:** Update multiple languages
- **Response:** Updated languages

#### Delete Language
**DELETE** `/api/data/languages/:locale`
- **Permission:** `languages:delete`
- **Parameters:**
  - `locale` (URL param): Language locale to delete
- **Description:** Delete language
- **Response:** Success message

### Audit Types Management

#### Get Audit Types List
**GET** `/api/data/audit-types`
- **Permission:** `audit-types:read`
- **Description:** Get list of all audit types
- **Response:** Array of audit type objects

#### Create Audit Type
**POST** `/api/data/audit-types`
- **Permission:** `audit-types:create`
- **Required Parameters:**
  - `name` (string): Audit type name
  - `templates` (array): Associated templates
- **Optional Parameters:**
  - `sections` (array): Custom sections
  - `hidden` (boolean): Hidden flag
- **Description:** Create new audit type
- **Response:** Created audit type object

#### Update Audit Types
**PUT** `/api/data/audit-types`
- **Permission:** `audit-types:update`
- **Required Parameters (array of objects):**
  - `name` (string): Audit type name
  - `templates` (array): Associated templates
- **Optional Parameters:**
  - `sections` (array): Custom sections
  - `hidden` (boolean): Hidden flag
- **Description:** Update multiple audit types
- **Response:** Updated audit types

#### Delete Audit Type
**DELETE** `/api/data/audit-types/:name`
- **Permission:** `audit-types:delete`
- **Parameters:**
  - `name` (URL param): Audit type name to delete
- **Description:** Delete audit type
- **Response:** Success message

### Vulnerability Types Management

#### Get Vulnerability Types List
**GET** `/api/data/vulnerability-types`
- **Permission:** `vulnerability-types:read`
- **Description:** Get list of all vulnerability types
- **Response:** Array of vulnerability type objects

#### Create Vulnerability Type
**POST** `/api/data/vulnerability-types`
- **Permission:** `vulnerability-types:create`
- **Required Parameters:**
  - `name` (string): Vulnerability type name
  - `locale` (string): Language locale
- **Description:** Create new vulnerability type
- **Response:** Created vulnerability type object

#### Update Vulnerability Types
**PUT** `/api/data/vulnerability-types`
- **Permission:** `vulnerability-types:update`
- **Required Parameters (array of objects):**
  - `name` (string): Vulnerability type name
  - `locale` (string): Language locale
- **Description:** Update multiple vulnerability types
- **Response:** Updated vulnerability types

#### Delete Vulnerability Type
**DELETE** `/api/data/vulnerability-types/:name`
- **Permission:** `vulnerability-types:delete`
- **Parameters:**
  - `name` (URL param): Vulnerability type name to delete
- **Description:** Delete vulnerability type
- **Response:** Success message

### Vulnerability Categories Management

#### Get Vulnerability Categories List
**GET** `/api/data/vulnerability-categories`
- **Permission:** `vulnerability-categories:read`
- **Description:** Get list of all vulnerability categories
- **Response:** Array of vulnerability category objects

#### Create Vulnerability Category
**POST** `/api/data/vulnerability-categories`
- **Permission:** `vulnerability-categories:create`
- **Required Parameters:**
  - `name` (string): Category name
- **Optional Parameters:**
  - `sortValue` (number): Sort value
  - `sortOrder` (string): Sort order
  - `sortAuto` (boolean): Auto sort flag
- **Description:** Create new vulnerability category
- **Response:** Created vulnerability category object

#### Update Vulnerability Categories
**PUT** `/api/data/vulnerability-categories`
- **Permission:** `vulnerability-categories:update`
- **Required Parameters (array of objects):**
  - `name` (string): Category name
- **Optional Parameters:**
  - `sortValue` (number): Sort value
  - `sortOrder` (string): Sort order
  - `sortAuto` (boolean): Auto sort flag
- **Description:** Update multiple vulnerability categories
- **Response:** Updated vulnerability categories

#### Delete Vulnerability Category
**DELETE** `/api/data/vulnerability-categories/:name`
- **Permission:** `vulnerability-categories:delete`
- **Parameters:**
  - `name` (URL param): Category name to delete
- **Description:** Delete vulnerability category
- **Response:** Success message

### Sections Management

#### Get Sections List
**GET** `/api/data/sections`
- **Permission:** `sections:read`
- **Description:** Get list of all custom sections
- **Response:** Array of section objects

#### Create Section
**POST** `/api/data/sections`
- **Permission:** `sections:create`
- **Required Parameters:**
  - `field` (string): Section field name
  - `name` (string): Section display name
- **Optional Parameters:**
  - `locale` (string): Language locale
  - `text` (string): Section text
  - `icon` (string): Section icon
- **Description:** Create new section
- **Response:** Created section object

#### Update Sections
**PUT** `/api/data/sections`
- **Permission:** `sections:update`
- **Required Parameters (array of objects):**
  - `name` (string): Section name
  - `field` (string): Section field
- **Optional Parameters:**
  - `icon` (string): Section icon
- **Description:** Update multiple sections
- **Response:** Updated sections

#### Delete Section
**DELETE** `/api/data/sections/:field/:locale`
- **Permission:** `sections:delete`
- **Parameters:**
  - `field` (URL param): Section field name
  - `locale` (URL param): Language locale
- **Description:** Delete section
- **Response:** Success message

### Custom Fields Management

#### Get Custom Fields List
**GET** `/api/data/custom-fields`
- **Permission:** `custom-fields:read`
- **Description:** Get list of all custom fields
- **Response:** Array of custom field objects

#### Create Custom Field
**POST** `/api/data/custom-fields`
- **Permission:** `custom-fields:create`
- **Required Parameters:**
  - `fieldType` (string): Field type
  - `label` (string): Field label
  - `display` (string): Display type
- **Optional Parameters:**
  - `displaySub` (string): Sub-display type
  - `size` (number): Field size
  - `offset` (number): Field offset
  - `required` (boolean): Required flag
  - `description` (string): Field description
  - `text` (string): Field text
  - `options` (array): Field options
  - `position` (number): Field position
- **Description:** Create new custom field
- **Response:** Created custom field object

#### Update Custom Fields
**PUT** `/api/data/custom-fields`
- **Permission:** `custom-fields:update`
- **Required Parameters (array of objects):**
  - `_id` (string): Field ID
  - `label` (string): Field label
  - `display` (string): Display type
- **Optional Parameters:**
  - `size` (number): Field size
  - `offset` (number): Field offset
  - `required` (boolean): Required flag
  - `description` (string): Field description
  - `text` (string): Field text
  - `options` (array): Field options
  - `position` (number): Field position
- **Description:** Update multiple custom fields
- **Response:** Updated custom fields

#### Delete Custom Field
**DELETE** `/api/data/custom-fields/:fieldId`
- **Permission:** `custom-fields:delete`
- **Parameters:**
  - `fieldId` (URL param): Field ID to delete
- **Description:** Delete custom field
- **Response:** Success message

---

## Settings Management

### Get Settings
**GET** `/api/settings`
- **Permission:** `settings:read`
- **Description:** Get all application settings
- **Response:** Settings object

### Get Public Settings
**GET** `/api/settings/public`
- **Permission:** `settings:read-public`
- **Description:** Get public application settings
- **Response:** Public settings object

### Update Settings
**PUT** `/api/settings`
- **Permission:** `settings:update`
- **Parameters:** Settings object with updated values
- **Description:** Update application settings
- **Response:** Updated settings object

### Revert Settings
**PUT** `/api/settings/revert`
- **Permission:** `settings:update`
- **Description:** Revert settings to default values
- **Response:** Default settings object

### Export Settings
**GET** `/api/settings/export`
- **Permission:** `settings:read`
- **Description:** Export settings as JSON file
- **Response:** File download (JSON)

---

## Company Management

### Get Companies List
**GET** `/api/companies`
- **Permission:** `companies:read`
- **Description:** Get list of all companies
- **Response:** Array of company objects

### Get Companies for Export
**GET** `/api/companies/export`
- **Permission:** `companies:read`
- **Description:** Get companies data for export
- **Response:** Exportable company data

### Create Companies
**POST** `/api/companies`
- **Permission:** `companies:create`
- **Required Parameters (array of objects):**
  - `name` (string): Company name
- **Optional Parameters:**
  - `shortName` (string): Short company name
  - `logo` (string): Company logo
- **Description:** Create multiple companies
- **Response:** Created company objects

### Update Company
**PUT** `/api/companies/:id`
- **Permission:** `companies:update`
- **Parameters:**
  - `id` (URL param): Company ID
- **Optional Parameters:**
  - `name` (string): Company name
  - `shortName` (string): Short company name
  - `logo` (string): Company logo
- **Description:** Update company
- **Response:** Success message

### Delete Company
**DELETE** `/api/companies/:id`
- **Permission:** `companies:delete`
- **Parameters:**
  - `id` (URL param): Company ID
- **Description:** Delete company
- **Response:** Success message

### Delete All Companies
**DELETE** `/api/companies`
- **Permission:** `companies:delete`
- **Description:** Delete all companies
- **Response:** Success message

---

## Client Management

### Get Clients List
**GET** `/api/clients`
- **Permission:** `clients:read`
- **Description:** Get list of all clients
- **Response:** Array of client objects

### Get Clients for Export
**GET** `/api/clients/export`
- **Permission:** `clients:read`
- **Description:** Get clients data for export
- **Response:** Exportable client data

### Create Clients
**POST** `/api/clients`
- **Permission:** `clients:create`
- **Required Parameters (array of objects):**
  - `email` (string): Client email
- **Optional Parameters:**
  - `lastname` (string): Client last name
  - `firstname` (string): Client first name
  - `phone` (string): Client phone
  - `cell` (string): Client cell phone
  - `title` (string): Client title
  - `company` (object): Client company information
    - `name` (string): Company name
- **Description:** Create multiple clients
- **Response:** Created client objects

### Update Client
**PUT** `/api/clients/:id`
- **Permission:** `clients:update`
- **Parameters:**
  - `id` (URL param): Client ID
- **Optional Parameters:**
  - `email` (string): Client email
  - `lastname` (string): Client last name
  - `firstname` (string): Client first name
  - `phone` (string): Client phone
  - `cell` (string): Client cell phone
  - `title` (string): Client title
  - `company` (object): Client company information
- **Description:** Update client
- **Response:** Success message

### Delete Client
**DELETE** `/api/clients/:id`
- **Permission:** `clients:delete`
- **Parameters:**
  - `id` (URL param): Client ID
- **Description:** Delete client
- **Response:** Success message

### Delete All Clients
**DELETE** `/api/clients`
- **Permission:** `clients:delete`
- **Description:** Delete all clients
- **Response:** Success message

---

## Template Management

### Get Templates List
**GET** `/api/templates`
- **Permission:** `templates:read`
- **Description:** Get list of all templates
- **Response:** Array of template objects

### Create Template
**POST** `/api/templates`
- **Permission:** `templates:create`
- **Required Parameters:**
  - `name` (string): Template name
  - `file` (string): Base64 encoded file content
  - `ext` (string): File extension
- **Description:** Create new template
- **Response:** Created template object

### Update Template
**PUT** `/api/templates/:templateId`
- **Permission:** `templates:update`
- **Parameters:**
  - `templateId` (URL param): Template ID
- **Optional Parameters:**
  - `name` (string): Template name
  - `file` (string): Base64 encoded file content
  - `ext` (string): File extension
- **Description:** Update template
- **Response:** Success message

### Delete Template
**DELETE** `/api/templates/:templateId`
- **Permission:** `templates:delete`
- **Parameters:**
  - `templateId` (URL param): Template ID
- **Description:** Delete template
- **Response:** Success message

### Download Template
**GET** `/api/templates/download/:templateId`
- **Permission:** `templates:read`
- **Parameters:**
  - `templateId` (URL param): Template ID
- **Description:** Download template file
- **Response:** File download

---

## Image Management

### Get Image
**GET** `/api/images/:imageId`
- **Permission:** `images:read`
- **Parameters:**
  - `imageId` (URL param): Image ID
- **Description:** Get image data
- **Response:** Image object

### Create Image
**POST** `/api/images`
- **Permission:** `images:create`
- **Required Parameters:**
  - `value` (string): Base64 encoded image data
- **Optional Parameters:**
  - `name` (string): Image name
  - `auditId` (string): Associated audit ID
- **Description:** Create new image
- **Response:** Created image object

### Delete Image
**DELETE** `/api/images/:imageId`
- **Permission:** `images:delete`
- **Parameters:**
  - `imageId` (URL param): Image ID
- **Description:** Delete image
- **Response:** Success message

---

## Response Structure

### Success Response
```json
{
  "status": "success",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description"
}
```

### Common HTTP Status Codes
- `200 OK`: Success
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Access denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

---

## Error Handling

### Common Error Types
- **BadParameters**: Missing or invalid parameters
- **Unauthorized**: Invalid or missing authentication
- **Forbidden**: Insufficient permissions
- **NotFound**: Resource not found
- **Internal**: Server error

### Parameter Validation
- All string parameters are validated for proper format
- File names must match: `/^[\p{Letter}\p{Mark}0-9 \[\]'()_-]+$/iu`
- Passwords must meet the configured password policy
- Email addresses must be valid format

### Permission System
The ACL (Access Control List) system controls access to endpoints based on user roles:

- **admin**: Full access to all resources
- **user**: Limited access based on ownership and permissions
- **reviewer**: Can review and approve audits
- **guest**: Read-only access to specific resources

### Rate Limiting
API endpoints may be rate-limited to prevent abuse. Check response headers for rate limit information.

---

## Notes for Frontend Development

1. **Authentication**: Always include JWT tokens in requests via HTTP-only cookies
2. **Error Handling**: Implement proper error handling for all API responses
3. **Permissions**: Check user permissions before showing UI elements
4. **File Uploads**: Use Base64 encoding for file uploads
5. **Real-time Updates**: Use WebSocket connections for real-time audit updates
6. **Pagination**: Some endpoints may implement pagination in the future
7. **Validation**: Implement client-side validation matching server-side rules
8. **Caching**: Consider caching static data like languages, roles, and settings

This documentation should be updated whenever API endpoints are modified or new endpoints are added. 