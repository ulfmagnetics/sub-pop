<template>
  <div class="dashboard">
    <div v-if="loading" class="spinner-container">
      <div class="spinner"></div>
      <p>Loading subscriptions...</p>
    </div>
    <div v-else>
      <div class="metrics-grid">
        <!-- Summary Cards -->
        <div class="metric-card">
          <h3>Total Monthly Cost</h3>
          <div class="metric-value">${{ totalMonthlyCost.toFixed(2) }}</div>
        </div>

        <div class="metric-card">
          <h3>Total Annual Cost</h3>
          <div class="metric-value">${{ totalAnnualCost.toFixed(2) }}</div>
        </div>

        <div class="metric-card">
          <h3>Active Subscriptions</h3>
          <div class="metric-value">{{ subscriptions.length }}</div>
        </div>

        <div class="metric-card">
          <h3>Average Value Rating</h3>
          <div class="metric-value">{{ averageValueRating.toFixed(1) }}/5</div>
        </div>
      </div>

      <!-- Upcoming Renewals -->
      <div class="dashboard-section">
        <h3>Upcoming Renewals</h3>
        <div class="renewals-list">
          <div v-if="upcomingRenewals.length === 0" class="empty-state">
            None
          </div>
          <div
            v-else
            v-for="renewal in upcomingRenewals"
            :key="renewal.id"
            class="renewal-item"
          >
            <div class="renewal-service">{{ renewal.serviceName }}</div>
            <div class="renewal-date">
              {{ formatDate(renewal.nextRenewal) }}
            </div>
            <div class="renewal-cost">
              ${{ parseFloat(renewal.cost).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Cost by Category Chart -->
      <div class="dashboard-section">
        <h3>Cost Distribution by Category</h3>
        <div class="chart-container">
          <PieChart :data="pieChartData" :options="pieChartOptions" />
        </div>
      </div>

      <!-- Value vs Cost Chart -->
      <div class="dashboard-section">
        <h3>Value vs Cost Analysis</h3>
        <div class="chart-container">
          <ScatterPlot
            :data="scatterChartData"
            :options="scatterChartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Scatter } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LinearScale,
  PointElement,
} from 'chart.js';
import { useSubscriptionStore } from '@/stores/SubscriptionStore';
import { displayToast } from '@/util/notifications';

ChartJS.register(Title, Tooltip, Legend, ArcElement, LinearScale, PointElement);

const categoryColors = [
  '#FF6B6B', // Coral Red
  '#4ECDC4', // Caribbean Green
  '#FFD166', // Mustard Yellow
  '#ff0000', // Just Red
  '#1A936F', // Jungle Green
  '#3D5A80', // Dark Blue
  '#F26419', // Pumpkin Orange
  '#8338EC', // Violet Purple
  '#06D6A0', // Aquamarine
  '#EF476F', // Watermelon Pink
];

export default {
  name: 'DashboardView',
  components: {
    PieChart: Pie,
    ScatterPlot: Scatter,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    subscriptionStore() {
      return useSubscriptionStore();
    },
    subscriptions() {
      return this.subscriptionStore.subscriptions;
    },
    // Calculate total monthly cost
    // TODO: refactor this into SubscriptionStore
    totalMonthlyCost() {
      return this.subscriptions.reduce((total, sub) => {
        const cost = parseFloat(sub.cost);
        return total + (sub.billingCycle === 'annual' ? cost / 12 : cost);
      }, 0);
    },

    // Calculate total annual cost
    // TODO: refactor this into SubscriptionStore
    totalAnnualCost() {
      return this.subscriptions.reduce((total, sub) => {
        const cost = parseFloat(sub.cost);
        return total + (sub.billingCycle === 'annual' ? cost : cost * 12);
      }, 0);
    },

    // Calculate average value rating
    // TODO: refactor this into SubscriptionStore
    averageValueRating() {
      if (this.subscriptions.length === 0) return 0;
      const total = this.subscriptions.reduce(
        (sum, sub) => sum + sub.valueRating,
        0
      );
      return total / this.subscriptions.length;
    },

    // Get upcoming renewals (next 30 days)
    upcomingRenewals() {
      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );

      return this.subscriptions
        .filter((sub) => {
          const renewalDate = new Date(sub.nextRenewal);
          return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.nextRenewal) - new Date(b.nextRenewal))
        .slice(0, 5); // Show only next 5 renewals
    },

    // Calculate cost by category for pie chart
    costByCategory() {
      const categoryTotals = this.subscriptions.reduce((acc, sub) => {
        const cost = sub.billingCycle === 'annual' ? sub.cost / 12 : sub.cost;
        acc[sub.category] = (acc[sub.category] || 0) + cost;
        return acc;
      }, {});

      return Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value: parseFloat(value.toFixed(2)),
      }));
    },

    // Prepare data for pie chart
    pieChartData() {
      return {
        labels: this.costByCategory.map((cat) => cat.name),
        datasets: [
          {
            data: this.costByCategory.map((cat) => cat.value),
            backgroundColor: categoryColors,
          },
        ],
      };
    },

    // Options for pie chart
    pieChartOptions() {
      return {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return '$' + value.toFixed(2);
              },
            },
          },
        },
      };
    },

    // Prepare data for value vs cost scatter plot
    scatterChartData() {
      const data = this.subscriptions.map((sub) => ({
        serviceName: sub.serviceName,
        x:
          sub.billingCycle === 'annual'
            ? parseFloat((sub.cost / 12).toFixed(2))
            : parseFloat(sub.cost),
        y: sub.valueRating,
      }));
      return {
        datasets: [
          {
            label: 'Value vs. Cost',
            data: data,
            backgroundColor: '#42A5F5',
            borderColor: '#1E88E5',
            borderWidth: 1,
          },
        ],
      };
    },

    // Options for scatter plot
    scatterChartOptions() {
      return {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Monthly Cost ($)',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Value Rating',
            },
            min: 0,
            max: 6,
          },
        },
        plugins: {
          tooltip: {
            // display the service name in the tooltip
            callbacks: {
              label: (tooltipItem) => {
                const { x, y, serviceName } = tooltipItem.raw;
                return `${serviceName}: Cost: $${x.toFixed(2)}, Value: ${y}`;
              },
            },
          },
        },
      };
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
    async fetchSubscriptions() {
      this.loading = true;
      try {
        await this.subscriptionStore.fetchSubscriptions();
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        displayToast('Failed to fetch subscriptions. Please try again later.');
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.fetchSubscriptions();
  },
  beforeUnmount() {
    // Clean up storage event listener
    window.removeEventListener('storage', this.loadSubscriptions);
  },
};
</script>

<style scoped>
.dashboard {
  padding: 1rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.metric-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #666;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
}

.dashboard-section {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.renewals-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.renewal-item {
  display: grid;
  grid-template-columns: 1fr 150px 100px;
  gap: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.renewal-service {
  font-weight: bold;
}

.renewal-date {
  color: #666;
}

.renewal-cost {
  font-weight: bold;
  color: #2c3e50;
}

.chart-container {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  height: 300px;
}
</style>
