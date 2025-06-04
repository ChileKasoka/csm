<template>
  <div class="projects-page">
    <header class="page-header">
      <h1>📁 Projects</h1>
      <p>Manage your active and archived projects.</p>
      <router-link to="/projects/create" class="create-btn">+ New Project</router-link>
    </header>

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
      projects: []
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
      this.$router.push(`/projects/${project.id}/edit`);
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
  margin-bottom: 0.5rem;
}

.create-btn {
  display: inline-block;
  margin-bottom: 1rem;
  background-color: #10b981;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
}

.create-btn:hover {
  background-color: #059669;
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
</style>
