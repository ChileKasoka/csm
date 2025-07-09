<template>
  <div class="project-create-page">
    <h1>Create New Project</h1>
    <form @submit.prevent="createProject" class="project-form">
      <input v-model="project.name" placeholder="Project Name" required />
      <input v-model="project.description" placeholder="Description" required />
      <input v-model="project.start_date" type="date" required />
      <input v-model="project.end_date" type="date" required />
      <select v-model="project.status" required>
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <div class="form-actions">
        <button type="submit">Create Project</button>
        <router-link to="/projects" class="cancel-link">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'ProjectCreate',
  data() {
    return {
      project: {
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planning'
      }
    };
  },
  methods: {
    async createProject() {
      const payload = {
        ...this.project,
        start_date: new Date(this.project.start_date + 'T00:00:00Z').toISOString(),
        end_date: new Date(this.project.end_date + 'T00:00:00Z').toISOString()
      };

      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        this.$router.push('/projects');
      } else {
        const err = await response.json();
        alert(err.message || 'Failed to create project');
      }
    }
  }
};
</script>

<style scoped>
.project-create-page {
  margin: 2rem auto;
  background: #ffffff;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.project-create-page h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #1f2937;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.project-form input,
.project-form select {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  background-color: #f9fafb;
  transition: border-color 0.2s, background-color 0.2s;
}

.project-form input:focus,
.project-form select:focus {
  outline: none;
  border-color: #3b82f6;
  background-color: #fff;
}

.project-form button {
  background-color: #3b82f6;
  color: #ffffff;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.project-form button:hover {
  background-color: #2563eb;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

.form-actions button {
  flex: 1;
  background-color: #e8e141;
  color: black;
}

.form-actions button:hover {
  background-color: #848484;
  color: white;
}

.cancel-link {
  flex: 1;
  display: inline-block;
  text-align: center;
  padding: 0.65rem;
  background-color: #9ca3af;
  color: white;
  border-radius: 12px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.cancel-link:hover {
  background-color: #ced0d4;
}

</style>

