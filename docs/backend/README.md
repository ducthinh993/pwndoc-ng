# Backend Documentation Index

This directory contains comprehensive documentation for the pwndoc-ng backend application. The documentation is organized to mirror the actual codebase structure for easy navigation and reference.

## 📁 Documentation Structure

```
docs/backend/
├── README.md                    # This navigation index
├── app/                         # Core application documentation
├── config/                      # Configuration and settings
├── lib/                         # Library modules and utilities
├── models/                      # MongoDB data models
├── routes/                      # API route handlers
├── translate/                   # Internationalization system
├── tests/                       # Test suite documentation
├── deployment/                  # Docker and deployment
└── examples/                    # Code examples and templates
```

## 🚀 Quick Start

### For New Developers
1. **Start Here**: [`/docs/development/backend.md`](../development/backend.md) - Main backend development guide
2. **System Overview**: [`/docs/architecture/system-overview.md`](../architecture/system-overview.md) - High-level architecture
3. **API Reference**: [`/docs/development/api-integration.md`](../development/api-integration.md) - Complete API documentation

### For Feature Implementation
1. **Models**: Start with data model documentation in [`models/`](models/)
2. **Routes**: API endpoint implementation in [`routes/`](routes/)
3. **Libraries**: Core business logic in [`lib/`](lib/)
4. **Tests**: Test patterns and examples in [`tests/`](tests/)

## 📚 Core Application

### [`app/`](app/) - Application Foundation
- **[app.js](app/app.md)** - Express server setup, HTTPS configuration, Socket.io initialization
- **[swagger.js](app/swagger.md)** - API documentation generation and Swagger UI

### [`config/`](config/) - Configuration Management
- **[Configuration System](config/configuration.md)** - Environment variables, database settings
- **[Swagger Documentation](config/swagger.md)** - API documentation configuration

## 🔧 Library Modules

### [`lib/`](lib/) - Core Business Logic
- **[auth.js](lib/auth.md)** - JWT token management, authentication middleware
- **[chart-generator.js](lib/chart-generator.md)** - Chart creation for reports and data visualization
- **[cron.js](lib/cron.md)** - Scheduled tasks and background jobs
- **[custom-generator.js](lib/custom-generator.md)** - Custom field and section generation
- **[cvsscalc31.js](lib/cvsscalc31.md)** - CVSS 3.1 scoring calculation and vulnerability assessment
- **[html2ooxml.js](lib/html2ooxml.md)** - HTML to DOCX conversion and report formatting
- **[httpResponse.js](lib/httpResponse.md)** - Standardized API response formatting
- **[passwordpolicy.js](lib/passwordpolicy.md)** - Password validation rules and security policies
- **[report-generator.js](lib/report-generator.md)** - Complete report generation system
- **[utils.js](lib/utils.md)** - Utility functions and helper methods

## 🗃️ Data Models

### [`models/`](models/) - MongoDB Schema Documentation
- **[audit.js](models/audit.md)** - Audit schema, lifecycle management, relationships
- **[audit-type.js](models/audit-type.md)** - Audit type definitions and categorization
- **[client.js](models/client.md)** - Client schema, contact information, associations
- **[company.js](models/company.md)** - Company schema, organizational structure, branding
- **[custom-field.js](models/custom-field.md)** - Custom field definitions and validation
- **[custom-section.js](models/custom-section.md)** - Custom section schema and integration
- **[image.js](models/image.md)** - Image storage, metadata, file handling
- **[language.js](models/language.md)** - Language definitions and i18n support
- **[settings.js](models/settings.md)** - Application settings and system preferences
- **[template.js](models/template.md)** - Report templates and DOCX structure
- **[user.js](models/user.md)** - User schema, authentication, roles, permissions
- **[vulnerability.js](models/vulnerability.md)** - Vulnerability schema, CVSS scoring, findings
- **[vulnerability-category.js](models/vulnerability-category.md)** - Vulnerability categorization
- **[vulnerability-type.js](models/vulnerability-type.md)** - Vulnerability type definitions
- **[vulnerability-update.js](models/vulnerability-update.md)** - Vulnerability update tracking

