<template src='./charts.html'></template>

<script src='./charts.js'></script>

<style lang="scss" scoped>
.charts-page {
  background-color: #f5f5f5;
  min-height: calc(100vh - 64px);
}

.charts-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.charts-content {
  max-width: 1400px;
  margin: 0 auto;
}

.chart-section {
  background: transparent;
}

.empty-state {
  background: white;
  border-radius: 8px;
  margin: 40px auto;
  max-width: 600px;
}

// Responsive design
@media (max-width: 1024px) {
  .charts-content {
    padding: 16px;
  }
  
  .charts-header {
    padding: 16px;
  }
  
  .charts-header .row {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .charts-header .col-auto:last-child {
    align-self: flex-end;
  }
}

@media (max-width: 768px) {
  .charts-content {
    padding: 12px;
  }
  
  .charts-header {
    padding: 12px;
  }
  
  .charts-header h4 {
    font-size: 1.25rem;
  }
  
  .q-btn-group {
    width: 100%;
  }
  
  .q-btn-group .q-btn {
    flex: 1;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .charts-content {
    padding: 8px;
  }
  
  .charts-header {
    padding: 8px;
  }
  
  .chart-section h5 {
    font-size: 1rem;
  }
}

// Dark mode support
body.body--dark {
  .charts-page {
    background-color: #121212;
  }
  
  .charts-header {
    background: #1e1e1e;
    border-bottom-color: #424242;
  }
  
  .empty-state {
    background: #1e1e1e;
    border: 1px solid #424242;
  }
  
  .chart-section h5 {
    color: #e0e0e0;
  }
}
</style> 