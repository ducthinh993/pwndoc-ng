# CVSS 3.1 Calculator Library Documentation

## Overview

The `backend/src/lib/cvsscalc31.js` file provides a complete implementation of the Common Vulnerability Scoring System (CVSS) version 3.1 specification. This library is used throughout pwndoc-ng to calculate vulnerability scores, severity ratings, and generate standardized vector strings for security assessment reporting.

## Table of Contents

1. [License & Copyright](#license--copyright)
2. [Core Functions](#core-functions)
3. [CVSS Metrics](#cvss-metrics)
4. [Score Calculation](#score-calculation)
5. [Vector String Processing](#vector-string-processing)
6. [Severity Ratings](#severity-ratings)
7. [Data Structures](#data-structures)
8. [Usage Examples](#usage-examples)
9. [Error Handling](#error-handling)
10. [Integration](#integration)

---

## License & Copyright

### Copyright Notice
```
Copyright (c) 2019, FIRST.ORG, INC.
All rights reserved.
```

### License
- **License Type**: BSD 3-Clause License
- **Source**: FIRST.ORG (Forum of Incident Response and Security Teams)
- **Usage**: Freely redistributable with attribution

### Version History
- **CVSS 3.1 Updates (2019-06-01)**: Enhanced rounding functions, environmental formula improvements, naming changes
- **Original Implementation**: Based on CVSS v3.0 specification

---

## Core Functions

### Primary Calculation Functions

#### `calculateCVSSFromMetrics()`
```javascript
CVSS31.calculateCVSSFromMetrics(
  AV, AC, PR, UI, S, C, I, A,     // Base metrics (required)
  E, RL, RC,                      // Temporal metrics (optional)
  CR, IR, AR,                     // Environmental Requirements (optional)
  MAV, MAC, MPR, MUI, MS, MC, MI, MA  // Modified Base metrics (optional)
)
```

**Parameters:**
- **Base Metrics** (Required):
  - `AV` (Attack Vector): N (Network), A (Adjacent), L (Local), P (Physical)
  - `AC` (Attack Complexity): L (Low), H (High)
  - `PR` (Privileges Required): N (None), L (Low), H (High)
  - `UI` (User Interaction): N (None), R (Required)
  - `S` (Scope): U (Unchanged), C (Changed)
  - `C` (Confidentiality Impact): N (None), L (Low), H (High)
  - `I` (Integrity Impact): N (None), L (Low), H (High)
  - `A` (Availability Impact): N (None), L (Low), H (High)

- **Temporal Metrics** (Optional):
  - `E` (Exploit Code Maturity): X (Not Defined), U (Unproven), P (Proof-of-Concept), F (Functional), H (High)
  - `RL` (Remediation Level): X (Not Defined), O (Official Fix), T (Temporary Fix), W (Workaround), U (Unavailable)
  - `RC` (Report Confidence): X (Not Defined), U (Unknown), R (Reasonable), C (Confirmed)

- **Environmental Metrics** (Optional):
  - `CR`, `IR`, `AR` (Security Requirements): X (Not Defined), L (Low), M (Medium), H (High)
  - `MAV`, `MAC`, `MPR`, `MUI`, `MS`, `MC`, `MI`, `MA` (Modified Base Metrics): X (Not Defined) or same values as base metrics

#### `calculateCVSSFromVector()`
```javascript
CVSS31.calculateCVSSFromVector(vectorString)
```

**Parameters:**
- `vectorString` (string): CVSS 3.1 vector string format
- **Format**: `"CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"`

### Utility Functions

#### `roundUp1()`
```javascript
CVSS31.roundUp1(input)
```
**Purpose**: Performs precise rounding to one decimal place using integer arithmetic to eliminate floating-point precision errors.

#### `severityRating()`
```javascript
CVSS31.severityRating(score)
```
**Purpose**: Converts numerical CVSS score to severity rating name.

---

## CVSS Metrics

### Base Metrics (Required)
Base metrics represent the intrinsic characteristics of a vulnerability.

#### Attack Vector (AV)
- **Network (N)**: 0.85 - Remotely exploitable
- **Adjacent Network (A)**: 0.62 - Local network access required
- **Local (L)**: 0.55 - Local access required
- **Physical (P)**: 0.20 - Physical access required

#### Attack Complexity (AC)
- **Low (L)**: 0.77 - No specialized conditions
- **High (H)**: 0.44 - Specialized conditions required

#### Privileges Required (PR)
- **None (N)**: 0.85 - No privileges required
- **Low (L)**: 0.62 (Unchanged scope) / 0.68 (Changed scope)
- **High (H)**: 0.27 (Unchanged scope) / 0.50 (Changed scope)

#### User Interaction (UI)
- **None (N)**: 0.85 - No user interaction
- **Required (R)**: 0.62 - User interaction required

#### Scope (S)
- **Unchanged (U)**: 6.42 - Impact limited to vulnerable component
- **Changed (C)**: 7.52 - Impact beyond vulnerable component

#### Impact Metrics (C, I, A)
- **High (H)**: 0.56 - Total impact
- **Low (L)**: 0.22 - Partial impact
- **None (N)**: 0.00 - No impact

### Temporal Metrics (Optional)
Temporal metrics reflect characteristics that change over time.

#### Exploit Code Maturity (E)
- **Not Defined (X)**: 1.00 - Default
- **Unproven (U)**: 0.91 - No exploit code available
- **Proof-of-Concept (P)**: 0.94 - Proof-of-concept code available
- **Functional (F)**: 0.97 - Functional exploit code available
- **High (H)**: 1.00 - Automated exploit available

#### Remediation Level (RL)
- **Not Defined (X)**: 1.00 - Default
- **Official Fix (O)**: 0.95 - Official fix available
- **Temporary Fix (T)**: 0.96 - Temporary fix available
- **Workaround (W)**: 0.97 - Workaround available
- **Unavailable (U)**: 1.00 - No solution available

#### Report Confidence (RC)
- **Not Defined (X)**: 1.00 - Default
- **Unknown (U)**: 0.92 - Unknown confidence
- **Reasonable (R)**: 0.96 - Reasonable confidence
- **Confirmed (C)**: 1.00 - Confirmed vulnerability

### Environmental Metrics (Optional)
Environmental metrics customize the score based on deployment environment.

#### Security Requirements (CR, IR, AR)
- **Not Defined (X)**: 1.00 - Default
- **Low (L)**: 0.5 - Low importance
- **Medium (M)**: 1.0 - Medium importance
- **High (H)**: 1.5 - High importance

---

## Score Calculation

### Base Score Formula
```javascript
Impact = 1 - ((1 - C) * (1 - I) * (1 - A))
Exploitability = 8.22 * AV * AC * PR * UI

if (Scope === "Unchanged") {
  BaseScore = roundUp1(min((Impact + Exploitability), 10))
} else {
  BaseScore = roundUp1(min(1.08 * (Impact + Exploitability), 10))
}
```

### Temporal Score Formula
```javascript
TemporalScore = roundUp1(BaseScore * E * RL * RC)
```

### Environmental Score Formula
```javascript
ModifiedImpact = min(1 - ((1 - MC * CR) * (1 - MI * IR) * (1 - MA * AR)), 0.915)
ModifiedExploitability = 8.22 * MAV * MAC * MPR * MUI

if (ModifiedScope === "Unchanged") {
  EnvironmentalScore = roundUp1(roundUp1(min((ModifiedImpact + ModifiedExploitability), 10)) * E * RL * RC)
} else {
  EnvironmentalScore = roundUp1(roundUp1(min(1.08 * (ModifiedImpact + ModifiedExploitability), 10)) * E * RL * RC)
}
```

---

## Vector String Processing

### Vector String Format
```
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H[/E:F/RL:O/RC:C][/CR:H/IR:H/AR:H/MAV:N/MAC:L/MPR:N/MUI:N/MS:U/MC:H/MI:H/MA:H]
```

### Vector String Components
- **Version**: CVSS:3.1 (required)
- **Base Metrics**: AV, AC, PR, UI, S, C, I, A (required)
- **Temporal Metrics**: E, RL, RC (optional)
- **Environmental Metrics**: CR, IR, AR, MAV, MAC, MPR, MUI, MS, MC, MI, MA (optional)

### Vector String Validation
```javascript
CVSS31.vectorStringRegex_31 = /^CVSS:3\.[01]\/((AV:[NALP]|AC:[LH]|PR:[UNLH]|UI:[NR]|S:[UC]|[CIA]:[NLH]|E:[XUPFH]|RL:[XOTWU]|RC:[XURC]|[CIA]R:[XLMH]|MAV:[XNALP]|MAC:[XLH]|MPR:[XUNLH]|MUI:[XNR]|MS:[XUC]|M[CIA]:[XNLH])\/){0,18}$/
```

---

## Severity Ratings

### Severity Rating Scale
```javascript
CVSS31.severityRatings = [
  { name: "None",     bottom: 0.0, top: 0.0 },
  { name: "Low",      bottom: 0.1, top: 3.9 },
  { name: "Medium",   bottom: 4.0, top: 6.9 },
  { name: "High",     bottom: 7.0, top: 8.9 },
  { name: "Critical", bottom: 9.0, top: 10.0 }
]
```

### Severity Rating Function
```javascript
const severity = CVSS31.severityRating(7.5);  // Returns "High"
```

---

## Data Structures

### Function Return Structure
```javascript
{
  success: true,
  baseScore: 9.8,
  baseSeverity: "Critical",
  temporalScore: 8.5,
  temporalSeverity: "High",
  environmentalScore: 9.2,
  environmentalSeverity: "Critical",
  vectorString: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
  // Sub-formula values
  baseMetricScore: {
    exploitabilitySubScore: 3.9,
    impactSubScore: 5.9
  },
  temporalMetricScore: {
    exploitCodeMaturity: 0.97,
    remediationLevel: 0.95,
    reportConfidence: 1.00
  },
  environmentalMetricScore: {
    modifiedImpactSubScore: 5.9,
    modifiedExploitabilitySubScore: 3.9
  }
}
```

### Error Response Structure
```javascript
{
  success: false,
  errorType: "MissingBaseMetric",
  errorMetrics: ["AV", "AC"]
}
```

---

## Usage Examples

### Basic CVSS Score Calculation
```javascript
const CVSS31 = require('./lib/cvsscalc31');

// Calculate from individual metrics
const result = CVSS31.calculateCVSSFromMetrics(
  'N', 'L', 'N', 'N', 'U', 'H', 'H', 'H',  // Base metrics
  'F', 'O', 'C',                             // Temporal metrics
  'H', 'H', 'H',                             // Environmental requirements
  'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'    // Modified base metrics
);

if (result.success) {
  console.log(`Base Score: ${result.baseScore} (${result.baseSeverity})`);
  console.log(`Temporal Score: ${result.temporalScore} (${result.temporalSeverity})`);
  console.log(`Environmental Score: ${result.environmentalScore} (${result.environmentalSeverity})`);
  console.log(`Vector String: ${result.vectorString}`);
}
```

### Vector String Calculation
```javascript
const vectorString = "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H";
const result = CVSS31.calculateCVSSFromVector(vectorString);

if (result.success) {
  console.log(`Score: ${result.baseScore} (${result.baseSeverity})`);
}
```

### Severity Rating Lookup
```javascript
const score = 7.5;
const severity = CVSS31.severityRating(score);
console.log(`Score ${score} is ${severity}`);  // "Score 7.5 is High"
```

---

## Error Handling

### Error Types
1. **MissingBaseMetric**: Required base metric not provided
2. **UnknownMetricValue**: Invalid metric value provided
3. **MalformedVectorString**: Vector string doesn't match expected format
4. **MultipleDefinitionsOfMetric**: Metric defined multiple times in vector string

### Error Response Examples
```javascript
// Missing base metric
{
  success: false,
  errorType: "MissingBaseMetric",
  errorMetrics: ["AV", "AC"]
}

// Invalid metric value
{
  success: false,
  errorType: "UnknownMetricValue",
  errorMetrics: ["AV", "PR"]
}

// Malformed vector string
{
  success: false,
  errorType: "MalformedVectorString"
}
```

### Input Validation
```javascript
// Validate metrics before calculation
const requiredMetrics = ['AV', 'AC', 'PR', 'UI', 'S', 'C', 'I', 'A'];
const validValues = {
  AV: ['N', 'A', 'L', 'P'],
  AC: ['L', 'H'],
  PR: ['N', 'L', 'H'],
  UI: ['N', 'R'],
  S: ['U', 'C'],
  C: ['N', 'L', 'H'],
  I: ['N', 'L', 'H'],
  A: ['N', 'L', 'H']
};
```

---

## Integration

### pwndoc-ng Integration
The CVSS 3.1 calculator is integrated throughout the application:

#### Vulnerability Model
```javascript
// In vulnerability.js model
const CVSS31 = require('../lib/cvsscalc31');

// Calculate CVSS score when vulnerability is saved
vulnerabilitySchema.pre('save', function() {
  if (this.cvssv3) {
    const result = CVSS31.calculateCVSSFromVector(this.cvssv3);
    if (result.success) {
      this.cvssScore = result.baseScore;
      this.severity = result.baseSeverity;
    }
  }
});
```

#### Report Generation
```javascript
// In report-generator.js
const CVSS31 = require('./cvsscalc31');

function generateVulnerabilityReport(vulnerabilities) {
  vulnerabilities.forEach(vuln => {
    const cvssResult = CVSS31.calculateCVSSFromVector(vuln.cvssv3);
    vuln.calculatedScore = cvssResult.baseScore;
    vuln.severityRating = cvssResult.baseSeverity;
  });
}
```

#### Frontend API
```javascript
// In vulnerability routes
app.post('/api/vulnerabilities/calculate-cvss', (req, res) => {
  const { vectorString } = req.body;
  const result = CVSS31.calculateCVSSFromVector(vectorString);
  res.json(result);
});
```

### Performance Considerations
- **Calculation Speed**: Fast mathematical operations
- **Memory Usage**: Minimal memory footprint
- **Caching**: Results can be cached for repeated calculations
- **Validation**: Input validation prevents invalid calculations

---

## Constants and Configuration

### Global Constants
```javascript
CVSS31.CVSSVersionIdentifier = "CVSS:3.1";
CVSS31.exploitabilityCoefficient = 8.22;
CVSS31.scopeCoefficient = 1.08;
```

### Weight Definitions
Complete weight definitions for all metrics are stored in `CVSS31.Weight` object, providing the numerical values used in score calculations.

---

## Future Enhancements

### Potential Improvements
1. **CVSS 4.0 Support**: Upgrade to newer CVSS version when available
2. **Batch Processing**: Calculate multiple vulnerabilities efficiently
3. **Custom Severity Scales**: Support for organization-specific severity scales
4. **Validation Extensions**: Enhanced input validation and error messages
5. **Performance Optimization**: Optimized calculations for large datasets

### Integration Opportunities
1. **Real-time Calculation**: Live CVSS calculation in UI
2. **Bulk Import**: CVSS calculation during bulk vulnerability import
3. **Reporting**: Enhanced reporting with CVSS analysis
4. **API Extensions**: RESTful API for external integrations

---

This CVSS 3.1 calculator provides comprehensive, standards-compliant vulnerability scoring functionality for pwndoc-ng, enabling accurate risk assessment and professional security reporting. 