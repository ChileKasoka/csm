<template>
  <div class="project-edit-page">
    <h1>Edit Project</h1>
    <form @submit.prevent="updateProject" class="project-form">
      <input v-model="project.name" placeholder="Project Name" required />
      <input v-model="project.description" placeholder="Description" required />
      <input v-model="project.start_date" type="date" required />
      <input v-model="project.end_date" type="date" required />
      <select v-model="project.status" required>
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <div class="buttons">
        <button type="submit" class="update-btn">Update Project</button>
        <router-link to="/projects" class="cancel-btn">Cancel</router-link>
      </div>
    </form>
  </div>
</template>

<script>
const API_BASE_URL = process.env.VUE_APP_BASE_URL || 'http://localhost:8080';

export default {
  name: 'EditProject',
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
  async mounted() {
    await this.fetchProject();
  },
  methods: {
    async fetchProject() {
      const res = await fetch(`http://API_BASE_URL/projects/${this.$route.params.id}`);
      if (!res.ok) {
        alert('Failed to fetch project.');
        this.$router.push('/projects');
        return;
      }
      const data = await res.json();
      this.project = {
        name: data.name || '',
        description: data.description || '',
        start_date: data.start_date ? data.start_date.split('T')[0] : '',
        end_date: data.end_date ? data.end_date.split('T')[0] : '',
        status: data.status || 'planning'
      };
    },
    async updateProject() {
      const formattedProject = {
        ...this.project,
        start_date: new Date(this.project.start_date + 'T00:00:00Z').toISOString(),
        end_date: new Date(this.project.end_date + 'T00:00:00Z').toISOString()
      };

      const res = await fetch(`http://API_BASE_URL/projects/${this.$route.params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProject)
      });

      if (res.ok) {
        this.$router.push('/projects');
      } else {
        const errorData = await res.json();
        alert(errorData.message || 'Failed to update project.');
      }
    }
  }
};
</script>

<style scoped>
.project-edit-page {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  font-family: 'Segoe UI', sans-serif;
}

h1 {
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
  color: #1f2937;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input,
select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
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
  text-align: center;
  line-height: 1.9rem;
}

.cancel-btn:hover {
  background-color: #6b7280;
}
</style>
