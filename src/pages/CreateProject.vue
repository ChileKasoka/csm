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
      <button type="submit">Create Project</button>
      <router-link to="/projects" class="cancel-link">Cancel</router-link>
    </form>
  </div>
</template>

<script>
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

      const response = await fetch('http://localhost:8080/projects', {
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
  max-width: 600px;
  margin: 2rem auto;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}
.project-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.project-form input,
.project-form select {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.project-form button {
  background-color: #2563eb;
  color: white;
  padding: 0.6rem;
  font-weight: bold;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-link {
  margin-top: 1rem;
  display: inline-block;
  color: #6b7280;
  text-decoration: underline;
}
</style>
