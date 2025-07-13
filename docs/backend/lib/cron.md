# Cron Jobs Library Documentation

## Overview

The `backend/src/lib/cron.js` file provides scheduled task functionality for pwndoc-ng using the node-cron library. It manages automated maintenance tasks, particularly cleanup of outdated audit reports based on system settings.

## Table of Contents

1. [Dependencies & Setup](#dependencies--setup)
2. [Scheduled Tasks](#scheduled-tasks)
3. [Report Cleanup Function](#report-cleanup-function)
4. [Configuration](#configuration)
5. [Usage](#usage)
6. [Error Handling](#error-handling)
7. [Performance Considerations](#performance-considerations)

---

## Dependencies & Setup

### Required Dependencies
```javascript
var cron = require('node-cron');
var Settings = require('mongoose').model('Settings');
var Audit = require('mongoose').model('Audit');
```

### Module Dependencies
- **node-cron**: Task scheduling library for Node.js
- **Settings Model**: Access to application settings
- **Audit Model**: Access to audit data and cleanup methods

### Module Export
```javascript
exports.cronJobs = cronJobs;
```

---

## Scheduled Tasks

### Main Cron Job Function
```javascript
function cronJobs() {
  // cron every day at 12:00  
  cron.schedule('0 12 * * *', () => {
    deleteOutdatedReportAutomation();
  });
}
```

### Schedule Configuration
- **Frequency**: Daily at 12:00 PM (noon)
- **Cron Expression**: `'0 12 * * *'`
- **Timezone**: Server timezone (typically UTC)

### Cron Expression Breakdown
```
0 12 * * *
│ │  │ │ │
│ │  │ │ └─── Day of week (0-7, 0=Sunday)
│ │  │ └───── Month (1-12)
│ │  └─────── Day of month (1-31)
│ └────────── Hour (0-23)
└──────────── Minute (0-59)
```

---

## Report Cleanup Function

### Function Implementation
```javascript
async function deleteOutdatedReportAutomation() {
  var settings = await Settings.getAll();
  if (settings.danger.enabled) {
    Audit.deleteOutdatedReportAutomation(settings.danger.public.nbdaydelete)
  }
}
```

### Functionality
- **Settings Check**: Retrieves system settings to determine if cleanup is enabled
- **Danger Mode**: Only runs when `settings.danger.enabled` is true
- **Day Threshold**: Uses `settings.danger.public.nbdaydelete` to determine deletion criteria
- **Audit Cleanup**: Delegates to `Audit.deleteOutdatedReportAutomation()` method

### Safety Mechanism
The function includes a safety check through the "danger" settings:
- **Enabled Check**: Cleanup only runs when explicitly enabled
- **Configuration**: Deletion threshold is configurable via settings
- **Protection**: Prevents accidental data loss

---

## Configuration

### Settings Structure
The cron job depends on the following settings configuration:
```javascript
{
  danger: {
    enabled: boolean,        // Enable/disable dangerous operations
    public: {
      nbdaydelete: number   // Number of days after which to delete reports
    }
  }
}
```

### Configuration Options
- **danger.enabled**: Master switch for enabling dangerous operations
- **danger.public.nbdaydelete**: Number of days to retain reports before deletion

### Example Configuration
```javascript
{
  danger: {
    enabled: true,
    public: {
      nbdaydelete: 90  // Delete reports older than 90 days
    }
  }
}
```

---

## Usage

### Application Integration
The cron jobs are typically initialized during application startup:

```javascript
const cron = require('./lib/cron');

// Start cron jobs
cron.cronJobs();
```

### Startup Integration
In `app.js` or main application file:
```javascript
// Initialize scheduled tasks
if (process.env.NODE_ENV === 'production') {
  require('./lib/cron').cronJobs();
}
```

### Manual Execution
For testing or manual cleanup:
```javascript
const cron = require('./lib/cron');

// Manual cleanup (for testing)
async function manualCleanup() {
  await deleteOutdatedReportAutomation();
}
```

---

## Error Handling

### Current Implementation
The current implementation has minimal error handling:
- Relies on the `Settings.getAll()` method for error handling
- Depends on `Audit.deleteOutdatedReportAutomation()` for cleanup errors

### Recommended Improvements
```javascript
async function deleteOutdatedReportAutomation() {
  try {
    var settings = await Settings.getAll();
    if (settings.danger && settings.danger.enabled) {
      await Audit.deleteOutdatedReportAutomation(settings.danger.public.nbdaydelete);
      console.log('Automated cleanup completed successfully');
    }
  } catch (error) {
    console.error('Error during automated cleanup:', error);
    // Could add logging or notification here
  }
}
```

### Error Scenarios
- **Settings unavailable**: Database connection issues
- **Cleanup failure**: Issues with audit deletion
- **Configuration errors**: Invalid settings values

---

## Performance Considerations

### Timing Considerations
- **Daily execution**: Runs once per day to minimize performance impact
- **Off-peak hours**: Scheduled at noon (adjust based on usage patterns)
- **Async operations**: Uses async/await for non-blocking execution

### Resource Usage
- **Memory**: Minimal memory footprint
- **CPU**: Depends on number of records to process
- **Database**: May impact database during cleanup operations

### Optimization Recommendations
- **Batch processing**: Process records in batches for large datasets
- **Indexing**: Ensure proper database indexes for date-based queries
- **Monitoring**: Add logging for performance monitoring

---

## Security Considerations

### Data Protection
- **Explicit enablement**: Requires explicit configuration to enable
- **Configurable retention**: Allows customization of retention periods
- **Audit trail**: Should log cleanup operations for audit purposes

### Access Control
- **Settings protection**: Secure access to danger settings
- **Role-based**: Only administrators should configure cleanup settings
- **Backup verification**: Ensure backups exist before cleanup

---

## Future Enhancements

### Potential Improvements
1. **Multiple schedules**: Support for different cleanup schedules
2. **Granular control**: Different retention periods for different audit types
3. **Notification system**: Email alerts for cleanup operations
4. **Backup integration**: Automatic backup before cleanup
5. **Metrics collection**: Track cleanup statistics

### Additional Cron Jobs
The framework supports adding more scheduled tasks:
```javascript
function cronJobs() {
  // Daily cleanup at noon
  cron.schedule('0 12 * * *', () => {
    deleteOutdatedReportAutomation();
  });
  
  // Weekly backup at midnight Sunday
  cron.schedule('0 0 * * 0', () => {
    performWeeklyBackup();
  });
  
  // Monthly statistics at 1 AM on 1st
  cron.schedule('0 1 1 * *', () => {
    generateMonthlyStats();
  });
}
```

---

## Monitoring and Logging

### Recommended Logging
```javascript
async function deleteOutdatedReportAutomation() {
  try {
    console.log('Starting automated cleanup process...');
    var settings = await Settings.getAll();
    
    if (settings.danger && settings.danger.enabled) {
      const deletedCount = await Audit.deleteOutdatedReportAutomation(settings.danger.public.nbdaydelete);
      console.log(`Automated cleanup completed: ${deletedCount} records deleted`);
    } else {
      console.log('Automated cleanup skipped: danger mode disabled');
    }
  } catch (error) {
    console.error('Error during automated cleanup:', error);
  }
}
```

### Health Monitoring
- **Execution tracking**: Monitor successful/failed executions
- **Performance metrics**: Track execution time and resource usage
- **Alert system**: Notify administrators of issues

---

This cron jobs library provides essential automated maintenance functionality for pwndoc-ng, ensuring efficient cleanup of outdated data while maintaining system performance and data integrity. 