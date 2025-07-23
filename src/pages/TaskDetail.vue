<template>
  <div class="task-detail-page">
    <div class="task-card">
      <h1 class="task-title">{{ task.title }}</h1>

      <div class="task-meta">
        <div class="meta-section">
          <label><i class="fas fa-align-left"></i> Description</label>
          <p class="meta-content">{{ task.description }}</p>
        </div>

        <div class="meta-grid">
          <div class="meta-section">
            <label><i class="fas fa-calendar-alt"></i> Start Date</label>
            <p class="meta-content">{{ formatDate(task.start_date) }}</p>
          </div>
          <div class="meta-section">
            <label><i class="fas fa-calendar-check"></i> End Date</label>
            <p class="meta-content">{{ formatDate(task.end_date) }}</p>
          </div>
        </div>

        <div class="meta-section">
          <label><i class="fas fa-flag"></i> Status</label>
          <p class="meta-content">
            <span :class="['badge', task.status?.toLowerCase().replace(' ', '-') || '']">
              {{ task.status }}
            </span>
          </p>
        </div>
      </div>

      <router-link to="/tasks" class="back-button">← Back to Tasks</router-link>
    </div>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'TaskDetail',
  data() {
    return {
      task: {}
    };
  },
  mounted() {
    this.fetchTask();
  },
  methods: {
    async fetchTask() {
      const id = this.$route.params.id;
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`);
      if (res.ok) {
        this.task = await res.json();
      } else {
        alert("Failed to load task details");
      }
    },
    formatDate(dateStr) {
      if (!dateStr || dateStr.startsWith('0001')) return '—';
      const date = new Date(dateStr);
      return isNaN(date)
        ? '—'
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }).format(date);
    }
  }
};
</script>

<style scoped>
.task-detail-page {
  background: #f1f5f9;
  min-height: 100vh;
  padding: 3rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: start;
  font-family: 'Segoe UI', sans-serif;
}

.task-card {
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  max-width: 800px;
  width: 100%;
  transition: all 0.3s ease-in-out;
}

.task-title {
  font-size: 2.2rem;
  color: #111827;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 1rem;
}

.task-meta {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.meta-grid {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-section label {
  font-weight: 600;
  color: #6b7280;
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.meta-section i {
  margin-right: 0.5rem;
  color: #9ca3af;
}

.meta-content {
  font-size: 1.1rem;
  color: #374151;
}

.badge {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.badge.pending {
  background-color: #fff3cd;
  color: #856404;
}
.badge.in-progress {
  background-color: #bee3f8;
  color: #2b6cb0;
}
.badge.completed {
  background-color: #c6f6d5;
  color: #2f855a;
}

.back-button {
  display: inline-block;
  margin-top: 2.5rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
  font-size: 1rem;
}

.back-button:hover {
  color: #1e40af;
}
</style>
