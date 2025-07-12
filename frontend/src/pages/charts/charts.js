import { defineComponent } from 'vue'
import { Notify } from 'quasar'

import Breadcrumb from 'components/breadcrumb.vue'
import PieChart from 'components/charts/PieChart.vue'
import BarChart from 'components/charts/BarChart.vue'

import ChartService from '@/services/chart'
import UserService from '@/services/user'

export default defineComponent({
  name: 'ChartsPage',
  
  components: {
    Breadcrumb,
    PieChart,
    BarChart
  },

  data() {
    return {
      UserService: UserService,
      auditId: null,
      
      // Loading states
      loading: {
        severity: false,
        category: false,
        type: false,
        status: false
      },
      
      // Error states
      errors: {
        severity: null,
        category: null,
        type: null,
        status: null
      },
      
      // Chart data
      chartData: {
        severity: null,
        category: null,
        type: null,
        status: null
      },
      
      // Chart display options
      chartOptions: {
        pie: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const dataset = context.dataset
                  const total = dataset.data.reduce((sum, value) => sum + value, 0)
                  const percentage = total > 0 ? ((context.raw / total) * 100).toFixed(1) : 0
                  return `${context.label}: ${context.raw} (${percentage}%)`
                }
              }
            }
          }
        },
        bar: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1
              }
            }
          }
        }
      },
      
      // UI state
      selectedView: 'all', // 'all', 'severity', 'category'
      
      // Breadcrumb props
      parentState: null,
      parentApprovals: null,
      
      // Processed chart data to avoid circular references
      processedChartData: {
        severityPie: { labels: [], datasets: [] },
        severityBar: { labels: [], datasets: [] },
        category: { labels: [], datasets: [] },
        type: { labels: [], datasets: [] }
      }
    }
  },

  computed: {
    // Loading states
    isLoading() {
      return Object.values(this.loading).some(state => state)
    },
    
    hasErrors() {
      return Object.values(this.errors).some(error => error !== null)
    },
    
    // Chart visibility
    showAllCharts() {
      return this.selectedView === 'all'
    },
    
    showSeverityOnly() {
      return this.selectedView === 'severity'
    },
    
    showCategoryOnly() {
      return this.selectedView === 'category'
    },
    
    // Safe chart data getters
    severityPieData() {
      return this.processedChartData.severityPie
    },
    
    severityBarData() {
      return this.processedChartData.severityBar
    },
    
    categoryChartData() {
      return this.processedChartData.category
    },
    
    typeChartData() {
      return this.processedChartData.type
    }
  },

  async mounted() {
    this.auditId = this.$route.params.auditId
    if (this.auditId) {
      await this.loadAllChartData()
    } else {
      this.showError('No audit ID provided')
    }
  },

  methods: {
    // Data transformation methods
    transformChartData() {
      try {
        // Create a new object to avoid reactivity issues
        const newProcessedData = {
          severityPie: { labels: [], datasets: [] },
          severityBar: { labels: [], datasets: [] },
          category: { labels: [], datasets: [] },
          type: { labels: [], datasets: [] }
        }
        
        // Transform severity data
        if (this.chartData.severity) {
          newProcessedData.severityPie = ChartService.transformSeverityToPieChart(this.chartData.severity)
          newProcessedData.severityBar = ChartService.transformSeverityToBarChart(this.chartData.severity)
        }
        
        // Transform category data  
        if (this.chartData.category) {
          newProcessedData.category = ChartService.transformCategoryToChart(this.chartData.category)
        }
        
        // Transform type data
        if (this.chartData.type) {
          newProcessedData.type = ChartService.transformTypeToChart(this.chartData.type)
        }
        
        // Replace the entire object to avoid reactivity issues
        this.processedChartData = newProcessedData
      } catch (error) {
        console.error('Error transforming chart data:', error)
        this.showError(`Failed to transform chart data: ${error.message}`)
      }
    },
    
    // Data loading methods
    async loadAllChartData() {
      const promises = [
        this.loadSeverityData(),
        this.loadCategoryData(), 
        this.loadTypeData()
      ]
      
      await Promise.allSettled(promises)
      this.transformChartData()
    },

    async loadSeverityData() {
      if (!this.auditId) return
      
      this.loading.severity = true
      this.errors.severity = null
      
      try {
        const data = await ChartService.getAuditSeverityData(this.auditId)
        this.chartData.severity = data
      } catch (error) {
        console.error('Error loading severity data:', error)
        this.errors.severity = error.message
        this.showError(`Failed to load severity data: ${error.message}`)
      } finally {
        this.loading.severity = false
      }
    },

    async loadCategoryData() {
      if (!this.auditId) return
      
      this.loading.category = true
      this.errors.category = null
      
      try {
        const data = await ChartService.getAuditCategoryData(this.auditId)
        this.chartData.category = data
      } catch (error) {
        console.error('Error loading category data:', error)
        this.errors.category = error.message
        this.showError(`Failed to load category data: ${error.message}`)
      } finally {
        this.loading.category = false
      }
    },

    async loadTypeData() {
      if (!this.auditId) return
      
      this.loading.type = true
      this.errors.type = null
      
      try {
        const data = await ChartService.getAuditTypeData(this.auditId)
        this.chartData.type = data
      } catch (error) {
        console.error('Error loading type data:', error)
        this.errors.type = error.message
        this.showError(`Failed to load type data: ${error.message}`)
      } finally {
        this.loading.type = false
      }
    },

    // Chart control methods
    async refreshChart(chartType) {
      switch (chartType) {
        case 'severity':
          await this.loadSeverityData()
          break
        case 'category':
          await this.loadCategoryData()
          break
        case 'type':
          await this.loadTypeData()
          break
        default:
          await this.loadAllChartData()
      }
      this.transformChartData()
    },

    async refreshAllCharts() {
      await this.loadAllChartData()
      this.showSuccess('Charts refreshed successfully')
    },

    exportChart(chartType) {
      // Chart export functionality can be implemented here
      console.log(`Exporting ${chartType} chart`)
      this.showSuccess(`${chartType} chart export started`)
    },

    changeView(view) {
      this.selectedView = view
    },

    showError(message) {
      Notify.create({
        type: 'negative',
        message: message,
        timeout: 5000,
        position: 'top'
      })
    },

    showSuccess(message) {
      Notify.create({
        type: 'positive', 
        message: message,
        timeout: 3000,
        position: 'top'
      })
    },

    getPieChartOptions() {
      return this.chartOptions.pie
    },

    getBarChartOptions() {
      return this.chartOptions.bar
    }
  },

  watch: {
    '$route.params.auditId': {
      handler(newAuditId) {
        if (newAuditId && newAuditId !== this.auditId) {
          this.auditId = newAuditId
          this.loadAllChartData()
        }
      },
      immediate: true
    }
  }
}) 