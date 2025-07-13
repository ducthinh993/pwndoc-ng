# Chart Generator Library Documentation

## Overview

The `backend/src/lib/chart-generator.js` file provides chart generation functionality for pwndoc-ng reports. It generates XML-based charts that can be embedded in DOCX documents, specifically designed for vulnerability reporting and data visualization.

## Table of Contents

1. [Dependencies & Setup](#dependencies--setup)
2. [Core Functions](#core-functions)
3. [Pie Chart Generation](#pie-chart-generation)
4. [Bar Chart Generation](#bar-chart-generation)
5. [XML Structure](#xml-structure)
6. [Usage Examples](#usage-examples)
7. [Integration with Reports](#integration-with-reports)
8. [Customization Options](#customization-options)

---

## Dependencies & Setup

### Module Structure
```javascript
var chartGenerator = {};
// ... function definitions
module.exports = chartGenerator;
```

### Helper Functions
```javascript
const encodeHTMLEntities = s => s.replace(/[\u00A0-\u9999<>&]/g, i => '&#'+i.charCodeAt(0)+';')
```

**Purpose**: Safely encode HTML entities in text content to prevent XML parsing errors.

---

## Core Functions

### Available Chart Types
- **Pie Charts**: Vulnerability severity distribution
- **Bar Charts**: Customizable data visualization

### Chart Output Format
- **XML Format**: OpenXML format compatible with Microsoft Office
- **DOCX Integration**: Charts can be embedded directly in Word documents
- **Customizable Styling**: Colors, sizes, and labels can be configured

---

## Pie Chart Generation

### Function Signature
```javascript
chartGenerator.generatePieChart(title, colorCrit, colorHigh, colorMed, colorLow, countCritical, countHigh, countMedium, countLow, translate)
```

### Parameters
- **title** (string): Chart title displayed above the pie chart
- **colorCrit** (string): Hex color code for critical severity (e.g., "#FF0000")
- **colorHigh** (string): Hex color code for high severity (e.g., "#FF8000")
- **colorMed** (string): Hex color code for medium severity (e.g., "#FFFF00")
- **colorLow** (string): Hex color code for low severity (e.g., "#00FF00")
- **countCritical** (number): Number of critical vulnerabilities
- **countHigh** (number): Number of high severity vulnerabilities
- **countMedium** (number): Number of medium severity vulnerabilities
- **countLow** (number): Number of low severity vulnerabilities
- **translate** (function): Translation function for internationalization

### Return Value
Returns a complete XML string representing a pie chart in OpenXML format.

### Chart Features
- **Data Labels**: Shows count values for each segment
- **Color Customization**: Each severity level has its own color
- **Internationalization**: Severity labels are translatable
- **Layout**: Optimized for report integration with proper sizing

### Usage Example
```javascript
const chartXML = chartGenerator.generatePieChart(
    "Vulnerability Distribution",
    "#8B0000",  // Critical - Dark Red
    "#FF4500",  // High - Orange Red
    "#FFD700",  // Medium - Gold
    "#32CD32",  // Low - Lime Green
    5,          // 5 critical vulnerabilities
    12,         // 12 high vulnerabilities
    8,          // 8 medium vulnerabilities
    3,          // 3 low vulnerabilities
    (key) => translations[key] || key
);
```

---

## Bar Chart Generation

### Function Signature
```javascript
chartGenerator.generateBarChart(title, barColor, legendXML, valueXML, labelSize, labelColor)
```

### Parameters
- **title** (string): Chart title displayed above the bar chart
- **barColor** (string): Hex color code for bar fill color
- **legendXML** (string): XML structure for category labels
- **valueXML** (string): XML structure for data values
- **labelSize** (number): Font size for axis labels (in points)
- **labelColor** (string): Hex color code for label text

### Return Value
Returns a complete XML string representing a bar chart in OpenXML format.

### Chart Features
- **Horizontal Bars**: Displays data as horizontal bars
- **Data Labels**: Shows values on each bar
- **Custom Colors**: Configurable bar and label colors
- **Flexible Data**: Supports any number of categories and values

### Legend XML Structure
```xml
<c:ptCount val="3"/>
<c:pt idx="0"><c:v>Category 1</c:v></c:pt>
<c:pt idx="1"><c:v>Category 2</c:v></c:pt>
<c:pt idx="2"><c:v>Category 3</c:v></c:pt>
```

### Value XML Structure
```xml
<c:ptCount val="3"/>
<c:pt idx="0"><c:v>10</c:v></c:pt>
<c:pt idx="1"><c:v>25</c:v></c:pt>
<c:pt idx="2"><c:v>15</c:v></c:pt>
```

### Usage Example
```javascript
const legendXML = `
    <c:ptCount val="3"/>
    <c:pt idx="0"><c:v>Web Application</c:v></c:pt>
    <c:pt idx="1"><c:v>Network</c:v></c:pt>
    <c:pt idx="2"><c:v>Social Engineering</c:v></c:pt>
`;

const valueXML = `
    <c:ptCount val="3"/>
    <c:pt idx="0"><c:v>15</c:v></c:pt>
    <c:pt idx="1"><c:v>8</c:v></c:pt>
    <c:pt idx="2"><c:v>3</c:v></c:pt>
`;

const chartXML = chartGenerator.generateBarChart(
    "Vulnerabilities by Category",
    "#4472C4",    // Blue bars
    legendXML,
    valueXML,
    1200,         // 12pt font size
    "#000000"     // Black labels
);
```

---

## XML Structure

### OpenXML Chart Components
- **Chart Space**: Root container for the chart
- **Chart Area**: Main chart content area
- **Plot Area**: Data visualization area
- **Data Series**: Chart data and styling
- **Axes**: Category and value axes (for bar charts)
- **Legend**: Chart legend and labels

### Key XML Namespaces
- `c`: Chart namespace (`http://schemas.openxmlformats.org/drawingml/2006/chart`)
- `a`: Drawing namespace (`http://schemas.openxmlformats.org/drawingml/2006/main`)
- `r`: Relationships namespace (`http://schemas.openxmlformats.org/officeDocument/2006/relationships`)

### Chart Layout Properties
- **Title**: Centered above chart with 16pt font
- **Plot Area**: 80% width and height of chart space
- **Data Labels**: Displayed on chart elements
- **Colors**: Solid fill colors for chart elements

---

## Integration with Reports

### Report Generator Integration
The chart generator is used by the report generator (`report-generator.js`) to create visual elements in audit reports.

### Common Use Cases
1. **Vulnerability Severity Distribution**: Pie charts showing breakdown of findings by severity
2. **Category Analysis**: Bar charts showing vulnerabilities by category
3. **Trend Analysis**: Charts showing vulnerability trends over time
4. **Compliance Reporting**: Charts for compliance and remediation status

### DOCX Template Integration
Charts are embedded in DOCX templates using template variables and processed during report generation.

---

## Customization Options

### Color Schemes
- **Severity Colors**: Standard red/orange/yellow/green scheme
- **Corporate Colors**: Custom color schemes for branding
- **Accessibility**: High contrast color options

### Chart Styling
- **Font Sizes**: Configurable text sizes
- **Layout**: Adjustable chart dimensions
- **Labels**: Customizable label positioning and formatting

### Data Formatting
- **Number Formatting**: General number format for values
- **Percentage Display**: Optional percentage labels
- **Multi-language**: Support for translated labels

---

## Performance Considerations

### XML Generation
- **String Templates**: Efficient string concatenation
- **Entity Encoding**: Proper HTML entity encoding for safety
- **Memory Usage**: Reasonable for typical audit report sizes

### Integration
- **Caching**: Chart XML can be cached for repeated use
- **Lazy Loading**: Charts generated only when needed
- **Error Handling**: Graceful handling of invalid data

---

## Error Handling

### Input Validation
- **Color Validation**: Hex color codes should be validated
- **Data Validation**: Numeric values should be validated
- **XML Safety**: All text content is properly encoded

### Common Issues
- **Invalid Colors**: Malformed hex color codes
- **Invalid Data**: Non-numeric values in data arrays
- **XML Parsing**: Malformed XML structure

---

## Future Enhancements

### Potential Improvements
- **Additional Chart Types**: Line charts, scatter plots
- **Advanced Styling**: Gradients, shadows, effects
- **Interactive Features**: Drill-down capabilities
- **Data Validation**: Enhanced input validation

### Integration Opportunities
- **Real-time Updates**: Dynamic chart updates
- **Export Options**: SVG and PNG export
- **Template Engine**: Integration with template system

---

This chart generator provides essential data visualization capabilities for pwndoc-ng audit reports, enabling clear and professional presentation of vulnerability data and security metrics. 