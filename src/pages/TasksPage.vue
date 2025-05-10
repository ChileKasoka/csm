<template>
  <div class="tasks-page">
    <header class="page-header">
      <h1>📝 Tasks</h1>
      <p>Track and manage your tasks here.</p>
    </header>

    <section class="task-list">
      <div class="task-card" v-for="task in tasks" :key="task.id">
        <h3>{{ task.title }}</h3>
        <p>{{ task.description }}</p>
        <span class="status" :class="task.status">{{ task.status }}</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'TasksPage',
  data() {
    return {
      tasks: [
        { id: 1, title: 'Design Project UI', description: 'Create mockups in Figma.', status: 'in-progress' },
        { id: 2, title: 'Write API Docs', description: 'Document endpoints for the backend.', status: 'completed' },
        { id: 3, title: 'Fix Login Bug', description: 'Resolve 500 error on failed login.', status: 'pending' }
      ]
    };
  }
};
</script>

<style scoped>
.tasks-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.page-header p {
  color: #6b7280;
}

.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.task-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.task-card h3 {
  margin-bottom: 0.5rem;
  color: #374151;
}

.task-card p {
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 1rem;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: capitalize;
}

.status.pending {
  background-color: #fef3c7;
  color: #b45309;
}

.status.in-progress {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.status.completed {
  background-color: #d1fae5;
  color: #047857;
}
</style>
