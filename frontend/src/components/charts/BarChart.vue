<template>
  <div class="chart-wrapper">
    <canvas 
      :id="chartId"
      ref="chartCanvas"
      :aria-label="$t('barChartAriaLabel')"
      role="img"
    />
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  BarController
)

export default defineComponent({
  name: 'BarChart',
  props: {
    chartData: {
      type: Object,
      required: true
    },
    chartOptions: {
      type: Object,
      default: () => ({})
    },
    chartId: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    }
  },
  setup(props, { emit }) {
    const chartCanvas = ref(null)
    const chartInstance = ref(null)
    
    // Default chart options optimized for PwnDoc-ng
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            font: {
              size: 12
            },
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          cornerRadius: 6,
          displayColors: true,
          callbacks: {
            label: function(context) {
              const label = context.dataset.label || ''
              const value = context.parsed.y || 0
              return `${label}: ${value}`
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11
            },
            maxRotation: 45,
            minRotation: 0
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          },
          ticks: {
            font: {
              size: 11
            },
            stepSize: 1
          }
        }
      },
      animation: {
        duration: 750,
        easing: 'easeOutQuart'
      },
      // Better accessibility
      accessibility: {
        enabled: true
      }
    }

    // Merge default options with provided options
    const mergedOptions = computed(() => {
      return {
        ...defaultOptions,
        ...props.chartOptions
      }
    })

    // Watch for data changes and update chart
    watch(
      () => props.chartData,
      (newData) => {
        if (chartInstance.value && newData) {
          chartInstance.value.data = newData
          chartInstance.value.update()
        }
      },
      { deep: true }
    )

    // Watch for option changes
    watch(
      () => props.chartOptions,
      (newOptions) => {
        if (chartInstance.value) {
          chartInstance.value.options = mergedOptions.value
          chartInstance.value.update()
        }
      },
      { deep: true }
    )

    const renderChart = async () => {
      if (!chartCanvas.value) return

      // Validate chart data
      if (!props.chartData || !props.chartData.labels || !props.chartData.datasets) {
        console.warn('Invalid chart data provided to BarChart')
        return
      }

      await nextTick()

      // Destroy existing chart instance
      if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
      }

      try {
        // Create new chart instance
        chartInstance.value = new ChartJS(chartCanvas.value, {
          type: 'bar',
          data: props.chartData,
          options: mergedOptions.value
        })

        // Emit chart instance for parent component access
        emit('chart-created', chartInstance.value)
      } catch (error) {
        console.error('Error creating bar chart:', error)
        emit('chart-error', error)
      }
    }

    onMounted(() => {
      renderChart()
    })

    onUnmounted(() => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
      }
    })

    return {
      chartCanvas,
      chartInstance,
      renderChart
    }
  },
  emits: ['chart-created', 'chart-error']
})
</script>

<style lang="scss" scoped>
.chart-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
}

// Responsive adjustments
@media (max-width: 768px) {
  .chart-wrapper {
    :deep(.chartjs-legend) {
      font-size: 11px;
    }
  }
}

@media (max-width: 480px) {
  .chart-wrapper {
    :deep(.chartjs-legend) {
      font-size: 10px;
      padding: 10px;
    }
  }
}
</style> 