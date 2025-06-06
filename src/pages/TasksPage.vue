<template>
  <div class="tasks-page">
    <div class="header">
      <h1>Tasks</h1>
      <router-link to="/tasks/create" class="create-btn">+ Create Task</router-link>
    </div>

    <section class="task-list">
      <router-link
        v-for="task in tasks"
        :key="task.id"
        :to="`/tasks/${task.id}`"
        class="task-card-wrapper"
      >
        <div class="task-card">
          <h3>{{ task.title }}</h3>
          <p>{{ task.description }}</p>
          <p class="format-time"><small>Start: {{ formatDate(task.start_date) }} | <br> End: {{ formatDate(task.end_date) }}</small></p>
          <span class="status" :class="task.status">{{ task.status }}</span>
          <div class="actions">
            <div class="icon-group">
              <font-awesome-icon icon="edit" class="icon edit" @click.stop.prevent="editTask(task)" />
              <font-awesome-icon icon="trash" class="icon delete" @click.stop.prevent="deleteTask(task.id)" />
            </div>
            <button class="assign-btn" @click.stop.prevent="goToAssignUsers(task.id)">Assign</button>
          </div>
        </div>
      </router-link>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tasks: []
    };
  },
  mounted() {
    this.fetchTasks();
  },
  methods: {
    async fetchTasks() {
      const res = await fetch('http://localhost:8080/tasks');
      const data = await res.json();
      this.tasks = data;
    },
    async deleteTask(taskId) {
      const confirmed = confirm('Are you sure you want to delete this task?');
      if (!confirmed) return;

      const res = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
      }
    },
    formatDate(dateStr) {
      if (!dateStr || dateStr.startsWith('0001')) return '—';
      const date = new Date(dateStr);
      return isNaN(date)
        ? '—'
        : new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }).format(date);
    },
    editTask(task) {
      this.$router.push(`/tasks/${task.id}/edit`);
    },
    goToAssignUsers(taskId) {
      this.$router.push(`/tasks/${taskId}/assign-users`);
    }
  }
};
</script>

<style scoped>
.tasks-page {
  padding: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.create-btn {
  background-color: #676767;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  text-decoration: none;
}

.create-btn:hover {
  background: #e4e140;
  color: #1f1f1e;
}
.task-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.task-card-wrapper {
  text-decoration: none;
  color: inherit;
}

.task-card {
  background-color: #fff;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
  position: relative;
}

.task-card h3 {
  font-size: 1.5rem;
  font-weight: bold;
  padding-bottom: 1rem;
}

.task-card:hover {
  transform: translateY(-4px);
}

.status {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.5rem;
}

.status.pending {
  background-color: #fcd34d;
  color: #92400e;
}

.status.in-progress {
  background-color: #60a5fa;
  color: #1e3a8a;
}

.status.completed {
  background-color: #86efac;
  color: #065f46;
}

.actions {
  position: absolute;
  top: 1rem;
  right: 1rem;
  justify-content: space-between;
  align-items: center;
}

.icon-group {
  display: flex;
  gap: 0.5rem;
  justify-content: end;
}

.icon {
  cursor: pointer;
  font-size: 1rem;
}

.icon.edit {
  color: #676767;
}

.icon.edit :hover {
  color: #e4e140;
}

.icon.delete {
  color: #676767;
}

.icon.delete :hover {
  color: rgb(175, 17, 17);
}

.assign-btn {
  margin-top: 2rem;
  background-color: #676767;
  color: #ffffff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1rem;
  text-decoration: none;
}

.assign-btn:hover {
  background: #e4e140;
  color: #1f1f1e;
}

.format-time {
  padding-top: 1rem;
  width: 50%;
  font-size: small;
  color: #676767;
}
</style>
