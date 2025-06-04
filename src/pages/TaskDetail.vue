<template>
  <div class="task-detail">
    <div class="card">
      <h1>{{ task.title }}</h1>
      <div class="meta">
        <p><strong>Status:</strong> <span :class="['badge', task.status]">{{ task.status }}</span></p>
        <p><strong>Start Date:</strong> {{ formatDate(task.start_date) }}</p>
        <p><strong>End Date:</strong> {{ formatDate(task.end_date) }}</p>
      </div>

      <br>
      <p class="description">{{ task.description }}</p>

      <router-link to="/tasks" class="back-button">← Back to Tasks</router-link>
    </div>
  </div>
</template>

<script>
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
      const res = await fetch(`http://localhost:8080/tasks/${id}`);
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
.task-detail {
  display: flex;
  justify-content: center;
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
}

.card {
  background: white;
  padding: 2rem 2.5rem;
  border-radius: 1rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.card h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #111827;
}

.description {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 1.5rem;
}

.meta p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #4b5563;
}

.badge {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 600;
  text-transform: capitalize;
  font-size: 0.85rem;
}

.badge.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.badge.in-progress {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.badge.completed {
  background-color: #d1fae5;
  color: #047857;
}

.back-button {
  display: inline-block;
  margin-top: 2rem;
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-button:hover {
  color: #1e40af;
}
</style>