## 🌐 API Routes

### [`routes/`](routes/) - API Endpoint Documentation
- **[audit.js](routes/audit.md)** - Audit API endpoints, CRUD operations, collaboration
- **[client.js](routes/client.md)** - Client management API endpoints
- **[company.js](routes/company.md)** - Company management API endpoints
- **[data.js](routes/data.md)** - Data management, export/import, bulk operations
- **[image.js](routes/image.md)** - Image upload, management, serving endpoints
- **[settings.js](routes/settings.md)** - Settings management API endpoints
- **[template.js](routes/template.md)** - Template management and customization
- **[user.js](routes/user.md)** - User management, authentication, authorization
- **[vulnerability.js](routes/vulnerability.md)** - Vulnerability management API endpoints

## 🌍 Internationalization

### [`translate/`](translate/) - Translation System
- **[Translation System](translate/translation-system.md)** - i18n implementation, language files
- **Supported Languages**: Spanish (es), French (fr), Dutch (nl), Russian (ru)

## 🧪 Testing

### [`tests/`](tests/) - Test Suite Documentation
- **[Test Overview](tests/test-overview.md)** - Testing strategy and patterns
- **[audit.test.js](tests/audit-test.md)** - Audit testing patterns and validation
- **[client.test.js](tests/client-test.md)** - Client API endpoint testing
- **[company.test.js](tests/company-test.md)** - Company testing patterns
- **[configs.test.js](tests/configs-test.md)** - Configuration testing
- **[data.test.js](tests/data-test.md)** - Data management testing
- **[index.test.js](tests/index-test.md)** - Main test suite setup
- **[lib.test.js](tests/lib-test.md)** - Library function testing
- **[role.test.js](tests/role-test.md)** - Role-based access control testing
- **[settings.test.js](tests/settings-test.md)** - Settings management testing
- **[template.test.js](tests/template-test.md)** - Template testing and validation
- **[unauthenticated.test.js](tests/unauthenticated-test.md)** - Unauthenticated endpoint testing
- **[user.test.js](tests/user-test.md)** - User management testing
- **[vulnerability.test.js](tests/vulnerability-test.md)** - Vulnerability testing and CVSS validation

## 🚀 Deployment & Infrastructure

### [`deployment/`](deployment/) - Deployment Documentation
- **[Docker Configuration](deployment/docker.md)** - Docker files and containerization
- **[SSL Certificates](deployment/ssl.md)** - SSL certificate management
- **[Package Dependencies](deployment/package.md)** - Dependencies and project configuration

## 📝 Code Examples

### [`examples/`](examples/) - Implementation Examples
- **[Common Patterns](examples/common-patterns.md)** - Reusable code patterns
- **[API Implementation](examples/api-implementation.md)** - Step-by-step API development
- **[Model Implementation](examples/model-implementation.md)** - Database model patterns
- **[Testing Examples](examples/testing-examples.md)** - Test implementation patterns

## 🔍 Quick Reference

### Database Collections
- **14 MongoDB collections** documented with complete schema definitions
- **Relationship mappings** between collections
- **Indexing strategies** for performance optimization

### API Endpoints
- **70+ API endpoints** across 9 route handlers
- **Authentication patterns** and middleware implementation
- **Error handling** and response formatting

### Security Features
- **JWT authentication** with refresh tokens
- **Role-based access control** (RBAC) system
- **Input validation** and sanitization
- **HTTPS configuration** and SSL management

## 📖 Related Documentation

- **[Main Backend Guide](../development/backend.md)** - Comprehensive backend development guide
- **[API Integration](../development/api-integration.md)** - Complete API reference
- **[Database Schema](../architecture/database-schema.md)** - Database design and relationships
- **[System Architecture](../architecture/system-overview.md)** - High-level system design

---

*This documentation is organized to provide immediate access to implementation details for Software Engineers working on the pwndoc-ng backend. Each component includes code examples, implementation patterns, and best practices.* 