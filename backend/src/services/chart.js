var CVSS31 = require('../lib/cvsscalc31');
var Settings = require('mongoose').model('Settings');

var chartService = {};

/**
 * Get CVSS severity distribution from findings
 * @param {Array} findings - Array of audit findings
 * @returns {Object} Severity distribution with counts
 */
chartService.getSeverityDistribution = function(findings) {
    var distribution = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        information: 0
    };

    if (!findings || !Array.isArray(findings)) {
        return distribution;
    }

    for (var i = 0; i < findings.length; i++) {
        var finding = findings[i];
        
        if (finding.cvssv3) {
            var cvss = CVSS31.calculateCVSSFromVector(finding.cvssv3);
            if (cvss.success) {
                var severity = cvss.baseSeverity.toLowerCase();
                if (distribution.hasOwnProperty(severity)) {
                    distribution[severity]++;
                }
            }
        }
    }

    return distribution;
};

/**
 * Get vulnerability type distribution from findings
 * @param {Array} findings - Array of audit findings
 * @returns {Object} Type distribution with counts
 */
chartService.getTypeDistribution = function(findings) {
    var distribution = {};

    if (!findings || !Array.isArray(findings)) {
        return distribution;
    }

    for (var i = 0; i < findings.length; i++) {
        var finding = findings[i];
        var type = finding.vulnType || 'Undefined';
        
        if (distribution[type]) {
            distribution[type]++;
        } else {
            distribution[type] = 1;
        }
    }

    return distribution;
};

/**
 * Get category distribution from findings
 * @param {Array} findings - Array of audit findings
 * @returns {Object} Category distribution with counts
 */
chartService.getCategoryDistribution = function(findings) {
    var distribution = {};

    if (!findings || !Array.isArray(findings)) {
        return distribution;
    }

    for (var i = 0; i < findings.length; i++) {
        var finding = findings[i];
        var category = finding.category || 'No Category';
        
        if (distribution[category]) {
            distribution[category]++;
        } else {
            distribution[category] = 1;
        }
    }

    return distribution;
};

/**
 * Get status distribution from findings
 * @param {Array} findings - Array of audit findings
 * @returns {Object} Status distribution with counts
 */
chartService.getStatusDistribution = function(findings) {
    var distribution = {
        done: 0,
        redacting: 0
    };

    if (!findings || !Array.isArray(findings)) {
        return distribution;
    }

    for (var i = 0; i < findings.length; i++) {
        var finding = findings[i];
        
        if (finding.status === 0) {
            distribution.done++;
        } else if (finding.status === 1) {
            distribution.redacting++;
        }
    }

    return distribution;
};

/**
 * Get complete chart data for an audit including pentest and retest statistics
 * @param {Object} audit - Audit object with findings
 * @returns {Promise} Promise resolving to complete chart data
 */
chartService.getAuditChartData = function(audit) {
    return new Promise((resolve, reject) => {
        Settings.getAll()
        .then(settings => {
            var allFindings = audit.findings || [];
            
            // For now, we'll treat all findings as pentest findings
            // In the future, this could be extended to differentiate between pentest and retest
            var pentestFindings = allFindings;
            var retestFindings = []; // This would be filtered based on some criteria
            
            var pentestStats = chartService.getSeverityDistribution(pentestFindings);
            var retestStats = chartService.getSeverityDistribution(retestFindings);
            
            var categoryStats = chartService.getCategoryDistribution(allFindings);
            var typeStats = chartService.getTypeDistribution(allFindings);
            var statusStats = chartService.getStatusDistribution(allFindings);
            
            var colors = {
                critical: settings.report.public.cvssColors.criticalColor,
                high: settings.report.public.cvssColors.highColor,
                medium: settings.report.public.cvssColors.mediumColor,
                low: settings.report.public.cvssColors.lowColor,
                information: settings.report.public.cvssColors.noneColor
            };

            var chartData = {
                pentestStats: pentestStats,
                retestStats: retestStats,
                categoryStats: categoryStats,
                typeStats: typeStats,
                statusStats: statusStats,
                colors: colors,
                totalFindings: allFindings.length
            };

            resolve(chartData);
        })
        .catch(err => {
            reject(err);
        });
    });
};

/**
 * Get severity-only chart data for an audit
 * @param {Object} audit - Audit object with findings
 * @returns {Promise} Promise resolving to severity chart data
 */
chartService.getAuditSeverityData = function(audit) {
    return new Promise((resolve, reject) => {
        Settings.getAll()
        .then(settings => {
            var allFindings = audit.findings || [];
            var severityStats = chartService.getSeverityDistribution(allFindings);
            
            var colors = {
                critical: settings.report.public.cvssColors.criticalColor,
                high: settings.report.public.cvssColors.highColor,
                medium: settings.report.public.cvssColors.mediumColor,
                low: settings.report.public.cvssColors.lowColor,
                information: settings.report.public.cvssColors.noneColor
            };

            var chartData = {
                severityStats: severityStats,
                colors: colors,
                totalFindings: allFindings.length
            };

            resolve(chartData);
        })
        .catch(err => {
            reject(err);
        });
    });
};

/**
 * Get category-only chart data for an audit
 * @param {Object} audit - Audit object with findings
 * @returns {Object} Category chart data
 */
chartService.getAuditCategoryData = function(audit) {
    var allFindings = audit.findings || [];
    var categoryStats = chartService.getCategoryDistribution(allFindings);
    
    return {
        categoryStats: categoryStats,
        totalFindings: allFindings.length
    };
};

/**
 * Get type-only chart data for an audit
 * @param {Object} audit - Audit object with findings
 * @returns {Object} Type chart data
 */
chartService.getAuditTypeData = function(audit) {
    var allFindings = audit.findings || [];
    var typeStats = chartService.getTypeDistribution(allFindings);
    
    return {
        typeStats: typeStats,
        totalFindings: allFindings.length
    };
};

/**
 * Get status-only chart data for an audit
 * @param {Object} audit - Audit object with findings
 * @returns {Object} Status chart data
 */
chartService.getAuditStatusData = function(audit) {
    var allFindings = audit.findings || [];
    var statusStats = chartService.getStatusDistribution(allFindings);
    
    return {
        statusStats: statusStats,
        totalFindings: allFindings.length
    };
};

module.exports = chartService; 