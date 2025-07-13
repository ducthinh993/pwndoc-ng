# HTML to OOXML Converter Library Documentation

## Overview

The `backend/src/lib/html2ooxml.js` file provides comprehensive HTML to OOXML conversion functionality for pwndoc-ng. It converts HTML content from the rich text editor into OOXML (Office Open XML) format, which is used for generating DOCX reports. The library handles complex HTML structures including tables, lists, code blocks, formatting, and syntax highlighting.

## Table of Contents

1. [Dependencies & Setup](#dependencies--setup)
2. [Core Functionality](#core-functionality)
3. [HTML Element Support](#html-element-support)
4. [Syntax Highlighting](#syntax-highlighting)
5. [Table Processing](#table-processing)
6. [List Processing](#list-processing)
7. [Text Formatting](#text-formatting)
8. [Link Handling](#link-handling)
9. [Code Block Processing](#code-block-processing)
10. [Usage Examples](#usage-examples)
11. [Integration](#integration)

---

## Dependencies & Setup

### Required Dependencies
```javascript
let docx = require("docx");
let xml = require("xml");
let htmlparser = require("htmlparser2");
```

### Module Dependencies
- **docx**: Library for creating DOCX documents
- **xml**: XML generation and manipulation
- **htmlparser2**: Fast HTML parser for processing HTML content

### Module Export
```javascript
module.exports = html2ooxml;
```

---

## Core Functionality

### Main Function
```javascript
function html2ooxml(html, style = "")
```

**Parameters:**
- `html` (string): HTML content to convert
- `style` (string, optional): Default paragraph style to apply

**Returns:** OOXML string representation of the HTML content

### Conversion Process
1. **HTML Parsing**: Uses htmlparser2 to parse HTML structure
2. **DOCX Generation**: Creates docx.Document with appropriate elements
3. **XML Conversion**: Converts DOCX structure to XML
4. **Post-processing**: Applies final formatting and link processing

### Input Preprocessing
```javascript
if (html === "") return html;
if (!html.match(/^<.+>/)) html = `<p>${html}</p>`;
```

**Features:**
- **Empty Check**: Returns empty string if no content
- **Auto-wrapping**: Wraps plain text in paragraph tags
- **HTML Validation**: Ensures proper HTML structure

---

## HTML Element Support

### Heading Elements
```javascript
// Supported heading levels
case 'h1': cParagraph = new docx.Paragraph({ heading: "Heading1" });
case 'h2': cParagraph = new docx.Paragraph({ heading: "Heading2" });
case 'h3': cParagraph = new docx.Paragraph({ heading: "Heading3" });
case 'h4': cParagraph = new docx.Paragraph({ heading: "Heading4" });
case 'h5': cParagraph = new docx.Paragraph({ heading: "Heading5" });
case 'h6': cParagraph = new docx.Paragraph({ heading: "Heading6" });
```

**Features:**
- **Heading Styles**: Maps HTML headings to DOCX heading styles
- **Hierarchy**: Maintains proper heading hierarchy
- **Formatting**: Uses built-in DOCX heading formatting

### Paragraph Elements
```javascript
case 'div':
case 'p':
  if (style && typeof style === 'string') {
    cParagraphProperties.style = style
  }
  cParagraph = new docx.Paragraph(cParagraphProperties)
```

**Features:**
- **Style Application**: Applies custom paragraph styles
- **Div/P Handling**: Treats div and p elements similarly
- **Property Management**: Manages paragraph properties

### List Elements
```javascript
case 'ul':
case 'ol':
  list_state.push({ type: tag, level: list_state.length });
  
case 'li':
  cParagraph = new docx.Paragraph({
    numbering: {
      reference: `${list_state[list_state.length - 1].type}-${list_state.length - 1}`,
      level: list_state.length - 1
    }
  });
```

**Features:**
- **Nested Lists**: Supports multiple nesting levels
- **List Types**: Handles both ordered (ol) and unordered (ul) lists
- **Level Tracking**: Maintains proper list hierarchy

### Table Elements
```javascript
case 'table': inTable = true;
case 'tr': inTableRow = true;
case 'td': 
case 'th':
  inTableCell = true;
  tmpCellContent = [];
```

**Features:**
- **Table Structure**: Supports complete table structures
- **Cell Types**: Handles both data cells (td) and header cells (th)
- **Content Management**: Manages cell content and formatting

---

## Syntax Highlighting

### Highlight Color Map
```javascript
const HIGHLIGHT_COLOR_MAP = {
  'hljs-keyword': '#569CD6',    // Blue - Keywords
  'hljs-built_in': '#DCDCAA',   // Yellow - Built-in functions
  'hljs-type': '#4EC9B0',       // Turquoise - Types
  'hljs-string': '#CE9178',     // Orange - Strings
  'hljs-comment': '#6A9955',    // Green - Comments
  'hljs-number': '#B5CEA8',     // Light green - Numbers
  // ... more color mappings
};
```

### Syntax Highlighting Process
```javascript
case 'span':
  if (inCodeBlock && attribs.class && HIGHLIGHT_COLOR_MAP[attribs.class]) {
    cRunProperties.color = HIGHLIGHT_COLOR_MAP[attribs.class];
  }
```

**Features:**
- **VS Code Theme**: Uses VS Code Dark theme colors
- **Language Support**: Supports all highlight.js language tokens
- **Color Consistency**: Maintains consistent color scheme

### Code Block Handling
```javascript
case 'pre':
  inCodeBlock = true;
  cParagraph = new docx.Paragraph({
    style: "CodeBlockStyle"
  });
```

**Features:**
- **Code Block Style**: Applies specific styling to code blocks
- **Syntax Preservation**: Maintains original code formatting
- **Highlight Integration**: Integrates with syntax highlighting

---

## Table Processing

### Table Structure Management
```javascript
// Table state variables
let inTable = false;
let inTableRow = false;
let inTableCell = false;
let tmpTable = [];
let tmpCells = [];
let tmpCellContent = [];
```

### Table Creation Process
1. **Table Detection**: Identifies table start/end tags
2. **Row Processing**: Handles table rows (tr)
3. **Cell Processing**: Processes table cells (td/th)
4. **Content Management**: Manages cell content and formatting
5. **Table Assembly**: Assembles complete table structure

### Cell Content Processing
```javascript
case 'td':
case 'th':
  tmpAttribs = attribs;
  inTableCell = true;
  cellHasText = false;
  tmpCellContent = [];
```

**Features:**
- **Cell Attributes**: Preserves cell attributes (colspan, rowspan, etc.)
- **Header Detection**: Distinguishes header cells from data cells
- **Content Tracking**: Tracks cell content and formatting

---

## List Processing

### List State Management
```javascript
let list_state = [];

// List tracking
case 'ul':
case 'ol':
  list_state.push({ type: tag, level: list_state.length });
```

### Nested List Support
```javascript
case 'li':
  cParagraph = new docx.Paragraph({
    numbering: {
      reference: `${list_state[list_state.length - 1].type}-${list_state.length - 1}`,
      level: list_state.length - 1
    }
  });
```

**Features:**
- **Nesting Levels**: Supports multiple nesting levels
- **List Types**: Handles ordered and unordered lists
- **Numbering**: Maintains proper list numbering and bullets

---

## Text Formatting

### Run Properties Management
```javascript
let cRunProperties = {};

// Bold formatting
case 'b':
case 'strong':
  cRunProperties.bold = true;

// Italic formatting
case 'i':
case 'em':
  cRunProperties.italics = true;

// Underline formatting
case 'u':
  cRunProperties.underline = {};
```

### Text Processing
```javascript
ontext(text) {
  if (text && cParagraph) {
    if (inTableCell) {
      cellHasText = true;
    }
    cRunProperties.text = text;
    cParagraph.addChildElement(new docx.TextRun(cRunProperties));
  }
}
```

**Features:**
- **Formatting Support**: Bold, italic, underline, strike-through
- **Property Tracking**: Manages multiple formatting properties
- **Text Runs**: Creates appropriate text runs with formatting

---

## Link Handling

### Link Processing
```javascript
case 'a':
  if (attribs.href) {
    cRunProperties.link = attribs.href;
  }
```

### Link Text Processing
```javascript
ontext(text) {
  if (cRunProperties.link) {
    cParagraph.addChildElement(new docx.TextRun({ 
      "text": `{_|link|_{${text}|-|${cRunProperties.link}}_|link|_}`, 
      "style": "PwndocLink" 
    }));
  }
}
```

### Link Post-processing
```javascript
// Final link replacement
dataXml = dataXml.replace(
  /\{_\|link\|_\{(.*?)\|\-\|(.*?)\}_\|link\|_\}/gm, 
  '<w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> HYPERLINK $2 </w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:rStyle w:val="PwndocLink"/></w:rPr><w:t> $1 </w:t> </w:r><w:r><w:fldChar w:fldCharType="end"/></w:r>'
);
```

**Features:**
- **Hyperlink Support**: Creates proper Word hyperlinks
- **Link Styling**: Applies custom link styling
- **URL Preservation**: Maintains original URLs

---

## Code Block Processing

### Code Block Detection
```javascript
case 'pre':
  inCodeBlock = true;
  cParagraph = new docx.Paragraph({
    style: "CodeBlockStyle"
  });
```

### Code Text Processing
```javascript
ontext(text) {
  if (inCodeBlock) {
    if (cRunProperties.color) {
      cParagraph.addChildElement(
        new docx.TextRun({
          text,
          color: cRunProperties.color,
        })
      );
    } else {
      cParagraph.addChildElement(
        new docx.TextRun({ text })
      );
    }
  }
}
```

**Features:**
- **Code Styling**: Applies monospace font and styling
- **Syntax Highlighting**: Integrates with highlight.js colors
- **Whitespace Preservation**: Maintains code formatting

---

## Usage Examples

### Basic HTML Conversion
```javascript
const html2ooxml = require('./lib/html2ooxml');

// Simple paragraph conversion
const html = '<p>This is a <strong>bold</strong> paragraph.</p>';
const ooxml = html2ooxml(html);

// With custom style
const ooxml = html2ooxml(html, "CustomParagraphStyle");
```

### Complex Content Conversion
```javascript
const complexHtml = `
  <h1>Vulnerability Report</h1>
  <p>This report contains <em>critical</em> findings:</p>
  <ul>
    <li>SQL Injection vulnerability</li>
    <li>Cross-site scripting (XSS)</li>
  </ul>
  <table>
    <tr>
      <th>Severity</th>
      <th>Count</th>
    </tr>
    <tr>
      <td>High</td>
      <td>5</td>
    </tr>
  </table>
`;

const ooxml = html2ooxml(complexHtml);
```

### Code Block Conversion
```javascript
const codeHtml = `
  <pre><code class="language-javascript">
    <span class="hljs-keyword">function</span> <span class="hljs-title">example</span>() {
      <span class="hljs-keyword">return</span> <span class="hljs-string">"Hello World"</span>;
    }
  </code></pre>
`;

const ooxml = html2ooxml(codeHtml);
```

---

## Integration

### Report Generator Integration
```javascript
// In report-generator.js
const html2ooxml = require('./html2ooxml');

function processVulnerabilityDescription(vuln) {
  const descriptionOOXML = html2ooxml(vuln.description);
  const proofOfConceptOOXML = html2ooxml(vuln.poc);
  
  return {
    description: descriptionOOXML,
    poc: proofOfConceptOOXML
  };
}
```

### Template Processing
```javascript
// Template variable replacement
function replaceTemplateVariables(template, data) {
  const processedData = {};
  
  Object.keys(data).forEach(key => {
    if (typeof data[key] === 'string' && data[key].includes('<')) {
      processedData[key] = html2ooxml(data[key]);
    } else {
      processedData[key] = data[key];
    }
  });
  
  return processedData;
}
```

### API Integration
```javascript
// In API routes
app.post('/api/convert-html', (req, res) => {
  const { html, style } = req.body;
  
  try {
    const ooxml = html2ooxml(html, style);
    res.json({ success: true, ooxml });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## Performance Considerations

### Optimization Strategies
- **Efficient Parsing**: Uses fast htmlparser2 for HTML parsing
- **Memory Management**: Efficient memory usage for large documents
- **Streaming**: Processes content in streaming fashion

### Large Document Handling
```javascript
// For large documents, consider chunking
function processLargeHtml(html) {
  const chunks = splitHtmlIntoChunks(html);
  let result = '';
  
  chunks.forEach(chunk => {
    result += html2ooxml(chunk);
  });
  
  return result;
}
```

---

## Error Handling

### Common Error Scenarios
1. **Invalid HTML**: Malformed HTML structure
2. **Unsupported Elements**: HTML elements not yet supported
3. **Memory Issues**: Large document processing
4. **Encoding Issues**: Character encoding problems

### Error Handling Implementation
```javascript
function safeHtml2ooxml(html, style = "") {
  try {
    return html2ooxml(html, style);
  } catch (error) {
    console.error('HTML to OOXML conversion error:', error);
    return `<p>Error processing content: ${error.message}</p>`;
  }
}
```

---

## Future Enhancements

### Potential Improvements
1. **Additional Elements**: Support for more HTML elements
2. **CSS Support**: CSS styling interpretation
3. **Image Processing**: Enhanced image handling
4. **Performance**: Optimization for large documents
5. **Validation**: HTML validation and sanitization

### Extension Points
- **Custom Handlers**: Plugin system for custom element handlers
- **Style Mapping**: Configurable style mapping
- **Post-processors**: Custom post-processing functions

---

This HTML to OOXML converter provides essential functionality for transforming rich text content into professional DOCX documents, enabling comprehensive and visually appealing vulnerability reports in pwndoc-ng. 