<template>
  <div class="create-task-page">
    <div class="form-container">
      <h2>Create New Task</h2>
      <form @submit.prevent="createTask">
        <input v-model="title" type="text" placeholder="Title" required />
        <textarea v-model="description" placeholder="Description" required></textarea>
        <input v-model="start_date" type="date" required />
        <input v-model="end_date" type="date" required />

        <select v-model="project_id" required>
          <option disabled value="">Select Project</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.name }}
          </option>
        </select>

        <select v-model="status" required>
          <option disabled value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div class="form-actions">
          <button type="submit">Create Task</button>
          <router-link to="/tasks" class="cancel-link">Cancel</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateTask",
  data() {
    return {
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      status: '',
      project_id: '',
      projects: []
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      try {
        const res = await fetch('http://localhost:8080/projects');
        this.projects = await res.json();
      } catch (err) {
        alert('Failed to load projects: ' + err.message);
      }
    },
    async createTask() {
      const payload = {
        title: this.title,
        description: this.description,
        start_date: new Date(this.start_date + 'T00:00:00Z').toISOString(),
        end_date: new Date(this.end_date + 'T00:00:00Z').toISOString(),
        status: this.status,
        project_id: parseInt(this.project_id)
      };

      try {
        const res = await fetch('http://localhost:8080/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          this.$router.push('/tasks');
        } else {
          const error = await res.json();
          alert(error.message || 'Failed to create task');
        }
      } catch (err) {
        alert('Failed to create task: ' + err.message);
      }
    }
  }
};
</script>

<style scoped>
.create-task-page {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
}

.form-container {
  background-color: #ffffff;
  padding-top: 2rem;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.form-container h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 1.5rem;
  color: #1f2937;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
textarea,
select {
  padding: 0.75rem;
  margin: 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 1rem;
}

button {
  flex: 1;
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1d4ed8;
}

.cancel-link {
  flex: 1;
  text-align: center;
  background-color: #9ca3af;
  color: white;
  padding: 0.75rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cancel-link:hover {
  background-color: #6b7280;
}
</style>
