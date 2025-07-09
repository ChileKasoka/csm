<template>
  <div class="task-edit-page">
    <h1>Edit Task</h1>
    <form @submit.prevent="updateTask">
      <div class="form-group">
        <label>Title</label>
        <input v-model="task.title" type="text" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="task.description" rows="3" required></textarea>
      </div>

      <div class="form-group">
        <label>Start Date</label>
        <input v-model="task.start_date" type="date" required />
      </div>

      <div class="form-group">
        <label>End Date</label>
        <input v-model="task.end_date" type="date" required />
      </div>

      <div class="form-group">
        <label>Status</label>
        <select v-model="task.status" required>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div class="buttons">
        <button type="submit" class="update-btn">Update</button>
        <router-link to="/tasks" class="cancel-btn">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  data() {
    return {
      task: {
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'pending'
      }
    };
  },
  mounted() {
    this.fetchTask();
  },
  methods: {
async fetchTask() {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks/${this.$route.params.id}`);
    const data = await res.json();

    this.task = {
      ...data,
      start_date: data.start_date ? data.start_date.slice(0, 10) : '',
      end_date: data.end_date ? data.end_date.slice(0, 10) : ''
    };
  } catch (err) {
    console.error('Failed to fetch task:', err);
    alert('Failed to load task.');
  }
},

async updateTask() {
  const updatedTask = {
    ...this.task,
    start_date: new Date(this.task.start_date + 'T00:00:00Z').toISOString(),
    end_date: new Date(this.task.end_date + 'T00:00:00Z').toISOString()
  };

  const res = await fetch(`${API_BASE_URL}/tasks/${this.$route.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedTask)
  });

  if (res.ok) {
    this.$router.push('/tasks');
  } else {
    alert('Failed to update task.');
  }
}

  }
};
</script>

<style scoped>
.task-edit-page {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #1f2937;
}

.form-group {
  margin-bottom: 1.2rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #374151;
}

input,
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.update-btn {
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: bold;
  cursor: pointer;
}

.update-btn:hover {
  background-color: #1d4ed8;
}

.cancel-btn {
  padding: 0.6rem 1.2rem;
  background-color: #9ca3af;
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
}

.cancel-btn:hover {
  background-color: #6b7280;
}
</style>
