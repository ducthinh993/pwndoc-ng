# Report Generator Documentation

## Overview

The `backend/src/lib/report-generator.js` module is responsible for generating DOCX reports from audit data in the pwndoc-ng application. It uses docxtemplater to process Word document templates and converts structured audit data into professional security assessment reports with charts, images, and formatted content.

## Table of Contents

1. [Dependencies & Setup](#dependencies--setup)
2. [Main Functions](#main-functions)
3. [Document Generation Process](#document-generation-process)
4. [Data Preparation](#data-preparation)
5. [Angular Expression Filters](#angular-expression-filters)
6. [Image Processing](#image-processing)
7. [Chart Generation](#chart-generation)
8. [HTML to OOXML Conversion](#html-to-ooxml-conversion)
9. [CVSS Processing](#cvss-processing)
10. [Custom Fields & Sections](#custom-fields--sections)
11. [Internationalization](#internationalization)
12. [Template Processing](#template-processing)
13. [Usage Examples](#usage-examples)

---

## Dependencies & Setup

### Required Dependencies
```javascript
var fs = require('fs');
var Docxtemplater = require('docxtemplater');
var PizZip = require("pizzip");
var expressions = require('angular-expressions');
var ImageModule = require('docxtemplater-image-module-pwndoc');
var sizeOf = require('image-size');
var customGenerator = require('./custom-generator');
var chartGenerator = require('./chart-generator');
var utils = require('./utils');
var html2ooxml = require('./html2ooxml');
var _ = require('lodash');
var Image = require('mongoose').model('Image');
var Settings = require('mongoose').model('Settings');
var CVSS31 = require('./cvsscalc31.js');
var translate = require('../translate');
```

### Global Variables
```javascript
var $t                    // Translation function
var pieChartXML           // Pie chart XML content
var barChartXML           // Bar chart XML content  
var zip                   // ZIP file handler
var numberOfPieChart = 0  // Pie chart counter
var numberOfBarChart = 0  // Bar chart counter
var chartRelXml = ''      // Chart relationships XML
var chartContentTypeXml = '' // Chart content types XML
```

---

## Main Functions

### `generateDoc(audit)`
**Description**: Main function that generates a DOCX report from audit data

**Parameters:**
- `audit` (object): Complete audit data with findings, sections, and metadata

**Returns**: `Buffer` - Generated DOCX document as buffer

**Implementation:**
```javascript
async function generateDoc(audit) {
    var templatePath = `${__basedir}/../report-templates/${audit.template.name}.${audit.template.ext || 'docx'}`
    var content = fs.readFileSync(templatePath, "binary");
    
    zip = new PizZip(content);
    
    translate.setLocale(audit.language)
    $t = translate.translate

    // Set finding identifiers
    audit.findings.forEach((finding, index) => {
        finding.identifier = index + 1
    })

    var settings = await Settings.getAll();
    var preppedAudit = await prepAuditData(audit, settings)

    // Configure image module
    var opts = {};
    opts.getImage = function(tagValue, tagName) {
        if (tagValue !== "undefined") {
            tagValue = tagValue.split(",")[1];
            return Buffer.from(tagValue, 'base64');
        }
    }
    opts.getSize = function(img, tagValue, tagName) {
        if (img) {
            var sizeObj = sizeOf(img);
            var width = sizeObj.width;
            var height = sizeObj.height;
            
            // Handle specific image types
            if (tagName === "company.logo_small") {
                var divider = sizeObj.height / 37;
                height = 37;
                width = Math.floor(sizeObj.width / divider);
            }
            else if (tagName === "company.logo") {
                var divider = sizeObj.height / 250;
                height = 250;
                width = Math.floor(sizeObj.width / divider);
                if (width > 400) {
                    divider = sizeObj.width / 400;
                    height = Math.floor(sizeObj.height / divider);
                    width = 400;
                }
            }
            else if (sizeObj.width > 600) {
                var divider = sizeObj.width / 600;
                width = 600;
                height = Math.floor(sizeObj.height / divider);
            }
            return [width, height];
        }
        return [0, 0]
    }

    // Add image border if configured
    if (settings.report.private.imageBorder && settings.report.private.imageBorderColor)
        opts.border = settings.report.private.imageBorderColor.replace('#', '')

    try {
        var imageModule = new ImageModule(opts);
    } catch(err) {
        console.log(err)
    }
    
    // Configure docxtemplater
    var doc = new Docxtemplater(zip, {
        modules: [imageModule],
        parser: parser,
        paragraphLoop: true
    });
    
    // Apply custom generation
    customGenerator.apply(preppedAudit);

    try {
        doc.render(preppedAudit);
    } catch (error) {
        // Handle template errors
        if (error.properties.id === 'multi_error') {
            error.properties.errors.forEach(function(err) {
                console.log(err);
            });
        }
        if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors.map(function (error) {
                return `Explanation: ${error.properties.explanation}\nScope: ${JSON.stringify(error.properties.scope).substring(0,142)}...`
            }).join("\n\n");
            throw `Template Error:\n${errorMessages}`;
        }
        throw error
    }

    // Process chart relationships
    const relsPath = "word/_rels/document.xml.rels";
    let relsXml = zip.files[relsPath].asText();
    relsXml = relsXml.replace("</Relationships>", `${chartRelXml}</Relationships>`);
    zip.file(relsPath, relsXml);

    // Add chart style files
    const pieChartXMLs = {
        "word/charts/pieChart-style-pwndoc.xml": `<c:chartStyle xmlns:c="http://schemas.microsoft.com/office/drawing/2012/chartStyle"/>`,
        "word/charts/pieChart-colors-pwndoc.xml": `<c:chartColors xmlns:c="http://schemas.microsoft.com/office/drawing/2012/chartColor"/>`,
        "word/charts/barChart-style-pwndoc.xml": `<c:chartStyle xmlns:c="http://schemas.microsoft.com/office/drawing/2012/chartStyle"/>`,
        "word/charts/barChart-colors-pwndoc.xml": `<c:chartColors xmlns:c="http://schemas.microsoft.com/office/drawing/2012/chartColor"/>`
    };
    
    Object.keys(pieChartXMLs).forEach(path => {
        zip.file(path, pieChartXMLs[path]);
    });

    // Update content types
    const contentTypesPath = "[Content_Types].xml";
    let contentTypesXml = zip.files[contentTypesPath].asText();
    contentTypesXml = contentTypesXml.replace("</Types>", `${chartContentTypeXml}</Types>`);
    zip.file(contentTypesPath, contentTypesXml);

    var buf = doc.getZip().generate({type:"nodebuffer"});
    return buf;
}
```

---

## Data Preparation

### `prepAuditData(data, settings)`
**Description**: Prepares audit data for template processing

**Parameters:**
- `data` (object): Raw audit data from database
- `settings` (object): Application settings

**Returns**: `object` - Processed audit data ready for template

**Key Processing Steps:**
1. **Color Configuration**: Sets up CVSS severity colors and cell formatting
2. **Basic Fields**: Processes audit metadata (name, dates, type)
3. **Custom Fields**: Converts custom fields to template-friendly format
4. **Company/Client Data**: Formats company and client information
5. **Collaborators/Reviewers**: Processes user lists
6. **Findings Processing**: Comprehensive finding data preparation
7. **CVSS Scoring**: Calculates and formats CVSS scores
8. **Categories**: Groups findings by category
9. **Sections**: Processes custom sections with HTML content

**Implementation:**
```javascript
async function prepAuditData(data, settings) {
    // CVSS Colors for table cells
    var noneColor = settings.report.public.cvssColors.noneColor.replace('#', '');
    var lowColor = settings.report.public.cvssColors.lowColor.replace('#', '');
    var mediumColor = settings.report.public.cvssColors.mediumColor.replace('#', '');
    var highColor = settings.report.public.cvssColors.highColor.replace('#', '');
    var criticalColor = settings.report.public.cvssColors.criticalColor.replace('#', '');

    var cellNoneColor = '<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="' + noneColor + '"/></w:tcPr>';
    var cellLowColor = '<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="'+lowColor+'"/></w:tcPr>';
    var cellMediumColor = '<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="'+mediumColor+'"/></w:tcPr>';
    var cellHighColor = '<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="'+highColor+'"/></w:tcPr>';
    var cellCriticalColor = '<w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="'+criticalColor+'"/></w:tcPr>';

    var result = {}
    result.name = data.name || "undefined"
    result.auditType = $t(data.auditType) || "undefined"
    result.date = data.date || "undefined"
    result.date_start = data.date_start || "undefined"
    result.date_end = data.date_end || "undefined"

    // Process custom fields
    if (data.customFields) {
        for (field of data.customFields) {
            var fieldType = field.customField.fieldType
            var label = field.customField.label
            
            if (fieldType === 'text')
                result[_.deburr(label.toLowerCase()).replace(/\s/g, '')] = await splitHTMLParagraphs(field.text)
            else if (fieldType !== 'space')
                result[_.deburr(label.toLowerCase()).replace(/\s/g, '')] = field.text
        }
    }

    // Company information
    result.company = {}
    if (data.company) {
        result.company.name = data.company.name || "undefined"
        result.company.shortName = data.company.shortName || result.company.name
        result.company.logo = data.company.logo || "undefined"
        result.company.logo_small = data.company.logo || "undefined"
    }

    // Client information
    result.client = {}
    if (data.client) {
        result.client.email = data.client.email || "undefined"
        result.client.firstname = data.client.firstname || "undefined"
        result.client.lastname = data.client.lastname || "undefined"
        result.client.phone = data.client.phone || "undefined"
        result.client.cell = data.client.cell || "undefined"
        result.client.title = data.client.title || "undefined"
    }

    // Process findings
    result.findings = []
    for (finding of data.findings) {
        var tmpCVSS = CVSS31.calculateCVSSFromVector(finding.cvssv3);
        var tmpFinding = {
            title: finding.title || "",
            vulnType: $t(finding.vulnType) || "",
            description: await splitHTMLParagraphs(finding.description),
            observation: await splitHTMLParagraphs(finding.observation),
            remediation: await splitHTMLParagraphs(finding.remediation),
            remediationComplexity: finding.remediationComplexity || "",
            priority: finding.priority || "",
            references: finding.references || [],
            poc: await splitHTMLParagraphs(finding.poc),
            affected: finding.scope || "",
            status: finding.status || "",
            category: $t(finding.category) || $t("No Category"),
            identifier: "IDX-" + utils.lPad(finding.identifier),
            unique_id: finding._id.toString()
        }

        // CVSS processing
        tmpFinding.cvss = {
            vectorString: tmpCVSS.vectorString || "",
            baseMetricScore: tmpCVSS.baseMetricScore || "",
            baseSeverity: tmpCVSS.baseSeverity || "",
            temporalMetricScore: tmpCVSS.temporalMetricScore || "",
            temporalSeverity: tmpCVSS.temporalSeverity || "",
            environmentalMetricScore: tmpCVSS.environmentalMetricScore || "",
            environmentalSeverity: tmpCVSS.environmentalSeverity || ""
        }

        // Color coding based on severity
        if (tmpCVSS.baseSeverity === "Low") tmpFinding.cvss.cellColor = cellLowColor
        else if (tmpCVSS.baseSeverity === "Medium") tmpFinding.cvss.cellColor = cellMediumColor
        else if (tmpCVSS.baseSeverity === "High") tmpFinding.cvss.cellColor = cellHighColor
        else if (tmpCVSS.baseSeverity === "Critical") tmpFinding.cvss.cellColor = cellCriticalColor
        else tmpFinding.cvss.cellColor = cellNoneColor

        // Custom fields processing
        if (finding.customFields) {
            for (field of finding.customFields) {
                var fieldType = field.customField ? field.customField.fieldType : field.fieldType
                var label = field.customField ? field.customField.label : field.label
                
                if (fieldType === 'text')
                    tmpFinding[_.deburr(label.toLowerCase()).replace(/\s/g, '').replace(/[^\w]/g, '_')] = await splitHTMLParagraphs(field.text)
                else if (fieldType !== 'space')
                    tmpFinding[_.deburr(label.toLowerCase()).replace(/\s/g, '').replace(/[^\w]/g, '_')] = field.text
            }
        }
        result.findings.push(tmpFinding)
    }

    // Group findings by category
    result.categories = _
        .chain(result.findings)
        .groupBy("category")
        .map((value,key) => {return {categoryName:key, categoryFindings:value}})
        .value()

    // Process sections
    for (section of data.sections) {
        var formatSection = {
            name: $t(section.name)
        }
        if (section.text) // Legacy support
            formatSection.text = await splitHTMLParagraphs(section.text)
        
        if (section.customFields) {
            for (field of section.customFields) {
                var fieldType = field.customField.fieldType
                var label = field.customField.label
                if (fieldType === 'text')
                    formatSection[_.deburr(label.toLowerCase()).replace(/\s/g, '').replace(/[^\w]/g, '_')] = await splitHTMLParagraphs(field.text)
                else if (fieldType !== 'space')
                    formatSection[_.deburr(label.toLowerCase()).replace(/\s/g, '').replace(/[^\w]/g, '_')] = field.text
            }
        }
        result[section.field] = formatSection
    }
    
    replaceSubTemplating(result)
    return result
}
```

---

## Angular Expression Filters

### Finding Filters

#### `uniqFindings`
**Description**: Removes duplicate findings based on title
```javascript
expressions.filters.uniqFindings = function (findings) {
    if (!findings) return findings;
    titles = [];
    filtered_findings = [];
    findings.forEach(function (f) {
        if (!(titles.includes(f.title))){
            titles.push(f.title);
            filtered_findings.push(f);
        }
    });
    return filtered_findings;
};
```

### Bookmark Filters

#### `bookmarkCreate`
**Description**: Creates Word document bookmarks
```javascript
expressions.filters.bookmarkCreate = function(input, refid = null) {
    let rand_id = Math.floor(Math.random() * 1000000 + 1000);
    let parsed_id = (refid ? refid : input).replace(/[^a-zA-Z0-9_]/g, '_').substring(0,40);

    if (input.indexOf('<w:r') !== 0) {
        input = '<w:r><w:t>' + input + '</w:t></w:r>';
    }

    return '<w:bookmarkStart w:id="' + rand_id + '" '
        + 'w:name="' + parsed_id + '"/>'
        + (refid ? input : '')
        + '<w:bookmarkEnd w:id="' + rand_id + '"/>';
}
```

#### `bookmarkLink`
**Description**: Creates hyperlinks to bookmarks
```javascript
expressions.filters.bookmarkLink = function(input, identifier) {
    identifier = identifier.replace(/[^a-zA-Z0-9_]/g, '_').substring(0,40);
    return '<w:hyperlink w:anchor="' + identifier + '">'
        + '<w:r><w:rPr><w:rStyle w:val="Hyperlink"/></w:rPr>'
        + '<w:t>' + input + '</w:t>'
        + '</w:r></w:hyperlink>';
}
```

#### `bookmarkRef`
**Description**: Creates dynamic field references
```javascript
expressions.filters.bookmarkRef = function(input) {
    return '<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve">'
        + ' REF ' + input.replace(/[^a-zA-Z0-9_]/g, '_').substring(0,40) + ' \\h </w:instrText></w:r>'
        + '<w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>'
        + input + '</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>';
}
```

### Text Processing Filters

#### `capfirst`
**Description**: Capitalizes first letter
```javascript
expressions.filters.capfirst = function(input) {
    if (!input || input == "undefined") return input;
    return input.replace(/^\w/, (c) => c.toUpperCase());
}
```

#### `changeID`
**Description**: Changes identifier prefix
```javascript
expressions.filters.changeID = function (input, prefix) {
    return input.replace("IDX-", prefix);
}
```

#### `d` (Default Value)
**Description**: Returns default value if input is falsy
```javascript
expressions.filters.d = function(input, s) {
    return (input && input != "undefined") ? input : s;
}
```

### Date Processing Filters

#### `convertDate`
**Description**: Converts date with specified format
```javascript
expressions.filters.convertDate = function(input, s) {
    var date = new Date(input);
    if (date != "Invalid Date") {
        var monthsFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var monthsShort = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var day = date.getUTCDate();
        var month = date.getUTCMonth();
        var year = date.getUTCFullYear();
        if (s === "full") {
            return days[date.getUTCDay()] + ", " + monthsFull[month] + " " + (day<10 ? '0'+day: day) + ", " + year;
        }
        if (s === "short") {
            return monthsShort[month] + "/" + (day<10 ? '0'+day: day) + "/" + year;
        }
    }
}
```

#### `convertDateLocale`
**Description**: Converts date with locale support
```javascript
expressions.filters.convertDateLocale = function(input, locale, style) {
    var date = new Date(input);
    if (date != "Invalid Date") {
        var options = { year: 'numeric', month: '2-digit', day: '2-digit'}
        if (style === "full")
            options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
        return date.toLocaleDateString(locale, options)
    }
}
```

#### `fromTo`
**Description**: Creates date range strings
```javascript
expressions.filters.fromTo = function(start, end, locale) {
    const start_date = new Date(start);
    const end_date = new Date(end);
    let options = {}, start_str = '', end_str = '';
    let str = "from {0} to {1}";

    if (start_date == "Invalid Date" || end_date == "Invalid Date") return start;

    options = {day: '2-digit', month: '2-digit', year: 'numeric'};
    end_str = end_date.toLocaleDateString(locale, options);

    if (start_date.getYear() != end_date.getYear()) {
        options = {day: '2-digit', month: '2-digit', year: 'numeric'};
        start_str = start_date.toLocaleDateString(locale, options);
    }
    else if (start_date.getMonth() != end_date.getMonth()) {
        options = {day: '2-digit', month: '2-digit'};
        start_str = start_date.toLocaleDateString(locale, options);
    }
    else if (start_date.getDay() != end_date.getDay()) {
        options = {day: '2-digit'};
        start_str = start_date.toLocaleDateString(locale, options);
    }
    else {
        str = "on {0}";
    }

    return $t(str, start_str, end_str);
}
```

---

## HTML to OOXML Conversion

### `splitHTMLParagraphs(data)`
**Description**: Converts HTML content to OOXML format with image handling

**Parameters:**
- `data` (string): HTML content to convert

**Returns**: `array` - Array of paragraph objects with text and images

**Implementation:**
```javascript
async function splitHTMLParagraphs(data) {
    var result = []
    if (!data)
        return result

    // Split by image tags
    var splitted = data.split(/(<img.+?src=".*?".+?alt=".*?".*?>)/)

    for (value of splitted){
        if (value.startsWith("<img")) {
            var src = value.match(/<img.+src="(.*?)"/) || ""
            var alt = value.match(/<img.+alt="(.*?)"/) || ""
            if (src && src.length > 1) src = src[1]
            if (alt && alt.length > 1) alt = _.unescape(alt[1])

            // Handle image sources
            if (!src.startsWith('data')){
                try {
                    src = (await Image.getOne(src)).value
                } catch (error) {
                    src = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA="
                }
            }
            if (result.length === 0)
                result.push({text: "", images: []})
            result[result.length-1].images.push({image: src, caption: alt})
        }
        else if (value === "") {
            continue
        }
        else {
            result.push({text: value, images: []})
        }
    }
    return result
}
```

**Features:**
- **Image Extraction**: Extracts images from HTML img tags
- **Base64 Handling**: Processes both data URLs and image references
- **Caption Support**: Extracts alt text as image captions
- **Paragraph Structure**: Maintains paragraph structure with embedded images

---

## CVSS Processing

### `cvssStrToObject(cvss)`
**Description**: Converts CVSS vector string to object format

**Parameters:**
- `cvss` (string): CVSS vector string

**Returns**: `object` - CVSS components as object

**Implementation:**
```javascript
function cvssStrToObject(cvss) {
    var res = {}
    if (cvss) {
        var splitted = cvss.split('/');
        for (var i = 0; i < splitted.length; i++) {
            var elt = splitted[i].split(':');
            if (elt.length === 2) {
                switch (elt[0]) {
                    case "AV":
                        if (elt[1] === "N") res.AV = "Network"
                        else if (elt[1] === "A") res.AV = "Adjacent Network"
                        else if (elt[1] === "L") res.AV = "Local"
                        else if (elt[1] === "P") res.AV = "Physical"
                        res.AV = $t(res.AV)
                        break;
                    case "AC":
                        if (elt[1] === "L") res.AC = "Low"
                        else if (elt[1] === "H") res.AC = "High"
                        res.AC = $t(res.AC)
                        break;
                    case "PR":
                        if (elt[1] === "N") res.PR = "None"
                        else if (elt[1] === "L") res.PR = "Low"
                        else if (elt[1] === "H") res.PR = "High"
                        res.PR = $t(res.PR)
                        break;
                    case "UI":
                        if (elt[1] === "N") res.UI = "None"
                        else if (elt[1] === "R") res.UI = "Required"
                        res.UI = $t(res.UI)
                        break;
                    case "S":
                        if (elt[1] === "U") res.S = "Unchanged"
                        else if (elt[1] === "C") res.S = "Changed"
                        res.S = $t(res.S)
                        break;
                    case "C":
                        if (elt[1] === "N") res.C = "None"
                        else if (elt[1] === "L") res.C = "Low"
                        else if (elt[1] === "H") res.C = "High"
                        res.C = $t(res.C)
                        break;
                    case "I":
                        if (elt[1] === "N") res.I = "None"
                        else if (elt[1] === "L") res.I = "Low"
                        else if (elt[1] === "H") res.I = "High"
                        res.I = $t(res.I)
                        break;
                    case "A":
                        if (elt[1] === "N") res.A = "None"
                        else if (elt[1] === "L") res.A = "Low"
                        else if (elt[1] === "H") res.A = "High"
                        res.A = $t(res.A)
                        break;
                }
            }
        }
    }
    return res
}
```

**CVSS Components:**
- **AV**: Attack Vector (Network, Adjacent Network, Local, Physical)
- **AC**: Attack Complexity (Low, High)
- **PR**: Privileges Required (None, Low, High)
- **UI**: User Interaction (None, Required)
- **S**: Scope (Unchanged, Changed)
- **C**: Confidentiality Impact (None, Low, High)
- **I**: Integrity Impact (None, Low, High)
- **A**: Availability Impact (None, Low, High)

---

## Template Processing

### `parser(tag)`
**Description**: Custom parser for docxtemplater expressions

**Features:**
- **Angular Expression Support**: Uses angular-expressions parser
- **Custom Filters**: Supports custom filter functions
- **Context Handling**: Manages template context and scope
- **Property Access**: Handles nested property access

### `replaceSubTemplating(o, originalData)`
**Description**: Replaces sub-template placeholders in processed data

**Parameters:**
- `o` (object): Object to process
- `originalData` (object): Original data for reference

**Pattern**: `{_{property.path}_}`

**Implementation:**
```javascript
function replaceSubTemplating(o, originalData = o){
    var regexp = /\{_\{([a-zA-Z0-9\[\]\_\.]{1,})\}_\}/gm;
    if (Array.isArray(o))
        o.forEach(key => replaceSubTemplating(key, originalData))
    else if (typeof o === 'object' && !!o) {
        Object.keys(o).forEach(key => {
            if (typeof o[key] === 'string') 
                o[key] = o[key].replace(regexp, (match, word) =>  _.get(originalData,word.trim(),''))
            else 
                replaceSubTemplating(o[key], originalData)
        })
    }
}
```

---

## Usage Examples

### Basic Report Generation
```javascript
const reportGenerator = require('./lib/report-generator');

// Generate report from audit data
const audit = await Audit.getAudit(isAdmin, auditId, userId);
const reportBuffer = await reportGenerator.generateDoc(audit);

// Save or send the report
fs.writeFileSync('report.docx', reportBuffer);
```

### Custom Template Processing
```javascript
// In template: {{name | capfirst}}
// Input: "security assessment"
// Output: "Security assessment"

// In template: {{findings | uniqFindings}}
// Removes duplicate findings based on title

// In template: {{date_start | convertDate: 'full'}}
// Input: "2024-01-15"
// Output: "Monday, January 15, 2024"
```

### Image Processing
```javascript
// In template: {{company.logo}}
// Automatically resizes and embeds company logo

// In template: {{findings[0].description}}
// Processes HTML with images and converts to OOXML
```

### CVSS Integration
```javascript
// In template: {{findings[0].cvss.baseMetricScore}}
// Displays calculated CVSS score

// In template: {{findings[0].cvss.cellColor}}
// Provides color-coded table cell formatting
```

### Custom Fields
```javascript
// Custom field "Executive Summary" becomes:
// {{executivesummary.text}}

// Custom field "Scope Details" becomes:
// {{scopedetails.text}}
```

---

## Error Handling

### Template Errors
```javascript
try {
    doc.render(preppedAudit);
} catch (error) {
    if (error.properties.id === 'multi_error') {
        error.properties.errors.forEach(function(err) {
            console.log(err);
        });
    }
    if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
            return `Explanation: ${error.properties.explanation}\nScope: ${JSON.stringify(error.properties.scope).substring(0,142)}...`
        }).join("\n\n");
        throw `Template Error:\n${errorMessages}`;
    }
    throw error
}
```

### Common Error Types
- **Template Syntax Errors**: Invalid docxtemplater syntax
- **Missing Data**: Referenced data not available
- **Image Processing Errors**: Invalid image format or missing images
- **CVSS Calculation Errors**: Invalid CVSS vectors
- **File System Errors**: Template file not found

---

## Performance Considerations

### Memory Management
- **Buffer Handling**: Efficient buffer management for large documents
- **Image Processing**: Optimized image resizing and embedding
- **Template Caching**: Templates are read once per generation

### Processing Optimization
- **Async Processing**: Asynchronous HTML and image processing
- **Chunked Processing**: Large findings lists processed efficiently
- **Selective Processing**: Only required data is processed

---

## Integration Points

### Dependencies
- **Custom Generator**: `./custom-generator` for additional processing
- **Chart Generator**: `./chart-generator` for chart creation
- **HTML2OOXML**: `./html2ooxml` for HTML conversion
- **CVSS Calculator**: `./cvsscalc31` for CVSS scoring
- **Image Model**: Database image retrieval
- **Settings Model**: Application configuration

### Template System
- **Template Location**: `${__basedir}/../report-templates/`
- **Supported Formats**: DOCX, DOC templates
- **Template Variables**: Extensive variable support
- **Custom Filters**: Extensible filter system

---

## Related Documentation

- **[Custom Generator](./custom-generator.md)** - Additional data processing
- **[Chart Generator](./chart-generator.md)** - Chart creation system
- **[HTML2OOXML](./html2ooxml.md)** - HTML to OOXML conversion
- **[CVSS Calculator](./cvsscalc31.md)** - CVSS scoring system
- **[Image Model](../models/image.md)** - Image management
- **[Settings Model](../models/settings.md)** - Application settings
- **[Audit Model](../models/audit.md)** - Audit data structure

---

*This report generator provides comprehensive document generation capabilities with support for professional formatting, charts, images, and internationalization for security audit reports.* 