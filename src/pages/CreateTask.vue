<template>
  <div class="create-task-page">
    <div class="form-container">
      <h2>Create New Task</h2>
      <form @submit.prevent="createTask">
        <input v-model="title" type="text" placeholder="Title" required />
        <textarea v-model="description" placeholder="Description" required></textarea>
        <input v-model="start_date" type="date" required />
        <input v-model="end_date" type="date" required />

        <!-- Project Select Dropdown -->
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

        <button type="submit">Create Task</button>
        <router-link to="/tasks" class="cancel-link">Cancel</router-link>
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
      project_id: '', // new
      projects: []    // new
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
  padding: 2rem;
}

.form-container {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

h2 {
  margin-bottom: 1rem;
}

form {
  display: flex;
  flex-direction: column;
}

input,
textarea,
select {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
}

button {
  padding: 0.75rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  background-color: #1e40af;
}

.cancel-link {
  margin-top: 1rem;
  display: inline-block;
  color: #6b7280;
  text-decoration: underline;
}
</style>
