<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>📁 Projects</h1>
      <p>Manage your active and archived projects.</p>
    </header>

    <form @submit.prevent="saveProject" class="project-form">
      <input v-model="newProject.name" placeholder="Project Name" required />
      <input v-model="newProject.description" placeholder="Description" required />
      <input v-model="newProject.start_date" type="date" required />
      <input v-model="newProject.end_date" type="date" required />
      <select v-model="newProject.status" required>
        <option value="planning">Planning</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      <button type="submit">
        {{ selectedProject ? 'Update Project' : 'Create Project' }}
      </button>
    </form>

<section class="project-list">
  <div class="project-card" v-for="project in projects" :key="project.id">
    <router-link :to="`/projects/${project.id}`">
      <h3>{{ project.name }}</h3>
      <p>{{ project.description }}</p>
      <p><strong>Start:</strong> {{ formatDate(project.start_date) }}</p>
      <p><strong>End:</strong> {{ formatDate(project.end_date) }}</p>
      <span class="status" :class="project.status">{{ project.status }}</span>
    </router-link>

    <div class="actions">
      <div class="icon-group">
        <font-awesome-icon icon="edit" class="icon edit" @click="editProject(project)" />
        <font-awesome-icon icon="trash" class="icon delete" @click="deleteProject(project.id)" />
      </div>
    </div>
  </div>
</section>

  </div>
</template>

<script>
export default {
  name: 'ProjectsPage',
  data() {
    return {
      projects: [],
      newProject: {
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planning'
      },
      selectedProject: null
    };
  },
  mounted() {
    this.fetchProjects();
  },
  methods: {
    async fetchProjects() {
      const res = await fetch('http://localhost:8080/projects');
      this.projects = await res.json();
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
    async deleteProject(id) {
      if (confirm('Are you sure you want to delete this project?')) {
        await fetch(`http://localhost:8080/projects/${id}`, {
          method: 'DELETE'
        });
        this.fetchProjects();
      }
    },
    editProject(project) {
      this.selectedProject = { ...project };
      this.newProject = {
        name: project.name,
        description: project.description,
        start_date: project.start_date.split('T')[0],
        end_date: project.end_date.split('T')[0],
        status: project.status
      };
    },
    async saveProject() {
      const formattedProject = {
        ...this.newProject,
        start_date: new Date(this.newProject.start_date + 'T00:00:00Z').toISOString(),
        end_date: new Date(this.newProject.end_date + 'T00:00:00Z').toISOString(),
        status: this.newProject.status
      };

      const url = this.selectedProject
        ? `http://localhost:8080/projects/${this.selectedProject.id}`
        : 'http://localhost:8080/projects';

      const method = this.selectedProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedProject)
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to save project');
        return;
      }

      const savedProject = await response.json();

      if (this.selectedProject) {
        const index = this.projects.findIndex(p => p.id === savedProject.id);
        if (index !== -1) this.projects[index] = savedProject;
      } else {
        this.projects.push(savedProject);
      }

      this.newProject = {
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        status: 'planning'
      };
      this.selectedProject = null;
    }
  }
};
</script>

<style scoped>
.projects-page {
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

.project-form {
  margin: 1rem 0 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.project-form input,
.project-form select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.project-form button {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.icon-group {
  display: flex;
  gap: 12px;
}

.icon {
  font-size: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  opacity: 0.9;
}

.icon:hover {
  transform: scale(1.15);
  opacity: 1;
}

.icon.edit {
  color: #daea33;
}

.icon.delete {
  color: #000000;
}

.project-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: white;
  border-radius: 10px;
  padding: 1.25rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.project-card h3 {
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.project-card p {
  font-size: 0.95rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.project-card a {
  text-decoration: none;
  color: inherit;
}


.status {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: capitalize;
}

.status.active {
  background-color: #d1fae5;
  color: #047857;
}

.status.planning {
  background-color: #fef3c7;
  color: #b45309;
}

.status.completed {
  background-color: #dbeafe;
  color: #1d4ed8;
}
</style>
