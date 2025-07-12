import { api } from 'boot/axios'

// Simple in-memory cache with TTL
class ChartCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, value) {
    const item = {
      value,
      timestamp: Date.now()
    }
    this.cache.set(key, item)
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    const isExpired = Date.now() - item.timestamp > this.ttl
    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  clear() {
    this.cache.clear()
  }

  delete(key) {
    this.cache.delete(key)
  }
}

const chartCache = new ChartCache()

export default {
  /**
   * Get complete chart data for a specific audit
   * @param {string} auditId - The audit ID
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise} Promise resolving to chart data
   */
  getAuditChartData: function(auditId, useCache = true) {
    const cacheKey = `audit-chart-${auditId}`
    
    if (useCache) {
      const cached = chartCache.get(cacheKey)
      if (cached) {
        return Promise.resolve(cached)
      }
    }

    return api.get(`charts/audit/${auditId}`)
      .then(response => {
        const data = response.data.datas
        if (useCache) {
          chartCache.set(cacheKey, data)
        }
        return data
      })
      .catch(err => {
        console.error('Error fetching audit chart data:', err)
        throw this.handleApiError(err)
      })
  },

  /**
   * Get CVSS severity distribution for a specific audit
   * @param {string} auditId - The audit ID
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise} Promise resolving to severity chart data
   */
  getAuditSeverityData: function(auditId, useCache = true) {
    const cacheKey = `audit-severity-${auditId}`
    
    if (useCache) {
      const cached = chartCache.get(cacheKey)
      if (cached) {
        return Promise.resolve(cached)
      }
    }

    return api.get(`charts/audit/${auditId}/severity`)
      .then(response => {
        const data = response.data.datas
        if (useCache) {
          chartCache.set(cacheKey, data)
        }
        return data
      })
      .catch(err => {
        console.error('Error fetching audit severity data:', err)
        throw this.handleApiError(err)
      })
  },

  /**
   * Get category distribution for a specific audit
   * @param {string} auditId - The audit ID
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise} Promise resolving to category chart data
   */
  getAuditCategoryData: function(auditId, useCache = true) {
    const cacheKey = `audit-category-${auditId}`
    
    if (useCache) {
      const cached = chartCache.get(cacheKey)
      if (cached) {
        return Promise.resolve(cached)
      }
    }

    return api.get(`charts/audit/${auditId}/categories`)
      .then(response => {
        const data = response.data.datas
        if (useCache) {
          chartCache.set(cacheKey, data)
        }
        return data
      })
      .catch(err => {
        console.error('Error fetching audit category data:', err)
        throw this.handleApiError(err)
      })
  },

  /**
   * Get vulnerability type distribution for a specific audit
   * @param {string} auditId - The audit ID
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise} Promise resolving to type chart data
   */
  getAuditTypeData: function(auditId, useCache = true) {
    const cacheKey = `audit-type-${auditId}`
    
    if (useCache) {
      const cached = chartCache.get(cacheKey)
      if (cached) {
        return Promise.resolve(cached)
      }
    }

    return api.get(`charts/audit/${auditId}/types`)
      .then(response => {
        const data = response.data.datas
        if (useCache) {
          chartCache.set(cacheKey, data)
        }
        return data
      })
      .catch(err => {
        console.error('Error fetching audit type data:', err)
        throw this.handleApiError(err)
      })
  },

  /**
   * Get status distribution for a specific audit
   * @param {string} auditId - The audit ID
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Promise} Promise resolving to status chart data
   */
  getAuditStatusData: function(auditId, useCache = true) {
    const cacheKey = `audit-status-${auditId}`
    
    if (useCache) {
      const cached = chartCache.get(cacheKey)
      if (cached) {
        return Promise.resolve(cached)
      }
    }

    return api.get(`charts/audit/${auditId}/status`)
      .then(response => {
        const data = response.data.datas
        if (useCache) {
          chartCache.set(cacheKey, data)
        }
        return data
      })
      .catch(err => {
        console.error('Error fetching audit status data:', err)
        throw this.handleApiError(err)
      })
  },

  /**
   * Transform severity data to Chart.js pie chart format
   * @param {Object} severityData - Raw severity data from API
   * @returns {Object} Chart.js formatted data
   */
  transformSeverityToPieChart: function(severityData) {
    if (!severityData || !severityData.severityStats) {
      return { labels: [], datasets: [] }
    }

    const stats = severityData.severityStats
    const colors = severityData.colors || {}

    const labels = []
    const data = []
    const backgroundColor = []

    // Order severity levels consistently
    const severityOrder = ['critical', 'high', 'medium', 'low', 'information']
    
    severityOrder.forEach(severity => {
      if (stats[severity] > 0) {
        labels.push(this.capitalizeSeverity(severity))
        data.push(stats[severity])
        backgroundColor.push(colors[severity] || this.getDefaultColor(severity))
      }
    })

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    }
  },

  /**
   * Transform severity data to Chart.js bar chart format
   * @param {Object} severityData - Raw severity data from API
   * @returns {Object} Chart.js formatted data
   */
  transformSeverityToBarChart: function(severityData) {
    if (!severityData || !severityData.severityStats) {
      return { labels: [], datasets: [] }
    }

    const stats = severityData.severityStats
    const colors = severityData.colors || {}

    const labels = []
    const data = []
    const backgroundColor = []

    // Order severity levels consistently
    const severityOrder = ['critical', 'high', 'medium', 'low', 'information']
    
    severityOrder.forEach(severity => {
      labels.push(this.capitalizeSeverity(severity))
      data.push(stats[severity] || 0)
      backgroundColor.push(colors[severity] || this.getDefaultColor(severity))
    })

    return {
      labels,
      datasets: [{
        label: 'Vulnerabilities',
        data,
        backgroundColor,
        borderWidth: 1,
        borderColor: backgroundColor.map(color => this.darkenColor(color, 0.2))
      }]
    }
  },

  /**
   * Transform category data to Chart.js format
   * @param {Object} categoryData - Raw category data from API
   * @returns {Object} Chart.js formatted data
   */
  transformCategoryToChart: function(categoryData) {
    if (!categoryData || !categoryData.categoryStats) {
      return { labels: [], datasets: [] }
    }

    const stats = categoryData.categoryStats
    const labels = Object.keys(stats)
    const data = Object.values(stats)
    
    // Generate colors for categories
    const backgroundColor = this.generateColors(labels.length)

    return {
      labels,
      datasets: [{
        data,
        backgroundColor,
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    }
  },

  /**
   * Transform type data to Chart.js format
   * @param {Object} typeData - Raw type data from API
   * @returns {Object} Chart.js formatted data
   */
  transformTypeToChart: function(typeData) {
    if (!typeData || !typeData.typeStats) {
      return { labels: [], datasets: [] }
    }

    const stats = typeData.typeStats
    const labels = Object.keys(stats)
    const data = Object.values(stats)
    
    // Generate colors for types
    const backgroundColor = this.generateColors(labels.length)

    return {
      labels,
      datasets: [{
        label: 'Vulnerability Types',
        data,
        backgroundColor,
        borderWidth: 1,
        borderColor: backgroundColor.map(color => this.darkenColor(color, 0.2))
      }]
    }
  },

  /**
   * Handle API errors consistently
   * @param {Error} error - The error object
   * @returns {Error} Processed error
   */
  handleApiError: function(error) {
    if (error.response) {
      // API responded with error status
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.datas || 'Unknown error'
      
      switch (status) {
        case 401:
          return new Error('Authentication required')
        case 403:
          return new Error('Access denied')
        case 404:
          return new Error('Audit not found')
        case 500:
          return new Error('Server error')
        default:
          return new Error(`API Error: ${message}`)
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error - please check your connection')
    } else {
      // Other error
      return new Error(error.message || 'Unknown error occurred')
    }
  },

  /**
   * Capitalize severity string
   * @param {string} severity - Severity level
   * @returns {string} Capitalized severity
   */
  capitalizeSeverity: function(severity) {
    return severity.charAt(0).toUpperCase() + severity.slice(1)
  },

  /**
   * Get default color for severity level
   * @param {string} severity - Severity level
   * @returns {string} Hex color
   */
  getDefaultColor: function(severity) {
    const colors = {
      critical: '#212121',
      high: '#fe0000',
      medium: '#f9a009',
      low: '#008000',
      information: '#4a86e8'
    }
    return colors[severity] || '#666666'
  },

  /**
   * Generate array of colors
   * @param {number} count - Number of colors needed
   * @returns {Array} Array of hex colors
   */
  generateColors: function(count) {
    const colors = [
      '#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6',
      '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
    ]
    
    const result = []
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length])
    }
    return result
  },

  /**
   * Darken a color by percentage
   * @param {string} color - Hex color
   * @param {number} percent - Percentage to darken (0-1)
   * @returns {string} Darkened hex color
   */
  darkenColor: function(color, percent) {
    const num = parseInt(color.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent * 100)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
  },

  /**
   * Clear all cached data
   */
  clearCache: function() {
    chartCache.clear()
  },

  /**
   * Clear cache for specific audit
   * @param {string} auditId - The audit ID
   */
  clearAuditCache: function(auditId) {
    const keys = [
      `audit-chart-${auditId}`,
      `audit-severity-${auditId}`,
      `audit-category-${auditId}`,
      `audit-type-${auditId}`,
      `audit-status-${auditId}`
    ]
    
    keys.forEach(key => chartCache.delete(key))
  }
} 