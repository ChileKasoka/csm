<template>
  <div class="alerts-page">
    <header class="page-header">
      <h1>Alerts</h1>
      <p>Stay updated with important system and project notifications.</p>
    </header>

    <hr />

    <!-- Loading -->
    <div v-if="isLoading" class="loading">🔄 Fetching alerts...</div>

    <!-- No Alerts -->
    <div v-else-if="alerts.length === 0" class="empty">✅ No alerts at this time.</div>

    <!-- Alerts List -->
    <ul v-else class="alerts-list">
      <li v-for="alert in alerts" :key="alert.id" :class="['alert-item', alert.type]">
        <div class="alert-header">
          <strong>{{ alert.title }}</strong>
          <span class="time">{{ formatDate(alert.created_at) }}</span>
        </div>
        <p>{{ alert.message }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || "http://localhost:8080";

export default {
  name: "AlertsPage",
  data() {
    return {
      alerts: [],
      isLoading: true,
      token: null,
    };
  },
  mounted() {
    const rawToken = localStorage.getItem("access_token");
    try {
      this.token = JSON.parse(rawToken)?.access_token || rawToken;
    } catch {
      this.token = rawToken;
    }
    this.fetchAlerts();
  },
  methods: {
    async fetchAlerts() {
      this.isLoading = true;
      try {
        const res = await fetch(`${API_BASE_URL}/alerts`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        const data = await res.json();
        this.alerts = Array.isArray(data) ? data : [];
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        this.alerts = [];
      } finally {
        this.isLoading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "—";
      const date = new Date(dateStr);
      return isNaN(date)
        ? "—"
        : new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date);
    },
  },
};
</script>

<style scoped>
.alerts-page {
  padding: 2rem;
}
.page-header {
  margin-bottom: 1rem;
}
.loading,
.empty {
  padding: 1rem;
  font-style: italic;
  color: #555;
}
.alerts-list {
  list-style: none;
  padding: 0;
}
.alert-item {
  background: #fff;
  border-left: 6px solid;
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.alert-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.alert-item.info {
  border-color: #3b82f6;
}
.alert-item.warning {
  border-color: #f59e0b;
}
.alert-item.error {
  border-color: #ef4444;
}
.time {
  font-size: 0.85rem;
  color: #666;
}
</style>
