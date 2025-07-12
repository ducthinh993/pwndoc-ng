module.exports = function(app) {

    var Response = require('../lib/httpResponse.js');
    var Audit = require('mongoose').model('Audit');
    var acl = require('../lib/auth').acl;
    var chartService = require('../services/chart');

    // Get complete chart data for specific audit
    app.get("/api/charts/audit/:auditId", acl.hasPermission('audits:read'), function(req, res) {
        // #swagger.tags = ['Charts']

        Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
        .then(audit => {
            if (!audit) {
                Response.NotFound(res, 'Audit not found or Insufficient Privileges');
                return;
            }
            
            return chartService.getAuditChartData(audit);
        })
        .then(chartData => {
            Response.Ok(res, chartData);
        })
        .catch(err => {
            Response.Internal(res, err);
        });
    });

    // Get CVSS severity distribution for specific audit
    app.get("/api/charts/audit/:auditId/severity", acl.hasPermission('audits:read'), function(req, res) {
        // #swagger.tags = ['Charts']

        Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
        .then(audit => {
            if (!audit) {
                Response.NotFound(res, 'Audit not found or Insufficient Privileges');
                return;
            }
            
            return chartService.getAuditSeverityData(audit);
        })
        .then(chartData => {
            Response.Ok(res, chartData);
        })
        .catch(err => {
            Response.Internal(res, err);
        });
    });

    // Get category distribution for specific audit
    app.get("/api/charts/audit/:auditId/categories", acl.hasPermission('audits:read'), function(req, res) {
        // #swagger.tags = ['Charts']

        Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
        .then(audit => {
            if (!audit) {
                Response.NotFound(res, 'Audit not found or Insufficient Privileges');
                return;
            }
            
            var chartData = chartService.getAuditCategoryData(audit);
            Response.Ok(res, chartData);
        })
        .catch(err => {
            Response.Internal(res, err);
        });
    });

    // Get vulnerability type distribution for specific audit
    app.get("/api/charts/audit/:auditId/types", acl.hasPermission('audits:read'), function(req, res) {
        // #swagger.tags = ['Charts']

        Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
        .then(audit => {
            if (!audit) {
                Response.NotFound(res, 'Audit not found or Insufficient Privileges');
                return;
            }
            
            var chartData = chartService.getAuditTypeData(audit);
            Response.Ok(res, chartData);
        })
        .catch(err => {
            Response.Internal(res, err);
        });
    });

    // Get status distribution for specific audit
    app.get("/api/charts/audit/:auditId/status", acl.hasPermission('audits:read'), function(req, res) {
        // #swagger.tags = ['Charts']

        Audit.getAudit(acl.isAllowed(req.decodedToken.role, 'audits:read-all'), req.params.auditId, req.decodedToken.id)
        .then(audit => {
            if (!audit) {
                Response.NotFound(res, 'Audit not found or Insufficient Privileges');
                return;
            }
            
            var chartData = chartService.getAuditStatusData(audit);
            Response.Ok(res, chartData);
        })
        .catch(err => {
            Response.Internal(res, err);
        });
    });

}; 