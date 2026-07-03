async function loadDashboard() {
  try {
    const response = await api.getDashboardStats();
    
    if (!response.success) {
      throw new Error(response.message);
    }

    const { stats, monthlyData, upcomingRenewals, recentAlerts } = response;

    // Update KPI Cards
    document.querySelector('.monthly-spend').textContent = `$${stats.monthlySpend.toLocaleString()}`;
    document.querySelector('.active-count').textContent = stats.activeSubscriptions;
    document.querySelector('.potential-savings').textContent = `$${stats.potentialSavings}`;
    document.querySelector('.renewals-count').textContent = stats.renewalsThisMonth;

    // Update Chart (if you use Chart.js)
    if (window.myChart) {
      window.myChart.data.labels = monthlyData.map(d => d.month);
      window.myChart.data.datasets[0].data = monthlyData.map(d => d.spend);
      window.myChart.update();
    }

    // Update Alerts
    const alertsContainer = document.querySelector('.alerts-container');
    if (alertsContainer) {
      alertsContainer.innerHTML = recentAlerts.map(a => `
        <div class="alert-item p-4 rounded-lg border-l-4 ${
          a.severity === 'danger' ? 'border-red-500 bg-red-50' :
          a.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' :
          'border-blue-500 bg-blue-50'
        }">
          <h4 class="font-bold">${a.title}</h4>
          <p class="text-sm text-gray-600">${a.message}</p>
          ${a.potentialSavings > 0 ? `<p class="text-green-600">Save $${a.potentialSavings}/mo</p>` : ''}
        </div>
      `).join('');
    }

  } catch (error) {
    console.error('Dashboard Error:', error);
    if (error.message.includes('token')) {
      api.logout();
    }
  }
}

// Load on page ready
document.addEventListener('DOMContentLoaded', loadDashboard);
